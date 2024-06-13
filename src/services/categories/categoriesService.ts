import supabase from "../server";


export const CategoriesService = {
    async getCategories(limit: number, page: number, search?: string) {
        let query = supabase
            .from('categories')
            .select('*')
            .range((page - 1) * limit, page * limit - 1);

        if (search) {
            query = query.ilike('name', `%${search}%`);
        }


        const { data, error, count } = await query;

        if (error) {
            throw error;
        }

        return { data, count };
    }
}
