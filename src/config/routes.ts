import { v4 as uuidv4 } from 'uuid';

const routes = {
  home: '/',
  templates: '/templates',
  authors: '/authors',
  explore: '/explore',
  popularProducts: '/popular-products',
  about: '/about-us',
  contact: '/contact-us',
  mydesigns: '/mydesigns',
  wishlists: '/wishlists',
  reports: '/reports',
  questions: '/questions',
  profile: '/profile',
  checkout: '/checkout',
  help: '/help',
  licensing: '/licensing',
  refund: '/refund',
  terms: '/terms',
  privacy: '/privacy',
  password: '/profile/security',
  feed: '/feed',
  subscription: '/subscription',
  wallet: '/wallet',
  followedShop: '/followed-authors',
  orderUrl: (tracking_number: string) =>
    `/orders/${encodeURIComponent(tracking_number)}`,
  productUrl: (slug: string) => `/products/${slug}`,
  templateUrl: (slug: string) => `/editor/${uuidv4()}/${slug}`,
  existingTemplateUrl: (slug: string) => `/editor/${slug}`,
  tagUrl: (slug: string) => `/products/tags/${slug}`,
  shopUrl: (slug: string) => `/authors/${slug}`,
  product: (slug: string) => {
    return `/products/${encodeURIComponent(slug)}`;
  },
  cards: '/cards',
};
export default routes;
