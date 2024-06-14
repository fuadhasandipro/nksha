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

      const paymentDate = new Date(response?.data?.date);
      const currentDate = new Date();
      const timeDifference = Math.abs(currentDate.getTime() - paymentDate.getTime());
      const timeDifferenceInMinutes = timeDifference / (1000 * 60);

      if (response?.data?.status == 'COMPLETED' && timeDifferenceInMinutes <= 5) {
        if (user) {
          await user.update({
            unsafeMetadata: {
              isSubscribed: true,
              subscriptionDate: new Date(),
            },
          });
        }
        router.push('/subscription');
      } else if (response?.data?.status == 'PENDING') {
        console.log('Payment Pending');
      } else {
        console.log(response?.data?.status);
        alert("Payment Error")
        router.push('/subscription');
      }
    } catch (err) {
      alert("Payment Error")
      console.error(err);
      router.push('/subscription');
      return null;
    }
  };

  verifyPayment();

  return <div>{router.query.invoice_id}</div>;
};

export default Success;
