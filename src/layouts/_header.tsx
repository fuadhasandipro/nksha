import type { User } from '@/types';
import { Fragment } from 'react';
import { useRouter } from 'next/router';
import Avatar from 'react-avatar';
import routes from '@/config/routes';
import Logo from '@/components/ui/logo';
import ThemeSwitcher from '@/components/ui/theme-switcher';
import ActiveLink from '@/components/ui/links/active-link';

import { Menu } from '@/components/ui/dropdown';
import { Transition } from '@/components/ui/transition';

import SearchButton from '@/components/search/search-button';

import Hamburger from '@/components/ui/hamburger';
import GridSwitcher from '@/components/design-templates/grid-switcher';
import { useIsMounted } from '@/lib/hooks/use-is-mounted';
import { useSwapBodyClassOnScrollDirection } from '@/lib/hooks/use-swap-body-class';
import { useModalAction } from '@/components/modal-views/context';
import { useTranslation } from 'next-i18next';
import Link from 'next/link';
import { SignOutButton } from '@clerk/nextjs';

import { useUser } from '@clerk/nextjs';
import { DetailsIcon } from '@/components/icons/details-icon';

const AuthorizedMenuItems = [
  {
    label: "Profile",
    path: routes.profile,
  },
  {
    label: 'Your Designs',
    path: routes.mydesigns,
  },
  {
    label: 'Password',
    path: routes.password,
  },
];

function AuthorizedMenu({ user }: { user: User }) {
  const { t } = useTranslation('common');
  return (
    <Menu>
      <Menu.Button className="relative inline-flex h-8 w-8 justify-center rounded-full border border-light-400 bg-light-300 dark:border-dark-500 dark:bg-dark-500">
        {/* @ts-ignore */}
        <Avatar
          size="32"
          round={true}
          name={user.name}
          textSizeRatio={2}
          src={user?.profile}
        />
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
        <Menu.Items className="absolute top-[84%] z-30 mt-4 w-56 rounded-md bg-light py-1.5 text-dark shadow-dropdown ltr:right-0 ltr:origin-top-right rtl:left-0 rtl:origin-top-left dark:bg-dark-250 dark:text-light">
          {AuthorizedMenuItems.map((item) => (
            <Menu.Item key={item.label}>
              <ActiveLink
                href={item.path}
                className="transition-fill-colors flex w-full items-center px-5 py-2.5 hover:bg-light-400 dark:hover:bg-dark-600"
              >
                {t(item.label)}
              </ActiveLink>
            </Menu.Item>
          ))}

          <SignOutButton>
            <Menu.Item>
              <button
                type="button"
                className="transition-fill-colors w-full px-5 py-2.5 hover:bg-light-400 ltr:text-left rtl:text-right dark:hover:bg-dark-600"
              >
                Logout
              </button>
            </Menu.Item>
          </SignOutButton>
        </Menu.Items>
      </Transition>
    </Menu>
  );
}

function LoginMenu() {
  const { openModal } = useModalAction();
  const { isLoaded, isSignedIn, user } = useUser();

  const me = {
    id: user?.id,
    name: user?.firstName ?? user?.username,
    profile: user?.imageUrl ?? '',
  };

  const isMounted = useIsMounted();
  if (!isMounted) {
    return (
      <div className="h-8 w-8 animate-pulse rounded-full bg-light-300 dark:bg-dark-500" />
    );
  }
  if (user && isSignedIn && isLoaded) {
    return <AuthorizedMenu user={me} />;
  }

  return (
    <div className="flex gap-x-3">
      <Link
        href="/sign-in"
        rel="noreferrer"
        className="focus:ring-accent-700 hidden h-9 shrink-0 items-center justify-center rounded border border-transparent bg-brand px-3 py-0 text-sm font-semibold leading-none text-light outline-none transition duration-300 ease-in-out hover:bg-brand-dark focus:shadow focus:outline-none focus:ring-1 sm:inline-flex"
      >
        Sign In
      </Link>
    </div>
  );
}

interface HeaderProps {
  isCollapse?: boolean;
  showHamburger?: boolean;
  onClickHamburger?: () => void;
}

export default function Header({
  isCollapse,
  showHamburger = false,
  onClickHamburger,
}: HeaderProps) {
  const router = useRouter();
  const { t } = useTranslation('common');
  useSwapBodyClassOnScrollDirection();
  const isMultiLangEnable =
    process.env.NEXT_PUBLIC_ENABLE_MULTI_LANG === 'true' &&
    !!process.env.NEXT_PUBLIC_AVAILABLE_LANGUAGES;
  return (
    <header className="app-header sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-light-300 bg-light px-4 py-1 ltr:left-0 rtl:right-0 dark:border-dark-300 dark:bg-dark-250 sm:h-[70px] sm:px-6">
      <div className="flex items-center gap-4">
        {showHamburger && (
          <Hamburger
            isToggle={isCollapse}
            onClick={onClickHamburger}
            className="hidden sm:flex"
          />
        )}
        <Logo />
      </div>
      <div className="relative flex items-center gap-2 pr-0.5 xs:gap-3 sm:gap-4">
        <SearchButton className="hidden sm:flex" />
        <ThemeSwitcher />
        <GridSwitcher />
        {/* <CartButton className="hidden sm:flex" /> */}
        {/* {isMultiLangEnable ? (
          <div className="ltr:ml-auto rtl:mr-auto">
            <LanguageSwitcher />
          </div>
        ) : (
          ''
        )} */}

        <Link
          href=""
          onClick={() => {
            window.open(routes.templateUrl("37"), '_blank', 'noopener,noreferrer');
          }}
          rel="noreferrer"
          target="_blank"
          className="focus:ring-accent-700 hidden h-9 w-36 shrink-0 items-center justify-center self-center rounded border border-transparent bg-brand px-3 py-0 text-sm font-semibold leading-none text-light outline-none transition duration-300 ease-in-out hover:bg-brand-dark focus:shadow focus:outline-none focus:ring-1 sm:inline-flex"
        >
          Noksha Editor
          <span className="ml-1 flex w-auto flex-shrink-0 items-center justify-start xl:w-3">
            <DetailsIcon />
          </span>
        </Link>
        <LoginMenu />
      </div>
    </header>
  );
}
