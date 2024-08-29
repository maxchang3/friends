import { mkdir, readFile, rm, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { buffer } from 'node:stream/consumers'
import sharp from 'sharp'
import { validate } from './utils'

const urlPrefix = 'https://maxchang3.github.io/friends/'

const rawContent = await readFile('./data/links.json', 'utf-8')

const parsedFriends = validate(rawContent)

await rm('./dist', { recursive: true, force: true })

await mkdir('./dist/img', { recursive: true })

await Promise.all(
    parsedFriends.data.map(async (friend) => {
        const filename = new URL(friend.link).hostname.replace(/\./g, '_')
        const filepath = `./img/${filename}.png`
        const { body } = await fetch(friend.avatar)
        const image = (await buffer(body)).buffer
        const processedImage = await sharp(image).resize(100, 100).png().toBuffer()
        writeFile(path.join('./dist', filepath), processedImage)
        friend.avatar = new URL(filepath, urlPrefix).toString()
    }),
)

await writeFile('./dist/links.json', JSON.stringify(parsedFriends.data), {
    encoding: 'utf-8',
    flag: 'w',
})
