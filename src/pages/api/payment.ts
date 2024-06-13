import axios from 'axios';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const options = {
    method: 'POST',
    url: 'https://sandbox.uddoktapay.com/api/checkout-v2',
    headers: {
      accept: 'application/json',
      'RT-UDDOKTAPAY-API-KEY': '982d381360a69d419689740d9f2e26ce36fb7a50',
      'content-type': 'application/json',
    },
    data: {
      full_name: 'John Doe',
      email: 'userEmail@gmail.com',
      amount: '100',
      metadata: { user_id: '10', order_id: '50' },
      redirect_url: `https://noksha-editor-v1.vercel.app/verify`,
      cancel_url: `https://noksha-editor-v1.vercel.app/cancel`,
      webhook_url: `https://noksha-editor-v1.vercel.app/webhook`,
      return_type: 'GET',
    },
  };

  axios
    .request(options)
    .then(function (response) {
      res.json(response.data);
    })
    .catch(function (error) {
      res.status(500).send('An error occurred');
    });
}
