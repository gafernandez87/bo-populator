import { NextApiRequest, NextApiResponse } from 'next';
import { createBet, getUpcomingPreview } from '../../utils/betopenly-utils'; // adjust the path as needed
import { getFeedbackInstance } from '@/utils/populate-feedback-cache';


export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    try {
        const feedback = getFeedbackInstance();
        feedback.reset();

        populateRegularBets(req.body).then(() => {
            feedback.finished = true;
        });

        res.status(200).json({ message: "proccesing... hit /api/check-populate to get feedback" });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
}


async function populateRegularBets(leagues: string[]) {
    console.log("=======Populate Bets=======");

    // Store the amount of bets created for each league
    let betsCreated;

    for (const league of leagues) {
        // Get the games for this league
        const upcomingGames = await getUpcomingPreview(league, 'GAME');

        betsCreated = {
            ML: false,
            SPREAD: false,
            OVER: false,
            UNDER: false,
            FUTURE: false
        };

        for (const game of upcomingGames) {

            if (Object.values(betsCreated).every(value => value === true)) {
                break;
            }

            const payloadInfo = JSON.parse(game.payload);

            const home = payloadInfo.home.id;

            if (payloadInfo.supportedBetTypes.threeWaySupported && payloadInfo.odds.homeThreeWay !== null && !betsCreated['ML']) {
                const created = await create(league, home, game.id, 'THREE_WAY', payloadInfo.odds.homeThreeWay, null);
                if (created) {
                    betsCreated['ML'] = true;
                }
            }

            if (!payloadInfo.supportedBetTypes.threeWaySupported && payloadInfo.odds.homeMoneyline !== null && !betsCreated['ML']) {
                const created = await create(league, home, game.id, 'MONEYLINE', payloadInfo.odds.homeMoneyline, null);
                if (created) {
                    betsCreated['ML'] = true;
                }
            }

            if (payloadInfo.odds.homeSpreadline !== null && payloadInfo.odds.homeSpread !== null && !betsCreated['SPREAD']) {
                const created = await create(league, home, game.id, 'SPREAD', payloadInfo.odds.homeSpreadline, payloadInfo.odds.homeSpread);
                if (created) {
                    betsCreated['SPREAD'] = true;
                }
            }

            // Creates Under ONLY if I already have an over created to avoid Tinder matchmaking.
            if (payloadInfo.odds.underLine !== null && payloadInfo.odds.overUnderOdds !== null && betsCreated['OVER'] && !betsCreated['UNDER']) {
                const created = await create(league, home, game.id, 'UNDER', payloadInfo.odds.overLine, payloadInfo.odds.overUnderOdds);
                if (created) {
                    betsCreated['UNDER'] = true;
                }
            }

            if (payloadInfo.odds.overLine !== null && payloadInfo.odds.overUnderOdds !== null && !betsCreated['OVER']) {
                const created = await create(league, home, game.id, 'OVER', payloadInfo.odds.overLine, payloadInfo.odds.overUnderOdds);
                if (created) {
                    betsCreated['OVER'] = true;
                }
            }
        }
    }
}

async function create(league: string, competitorId: string, eventId: string, betType: string, odds: number, line: number | null) {
    const betDetail = {
        'betType': betType,
        'competitorId': competitorId,
        'opponentId': null,
        'eventId': eventId,
        'value': line,
        'odds': odds
    };

    const created = await createBet(league, 'GAME', [betDetail]);
    if (created) {
        const feedback = getFeedbackInstance();

        feedback.bets = [...feedback.bets, {
            league,
            betType,
        }];
    }
    return created;
}
