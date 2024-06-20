import type { Product } from '@/types';
import { motion } from 'framer-motion';
import cn from 'classnames';
import Button from '@/components/ui/button';
import Card from './card';
import ProductCardLoader from './product-loader';
import { useGridSwitcher } from './grid-switcher';
import rangeMap from '@/lib/range-map';
import { staggerTransition } from '@/lib/framer-motion/stagger-transition';
import { useTranslation } from 'next-i18next';

interface GridProps {
  products: Product[];
  onLoadMore?: () => void;
  hasNextPage?: boolean;
  isLoadingMore?: boolean;
  isLoading?: boolean;
  limit?: number;
}

export default function Grid({
  products,
  onLoadMore,
  hasNextPage,
  isLoadingMore,
  isLoading,
  limit = 15,
}: GridProps) {
  const { isGridCompact } = useGridSwitcher();
  const { t } = useTranslation('common');

  const noProducts = !isLoading && products?.pages[0]?.length === 0;

  return (
    <div className="w-full px-4 pb-9 pt-5 md:px-6 md:pb-10 md:pt-6 lg:px-7 lg:pb-12 3xl:px-8">
      <motion.div
        variants={staggerTransition(0.025)}
        className={cn(
          'grid grid-cols-1 gap-5 xs:grid-cols-2 md:grid-cols-[repeat(auto-fill,minmax(300px,1fr))] lg:gap-6 3xl:gap-7',
          {
            '2xl:grid-cols-4 3xl:grid-cols-5 4xl:grid-cols-[repeat(auto-fill,minmax(300px,1fr))]':
              isGridCompact,
            '2xl:grid-cols-3 3xl:grid-cols-[repeat(auto-fill,minmax(340px,1fr))] 4xl:grid-cols-[repeat(auto-fill,minmax(380px,1fr))]':
              !isGridCompact,
          }
        )}
      >
        {isLoading && !products?.pages?.length
          ? rangeMap(limit, (i) => (
            <ProductCardLoader key={i} uniqueKey={`product-${i}`} />
          ))
          : products?.pages?.map((product) =>
            product.map((mini) => {
              return <Card key={mini.id} product={mini} />;
            })
          )}
      </motion.div>

      {noProducts && (
        <div className="mt-8 text-center">
          <p>No Templates Found</p>
        </div>
      )}

      {hasNextPage && (
        <div className="mt-8 grid place-content-center md:mt-10">
          <Button
            onClick={onLoadMore}
            disabled={isLoadingMore}
            isLoading={isLoadingMore}
          >
            {t('text-loadmore')}
          </Button>
        </div>
      )}
    </div>
  );
}
