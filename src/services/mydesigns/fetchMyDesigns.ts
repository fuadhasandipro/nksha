
import { PAGE_SIZE } from '@/data/static/constants';
import { createClerkSupabaseClient } from '../server';

export const fetchMyDesigns = async ({ pageParam = 0, queryKey }) => {

  const [, userId] = queryKey;

  const supabase = createClerkSupabaseClient();

  let query = supabase.from('user_designs').select();

  if (userId) {
    query = query.eq("user_id", userId).order("updated_at", { ascending: false })
  }

  if (pageParam) {
    query = query.gt('id', pageParam);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error('Error fetching designs');
  }

  return data;
};
