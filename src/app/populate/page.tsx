'use client'

// React
import { useState } from 'react';

// Styles
import styles from './Populate.module.css';

// Components
import Loading from '../../client/Loading/Loading';
import Modal from '../../client/Modal/Modal';
import Card from '../../client/Card/Card';
import Button from '@/client/Button/Button';
import { PopulateFeedback } from '@/utils/populate-feedback-cache';

export default function Page() {
    const [isLoading, setLoading] = useState(false);
    const [isPopulating, setPopulating] = useState(false);

    const [leagues, setLeagues] = useState<string[]>([]);
    const [selectedLeagues, setSelectedLeagues] = useState<string[]>([]);
    const [betsCreated, setBetsCreated] = useState<string>();

    const selectLeagues = (event: any) => {
        let value = Array.from(event.target.selectedOptions, (option: any) => option.value);
        setSelectedLeagues(value);
    }

    const getLeagues = () => {
        setLoading(true);
        fetch('/api/leagues')
            .then(res => res.json())
            .then((leagues: string[]) => {
                setLoading(false);
                const sortedLeagues = leagues.sort((l1, l2) => l1.localeCompare(l2));
                setLeagues(sortedLeagues);
            });
    }

    const populate = () => {
        setPopulating(true);
        fetch('/api/populate-bets', {
            method: 'POST',
            body: JSON.stringify(selectedLeagues),
            headers: {
                'Content-type': 'application/json'
            }
        }).then(() => checkProcessStatus())
    }

    const checkProcessStatus = () => {
        const intervalRef = setInterval(() => {
            fetch("/api/check-populate")
                .then(res => res.json())
                .then((feedback: PopulateFeedback) => {
                    console.log(feedback);

                    const betsCreated = feedback.bets.map((bet: any) => `${bet.league} ${bet.betType} Created`).join('\n');
                    console.log(betsCreated);
                    setBetsCreated(betsCreated)

                    if (feedback.finished) {
                        setPopulating(false);
                        clearInterval(intervalRef);
                    }
                });
        }, 500);

    }

    return (
        <div className={styles.container}>
            <h3 className={styles.title}>Betopenly Populator</h3>

            <div className={styles.cardsContainer}>
                <Card>
                    <div className={styles.card}>
                        <div>
                            <h3>Populate Bets</h3>
                            <p>Click Begin To See Available Leagues</p>
                            <Button click={getLeagues}>Get Leagues</Button>
                        </div>
                        <div className={styles.leaguesContainer}>
                            Leagues:
                            <select onChange={selectLeagues} className={styles.select} multiple>
                                {leagues.map(league => <option key={league}>{league}</option>)}
                            </select>
                            <button onClick={populate}>Populate</button>
                        </div>
                        <div className={styles.feedback}>
                            <textarea value={betsCreated}></textarea>
                        </div>
                    </div>
                </Card>
                {/* <Card title='Populate Bets' body='Creates 1 bet of each bet type for each available league' button='Populate' buttonClick={() => handleClick('populate-bets')} />
                <Card title='Populate Parlays' body='Creates 1 Parlay for each available league' button='Populate' buttonClick={() => handleClick('populate-parlays')} />
                <Card title='Populate Contests' body='Creates 1 Contest of each Type for each available league' button='Populate' buttonClick={() => handleClick('populate-contest')} /> */}
            </div>

            <Modal show={isLoading || isPopulating}>
                <h2>Loading</h2>
                <Loading />
                {isPopulating && <textarea value={betsCreated}></textarea>}
            </Modal>
        </div>
    );
}
