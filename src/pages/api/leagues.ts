import { NextApiRequest, NextApiResponse } from 'next';
import { getLeagues } from '../../utils/betopenly-utils'; // adjust the path as needed


export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    try {
        const leagues = await getLeagues('GAME')
        res.status(200).json(leagues);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
}

