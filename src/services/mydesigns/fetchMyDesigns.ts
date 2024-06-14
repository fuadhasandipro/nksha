
import { createClerkSupabaseClient } from '../server';

export const fetchMyDesigns = async (userId, pageParam = 0) => {
  const supabase = createClerkSupabaseClient();

  let query = supabase.from('user_designs').select().eq("user_id", userId);

  if (pageParam) {
    query = query.gt('id', pageParam);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error('Error fetching designs');
  }

  return data;
};
