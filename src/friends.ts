import logger from 'consola'
import config from './data/config.jsonc' with { type: 'jsonc' }
import type { Friend } from './schema'
import { optimizeImage } from './utils'

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
  const isExcluded = excludeFormats.some((format) => friend.avatar.endsWith(format))

  if (!avatarResponse.ok) {
    throw new Error(
      `${friend.name}: Failed to fetch avatar (${avatarResponse.status} ${avatarResponse.statusText})`
    )
  }

  const { optimizedImage, format } = await optimizeImage(avatarResponse, isExcluded)

  return {
    filename: `${name}.${format}`,
    optimizedImage,
  }
}
