'use client'

import Card from '@/client/Card/Card';
// Styles
import styles from './ImageScrapper.module.css';
import { useState } from 'react';
import Leagues from '@/client/Leagues/Leagues';
import Button from '@/client/Button/Button';
import { CompetitorDB } from '@/utils/betopenly-admin-utils';


const ESP_LEAGUE_MAPPER: { [key: string]: string } = {
    'MEXICO_LIGA_MX': 'LIGA MX',
    "ENGLAND_PREMIER_LEAGUE": "prem",
    "ENGLAND_CHAMPIONSHIP": "lc",
    "BELGIUM_JUPILER_PRO_LEAGUE": 'Belgian First Division A',
    "USA_MAJOR_LEAGUE_SOCCER": "MLS",
}

export default function Page() {
    const [selectedLeagues, setSelectedLeagues] = useState<string[]>([]);
    const [selectedTeams, setSelectedTeams] = useState<CompetitorDB[]>([]);
    const [teamsWithoutLogo, setTeamsWithoutLogo] = useState<CompetitorDB[]>([]);
    const [fetchedTeams, setFetchedTeams] = useState(false);

    const leaguesChange = (leagues: any) => {
        setFetchedTeams(false);
        setSelectedLeagues(leagues);
    }

    const getTeamsWithoutLogo = () => {
        fetch('/api/teams-without-logo', {
            method: 'POST',
            body: JSON.stringify(selectedLeagues),
            headers: { 'Content-type': 'application/json' }
        })
            .then(res => res.json())
            .then(teams => {
                setTeamsWithoutLogo(teams);
                setFetchedTeams(true);
            });
    }

    const selectTeams = (event: any) => {
        const teamIds = Array.from(event.target.selectedOptions, (option: any) => option.value);
        const teams = teamIds.map((id: string) => teamsWithoutLogo.find(team => team.id === id));
        const teamsSelected = teams.filter((team): team is CompetitorDB => team !== undefined);
        setSelectedTeams(teamsSelected);
    }

    const getImages = () => {
        const payload = {
            players: selectedTeams.map(t => ({
                ...t,
                league: ESP_LEAGUE_MAPPER[t.league] || t.league
            }))
        };

        fetch('/api/update-competitor', {
            method: 'POST',
            body: JSON.stringify(payload),
            headers: { 'Content-type': 'application/json' }
        })
            .then(res => res.json())

    }

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Image Scrapper</h1>
            <div className={styles.scrappers}>
                <Card>
                    <div className={styles.scrapperContainer}>
                        <p className={styles.title}>Teams</p>
                        <Leagues leaguesChange={leaguesChange}></Leagues>

                        <div className={styles.teamsContainer}>
                            <span>
                                Teams Without Logo
                                <Button disabled={selectedLeagues.length <= 0} click={getTeamsWithoutLogo} size={'sm'}>Get</Button>
                            </span>
                            <select className={styles.select} multiple onChange={selectTeams}>
                                {teamsWithoutLogo.map(team => <option key={team.id} value={team.id}>{team.displayName}</option>)}
                                {fetchedTeams && teamsWithoutLogo.length === 0 && <option>No Teams Found</option>}
                            </select>

                            <Button click={getImages} size={'sm'} disabled={selectedTeams.length <= 0}>Get Images</Button>
                        </div>
                    </div>
                </Card>
                <Card>
                    <p className={styles.title}>Players</p>
                </Card>
            </div>
        </div>
    );
}
