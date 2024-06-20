import type { Product } from '@/types';
import cn from 'classnames';
import { motion } from 'framer-motion';
import Image from '@/components/ui/image';
import AnchorLink from '@/components/ui/links/anchor-link';
import { useModalAction } from '@/components/modal-views/context';
import routes from '@/config/routes';
import { DetailsIcon } from '@/components/icons/details-icon';
import placeholder from '@/assets/images/placeholders/product.svg';
import { useGridSwitcher } from './grid-switcher';
import { fadeInBottomWithScaleX } from '@/lib/framer-motion/fade-in-bottom';
import { useTranslation } from 'next-i18next';

export default function Card({ product }: { product: Product }) {
  const { name, id, cover } = product ?? {};
  const { openModal } = useModalAction();
  const { isGridCompact } = useGridSwitcher();

  const goToEditPage = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    window.open(routes.templateUrl(id), '_blank', 'noopener,noreferrer');
  };
  const { t } = useTranslation('common');

  return (
    <motion.div variants={fadeInBottomWithScaleX()} title={name}>
      <div className="group relative flex aspect-[3/3] w-full justify-center overflow-hidden">
        <Image
          alt={name}
          fill
          quality={100}
          src={cover ?? placeholder}
          className="bg-light-500 object-cover dark:bg-dark-400"
          sizes="(max-width: 768px) 100vw,
              (max-width: 1200px) 50vw,
              33vw"
        />
        <div
          className="absolute left-0 top-0 z-10 flex h-full w-full cursor-pointer items-center justify-center gap-9 bg-dark/60 p-4 opacity-0 backdrop-blur-sm transition-all group-hover:gap-5 group-hover:opacity-100 dark:bg-dark/70"
        >
          {/* <button
            className={cn(
              'text-center font-medium text-light',
              isGridCompact ? 'text-xs' : 'text-13px'
            )}
          >
            <div
              className={cn(
                'mb-2 flex items-center justify-center rounded-full bg-dark-800 text-light backdrop-blur-sm transition-all hover:bg-brand',
                isGridCompact ? 'h-11 w-11' : 'h-[50px] w-[50px]'
              )}
            >
              <PreviewIcon
                className={cn(isGridCompact ? 'h-4 w-4' : 'h-5 w-5')}
              />
            </div>
            {t('text-preview')}
          </button> */}
          <button
            onClick={goToEditPage}
            className={cn(
              'relative z-[11] text-center font-medium text-light',
              isGridCompact ? 'text-xs' : 'text-13px'
            )}
          >
            <div
              className={cn(
                'mb-2 flex items-center justify-center rounded-full bg-dark-800 text-light backdrop-blur-sm transition-all hover:bg-brand',
                isGridCompact ? 'h-11 w-11' : 'h-[50px] w-[50px]'
              )}
            >
              <DetailsIcon
                className={cn(isGridCompact ? 'h-4 w-4' : 'h-5 w-5')}
              />
            </div>
            {t('text-details')}
          </button>
        </div>
      </div>
      <div className="flex items-start justify-between pt-3.5">
        <div className="-mt-[1px] flex flex-col truncate ltr:mr-auto ltr:pl-2.5 rtl:ml-auto rtl:pr-2.5 rtl:text-right">
          <h3
            title={name}
            className="mb-0.5 truncate font-medium text-dark-100 dark:text-light"
          >
            <AnchorLink href={routes.templateUrl(id)}>{name}</AnchorLink>
          </h3>
        </div>
      </div>
    </motion.div>
  );
}
