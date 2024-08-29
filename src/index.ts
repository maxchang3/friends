import { mkdir, readFile, rm, writeFile } from 'node:fs/promises'
import path from 'node:path'
import sharp from 'sharp'
import { toNodeBuffer, validate } from './utils'

const urlPrefix = 'https://maxchang3.github.io/friends/'
const outputDir = './dist'
const imgDir = path.join(outputDir, 'img')
const excludeFormats = ['svg', 'ico']

const rawContent = await readFile('./data/links.json', 'utf-8')
const parsedFriends = validate(rawContent)

await rm(outputDir, { recursive: true, force: true })
await mkdir(imgDir, { recursive: true })

await Promise.all(parsedFriends.data.map(async (friend) => {
    const filename = new URL(friend.link).hostname.replace(/\./g, '_')
    const { body: avatarBody } = await fetch(friend.avatar)

    const isExcluded = excludeFormats.some(format => friend.avatar.endsWith(format))

    const optimizedImage = isExcluded
        ? avatarBody
        : await sharp(await toNodeBuffer(avatarBody)).resize(100, 100).png().toBuffer()

    const format = isExcluded ? friend.avatar.split('.').pop() : 'png'
    const filepath = path.join(imgDir, `${filename}.${format}`)

    await writeFile(filepath, optimizedImage)

    friend.avatar = new URL(path.relative(outputDir, filepath), urlPrefix).toString()
}))

await writeFile(path.join(outputDir, 'links.json'), JSON.stringify(parsedFriends.data), 'utf-8')
