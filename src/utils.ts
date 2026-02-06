import sharp from 'sharp'
import { fromError } from 'zod-validation-error'
import { friendSchema } from './schema'

export const validate = (data: unknown) => {
  const parsedFriends = friendSchema.safeParse(data)
  if (!parsedFriends.success) {
    const validationError = fromError(parsedFriends.error)
    console.error(validationError.message)
    process.exit(1)
  }
  return parsedFriends
}

export const optimizeImage = async (avatarResponse: Response, isExcluded: boolean) => {
  const avatarBuffer = Buffer.from(await avatarResponse.arrayBuffer())
  const optimizedImage = isExcluded
    ? avatarBuffer
    : await sharp(avatarBuffer).resize(100, 100).png().toBuffer()

  const format = isExcluded ? avatarResponse.url.split('.').pop()?.split('?')[0] : 'png'

  return { optimizedImage, format }
}
