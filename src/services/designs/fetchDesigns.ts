import { PAGE_SIZE } from "@/data/static/constants";
import supabase from "../server";


export const fetchDesigns = async ({ pageParam = 0, queryKey }) => {
  const [, category] = queryKey;

  let query = supabase.from('designs').select('*').limit(PAGE_SIZE).order("id", { ascending: false });

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


// {
//   "id": "abcdefghijkl",
//   "type": "GRAPHIC",
//   "name": "Eid Mubarak Post",
//   "frame": { "width": 1200, "height": 1200 },
//   "scenes": [],
//   "metadata": {},
//   "preview": ""
// }
