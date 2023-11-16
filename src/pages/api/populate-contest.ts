import { NextApiRequest, NextApiResponse } from 'next';
import { createContest, getLeagues, getUpcomingPreview } from '../utils/betopenly-utils'; // adjust the path as needed


export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    try {
        await populateContests();
        res.status(200);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
}



async function populateContests() {
    console.log("=======Populate Contests=======");

    const leagues = await getLeagues('CONTEST');

    console.log("Got leagues: ", leagues.join(" | "));

    for (const league of leagues) {
        console.log("Getting Games for ", league);
        const upcomingGames = await getUpcomingPreview(league, 'CONTEST');
        console.log(`Got ${upcomingGames.length} games`);

        if (upcomingGames.length < 3) {
            console.log(`Cannot create a ${league} contest with ${upcomingGames.league} games`);
            continue;
        }

        // Spread
        const game1 = upcomingGames[0];
        const game1Payload = JSON.parse(game1.payload);
        const pick1Spread = generateContestPick(game1.id, game1Payload.home.id, game1Payload.odds.homeSpreadline, game1Payload.odds.homeSpread);
        const pick2Spread = generateContestPick(game1.id, game1Payload.away.id, game1Payload.odds.awaySpreadline, game1Payload.odds.awaySpread);

        const game2 = upcomingGames[1];
        const game2Payload = JSON.parse(game2.payload);
        const pick3Spread = generateContestPick(game2.id, game2Payload.home.id, game2Payload.odds.homeSpreadline, game2Payload.odds.homeSpread);
        const pick4Spread = generateContestPick(game2.id, game2Payload.away.id, game2Payload.odds.awaySpreadline, game2Payload.odds.awaySpread);

        const game3 = upcomingGames[2];
        const game3Payload = JSON.parse(game3.payload);
        const pick5Spread = generateContestPick(game3.id, game3Payload.home.id, game3Payload.odds.homeSpreadline, game3Payload.odds.homeSpread);

        const spreadPayload = getContestPayload(league, 'SPREAD', [pick1Spread, pick2Spread, pick3Spread, pick4Spread, pick5Spread]);
        await createContest(league, spreadPayload);

        // POINTS
        const pick1Points = generateContestPick(game1.id, game1Payload.home.id, game1Payload.odds.homeMoneyline, null);
        const pick2Points = generateContestPick(game1.id, game1Payload.away.id, game1Payload.odds.awayMoneyline, null);
        const pick3Points = generateContestPick(game2.id, game2Payload.home.id, game2Payload.odds.homeMoneyline, null);
        const pick4Points = generateContestPick(game2.id, game2Payload.away.id, game2Payload.odds.awayMoneyline, null);
        const pick5Points = generateContestPick(game3.id, game3Payload.away.id, game3Payload.odds.awayMoneyline, null);

        const pointsPayload = getContestPayload(league, 'POINTS', [pick1Points, pick2Points, pick3Points, pick4Points, pick5Points]);
        await createContest(league, pointsPayload);

        // TOTALS
        const totalsPayload = getContestPayload(league, 'TOTALS', [pick1Points, pick2Points, pick3Points, pick4Points, pick5Points]);
        await createContest(league, totalsPayload);

        // WINS
        const winPayload = getContestPayload(league, 'TO_WIN', [pick1Points, pick2Points, pick3Points, pick4Points, pick5Points]);
        await createContest(league, winPayload);
    }

}

function generateContestPick(eventId: string, competitorId: string, odds: number, value: number | null) {
    return {
        event: { eventId },
        competitorId,
        odds,
        value,
        competitorLogoUrl: null,
        competitorName: null
    };
}

function getContestPayload(league: string, contestType: string, picks: any[]) {
    return {
        amount: 10,
        amountToWin: 30,
        eventType: "CONTEST",
        league,
        timeframe: "-1",
        betDetails: null,
        inverse: false,
        live: false,
        picks,
        contest: {
            type: contestType,
            maxParticipants: 2,
            size: 5
        }
    }
}