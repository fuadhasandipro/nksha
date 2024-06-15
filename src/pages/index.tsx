import type { NextPageWithLayout } from '@/types';
import type { GetStaticProps } from 'next';
import Layout from '@/layouts/_layout';

import Seo from '@/layouts/_seo';
import routes from '@/config/routes';

import { dehydrate, QueryClient } from 'react-query';

import CategoryFilter from '@/components/design-templates/category-filter';
// import PromoCarousel from '@/components/design-templates/promo-carousel';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
// import { useTypes } from '@/data/type';
import isEmpty from 'lodash/isEmpty';
import { useAllDesigns } from '@/data/designs';
import Grid from '@/components/design-templates/grid';
import { fetchDesigns } from '@/services/designs/fetchDesigns';

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  const queryClient = new QueryClient();
  try {
    await Promise.all([
      queryClient.prefetchInfiniteQuery(
        ['categories', ''], // Prefetch without any specific category
        fetchDesigns
      ),
      // queryClient.prefetchInfiniteQuery(
      //   [API_ENDPOINTS.CATEGORIES, { limit: 100, language: locale }],
      //   ({ queryKey }) =>
      //     client.categories.all(queryKey[1] as CategoryQueryOptions)
      // ),
      // queryClient.prefetchInfiniteQuery(
      //   [API_ENDPOINTS.TYPES, { limit: 100, language: locale }],
      //   ({ queryKey }) => client.types.all(queryKey[1] as TypeQueryOptions)
      // ),
    ]);
    return {
      props: {
        ...(await serverSideTranslations(locale!, ['common'])),
        dehydratedState: JSON.parse(JSON.stringify(dehydrate(queryClient))),
      },
      revalidate: 60, // In seconds
    };
  } catch (error) {
    //* if we get here, the product doesn't exist or something else went wrong
    return {
      notFound: true,
    };
  }
};

function Products() {
  const {
    templates,
    error,
    loadMore,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useAllDesigns();

  return (
    <Grid
      products={templates}
      onLoadMore={loadMore}
      hasNextPage={hasNextPage}
      isLoadingMore={isFetchingNextPage}
      isLoading={isLoading}
    />
  );
}

// function PromotionalSlider() {
//   const { types } = useTypes({ limit: 100 });
//   return !isEmpty(types) ? <PromoCarousel types={types} /> : null;
// }

const Templates: NextPageWithLayout = () => {
  return (
    <>
      <Seo
        title="Noksha Editor"
        description="All Collections of bengali graphics elements, easy to customize"
        url={routes.home}
      />
      {/* <PromotionalSlider /> */}
      <CategoryFilter defaultActivePath={routes.explore} />
      <Products />
    </>
  );
};

Templates.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};

export default Templates;
