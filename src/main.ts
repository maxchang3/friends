import * as path from 'node:path'
import sharp from 'sharp'
import config from '../data/config.jsonc' with { type: 'jsonc' }
import linksData from '../data/links.jsonc' with { type: 'jsonc' }
import { logger, validate } from './utils.ts'

const urlPrefix = 'https://friends.maxchang.me/'
const outputDir = './dist'
const imgDir = path.join(outputDir, 'img')
const excludeFormats = ['svg', 'ico']

const parsedFriends = validate(linksData)

logger.info('Found {count} friends to process', { count: parsedFriends.data.length })

// Remove old dist directory if it exists
const distFile = Bun.file(outputDir)
if (await distFile.exists()) {
  logger.info('Cleaning old dist directory...')
  await Bun.$`rm -rf ${outputDir}`
}

// Create img directory
logger.info('Creating output directories...')
await Bun.$`mkdir -p ${imgDir}`

logger.info('Processing friends...')
await Promise.all(
  parsedFriends.data.map(async (friend) => {
    const hostname = new URL(friend.link).hostname
    const isIgnored = config.ignoredDomains?.includes(hostname)

    if (isIgnored) {
      logger.info('{name} Skipping link check (domain ignored)', { name: friend.name })
    } else {
      // Check if the link is accessible
      try {
        const res = await fetch(friend.link, { method: 'HEAD' })
        if (!res.ok) throw new Error(`${friend.name}: Link inaccessible (${res.status} ${res.statusText})`)
      } catch (error) {
        throw new Error(`${friend.name}: Link check failed - ${error}`)
      }
    }

    const filename = new URL(friend.link).hostname.replace(/\./g, '_')

    const avatarResponse = await fetch(friend.avatar)

    const isExcluded = excludeFormats.some((format) => friend.avatar.endsWith(format))

    const avatarBuffer = Buffer.from(await avatarResponse.arrayBuffer())
    const optimizedImage = isExcluded ? avatarBuffer : await sharp(avatarBuffer).resize(100, 100).png().toBuffer()

    const format = isExcluded ? friend.avatar.split('.').pop() : 'png'
    const filepath = path.join(imgDir, `${filename}.${format}`)

    await Bun.write(filepath, optimizedImage)

    friend.avatar = new URL(path.relative(outputDir, filepath), urlPrefix).toString()
  })
)

logger.info('Writing links.json...')
logger.info('Copying public files...')
await Promise.all([
  Bun.write(path.join(outputDir, 'links.json'), JSON.stringify(parsedFriends.data)),
  Bun.$`cp -r ./public/* ${outputDir}`,
])

logger.info('Build complete!')
