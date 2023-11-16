import { NextApiRequest, NextApiResponse } from 'next';
import { createBet, getLeagues, getUpcomingPreview } from '../utils/betopenly-utils'; // adjust the path as needed


export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    try {
        await populateParlays();
        res.status(200);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
}



async function populateParlays(legs = 2) {
    console.log("======= Populate Parlays =======");

    const leagues = await getLeagues('GAME');

    for (const league of leagues) {
        const games = await getUpcomingPreview(league, 'GAME');

        const betDetails = [];
        for (let i = 1; i <= legs; i++) {
            if (betDetails.length === 2) break;

            const game = games[i];

            const payloadInfo = JSON.parse(game.payload);
            const eventId = game.id;
            const homeId = payloadInfo.home.id;

            if (payloadInfo.odds.homeSpreadline !== null && payloadInfo.odds.homeSpread !== null && betDetails.length < 2) {
                const betDetail = {
                    'betType': 'SPREAD',
                    'competitorId': homeId,
                    'opponentId': null,
                    'eventId': eventId,
                    'value': payloadInfo.odds.homeSpread,
                    'odds': payloadInfo.odds.homeSpreadline,
                };
                betDetails.push(betDetail);
            }

            if (payloadInfo.odds.overLine !== null && payloadInfo.odds.overUnderOdds !== null && betDetails.length < 2) {
                const betDetail = {
                    'betType': 'OVER',
                    'competitorId': homeId,
                    'opponentId': null,
                    'eventId': eventId,
                    'value': payloadInfo.odds.overUnderOdds,
                    'odds': payloadInfo.odds.overLine,
                };
                betDetails.push(betDetail);
            }

        }

        await createBet(league, 'GAME', betDetails);
    }
}
