
import { updateCompetitor } from '@/utils/betopenly-admin-utils';
import { NextApiRequest, NextApiResponse } from 'next';


export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    try {
        const players = req.body?.players || [];
        let proccessed = 0;

        for (let i = 0; i < players.length; i++) {
            const { id, league, ...competitor } = players[i];
            console.log("Processing ", players[i])

            const img = await scrapImage(league, competitor.displayName);
            if (img) {
                console.log("Found image", img);
                const updated = await updateCompetitor(id, {
                    abbreviation: competitor.abbreviation,
                    displayName: competitor.displayName,
                    visible: competitor.visible,
                    logoUrl: img
                });
                proccessed += updated ? 1 : 0;
            }
        }

        res.status(200).json(proccessed);

    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
}


async function scrapImage(league: string, name: string): Promise<string | null> {
    try {
        const teamName = name.split(" ").filter(word => !['fc', 'cf'].includes(word.toLocaleLowerCase())).join(' ');
        let img = null;

        const response: any = await fetch(`https://site.web.api.espn.com/apis/search/v2?region=us&lang=en&page=1&query=${teamName}&type=team`);
        const data = await response.json();
        const teams = data?.results?.find((p: any) => p.displayName === 'Teams');
        if (teams) {
            const found = teams.contents?.find((c: any) => c.subtitle.toLocaleLowerCase() === league.toLocaleLowerCase())
            img = found?.image?.default || null;
        }

        return img;
    } catch (err) {
        console.log(err);
        return null;
    }

}
