const admin = process.env.BO_U_A;

let token: string | null = null;

const IS_PROD = true;

export interface CompetitorDB {
    id: string;
    league: string;
    abbreviation: string | null;
    displayName: string;
    logoUrl: string | null;
    dataProvider: string;
    visible: boolean;
}

export interface Pageable<T> {
    content: T[];
    totalPages: number;
    totalElements: number;
    size: number;
    number: number;
    numberOfElements: number;
    first: boolean;
    last: boolean;
    empty: boolean;
    pageable: Page;
}

export interface Page {
    offset: number;
    pageNumber: number;
    pageSize: number;
    paged: number;
    sort: any;
}

export async function getCompetitorsByLeague(league: string): Promise<CompetitorDB[]> {
    const { host, config } = await prepareRequest();
    return fetch(`${host}/v1/events/COMPETITOR/manage/all?query=${league}`, config)
        .then(res => res.json())
        .then(data => data.content);
}

export async function updateCompetitor(id: string, competitor: any) {
    const { host, config } = await prepareRequest();

    console.log(`Updating competitor ${id}`, config);

    return fetch(`${host}/v1/events/COMPETITOR/manage/${id}`, {
        ...config,
        method: 'POST',
        body: JSON.stringify(competitor)
    }).then((res: any) => {
        if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);

        console.log('Status code: ', res.status);
        return res.status == 200;
    }).catch((err: any) => {
        console.log('Error: ', err.message);
        return false;
    });
}

export async function getCompetitorById(competitorId: string): Promise<CompetitorDB> {
    const { host, config } = await prepareRequest();
    return fetch(`${host}/v1/events/COMPETITOR/manage/${competitorId}`, config)
        .then(res => res.json())
        .then((competitor: CompetitorDB) => competitor);
}

async function prepareRequest() {
    await getToken();

    const host = getHost();
    const config = {
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }
    };

    return { host, config };
}

async function getToken() {
    if (token) return Promise.resolve(token);

    const host = getHost();

    return fetch(`${host}/v1/cas/login`, {
        method: 'POST',
        body: JSON.stringify({ username: admin, password: admin }),
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

function getHost(): string {
    return IS_PROD ? 'https://api.betopenly.com' : 'https://api-dev.betopenly.com';
}

