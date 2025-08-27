import { supabase } from './supabase'

export interface News {
  id: string
  title: string
  excerpt: string
  content: string
  author_id: string
  publish_date: string
  status: string
  category: string
  image: string
  tags: string
  views: number
  featured: boolean
  created_at: string
  updated_at: string
  users?: {
    name: string
  }
}

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
