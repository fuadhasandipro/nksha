import type { AppProps } from 'next/app';
import type { NextPageWithLayout } from '@/types';
import { useEffect, useState } from 'react';
import { Hydrate, QueryClient, QueryClientProvider } from 'react-query';
import { AnimatePresence } from 'framer-motion';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from 'next-themes';
import { appWithTranslation } from 'next-i18next';
import { validateEnvironmentVariables } from '@/config/validate-environment-variables';
// import { CartProvider } from '@/components/cart/lib/cart.context';
import { ModalProvider } from '@/components/modal-views/context';
import ModalsContainer from '@/components/modal-views/container';
import DrawersContainer from '@/components/drawer-views/container';
import SearchView from '@/components/search/search-view';

import { SearchProvider } from '@/components/search/search.context';
import { ClerkProvider } from '@clerk/nextjs';

// base css file
import '@/assets/css/scrollbar.css';
import '@/assets/css/swiper-carousel.css';
import '@/assets/css/pagination.css';
import '@/assets/css/globals.css';
import '../components/DesignEditor/styles/styles.css';

import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { getDirection } from '@/lib/constants';
import GoogleAnalytics from '@/components/GoogleAnalytics';

const PrivateRoute = dynamic(() => import('@/layouts/_private-route'), {
  ssr: false,
});

validateEnvironmentVariables();

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

function CustomApp({ Component, pageProps }: AppPropsWithLayout) {
  const { locale } = useRouter();
  const [queryClient] = useState(() => new QueryClient());

  const getLayout = Component.getLayout ?? ((page) => page);
  const dir = getDirection(locale);
  useEffect(() => {
    document.documentElement.dir = dir;
  }, [dir]);
  const authenticationRequired = Component.authorization ?? false;
  return (
    <>
      <GoogleAnalytics />
      <QueryClientProvider client={queryClient}>
        <Hydrate state={pageProps.dehydratedState}>
          <ClerkProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="dark"
              enableSystem={false}
            >
              <SearchProvider>
                <ModalProvider>
                  <AnimatePresence
                    initial={false}
                    onExitComplete={() => window.scrollTo(0, 0)}
                  >
                    <>
                      {/* <DefaultSeo /> */}
                      {getLayout(<Component {...pageProps} />)}
                      <SearchView />
                      <ModalsContainer />
                      <DrawersContainer />
                      <Toaster containerClassName="!top-28 sm:!top-3.5 !bottom-16 sm:!bottom-3.5" />
                    </>
                  </AnimatePresence>
                </ModalProvider>
              </SearchProvider>
            </ThemeProvider>
          </ClerkProvider>
        </Hydrate>
        {/* <ReactQueryDevtools initialIsOpen={false} position="bottom-right" /> */}
      </QueryClientProvider>
    </>
  );
}

export default appWithTranslation(CustomApp);
