import * as path from 'node:path'
import logger from 'consola'
import sharp from 'sharp'
import config from './data/config.jsonc' with { type: 'jsonc' }
import type { Friend } from './schema'

export const validateFriendLink = async (friend: Friend) => {
  const hostname = new URL(friend.link).hostname
  const isIgnored = config.ignoredDomains?.includes(hostname)
  if (isIgnored) {
    logger.info(`${friend.name} Skipping link check (domain ignored)`)
    return
  }
  try {
    const res = await fetch(friend.link, { method: 'HEAD' })
    if (!res.ok) {
      throw new Error(`${friend.name}: Link inaccessible (${res.status} ${res.statusText})`)
    }
  } catch (error) {
    throw new Error(`${friend.name}: Link check failed - ${error}`)
  }
}

export const processFriendAvatar = async (friend: Friend) => {
  const name = new URL(friend.link).hostname.replace(/\./g, '_')
  const excludeFormats = ['svg', 'ico']

  const avatarResponse = await fetch(friend.avatar)
  if (!avatarResponse.ok) {
    throw new Error(
      `${friend.name}: Failed to fetch avatar (${avatarResponse.status} ${avatarResponse.statusText})`
    )
  }

  const avatarBuffer = Buffer.from(await avatarResponse.arrayBuffer())
  const ext = path.extname(new URL(friend.avatar).pathname).slice(1).toLowerCase()
  const isExcluded = excludeFormats.includes(ext)

  const optimizedImage = isExcluded
    ? avatarBuffer
    : await sharp(avatarBuffer).resize(100, 100).png().toBuffer()

  const finalExt = isExcluded ? ext || 'bin' : 'png'

  return {
    filename: `${name}.${finalExt}`,
    optimizedImage,
  }
}
