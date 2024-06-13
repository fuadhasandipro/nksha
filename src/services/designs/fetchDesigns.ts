import { PAGE_SIZE } from "@/data/static/constants";
import supabase from "../server";


export const fetchDesigns = async ({ pageParam = 0, queryKey }) => {
  const [, category] = queryKey;

  let query = supabase.from('designs').select('*').limit(PAGE_SIZE);

  if (category) {
    query = query.filter('categories', 'ilike', `%${category}%`);
  }

  if (pageParam) {
    query = query.gt('id', pageParam);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error('Error fetching categories');
  }

  return data;
};