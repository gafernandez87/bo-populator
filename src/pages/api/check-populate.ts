import { getFeedbackInstance } from '@/utils/populate-feedback-cache';
import { NextApiRequest, NextApiResponse } from 'next';


export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    try {
        const feedback = getFeedbackInstance();
        res.status(200).json(feedback);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
}


