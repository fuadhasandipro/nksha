

import { useAllDesigns, useSearchDesigns } from '@/data/designs';
import Grid from '../design-templates/grid';

export default function SearchResults({ searchText }: { searchText: string }) {
  const {
    templates,
    error,
    loadMore,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useSearchDesigns(searchText);
  return (
    //@ts-ignore
    <Grid
      products={templates}
      onLoadMore={loadMore}
      hasNextPage={hasNextPage}
      isLoadingMore={isFetchingNextPage}
      isLoading={isLoading}
    />

  );
}
