import type { GenericBar } from 'cli-progress'
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

export const useProgressBar = (bar: GenericBar, total: number) => {
  bar.start(total, 0)

  const runTask = async <T>(fn: () => Promise<T>): Promise<T> => {
    try {
      return await fn()
    } finally {
      bar.increment()
    }
  }
  return {
    increment: () => bar.increment(),
    runTask,
    [Symbol.dispose]() {
      bar.stop()
    },
  }
}

export const useTimer = (callback: (duration: number) => void) => {
  const start = Date.now()
  return {
    [Symbol.dispose]() {
      const duration = Date.now() - start
      callback(duration)
    },
  }
}
