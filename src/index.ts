import { mkdir, readFile, writeFile } from 'node:fs/promises'
import process from 'node:process'
import { z } from 'zod'
import { fromError } from 'zod-validation-error'

const schema = z.array(z.object({
    name: z.string(),
    link: z.string().url(),
    avatar: z.string().url(),
    descr: z.string(),
}))

const rawContent = await readFile('./data/links.json', 'utf-8')

const links = JSON.parse(rawContent)

const result = schema.safeParse(links)

if (!result.success) {
    const validationError = fromError(result.error)
    console.error(validationError.message)
    process.exit(1)
}

await mkdir('./dist').catch((err) => { if (err.code !== 'EEXIST') throw err })

await writeFile('./dist/links.json', JSON.stringify(result), { encoding: 'utf-8', flag: 'w' })
