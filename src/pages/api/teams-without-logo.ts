import { CompetitorDB, getCompetitorById, getCompetitorsByLeague, updateCompetitor } from '@/utils/betopenly-admin-utils';
import { getUpcomingPreview } from '@/utils/betopenly-utils';
import { NextApiRequest, NextApiResponse } from 'next';


interface Payload {
    home: Team;
    away: Team;
}

interface Team {
    id: string;
    displayName: string;
    abbreviation: string;
    logoUrl: string | null;
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    try {
        const leagues = req.body;
        console.log(leagues);

        let allCompetitors: CompetitorDB[] = [];
        for (let i = 0; i < leagues.length; i++) {
            allCompetitors.push(...await getTeamsWithoutLogo(leagues[i]));
        }

        res.status(200).json(allCompetitors);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
}

async function getTeamsWithoutLogo(league: string): Promise<CompetitorDB[]> {
    const competitors = await getCompetitorsByLeague(league);
    return competitors.filter(competitor => !competitor.logoUrl);
}