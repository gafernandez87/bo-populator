'use client'

// React
import { useState } from 'react';

// Styles
import styles from './Populate.module.css';

// Components
import Loading from '../../client/Loading/Loading';
import Modal from '../../client/Modal/Modal';
import Card from '../../client/Card/Card';

export default function Page() {
    const [isLoading, setLoading] = useState(false);

    const handleClick = (action: string) => {
        console.log(`Populating ${action}`);
        setLoading(true);
        fetch(`/api/${action}`).then((res) => {
            console.log("Finished", res);
            setLoading(false);
        }).catch(err => {
            console.log("Finished", err);
            setLoading(false);
        });
    };


    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Betopenly Populator</h1>

            <div className={styles.buttonContainer}>
                <Card title='Populate Bets' body='Creates 1 bet of each bet type for each available league' button='Populate' buttonClick={() => handleClick('populate-bets')} />
                <Card title='Populate Parlays' body='Creates 1 Parlay for each available league' button='Populate' buttonClick={() => handleClick('populate-parlays')} />
                <Card title='Populate Contests' body='Creates 1 Contest of each Type for each available league' button='Populate' buttonClick={() => handleClick('populate-contest')} />
            </div>

            <Modal show={isLoading}>
                <h2>Processing</h2>
                <h4>this can take a while</h4>
                <Loading />
            </Modal>
        </div>
    );
}
