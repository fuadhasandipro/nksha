import { useState } from 'react';
import { useInfiniteQuery } from 'react-query';
import { PAGE_SIZE } from './static/constants';
import { createClerkSupabaseClient } from '@/services/server';
import { useUser } from '@clerk/nextjs';
import { fetchMyDesigns } from '@/services/mydesigns/fetchMyDesigns';

export const useUserAllDesigns = () => {
  const [page, setPage] = useState(0);

  const { isLoaded, user } = useUser();

  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useInfiniteQuery('userdesigns', fetchMyDesigns, {
    getNextPageParam: (lastPage) => {
      if (lastPage.length < PAGE_SIZE) {
        return undefined;
      }
      return lastPage[lastPage.length - 1].id;
    },
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
