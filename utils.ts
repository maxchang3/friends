import { z } from "zod"
import { fromError } from "npm:zod-validation-error"
import { toArrayBuffer } from "@std/streams"

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
    Deno.exit(1)
  }
  return parsedFriends
}

export const readableStreamToBytes = async (
  stream: ReadableStream<Uint8Array>,
): Promise<Uint8Array> => new Uint8Array(await toArrayBuffer(stream))
