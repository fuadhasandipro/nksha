import { useInfiniteQuery } from 'react-query';
import { useRouter } from 'next/router';
import { CategoriesService } from '@/services/categories/categoriesService';

export function useCategories(options) {
  const { locale } = useRouter();

  const {
    data,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery(
    ['categories', { ...options, locale }],
    async ({ queryKey, pageParam = 1 }) => {
      const [_, { limit, search }] = queryKey;
      const { data, count } = await CategoriesService.getCategories(limit, pageParam, search);
      return {
        data,
        count,
        current_page: pageParam,
        last_page: Math.ceil(count / limit),
      };
    },
    {
      getNextPageParam: (lastPage) =>
        lastPage.current_page < lastPage.last_page ? { page: lastPage.current_page + 1 } : false,
    }
  );

  function handleLoadMore() {
    fetchNextPage();
  }

  return {
    categories: data?.pages.flatMap((page) => page.data) ?? [],
    paginatorInfo: data?.pages ? data.pages[data.pages.length - 1] : null,
    hasNextPage,
    isLoadingMore: isFetchingNextPage,
    isLoading,
    error,
    loadMore: handleLoadMore,
  };
}
