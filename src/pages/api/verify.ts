import axios from 'axios';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { invoice_id } = req.query;

  if (!invoice_id) {
    return res.status(400).send('invoice_id is required');
  }

  const options = {
    method: 'POST',
    url: 'https://sandbox.uddoktapay.com/api/verify-payment',
    headers: {
      accept: 'application/json',
      'RT-UDDOKTAPAY-API-KEY': '982d381360a69d419689740d9f2e26ce36fb7a50',
      'content-type': 'application/json',
    },
    data: { invoice_id },
  };

  try {
    const response = await axios.request(options);
    res.status(200).json(response.data);
  } catch (error) {
    console.error('Error occurred during the request:', error);
    res.status(500).json({ message: 'An error occurred' });
  }
}
