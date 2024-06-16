import { Fragment } from 'react';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import type { GetStaticProps } from 'next';
import { useTranslation } from 'next-i18next';
import type { NextPageWithLayout, OrderedFile } from '@/types';

import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

import { motion } from 'framer-motion';

import Image from '@/components/ui/image';
import { Menu } from '@/components/ui/dropdown';
import { Transition } from '@/components/ui/transition';

import { fadeInBottom } from '@/lib/framer-motion/fade-in-bottom';
import rangeMap from '@/lib/range-map';
import Button from '@/components/ui/button';
import placeholder from '@/assets/images/placeholders/product.svg';
import { useModalAction } from '@/components/modal-views/context';

import Link from 'next/link';
import routes from '@/config/routes';
import AnchorLink from '@/components/ui/links/anchor-link';

import { useUserAllDesigns } from '@/data/userdesigns';

import type { GetStaticProps } from 'next';

import Layout from '@/layouts/_layout';
import { DetailsIcon } from '@/components/icons/details-icon';
import Seo from '@/layouts/_seo';
import HomeButton from '@/components/ui/button';
import { useRouter } from 'next/router';

dayjs.extend(relativeTime);

function OrderedItem({ item }: { item: OrderedFile }) {
  const { t } = useTranslation('common');
  const { openModal } = useModalAction();
  const { title, session, template_id, updated_at, thumbnail } = item;

  return (
    <div className="flex items-center gap-4 border-b border-light-400 py-4 last:border-b-0 dark:border-dark-400 sm:gap-5">
      <AnchorLink
        href={routes.existingTemplateUrl(`${session}/${template_id}`)}
      >
        <div className="relative aspect-[3/3] w-28 flex-shrink-0 border border-light-300 dark:border-0 sm:w-32 md:w-36">
          <Image
            alt={title}
            fill
            quality={100}
            src={thumbnail || placeholder}
            className="bg-light-400 object-cover dark:bg-dark-400"
            sizes="(max-width: 768px) 100vw"
          />
        </div>
      </AnchorLink>

      <div className="flex flex-1 flex-col gap-4 sm:flex-row sm:items-center sm:justify-between md:gap-0">
        <div className="border-b border-light-400 pb-3 dark:border-dark-600 sm:border-b-0 sm:pb-0">
          <p className="text-gray-500 dark:text-gray-400">
            {'Last Edited '}
            {dayjs(updated_at).fromNow()}
          </p>
          <h3
            className="my-1.5 font-medium text-dark dark:text-light sm:mb-3"
            title={title}
          >
            <AnchorLink
              href={routes.existingTemplateUrl(`${session}/${template_id}`)}
              className="transition-colors hover:text-brand"
            >
              {title}
            </AnchorLink>
          </h3>
        </div>
        <div className="flex items-center gap-3">
          <a
            href={routes.existingTemplateUrl(`${session}/${template_id}`)}
            className="inline-flex min-h-[46px] items-center gap-x-2 rounded bg-brand px-4 py-3 text-white hover:bg-brand-dark focus:bg-brand-dark sm:h-12 md:px-5"
            target="_blank"
          >
            <DetailsIcon className="h-auto w-4" />
            Edit
          </a>
          {/* <div className="relative shrink-0">
            <Menu>
              <Menu.Button className="flex items-center space-x-[3px] font-semibold text-brand hover:text-brand-dark sm:h-12 sm:rounded sm:border sm:border-light-500 sm:px-4 sm:py-3 sm:dark:border-dark-600">
                <span className="inline-flex h-1 w-1 shrink-0 rounded-full bg-dark-700 dark:bg-light-800"></span>
                <span className="inline-flex h-1 w-1 shrink-0 rounded-full bg-dark-700 dark:bg-light-800"></span>
                <span className="inline-flex h-1 w-1 shrink-0 rounded-full bg-dark-700 dark:bg-light-800"></span>
              </Menu.Button>
              <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items className="absolute top-[110%] z-30 mt-4 w-48 rounded-md bg-light py-1.5 text-dark  shadow-dropdown ltr:right-0 ltr:origin-top-right rtl:left-0 rtl:origin-top-left dark:bg-dark-400 dark:text-light md:top-[78%]">
                  <Menu.Item>
                    <Link
                      href={routes.existingTemplateUrl(
                        `${session}/${template_id}`
                      )}
                      className="transition-fill-colors block w-full px-5 py-2.5 font-medium hover:bg-light-400 ltr:text-left rtl:text-right dark:hover:bg-dark-600"
                    >
                      {t('text-order-details')}
                    </Link>
                  </Menu.Item>
                </Menu.Items>
              </Transition>
            </Menu>
          </div> */}
        </div>
      </div>
    </div>
  );
}

