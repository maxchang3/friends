import { mkdir, readFile, rm, writeFile } from 'node:fs/promises'
import path from 'node:path'
import process from 'node:process'
import { URL } from 'node:url'
import { z } from 'zod'
import { fromError } from 'zod-validation-error'

const urlPrefix = 'https://maxchang3.github.io/'

const schema = z.array(
    z.object({
        name: z.string(),
        link: z.string().url(),
        avatar: z.string().url(),
        descr: z.string(),
    }),
)

const rawContent = await readFile('./data/links.json', 'utf-8')

const friends = JSON.parse(rawContent)

const parsedFriends = schema.safeParse(friends)

if (!parsedFriends.success) {
    const validationError = fromError(parsedFriends.error)
    console.error(validationError.message)
    process.exit(1)
}

await rm('./dist', { recursive: true, force: true })

await mkdir('./dist/img', { recursive: true })

await Promise.all(
    parsedFriends.data.map(async (friend) => {
        const filename = new URL(friend.link).hostname.replace(/\./g, '_')
        const filepath = `./img/${filename}.png`
        const { body } = await fetch(friend.avatar)
        friend.avatar = new URL(filepath, urlPrefix).toString()
        return writeFile(path.join('./dist', filepath), body)
    }),
)

await writeFile('./dist/links.json', JSON.stringify(parsedFriends.data), {
    encoding: 'utf-8',
    flag: 'w',
})
