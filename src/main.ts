import * as path from 'node:path'
import cliProgress from 'cli-progress'
import logger from 'consola'
import pLimit from 'p-limit'
import linksData from '../data/links.jsonc' with { type: 'jsonc' }
import { processFriendAvatar, validateFriendLink } from './friends.ts'
import { optimizeImage, validate } from './utils.ts'

const urlPrefix = 'https://friends.maxchang.me/'
const outputDir = './dist'
const imgDir = path.join(outputDir, 'img')

const limit = pLimit(10)

const main = async () => {
  const parsedFriends = validate(linksData)
  logger.info(`Found ${parsedFriends.data.length} friends to process`)

  // Clean and create directories
  if (await Bun.file(outputDir).exists()) await Bun.$`rm -rf ${outputDir}`
  await Bun.$`mkdir -p ${imgDir}`

  const bar = new cliProgress.SingleBar(
    {
      format: 'Processing friends |{bar}| {value}/{total}',
      hideCursor: true,
    },
    cliProgress.Presets.shades_classic
  )

  bar.start(parsedFriends.data.length, 0)

  const processedFriends = parsedFriends.data.map((friend) =>
    limit(async () => {
      const [, avatar] = await Promise.all([
        validateFriendLink(friend),
        processFriendAvatar(friend),
      ])

      const { filename, isExcluded, avatarResponse } = avatar
      const { optimizedImage, format } = await optimizeImage(avatarResponse, isExcluded)

      const filepath = path.join(imgDir, `${filename}.${format}`)
      await Bun.write(filepath, optimizedImage)

      const relativePath = path.relative(outputDir, filepath)
      const webPath = relativePath.split(path.sep).join('/')

      friend.avatar = new URL(webPath, urlPrefix).toString()

      bar.increment()
    })
  )

  await Promise.all(processedFriends)

  bar.stop()

  // Save data and copy public files
  await Promise.all([
    Bun.write(path.join(outputDir, 'links.json'), JSON.stringify(parsedFriends.data)),
    Bun.$`cp -r ./public/* ${outputDir}`,
  ])

  logger.info('Build complete! check the dist/ directory.')
}

main().catch((error) => {
  logger.error(error)
  process.exit(1)
})
