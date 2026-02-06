import { configure, getAnsiColorFormatter, getConsoleSink, getLogger } from '@logtape/logtape'
import { z } from 'zod'
import { fromError } from 'zod-validation-error'

await configure({
  sinks: {
    console: getConsoleSink({
      formatter: getAnsiColorFormatter({
        timestamp: 'time',
      }),
    }),
  },
  loggers: [
    { category: 'friends', lowestLevel: 'info', sinks: ['console'] },
    { category: ['logtape', 'meta'], lowestLevel: 'warning', sinks: ['console'] },
  ],
})

export const logger = getLogger(['friends'])

const schema = z.array(
  z.object({
    name: z.string(),
    link: z.url(),
    rss: z.url().optional(),
    avatar: z.url(),
    descr: z.string(),
  })
)

export const validate = (data: unknown) => {
  const parsedFriends = schema.safeParse(data)
  if (!parsedFriends.success) {
    const validationError = fromError(parsedFriends.error)
    console.error(validationError.message)
    process.exit(1)
  }
  return parsedFriends
}
