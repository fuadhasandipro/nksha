import { NextPageWithLayout } from '@/types';
import { useUser } from '@clerk/nextjs';
import axios from 'axios';
import { useRouter } from 'next/router';

const Success: NextPageWithLayout = () => {
  const router = useRouter();
  const { user } = useUser();

  const verifyPayment = async () => {
    try {
      const response = await axios.get(
        'https://noksha.site/api/verify?invoice_id=' + router.query.invoice_id
      );
      if (response?.data?.status == 'COMPLETED') {
        if (user) {
          user.update({
            unsafeMetadata: {
              isSubscribed: true,
              subscriptionDate: new Date(),
            },
          });
        }
        router.push('/');
      } else if (response?.data?.status == 'PENDING') {
        console.log('Payment Pending');
      } else {
        console.log(response?.data?.status);
      }
    } catch (err) {
      console.error(err);
      return null;
    }
  };

  verifyPayment();

  return <div> {router.query.invoice_id}</div>;
};

export default Success;
