import { useState } from 'react';
import axios from 'axios';

const usePaymentUrl = () => {
  const [error, setError] = useState('');

  const fetchPaymentUrl = async () => {
    try {
      const response = await axios.get('/api/payment');
      return response.data.payment_url;
    } catch (err) {
      setError('An error occurred');
      console.error(err);
      return null;
    }
  };

  return { error, fetchPaymentUrl };
};

export default usePaymentUrl;
