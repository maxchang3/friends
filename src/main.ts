import * as path from "@std/path"
import sharp from "sharp"
import { assert } from "@std/assert"
import { readableStreamToBytes, validate } from "./utils.ts"

const urlPrefix = "https://friends.maxchang.me/"
const outputDir = "./dist"
const imgDir = path.join(outputDir, "img")
const excludeFormats = ["svg", "ico"]

const rawContent = await Deno.readTextFile("./data/links.json")
const parsedFriends = validate(rawContent)

try {
  await Deno.remove(outputDir, { recursive: true })
} catch (err) {
  if (!(err instanceof Deno.errors.NotFound)) {
    throw err
  }
}

await Deno.mkdir(imgDir, { recursive: true })

await Promise.all(parsedFriends.data.map(async (friend) => {
  const filename = new URL(friend.link).hostname.replace(/\./g, "_")
  const { body: avatarBody } = await fetch(friend.avatar)

  assert(avatarBody !== null, "Failed to fetch avatar")

  const isExcluded = excludeFormats.some((format) =>
    friend.avatar.endsWith(format)
  )

  const optimizedImage = isExcluded
    ? avatarBody
    : await sharp(await readableStreamToBytes(avatarBody)).resize(100, 100)
      .png()
      .toBuffer()

  const format = isExcluded ? friend.avatar.split(".").pop() : "png"
  const filepath = path.join(imgDir, `${filename}.${format}`)

  await Deno.writeFile(filepath, optimizedImage)

  friend.avatar = new URL(path.relative(outputDir, filepath), urlPrefix)
    .toString()
}))

await Promise.all([
  Deno.writeTextFile(
    path.join(outputDir, "links.json"),
    JSON.stringify(parsedFriends.data),
  ),
  Deno.copyFile("./assets/logo.svg", path.join(outputDir, "logo.svg")),
])
