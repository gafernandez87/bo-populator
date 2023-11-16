'use client'

import { useState } from 'react';
import styles from './BetButtons.module.css';
import Loading from './Loading';
import Modal from './Modal';

export default function BetButtons() {
    const [isLoading, setLoading] = useState(true);

    const handleClick = (action: string) => {
        console.log(`Populating ${action}`); // Replace with your actual function
        setLoading(true);
        fetch(`/api/${action}`).then((res) => {
            console.log("Finished", res);
            setLoading(false);
        }).catch(err => {
            console.log("Finished", err);
            setLoading(false);
        })
        // Simulate an asynchronous action
        setTimeout(() => {

        }, 2000);
    };

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Betopenly Populator</h1>

            <div className={styles.buttonContainer}>
                <button className={styles.btn} onClick={() => handleClick('populate-bets')} disabled={isLoading}>Populate Bets</button>
                <button className={styles.btn} onClick={() => handleClick('populate-parlays')} disabled={isLoading}>Populate Parlays</button>
                <button className={styles.btn} onClick={() => handleClick('populate-contest')} disabled={isLoading}>Populate Contest</button>
            </div>

            <Modal show={isLoading}>
                <h2>Processing</h2>
                <h4>this can take a while</h4>
                <Loading />
            </Modal>
        </div>
    );
}
