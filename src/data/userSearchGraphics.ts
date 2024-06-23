import { useInfiniteQuery } from 'react-query';
import axios from 'axios';

const PAGE_SIZE = 10; // Adjust this to match the page size you need

export const useSearchGraphics = (searchText = "") => {
    const fetchDesigns = async ({ pageParam = 1 }) => {
        const response = await axios.get('https://noksha-assets.vercel.app/api/fetch-pngs', {
            params: {
                search: searchText,
                page: pageParam,
            },
        });

        if (response.status !== 200) {
            throw new Error('Error fetching designs');
        }

        return response.data;
    };

    const {
        data,
        error,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
    } = useInfiniteQuery(['searchDesigns', searchText], fetchDesigns, {
        getNextPageParam: (lastPage, allPages) => {
            if (lastPage.length < PAGE_SIZE) {
                return undefined;
            }
            return allPages.length + 1;
        },
    });

    const loadMore = () => {
        fetchNextPage();
    };

    return {
        templates: data?.pages.flat(), // Flatten the pages array
        error,
        loadMore,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
    };
};
