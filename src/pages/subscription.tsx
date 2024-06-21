
import { CrownIcon } from '@/components/icons/crown-icon';
import { DetailsIcon } from '@/components/icons/details-icon';
import { FacebookIcon } from '@/components/icons/facebook-icon';
import routes from '@/config/routes';
import Layout from '@/layouts/_layout';
import Seo from '@/layouts/_seo';
import { event } from '@/lib/events';
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
import catUnsubscribe from '@/assets/images/cat_un.png'
import catUnsubscribeDark from '@/assets/images/cat_un_dark.png'
import catSubscribed from '@/assets/images/happy_cat.png'



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
        <div className="flex flex-col justify-center items-center max-h-full h-full">
            {differenceInDays === null || differenceInDays > 30 ?
                <>
                    <div className="group cursor-pointer rounded-md bg-light px-4 py-7 text-center dark:bg-dark-250 w-96 ">
                        <div className="flex justify-center">
                            <Image src={isDarkMode ? catUnsubscribeDark : catUnsubscribe} width={130} height={130} />
                        </div>
                        <h3 className="my-1.5 text-xl font-tiro font-medium text-dark dark:text-light">আপনার সাবস্ক্রিপশন নেই <br /> অথবা মেয়াদ শেষ হয়ে গিয়েছে!</h3>
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
                            className="focus:ring-accent-700 h-9 w-36 shrink-0 items-center justify-center self-center rounded border border-transparent bg-buy px-3 py-0 text-sm font-semibold leading-none text-dark outline-none transition duration-300 ease-in-out hover:bg-buy-dark focus:shadow focus:outline-none focus:ring-1 inline-flex mt-4"
                            onClick={async (e) => {
                                e.preventDefault();

                                event({
                                    action: 'click',
                                    category: 'Button',
                                    label: 'Pay Button',
                                    value: 'Clicked on Pay Button '
                                });
                                // openModal('PRODUCT_DETAILS')

                                const paymentUrl = await fetchPaymentUrl();

                                window.open(paymentUrl, '_blank');
                                router.push('/subscription');
                            }}
                        >
                            Buy Now
                            <span className="ml-2 flex flex-shrink-0 items-center justify-start w-3">
                                <CrownIcon />
                            </span>
                        </Link>
                    </div>

                    <div className='flex flex-col justify-center mt-7'>
                        <h2 className='font-tiro sm:text-xl text-base dark:text-white text-black'>যেকোন আপডেট পেতে যুক্ত থাকুন আমাদের ফেসবুক গ্রুপে।</h2>
                        <Link
                            href="https://www.facebook.com/groups/noksha.site"
                            rel="noreferrer"
                            target="_blank"
                            className="focus:ring-accent-700 h-9 w-60 shrink-0 items-center justify-center self-center rounded border border-transparent px-3 py-0 text-sm font-semibold leading-non outline-none transition duration-300 ease-in-out underline text-blue-600 focus:shadow focus:outline-none focus:ring-1 inline-flex "
                        >
                            <span className="mr-2 flex flex-shrink-0 items-center justify-start w-3">
                                <FacebookIcon />
                            </span>
                            Join Our Facebook Group

                        </Link>
                    </div>
                </>

                : <>
                    <div className="group cursor-pointer rounded-md bg-light px-4 py-7 text-center dark:bg-dark-250 w-80">
                        <div className="flex justify-center">
                            <Image src={catSubscribed} width={130} height={130} />
                        </div>
                        <h3 className="text-xl font-tiro font-medium text-dark dark:text-light my-4">আপনার নকশা প্রিমিয়াম একটিভেট হয়েছে।</h3>
                        <div className="font-medium text-dark-800 dark:text-dark-base">
                            Date Purchased: {dayjs(user?.unsafeMetadata.subscriptionDate).format('D MMMM, YYYY [at] hh:mm A')}
                        </div>
                        <div className="font-medium text-dark-800 dark:text-dark-base mb-3">
                            Expires in: {Math.trunc(30 - subscriptionTimeLeft(user?.unsafeMetadata.subscriptionDate))} Day(s)
                        </div>

                        <Link
                            href="/"
                            rel="noreferrer"
                            className="focus:ring-accent-700 h-9 w-full shrink-0 items-center justify-center self-center rounded border border-transparent bg-brand px-3 py-0 text-sm font-semibold leading-none text-light outline-none transition duration-300 ease-in-out hover:bg-brand-dark focus:shadow focus:outline-none focus:ring-1 inline-flex mt-4"
                        >
                            Start Editing
                            <span className="ml-1 flex flex-shrink-0 items-center justify-start w-3">
                                <DetailsIcon />
                            </span>
                        </Link>
                    </div>
                    <div className='flex flex-col justify-center mt-7'>
                        <h2 className='font-tiro sm:text-xl text-base dark:text-white text-black text-center'>যেকোন টেমপ্লেট বা ডিজাইন রিকোয়েস্ট অথবা <br /> আপনার ফিডব্যাক পোস্ট করতে পারেন আমাদের গ্রুপে।</h2>
                        <Link
                            href="https://www.facebook.com/groups/noksha.site"
                            rel="noreferrer"
                            target="_blank"
                            className="focus:ring-accent-700 h-9 w-60 shrink-0 items-center justify-center self-center rounded border border-transparent px-3 py-0 text-sm font-semibold leading-non outline-none transition duration-300 ease-in-out underline text-blue-600 focus:shadow focus:outline-none focus:ring-1 inline-flex"
                        >
                            <span className="mr-2 flex flex-shrink-0 items-center justify-start w-3">
                                <FacebookIcon />
                            </span>
                            Join Our Facebook Group

                        </Link>
                    </div>
                </>}

        </div>
    )
}


Subscription.getLayout = function getLayout(page: any) {
    return <>
        <Seo
            title="You Subscription"
            description="You Subscription"
            url={routes.subscription}
        />

        <Layout>{page}</Layout>
    </>
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
