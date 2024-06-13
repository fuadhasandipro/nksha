import { NextApiRequest, NextApiResponse } from 'next';
import { createClerkSupabaseClient } from '@/services/server';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { session, id, userId } = req.query as { session: string; id: string; userId: string };

    const supabase = createClerkSupabaseClient()

    const { data: existingSession } = await supabase
        .from('user_designs')
        .select('user_id, json')
        .eq('session', session)
        .single();

    if (existingSession) {
        if (existingSession.user_id === userId) {
            const jsonDesign = JSON.parse(existingSession.json);
            res.json({
                initialData: {
                    jsonDesign,
                    type: jsonDesign.type,
                },
            });
        }
    } else {
        const { data: designData, error: designError } = await supabase
            .from('designs')
            .select('json, cover')
            .eq('id', id)
            .single();

        const jsonDesign = JSON.parse(designData?.json);
        res.json({
            initialData: {
                jsonDesign,
                type: jsonDesign.type,
            },
        });
    }
}
