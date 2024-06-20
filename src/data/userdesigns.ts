import { useInfiniteQuery } from 'react-query';
import { PAGE_SIZE } from './static/constants';
import { fetchMyDesigns } from '@/services/mydesigns/fetchMyDesigns';
import { useAuth } from '@clerk/nextjs';

export const useUserAllDesigns = () => {
  const { userId } = useAuth(); // Ensure useAuth is called inside a component or another hook

  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    refetch
  } = useInfiniteQuery(['userdesigns', userId], fetchMyDesigns, {
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.length < PAGE_SIZE) {
        return undefined;
      }
      return allPages.length;
    },
  });

  const loadMore = () => {
    fetchNextPage();
  };

  return {
    downloadableFiles: data,
    error,
    loadMore,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    refetch
  };
};
