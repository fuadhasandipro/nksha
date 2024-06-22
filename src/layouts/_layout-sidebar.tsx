import cn from 'classnames';
import routes from '@/config/routes';
import Logo from '@/components/ui/logo';
import ActiveLink from '@/components/ui/links/active-link';
import { HomeIcon } from '@/components/icons/home-icon';
import { SettingIcon } from '@/components/icons/setting-icon';
import { CloseIcon } from '@/components/icons/close-icon';
import { useDrawer } from '@/components/drawer-views/context';
import { ProductIcon } from '@/components/icons/product-icon';

import { PaperPlaneIcon } from '@/components/icons/paper-plane-icon';
import Scrollbar from '@/components/ui/scrollbar';
import Copyright from '@/layouts/_copyright';

import { FeedIcon } from '@/components/icons/feed-icon';
import { useTranslation } from 'next-i18next';
import Link from 'next/link';
import Image from 'next/image';
import { useIsDarkMode } from '@/lib/hooks/use-is-dark-mode';
import { useModalAction } from '@/components/modal-views/context';
import usePaymentUrl from '@/lib/hooks/use-payment-url';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/router';
import subscriptionTimeLeft from '@/lib/getSubscriptionDuration';
import { DetailsIcon } from '@/components/icons/details-icon';
import { event } from '@/lib/events';
import { FacebookIcon } from '@/components/icons/facebook-icon';
import { CrownIcon } from '@/components/icons/crown-icon';

interface NavLinkProps {
  href: string;
  title: string;
  icon: React.ReactNode;
  isCollapse?: boolean;
}

function NavLink({ href, icon, title, isCollapse }: NavLinkProps) {
  return (
    <ActiveLink
      href={href}
      className="my-0.5 flex items-center gap-1 px-4 py-3 hover:bg-light-300 hover:dark:bg-dark-300 xs:px-6 sm:my-1 sm:gap-1.5 sm:px-7 lg:gap-2 xl:my-0.5"
      activeClassName="text-dark-100 active-text-dark dark:active-text-light dark:text-light-400 font-medium bg-light-400 dark:bg-dark-400 hover:bg-light-600 hover:dark:bg-dark-500"
    >
      <span
        className={cn(
          'flex flex-shrink-0 items-center justify-start',
          isCollapse ? 'w-8 xl:w-auto' : 'w-auto xl:w-8'
        )}
      >
        {icon}
      </span>
      <span
        className={cn(
          'text-dark-100 dark:text-light-400',
          isCollapse ? 'inline-flex xl:hidden' : 'hidden xl:inline-flex'
        )}
      >
        {title}
      </span>
    </ActiveLink>
  );
}

