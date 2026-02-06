import * as path from 'node:path'
import cliProgress from 'cli-progress'
import logger from 'consola'
import pLimit from 'p-limit'
import config from './config.ts'
import linksData from './data/links.jsonc' with { type: 'jsonc' }
import { processFriendAvatar, validateFriendLink } from './friends.ts'
import { processFriendRSS } from './rss.ts'
import type { Friend } from './schema.ts'
import { useProgressBar, useTimer, validate } from './utils.ts'

const limit = pLimit(10)

const processAllFriends = async (friends: Friend[]) => {
  using bar = useProgressBar(
    new cliProgress.SingleBar(
      {
        format: 'Processing friends |{bar}| {value}/{total}',
        hideCursor: true,
      },
      cliProgress.Presets.shades_classic
    ),
    friends.length
  )

  const processFriendTask = async (friend: Friend) =>
    bar.runTask(async () => {
      await validateFriendLink(friend)

      const [articles, avatar] = await Promise.all([
        processFriendRSS(friend, config.articlesPerFriendLimit),
        processFriendAvatar(friend),
      ])

      const avatarOutputPath = path.join(config.imgDir, avatar.filename)

      return {
        friend: { ...friend, avatar: new URL(avatarOutputPath, config.urlPrefix).toString() },
        articles,
        avatar: { optimizedImage: avatar.optimizedImage, urlPath: avatarOutputPath },
      }
    })

  const tasks = friends.map((friend) => limit(() => processFriendTask(friend)))

  const results = await Promise.all(tasks)

  return results
}

const main = async () => {
  using _ = useTimer((duration) => logger.info(`Build time: ${(duration / 1000).toFixed(2)} s`))

  const { data: rawFriends } = validate(linksData)
  logger.info(`Found ${rawFriends.length} friends to process`)

  // clean & prepare output
  await Bun.$`rm -rf ${config.outputDir}`
  await Bun.$`mkdir -p ${config.outputDir}/${config.imgDir}`

  // process
  const processed = await processAllFriends(rawFriends)

  // aggregate articles
  const articles = processed
    .flatMap((p) => p.articles)
    .toSorted((a, b) => b.pubDate.getTime() - a.pubDate.getTime())
    .slice(0, config.totalArticlesLimit)

  // build friends.json
  const friends: Friend[] = processed.map((p) => p.friend)

  // write all outputs
  await Promise.all([
    Bun.write(path.join(config.outputDir, 'links.json'), JSON.stringify(friends)),
    Bun.write(path.join(config.outputDir, 'articles.json'), JSON.stringify(articles)),
    ...processed.map(({ avatar }) =>
      Bun.write(path.join(config.outputDir, avatar.urlPath), avatar.optimizedImage)
    ),
    Bun.$`cp -r ${config.publicDir}/* ${config.outputDir}`,
  ])

  logger.success('Build complete! Check the dist/ directory.')
}

main().catch((error) => {
  logger.error(error)
  process.exit(1)
})
