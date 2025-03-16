import { z } from "zod"
import { parse } from "@std/jsonc"
import { toArrayBuffer } from "@std/streams"
import { fromError } from "zod-validation-error"

const schema = z.array(
  z.object({
    name: z.string(),
    link: z.string().url(),
    avatar: z.string().url(),
    descr: z.string(),
  }),
)

export const validate = (raw: string) => {
  const jsonc = parse(raw)
  const parsedFriends = schema.safeParse(jsonc)
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
