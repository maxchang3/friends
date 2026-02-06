import logger from 'consola'
import Parser from 'rss-parser'
import type { Friend } from './schema'

export interface Article {
  title: string
  link: string
  pubDate: Date
  description?: string
  source: string
}

const USER_AGENT = 'Mozilla/5.0 (compatible; MaxChangFriendsBot/1.0; +https://friends.maxchang.me/)'
const CURRENT_YEAR = new Date().getFullYear()

const parser = new Parser({
  headers: {
    'User-Agent': USER_AGENT,
  },
})

export const processFriendRSS = async (friend: Friend, maxArticles = 10) => {
  if (!friend.rss) return []
  try {
    const feed = await parser.parseURL(friend.rss)

    const articles: Article[] = feed.items
      .map((item) => {
        const dateStr = item.isoDate || item.pubDate
        return {
          title: item.title?.trim() || 'Untitled',
          link: item.link?.trim() || '',
          // Fallback to Epoch 0 instead of new Date() to prevent undated articles from appearing at the top
          pubDate: dateStr ? new Date(dateStr) : new Date(0),
          description: item.contentSnippet || item.description || '',
          source: friend.name,
        }
      })
      .filter((item) => item.link && item.title && item.pubDate.getFullYear() <= CURRENT_YEAR)
      .sort((a, b) => b.pubDate.getTime() - a.pubDate.getTime())
      .slice(0, maxArticles)

    return articles
  } catch (error) {
    logger.warn(
      `[RSS Error] Failed to fetch ${friend.name} (${friend.rss}): ${error instanceof Error ? error.message : 'Unknown error'}`
    )
    return []
  }
}