function OrderItemLoader() {
  return (
    <div className="flex animate-pulse items-start gap-4 border-b border-light-400 py-4 last:border-b-0 dark:border-dark-400 sm:items-stretch sm:gap-5">
      <div className="relative aspect-[5/3.4] w-28 flex-shrink-0 bg-light-400 dark:bg-dark-400 sm:w-32 md:w-36" />
      <div className="flex flex-1 flex-col gap-4 sm:flex-row sm:items-center sm:justify-between md:gap-0">
        <div className="h-full flex-grow border-b border-light-400 pb-3 dark:border-dark-600 sm:border-b-0 sm:pb-0">
          <div className="mb-3 h-2.5 w-1/4 bg-light-400 dark:bg-dark-400" />
          <div className="mb-6 h-2.5 w-2/4 bg-light-400 dark:bg-dark-400" />
          <div className="h-2.5 w-1/5 bg-light-400 dark:bg-dark-400" />
        </div>
        <div className="h-2.5 w-1/3 bg-light-400 dark:bg-dark-400 sm:h-12 sm:w-1/4 sm:rounded md:w-1/6" />
      </div>
    </div>
  );
}

const Purchases: NextPageWithLayout = () => {
  const { t } = useTranslation('common');
  const {
    downloadableFiles,
    error,
    loadMore,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useUserAllDesigns();



  if (!downloadableFiles?.pages[0]?.length) {
    return <div className="flex justify-center items-center h-full flex-col">
      <h1 className='text-2xl font-bold'>No Design Found</h1>
      <Link
        href="/"
        rel="noreferrer"
        className="focus:ring-accent-700  mt-5 inline-flex h-9 w-36 shrink-0 items-center justify-center rounded border border-transparent bg-brand px-3 py-0 text-sm font-semibold leading-none text-light outline-none transition duration-300 ease-in-out hover:bg-brand-dark focus:shadow focus:outline-none focus:ring-1"
      >
        Browse Designs
      </Link>
    </div>
  }

  return (
    <motion.div
      variants={fadeInBottom()}
      className="w-full px-4 pb-9 pt-5 md:px-6 md:pb-10 md:pt-6 lg:px-7 lg:pb-12 3xl:px-8"
    >
      <h1 className="mb-3 text-15px font-medium text-dark dark:text-light">
        Your Recent Designs
      </h1>

      {isLoading && !downloadableFiles?.pages.length
        ? rangeMap(15, (i) => (
          <OrderItemLoader key={`order-loader-${i}`} />
        ))
        : downloadableFiles?.pages?.map((product) =>
          product.map((mini) => {
            return <OrderedItem key={mini.id} item={mini} />;
          })
        )}

      {hasNextPage && (
        <div className="mt-10 grid place-content-center">
          <Button
            onClick={loadMore}
            disabled={isFetchingNextPage}
            isLoading={isFetchingNextPage}
          >
            {t('text-loadmore')}
          </Button>
        </div>
      )}
    </motion.div>
  );
};

Purchases.authorization = true;
Purchases.getLayout = function getLayout(page) {

  return (
    <>
      <Seo
        title="You Designs"
        description="List of all your designs"
        url={routes.mydesigns}
      />
      <Layout>{page}</Layout>
    </>
  );
};

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale!, ['common'])),
    },
    revalidate: 60, // In seconds
  };
};

export default Purchases;
