import { useState } from 'react';
import { useInfiniteQuery } from 'react-query';
import { PAGE_SIZE } from './static/constants';
import { fetchMyDesigns } from '@/services/mydesigns/fetchMyDesigns';
import { useAuth } from '@clerk/nextjs';

export const useUserAllDesigns = () => {
  const { userId } = useAuth(); // Ensure useAuth is called inside a component or another hook
  const [page, setPage] = useState(0);

  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useInfiniteQuery(['userdesigns', userId], fetchMyDesigns, {
    getNextPageParam: (lastPage) => {
      if (lastPage.length < PAGE_SIZE) {
        return undefined;
      }
      return lastPage[lastPage.length - 1].id;
    },
    // enabled: !!userId, // Ensure query runs only if userId is available
  });

  const loadMore = () => {
    setPage(page + 1);
    fetchNextPage();
  };

  return {
    downloadableFiles: data,
    error,
    loadMore,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  };
};
