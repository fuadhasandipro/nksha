import { fetchDesigns } from "@/services/designs/fetchDesigns";
import { useRouter } from "next/router";
import { useState } from "react";
import {
    useInfiniteQuery,
} from 'react-query';
import { PAGE_SIZE } from "./static/constants";

export const useAllDesigns = () => {
    const [page, setPage] = useState(0);
    const router = useRouter();
    const category = router.query.category || '';

    const {
        data,
        error,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading
    } = useInfiniteQuery(['categories', category], fetchDesigns, {
        getNextPageParam: (lastPage) => {
            if (lastPage.length < PAGE_SIZE) {
                return undefined; // No more pages
            }
            return lastPage[lastPage.length - 1].id;
        },
    });

    const loadMore = () => {
        setPage(page + 1);
        fetchNextPage();
    };

    return { templates: data, error, loadMore, hasNextPage, isFetchingNextPage, isLoading };
};