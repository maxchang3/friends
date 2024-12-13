import process from 'node:process'
import { buffer } from 'node:stream/consumers'
import { z } from 'zod'
import { fromError } from 'zod-validation-error'

const schema = z.array(
    z.object({
        name: z.string(),
        link: z.string().url(),
        avatar: z.string().url(),
        descr: z.string(),
    }),
)

export const validate = (raw: string) => {
    const json = JSON.parse(raw)
    const parsedFriends = schema.safeParse(json)
    if (!parsedFriends.success) {
        const validationError = fromError(parsedFriends.error)
        console.error(validationError.message)
        process.exit(1)
    }

    return parsedFriends
}

export const toNodeBuffer = async (stream: ReadableStream<Uint8Array>) => (await buffer(stream)).buffer as ArrayBuffer
