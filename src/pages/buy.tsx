import { DetailsIcon } from '@/components/icons/details-icon';
import GeneralLayout from '@/layouts/_general-layout';
import { useIsDarkMode } from '@/lib/hooks/use-is-dark-mode';
import usePaymentUrl from '@/lib/hooks/use-payment-url';
import { NextPageWithLayout } from '@/types';
import { GetStaticProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';

const Buy: NextPageWithLayout = () => {
  const { isDarkMode } = useIsDarkMode();
  const { fetchPaymentUrl } = usePaymentUrl();
  const router = useRouter()

  return (
    <nav className="flex flex-1 flex-col items-center justify-center pb-4">
      <Image
        src={
          isDarkMode ? '/package/offer-dark.png' : '/package/offer-light.png'
        }
        alt="offer dark"
        width={250}
        height={250}
      />

      <Link
        href=""
        rel="noreferrer"
        className="focus:ring-accent-700 mt-6 hidden h-9 w-44 shrink-0 items-center justify-center self-center rounded border border-transparent bg-brand px-3 py-0 text-sm font-semibold uppercase leading-none text-light outline-none transition duration-300 ease-in-out hover:bg-brand-dark focus:shadow focus:outline-none focus:ring-1 sm:inline-flex"
        onClick={async (e) => {
          e.preventDefault();

          const paymentUrl = await fetchPaymentUrl();

          window.open(paymentUrl, '_blank');
          router.push('/');
        }}
      >
        Get Noksha Pro
        <span className="-mt-1 ml-1.5 flex w-auto flex-shrink-0 items-center justify-start xl:w-3.5">
          <DetailsIcon />
        </span>
      </Link>
    </nav>
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

Buy.getLayout = function getLayout(page) {
  return <GeneralLayout>{page}</GeneralLayout>;
};

export default Buy;
