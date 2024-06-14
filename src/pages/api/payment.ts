import axios from 'axios';
import { NextApiRequest, NextApiResponse } from 'next';
import { headers } from "next/headers"

const headersList = headers();
const cookie = headersList.get('cookie');

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const options = {
    method: 'POST',
    url: 'https://pay.noksha.site/api/checkout-v2',
    headers: {
      accept: 'application/json',
      'RT-UDDOKTAPAY-API-KEY': 'f1d5bd54b659a131aad3020f1bbcd15e5bd275d9',
      'content-type': 'application/json',
      'Cookie': cookie
    },
    data: {
      full_name: 'John Doe',
      email: 'userEmail@gmail.com',
      amount: '2',
      metadata: { user_id: '10', order_id: '50' },
      redirect_url: `https://nksha.vercel.app/verify`,
      cancel_url: `https://nksha.vercel.app/`,
      webhook_url: `https://nksha.vercel.app/webhook`,
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
