import { GetServerSideProps } from 'next';
import { clerkClient, getAuth } from '@clerk/nextjs/server';
import { createClerkSupabaseServer } from '@/services/supabaseServer';
import DesignEditor from '@/components/DesignEditor';

export default function Editor() {

  return <DesignEditor />;
};

// export const getServerSideProps: GetServerSideProps = async (context) => {
//   try {
//     const { session, id } = context.query;

//     const { userId, getToken } = getAuth(context.req);

//     if (!userId) {
//       return {
//         redirect: {
//           destination: '/sign-in',
//           permanent: false,
//         },
//       };
//     }

//     const response = await clerkClient.users.getUser(userId);

//     if (!response) {
//       return {
//         redirect: {
//           destination: '/sign-in',
//           permanent: false,
//         },
//       };
//     }

//     const token = await getToken({ template: 'supabase' });
//     const supabase = createClerkSupabaseServer(token);

//     const { data: existingSession } = await supabase
//       .from('user_designs')
//       .select('user_id, json')
//       .eq('session', session)
//       .single();

//     if (existingSession) {
//       if (existingSession.user_id !== userId) {
//         return {
//           redirect: {
//             destination: '/',
//             permanent: false,
//           },
//         };
//       }
//     } else {
//       const { data: designData, error: designError } = await supabase
//         .from('designs')
//         .select('json, cover')
//         .eq('id', id)
//         .single();

//       if (designError || !designData) {
//         return {
//           redirect: {
//             destination: '/',
//             permanent: false,
//           },
//         };
//       }

//     }

//     const initialData = { shouldFetchData: true, session, id, userId }

//     return {
//       props: { initialData },
//     };
//   } catch (error) {
//     console.error('Error in getServerSideProps:', error.message);
//     return {
//       props: {},
//       redirect: {
//         destination: '/error',
//         permanent: false,
//       },
//     };
//   }
// };


