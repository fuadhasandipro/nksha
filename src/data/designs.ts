import { useRouter } from "next/router";
import { useInfiniteQuery } from 'react-query';
import { PAGE_SIZE } from "./static/constants";
import supabases from "@/services/server";

export const useAllDesigns = () => {
    const router = useRouter();
    const category = router.query.category || '';

    const fetchDesigns = async ({ pageParam = 0, queryKey }) => {
        const [, category] = queryKey;

        let query = supabases
            .from('designs')
            .select('*')
            .range(pageParam * PAGE_SIZE, (pageParam + 1) * PAGE_SIZE - 1)
            .order("id", { ascending: false });

        if (category) {
            query = query.ilike('categories', `%${category}%`);
        }

        const { data, error } = await query;

        if (error) {
            throw new Error('Error fetching designs');
        }

        return data;
    };

    const {
        data,
        error,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
    } = useInfiniteQuery(['designs', category], fetchDesigns, {
        getNextPageParam: (lastPage, allPages) => {
            if (lastPage.length < PAGE_SIZE) {
                return undefined; // No more pages
            }
            return allPages.length; // This will be used as the pageParam in the next fetch
        },
    });

    const loadMore = () => {
        fetchNextPage();
    };

    return {
        templates: data,
        error,
        loadMore,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
    };
};
