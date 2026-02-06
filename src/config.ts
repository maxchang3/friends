export interface Config {
  urlPrefix: string
  outputDir: string
  publicDir: string
  imgDir: string
  totalArticlesLimit: number
  articlesPerFriendLimit: number
}

const DEFAULT_CONFIG: Config = {
  urlPrefix: 'https://friends.maxchang.me/',
  outputDir: 'dist',
  publicDir: 'public',
  imgDir: 'img',
  totalArticlesLimit: 20,
  articlesPerFriendLimit: 2,
}

export function defineConfig(config: Partial<Config>): Config {
  return { ...DEFAULT_CONFIG, ...config }
}

export default defineConfig({})
