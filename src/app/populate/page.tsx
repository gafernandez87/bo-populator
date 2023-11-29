'use client'

// React
import { useState } from 'react';

// Styles
import styles from './Populate.module.css';

// Components
import Card from '@/client/Card/Card';
import Button from '@/client/Button/Button';
import Leagues from '@/client/Leagues/Leagues';
import { PopulateFeedback } from '@/utils/populate-feedback-cache';

export default function Page() {
    const [isPopulating, setPopulating] = useState(false);

    const [selectedLeagues, setSelectedLeagues] = useState<string[]>([]);
    const [betsCreated, setBetsCreated] = useState<string>();

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
                    setBetsCreated(betsCreated)

                    if (feedback.finished) {
                        setPopulating(false);
                        clearInterval(intervalRef);
                    }
                });
        }, 700);

    }

    return (
        <div className={styles.container}>
            <h3 className={styles.title}>Betopenly Populator</h3>

            <div className={styles.cardsContainer}>
                <Card>
                    <div className={styles.card}>
                        <Leagues leaguesChange={setSelectedLeagues}></Leagues>

                        <Button disabled={selectedLeagues.length === 0} click={populate}>Start Populate</Button>

                        <div className={styles.feedback}>
                            Feedback {isPopulating && <p>Loading...</p>}
                            <textarea value={betsCreated}></textarea>
                            {!isPopulating && betsCreated && <p>Done</p>}
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
}
