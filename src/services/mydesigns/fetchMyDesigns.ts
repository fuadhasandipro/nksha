import { PAGE_SIZE } from '@/data/static/constants';
import { createClerkSupabaseClient } from '../server';

export const fetchMyDesigns = async ({ pageParam = 0, userId }) => {
  const supabase = createClerkSupabaseClient();
  let query = supabase.from('user_designs').select().limit(PAGE_SIZE);

  if (pageParam) {
    query = query.gt('id', pageParam);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error('Error fetching designs');
  }

  return data;
};
