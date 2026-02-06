import { z } from 'zod'

export const friendSchema = z.array(
  z.object({
    name: z.string(),
    link: z.url(),
    rss: z.url().optional(),
    avatar: z.url(),
    descr: z.string(),
  })
)

export type Friend = z.infer<typeof friendSchema>[number]
