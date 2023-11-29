'use client'

import Card from '@/client/Card/Card';
// Styles
import styles from './ImageScrapper.module.css';
import { useState } from 'react';
import Leagues from '@/client/Leagues/Leagues';
import Button from '@/client/Button/Button';
import { CompetitorDB } from '@/utils/betopenly-admin-utils';

export default function Page() {
    const [selectedLeagues, setSelectedLeagues] = useState<string[]>([]);
    const [teamsWithoutLogo, setTeamsWithoutLogo] = useState<CompetitorDB[]>([]);

    const getTeamsWithoutLogo = () => {
        console.log("getTeamsWithoutLogo", selectedLeagues)
        fetch('/api/teams-without-logo', {
            method: 'POST',
            body: JSON.stringify(selectedLeagues),
            headers: { 'Content-type': 'application/json' }
        })
            .then(res => res.json())
            .then(teams => setTeamsWithoutLogo(teams));
    }

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Image Scrapper</h1>
            <div className={styles.options}>
                <Card>
                    <p className={styles.title}>Teams</p>
                    <Leagues leaguesChange={setSelectedLeagues}></Leagues>
                    <Button click={getTeamsWithoutLogo}>Get Teams Without Logo</Button>
                    <select className={styles.select} multiple>
                        {teamsWithoutLogo.map(team => <option key={team.id} value={team.id}>{team.displayName}</option>)}
                    </select>
                </Card>
                <Card>
                    <p className={styles.title}>Players</p>
                </Card>
            </div>
        </div>
    );
}
