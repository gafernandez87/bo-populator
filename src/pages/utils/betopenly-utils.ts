const username = process.env.BO_U;
const password = process.env.BO_P;

let token: string | null = null;

export async function getLeagues(eventType: string) {
    console.log("Getting leagues");

    await getToken();
    return fetch(`https://api-dev.betopenly.com/v1/events/${eventType}/leagues?live=false`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then((sports: any) => {
            const leagues = sports.reduce((acc: string[], curr: any) => {
                console.log(curr);
                const sportLeagues = curr.leagues.map((l: any) => l.name || l.league);
                acc.push(...sportLeagues);
                return acc;
            }, []);

            console.log("Leagues: ", leagues);
            return leagues;
        })
}

export async function getUpcomingPreview(league: string, eventType: string) {
    return fetch(`https://api-dev.betopenly.com/v1/events/${eventType}/${league}/upcoming-preview?timeframe=-1&live=false`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        });
}

export async function createBet(league: string, eventType: string, betDetails: any[]) {
    console.log("Creating", league);

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

    return fetch('https://api-dev.betopenly.com/v1/bets', {
        method: 'POST',
        body: JSON.stringify(bet),
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }
    })
        .then((res: any) => {
            console.log('Status code: ', res.status);
            return res.status == 201;
        })
        .catch((err: any) => {
            console.log('Error: ', err.message);
            return false;
        });

}

export async function createContest(league: string, payload: any) {
    console.log("Creating Contest", league);

    return fetch('https://api-dev.betopenly.com/v1/bets', {
        method: 'POST',
        body: JSON.stringify(payload),
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then((res: any) => {
            console.log('Status code: ', res.status);
            return res.status == 201;
        })
        .catch((err: any) => {
            console.log('Error: ', err.message);
            return false;
        });
}

function getToken() {
    if (token) {
        return Promise.resolve(token);
    }

    return fetch('https://api-dev.betopenly.com/v1/cas/login', {
        method: 'POST',
        body: JSON.stringify({ username: username, password: password }),
        headers: { 'Content-Type': 'application/json' }
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then((res: any) => {
            token = res.data;
            return token;
        })
        .catch((err: any) => {
            console.log('Error: ', err.message);
            return null;
        });
}

function calculateAmountToWin(amount: number, betDetails: any[]) {
    const oddsMultiplier = (betDetails.reduce((acc, bet) => acc * (1 + bet.odds), 1) - 1) * 0.9;
    return amount * oddsMultiplier;
}
