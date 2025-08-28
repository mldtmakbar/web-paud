import { supabase } from './supabase'
import { News } from './types'

export async function getNews(
  limit: number = 10,
  offset: number = 0,
  featured?: boolean
): Promise<News[]> {
  try {
    let query = supabase
      .from('news')
      .select(`
        *,
        users!news_author_id_fkey (
          name
        )
      `)
      .eq('status', 'published')
      .order('publish_date', { ascending: false })
      .range(offset, offset + limit - 1)

    if (featured !== undefined) {
      query = query.eq('featured', featured)
    }

    const { data, error } = await query

    if (error) throw error

    return data.map(item => ({
      ...item,
      author: item.users?.name || 'Unknown Author'
    }))
  } catch (error) {
    console.error('Get news error:', error)
    return []
  }
}

export async function getNewsById(id: string): Promise<News | null> {
  try {
    const { data, error } = await supabase
      .from('news')
      .select(`
        *,
        users!news_author_id_fkey (
          name
        )
      `)
      .eq('id', id)
      .single()

    if (error) throw error

    return {
      ...data,
      author: data.users?.name || 'Unknown Author'
    }
  } catch (error) {
    console.error('Get news by id error:', error)
    return null
  }
}

export async function addNews(news: {
  title: string
  excerpt: string
  content: string
  author_id: string
  category: string
  image?: string
  tags?: string
  featured?: boolean
  status?: string
  publish_date?: string
}): Promise<News | null> {
  try {
    const { data, error } = await supabase
      .from('news')
      .insert([{
        ...news,
        featured: news.featured || false,
        status: news.status || 'draft',
        publish_date: news.publish_date || new Date().toISOString(),
        image: news.image || '',
        tags: news.tags || ''
      }])
      .select(`
        *,
        users!news_author_id_fkey (
          name
        )
      `)
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error('Add news error:', error)
    return null
  }
}

export async function updateNews(id: string, news: {
  title?: string
  excerpt?: string
  content?: string
  author_id?: string
  category?: string
  image?: string
  tags?: string
  featured?: boolean
  status?: string
  publish_date?: string
}): Promise<News | null> {
  try {
    const { data, error } = await supabase
      .from('news')
      .update(news)
      .eq('id', id)
      .select(`
        *,
        users!news_author_id_fkey (
          name
        )
      `)
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error('Update news error:', error)
    return null
  }
}

export async function deleteNews(id: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('news')
      .delete()
      .eq('id', id)

    if (error) throw error
    return true
  } catch (error) {
    console.error('Delete news error:', error)
    return false
  }
}
