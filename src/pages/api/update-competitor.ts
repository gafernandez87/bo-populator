
import { getCompetitorById, updateCompetitor } from '@/utils/betopenly-admin-utils';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    try {
        // const updated = await updateCompetitor(req.body);
        // const updated = await getCompetitorById(req.body.id)

        res.status(200).json(false);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
}
