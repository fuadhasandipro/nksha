
import { DetailsIcon } from '@/components/icons/details-icon';
import Layout from '@/layouts/_layout';
import subscriptionTimeLeft from '@/lib/getSubscriptionDuration';
import { useIsDarkMode } from '@/lib/hooks/use-is-dark-mode';
import usePaymentUrl from '@/lib/hooks/use-payment-url';
import { useUser } from '@clerk/nextjs';
import dayjs from 'dayjs';
import { GetStaticProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react'

const Subscription = () => {

    const { user } = useUser();
    const router = useRouter()
    const { fetchPaymentUrl } = usePaymentUrl()
    const { isDarkMode } = useIsDarkMode();

    const subscriptionDateStr = user?.unsafeMetadata.subscriptionDate;
    let differenceInDays = null;
    if (subscriptionDateStr) {
        differenceInDays = subscriptionTimeLeft(subscriptionDateStr)
    }


    return (
        <div className="flex justify-center items-center max-h-full h-full">
            {differenceInDays === null || differenceInDays > 30 ?


                <div className="group cursor-pointer rounded-md bg-light px-4 py-7 text-center dark:bg-dark-250 w-96 ">
                    <div className="flex justify-center">
                        <svg width="100" height="100" viewBox="0 0 32 32" fill="#fdbc68" xmlns="http://www.w3.org/2000/svg">
                            <path fillRule="evenodd" clipRule="evenodd" d="M18.546 6.545c0 .992-.568 1.851-1.395 2.272 1.304 3.493 2.67 5.21 3.871 5.344 1.35.152 2.586-.47 3.796-2.004a1.23 1.23 0 0 1 .512-.39A2.545 2.545 0 1 1 27 12.869c.002.112-.01.23-.04.353l-1.981 7.981A3.67 3.67 0 0 1 21.423 24H10.577a3.67 3.67 0 0 1-3.556-2.797l-1.98-7.981a1.329 1.329 0 0 1-.04-.353 2.545 2.545 0 1 1 1.67-1.102c.193.076.376.21.527.41 1.152 1.525 2.375 2.142 3.78 1.984 1.259-.14 2.618-1.852 3.872-5.344a2.545 2.545 0 1 1 3.696-2.272ZM7 27.25c0-.69.56-1.25 1.25-1.25h15.5a1.25 1.25 0 1 1 0 2.5H8.25c-.69 0-1.25-.56-1.25-1.25Z" fill="#cccccc">
                            </path>
                        </svg>
                    </div>
                    <h3 className="my-1.5 text-xl font-medium text-dark dark:text-light">You don't have subscription or subscription has expired</h3>
                    <div className="flex justify-center my-4">
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
                    </div>
                    <Link
                        href=""
                        rel="noreferrer"
                        target="_blank"
                        className="focus:ring-accent-700 hidden h-9 w-36 shrink-0 items-center justify-center self-center rounded border border-transparent bg-brand px-3 py-0 text-sm font-semibold leading-none text-light outline-none transition duration-300 ease-in-out hover:bg-brand-dark focus:shadow focus:outline-none focus:ring-1 sm:inline-flex mt-4"
                        onClick={async (e) => {
                            e.preventDefault();
                            // openModal('PRODUCT_DETAILS')

                            const paymentUrl = await fetchPaymentUrl();

                            window.open(paymentUrl, '_blank');
                            router.push('/subscription');
                        }}
                    >
                        Buy Now
                        <span className="ml-1 flex w-auto flex-shrink-0 items-center justify-start xl:w-3">
                            <DetailsIcon />
                        </span>
                    </Link>


                </div>

                : <div className="group cursor-pointer rounded-md bg-light px-4 py-7 text-center dark:bg-dark-250 w-80">
                    <div className="flex justify-center">
                        <svg width="100" height="100" viewBox="0 0 32 32" fill="#fdbc68" xmlns="http://www.w3.org/2000/svg">
                            <path fillRule="evenodd" clipRule="evenodd" d="M18.546 6.545c0 .992-.568 1.851-1.395 2.272 1.304 3.493 2.67 5.21 3.871 5.344 1.35.152 2.586-.47 3.796-2.004a1.23 1.23 0 0 1 .512-.39A2.545 2.545 0 1 1 27 12.869c.002.112-.01.23-.04.353l-1.981 7.981A3.67 3.67 0 0 1 21.423 24H10.577a3.67 3.67 0 0 1-3.556-2.797l-1.98-7.981a1.329 1.329 0 0 1-.04-.353 2.545 2.545 0 1 1 1.67-1.102c.193.076.376.21.527.41 1.152 1.525 2.375 2.142 3.78 1.984 1.259-.14 2.618-1.852 3.872-5.344a2.545 2.545 0 1 1 3.696-2.272ZM7 27.25c0-.69.56-1.25 1.25-1.25h15.5a1.25 1.25 0 1 1 0 2.5H8.25c-.69 0-1.25-.56-1.25-1.25Z" fill="#fdbc68">
                            </path>
                        </svg>
                    </div>
                    <h3 className="my-1.5 text-xl font-medium text-dark dark:text-light"> Noksha Premium Activated</h3>
                    <div className="font-medium text-dark-800 dark:text-dark-base">
                        Date Purchased: {dayjs(user?.unsafeMetadata.subscriptionDate).format('D MMMM, YYYY [at] hh:mm A')}
                    </div>
                    <div className="font-medium text-dark-800 dark:text-dark-base mb-3">
                        Expires in: {Math.trunc(30 - subscriptionTimeLeft(user?.unsafeMetadata.subscriptionDate))} Day(s)
                    </div>

                    <Link
                        href="/"
                        rel="noreferrer"
                        className="focus:ring-accent-700 hidden h-9 w-36 shrink-0 items-center justify-center self-center rounded border border-transparent bg-brand px-3 py-0 text-sm font-semibold leading-none text-light outline-none transition duration-300 ease-in-out hover:bg-brand-dark focus:shadow focus:outline-none focus:ring-1 sm:inline-flex mt-4"
                    >
                        Start Editing
                        <span className="ml-1 flex w-auto flex-shrink-0 items-center justify-start xl:w-3">
                            <DetailsIcon />
                        </span>
                    </Link>

                </div>}

        </div>
    )
}

Subscription.getLayout = function getLayout(page) {
    return <Layout>{page}</Layout>;
};


export const getStaticProps: GetStaticProps = async ({ locale }) => {
    return {
        props: {
            ...(await serverSideTranslations(locale!, ['common'])),
        },
        revalidate: 60, // In seconds
    };
};

export default Subscription