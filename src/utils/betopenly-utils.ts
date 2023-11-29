const boUsername = process.env.BO_U;
const boPassword = process.env.BO_P;

let token: string | null = null;

const IS_PROD = false;

export async function getLeagues(eventType: string) {
    console.log("Getting leagues");

    const { host } = await prepareRequest();
    return fetch(`${host}/v1/events/${eventType}/leagues?live=false`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then((sports: any) => {
            const leagues = sports.reduce((acc: string[], curr: any) => {
                acc.push(...curr.leagues);
                return acc;
            }, []);

            // console.log("Leagues: ", leagues);
            return leagues;
        })
}

export async function getUpcomingPreview(league: string, eventType: string) {
    const { host } = await prepareRequest();
    return fetch(`${host}/v1/events/${eventType}/${league}/upcoming-preview?timeframe=-1&live=false`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        });
}

export async function createBet(league: string, eventType: string, betDetails: any[]) {
    console.log("Creating", league);

    const { host, config } = await prepareRequest();

    const bet = {
        'league': league,
        'inverse': false,
        'eventType': eventType,
        'timeframe': '-1',
        'live': false,
        'amount': 10,
        'amountToWin': calculateAmountToWin(10, betDetails),
        'expiryDate': null,
        'betDetails': betDetails
    }

    return fetch(`${host}/v1/bets`, {
        ...config,
        method: 'POST',
        body: JSON.stringify(bet),
    }).then((res: any) => {
        console.log('Status code: ', res.status);
        return res.status == 201;
    }).catch((err: any) => {
        console.log('Error: ', err.message);
        return false;
    });

}

export async function createContest(league: string, payload: any) {
    console.log("Creating Contest", league);
    const { host, config } = await prepareRequest();

    return fetch(`${host}/v1/bets`, {
        ...config,
        method: 'POST',
        body: JSON.stringify(payload),
    }).then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
    }).then((res: any) => {
        console.log('Status code: ', res.status);
        return res.status == 201;
    }).catch((err: any) => {
        console.log('Error: ', err.message);
        return false;
    });
}

function calculateAmountToWin(amount: number, betDetails: any[]) {
    const oddsMultiplier = (betDetails.reduce((acc, bet) => acc * (1 + bet.odds), 1) - 1) * 0.9;
    return amount * oddsMultiplier;
}

async function prepareRequest() {
    await getToken();

    const host = getHost();
    const config = {
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }
    };

    return { host, config };
}

function getHost(): string {
    return IS_PROD ? 'https://api.betopenly.com' : 'https://api-dev.betopenly.com';
}

async function getToken() {
    if (token) return Promise.resolve(token);

    const host = getHost();

    return fetch(`${host}/v1/cas/login`, {
        method: 'POST',
        body: JSON.stringify({ username: boUsername, password: boPassword }),
        headers: { 'Content-Type': 'application/json' }
    }).then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
    }).then((res: any) => {
        token = res.data;
        return token;
    }).catch((err: any) => {
        console.log('Error: ', err.message);
        return null;
    });
}
