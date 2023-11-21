'use client'

import styles from './Card.module.css';

interface CardProps {
    title: string;
    body: string;
    button: string;
    buttonClick: () => void;
    children?: React.ReactNode;

}

const Card: React.FC<CardProps> = ({ title, body, button, buttonClick }) => {
    return (
        <div className={styles.card}>
            <div className={styles.content}>
                <p className={styles.heading}>{title}</p>
                <p className={styles.para}>
                    {body}
                </p>
                <button className={styles.btn} onClick={buttonClick}>{button}</button>
            </div>
        </div>
    );
};

export default Card;