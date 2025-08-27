import { supabase } from '@/lib/supabase'

export async function deleteTeacher(id: string) {
  const { error } = await supabase
    .from('teachers')
    .delete()
    .eq('id', id)

  if (error) {
    throw error
  }
}
