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

type Bar = {
  increment: () => void
  runTask: <T>(fn: () => Promise<T>) => Promise<T>
  start: GenericBar['start']
  stop: GenericBar['stop']
  [Symbol.dispose]: () => void
}

/**
 * Use a progress bar with automatic start/stop and task wrapping
 */
function useProgressBar(bar: GenericBar, options: { total: number; startOnInit: true }): Bar
function useProgressBar(bar: GenericBar, options?: { startOnInit: false }): Bar
function useProgressBar(bar: GenericBar, options: { total?: number; startOnInit?: boolean } = {}) {
  const { total, startOnInit = false } = options
  if (startOnInit) bar.start(total!, 0)

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
    start: bar.start.bind(bar),
    stop: bar.stop.bind(bar),
    [Symbol.dispose]() {
      bar.stop()
    },
  }
}

export { useProgressBar }

export const useTimer = (callback: (duration: number) => void) => {
  const start = Date.now()
  return {
    [Symbol.dispose]() {
      const duration = Date.now() - start
      callback(duration)
    },
  }
}