export function Sidebar({
  isCollapse,
  className = 'hidden sm:flex fixed bottom-0 z-20 pt-[82px]',
}: {
  isCollapse?: boolean;
  className?: string;
}) {
  const { t } = useTranslation('common');
  const { user } = useUser();

  const { isDarkMode } = useIsDarkMode();
  const { openModal } = useModalAction();
  const { fetchPaymentUrl, error } = usePaymentUrl();

  const router = useRouter()

  const subscriptionDateStr = user?.unsafeMetadata.subscriptionDate;
  let differenceInDays = null;
  if (subscriptionDateStr) {
    differenceInDays = subscriptionTimeLeft(subscriptionDateStr)
  }


  return (
    <aside
      className={cn(
        'h-full flex-col justify-between overflow-y-auto border-r border-light-400 bg-light-100 text-dark-900 dark:border-0 dark:bg-dark-200',
        isCollapse ? 'sm:w-60 xl:w-[75px]' : 'sm:w-[75px] xl:w-60',
        className
      )}
    >
      <Scrollbar className="relative h-full w-full">
        <div className="flex h-full w-full flex-col">
          <nav className="flex flex-col">
            <NavLink
              title="Home"
              href={routes.home}
              isCollapse={isCollapse}
              icon={<HomeIcon className="h-[18px] w-[18px] text-current" />}
            />

            <NavLink
              title="Your Designs"
              href={routes.mydesigns}
              isCollapse={isCollapse}
              icon={<ProductIcon className="h-4 w-4 text-current" />}
            />
            {/* 
            <NavLink
              title="Browse Templates"
              href={routes.templates}
              isCollapse={isCollapse}
              icon={<DiscoverIcon className="h-[18px] w-[18px] text-current" />}
            /> */}



            {/* <NavLink
              title={t('text-contact')}
              href={routes.contact}
              isCollapse={isCollapse}
              icon={
                <PaperPlaneIcon className="h-[18px] w-[18px] text-current" />
              }
            /> */}

            <NavLink
              title="Profile"
              href={routes.profile}
              isCollapse={isCollapse}
              icon={<SettingIcon className="h-[18px] w-[18px] text-current" />}
            />

            <NavLink
              title="Your Subscription"
              href={routes.subscription}
              isCollapse={isCollapse}
              icon={<CrownIcon className="h-[17px] w-[17px] text-current" />}
            />
          </nav>

          {differenceInDays === null || differenceInDays > 30 ? (
            <nav className="mt-auto flex flex-col items-center pb-4">
              <Image
                src={
                  isDarkMode
                    ? '/package/offer-dark.png'
                    : '/package/offer-light.png'
                }
                alt="offer dark"
                width={150}
                height={150}
              />

              <Link
                href=""
                rel="noreferrer"
                className="focus:ring-accent-700  mt-5 inline-flex h-9 w-36 shrink-0 items-center justify-center rounded border border-transparent bg-buy px-3 py-0 text-sm font-semibold leading-none text-dark outline-none transition duration-300 ease-in-out hover:bg-buy-dark focus:shadow focus:outline-none focus:ring-1"
                onClick={async (e) => {

                  event({
                    action: 'click',
                    category: 'Button',
                    label: 'Pay Button',
                    value: 'Clicked on Pay Button '
                  });

                  e.preventDefault();
                  // openModal('PRODUCT_DETAILS')

                  const paymentUrl = await fetchPaymentUrl();

                  if (error) {
                    console.log(error);
                    return
                  }

                  window.open(paymentUrl, '_blank');
                  router.push('/');
                }}
              >
                Buy Now
                <span className="ml-1 flex w-auto flex-shrink-0 items-center justify-start xl:w-3">
                  <CrownIcon className="h-[14px] w-[14px] text-current" />
                </span>
              </Link>
            </nav>
          ) : ""}
        </div>
      </Scrollbar>

      <footer
        className={cn(
          'flex-col border-t border-light-400 pb-4 pt-3 text-center dark:border-dark-400',
          isCollapse ? 'flex xl:hidden' : 'hidden xl:flex'
        )}
      >
        {differenceInDays === null || differenceInDays > 30 ? <div className='flex flex-col justify-center mt-7'>
          <h2 className='font-tiro text-base dark:text-white text-black'>যেকোন আপডেট পেতে যুক্ত থাকুন আমাদের ফেসবুক গ্রুপে।</h2>
          <Link
            href="https://www.facebook.com/groups/noksha.site"
            rel="noreferrer"
            target="_blank"
            className="focus:ring-accent-700 h-9 w-48 shrink-0 items-center justify-center self-center rounded border border-transparent bg-blue-600 px-3 py-0 text-sm font-semibold leading-none text-light outline-none transition duration-300 ease-in-out hover:bg-blue-800 focus:shadow focus:outline-none focus:ring-1 inline-flex mt-4 "
          >
            <span className="mr-2 flex flex-shrink-0 items-center justify-start w-3">
              <FacebookIcon />
            </span>
            Join Our FB Group

          </Link>
        </div> : ""}


        <nav className="flex items-center justify-center gap-5 pb-1.5 text-13px font-medium capitalize tracking-[0.2px]">
          <ActiveLink
            href="https://www.facebook.com/noksha.site"
            target='_blank'
            className="block py-2 text-dark-700 hover:text-dark-100 dark:hover:text-brand"
          >
            Facebook Page
          </ActiveLink>
          <ActiveLink
            href="https://wa.me/+8801971271317?text="
            target='_blank'
            className="block py-2 text-dark-700 hover:text-dark-100 dark:hover:text-brand"
          >
            WhatsApp
          </ActiveLink>
          {/* <ActiveLink
            href={routes.help}
            className="block py-2 text-dark-700 hover:text-dark-100 dark:hover:text-brand"
          >
            Help
          </ActiveLink> */}
        </nav>
        <Copyright className="text-xs font-medium text-dark-800/80 dark:text-dark-700" />
      </footer>
    </aside>
  );
}

export default function SidebarDrawerView() {
  const { closeDrawer } = useDrawer();
  const { t } = useTranslation();
  return (
    <>
      <div className="flex h-[70px] items-center justify-between px-5 py-2 xs:px-7">
        <Logo />
        <div className="ml-3 flex h-7 items-center">
          <button
            type="button"
            className="-m-2 p-2 text-dark-900 outline-none transition-all hover:text-dark dark:text-dark-800 hover:dark:text-light-200"
            onClick={closeDrawer}
          >
            <span className="sr-only">{t('text-close-panel')}</span>
            <CloseIcon className="h-4 w-4" />
          </button>
        </div>
      </div>
      <Sidebar isCollapse={true} className="flex text-13px" />
    </>
  );
}
