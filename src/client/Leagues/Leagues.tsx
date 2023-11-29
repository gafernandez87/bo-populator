'use client'

import React, { useState } from 'react';
import styles from './Leagues.module.css';

// Components
import Modal from '@/client/Modal/Modal';
import Loading from '@/client/Loading/Loading';
import Button from '@/client/Button/Button';

interface LeaguesProps {
    leaguesChange: (selectedLeagues: string[]) => void;
}

const Leagues: React.FC<LeaguesProps> = ({ leaguesChange }) => {
    const [isLoading, setLoading] = useState(false);
    const [leagues, setLeagues] = useState<any[]>([]);
    const [_, setSelectedLeagues] = useState<string[]>([]);

    const selectLeagues = (event: any) => {
        let value = Array.from(event.target.selectedOptions, (option: any) => option.value);
        setSelectedLeagues(value);
        leaguesChange(value);
    }

    const getLeagues = () => {
        setLoading(true);
        fetch('/api/leagues')
            .then(res => res.json())
            .then((leagues: any[]) => {
                console.log(leagues);
                setLoading(false);
                const sortedLeagues = leagues.sort((l1, l2) => l1.id.localeCompare(l2.id));
                setLeagues(sortedLeagues);
            });
    }

    return (
        <div>
            <div className={styles.leaguesContainer}>
                <span>
                    Leagues
                    <Button click={getLeagues} size={'sm'}>Get</Button>
                </span>
                <select onChange={selectLeagues} className={styles.select} multiple>
                    {leagues.map(league => <option key={league.id} value={league.id}>{league.name}</option>)}
                </select>

            </div>
            <Modal show={isLoading}>
                <h2>Loading</h2>
                <Loading />
            </Modal>
        </div>
    );
};

export default Leagues;
