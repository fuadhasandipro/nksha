import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import type { GetStaticProps, GetStaticPaths } from 'next';
import type { NextPageWithLayout } from '@/types';
import { motion } from 'framer-motion';
import { fadeInBottom } from '@/lib/framer-motion/fade-in-bottom';
import { UserProfile } from '@clerk/nextjs';
import Layout from '@/layouts/_layout';

const ProfilePage: NextPageWithLayout = () => {
  return (
    <motion.div
      variants={fadeInBottom()}
      className="w-full px-4 pb-9 pt-5 md:px-6 md:pb-10 md:pt-6 lg:px-7 lg:pb-12 3xl:px-8"
    >
      <UserProfile path="/profile" />
    </motion.div>
  );
};

ProfilePage.getLayout = function getLayout(page) {
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

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: 'blocking',
  };
};

export default ProfilePage;
