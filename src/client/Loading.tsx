'use client'

// components/Loading.tsx
import React from 'react';
import styles from './Loading.module.css';

const Loading: React.FC = () => {
    return (
        <div className={styles.spinner}>
            <div className={styles.bounce1}></div>
            <div className={styles.bounce2}></div>
            <div className={styles.bounce3}></div>
        </div>
    );
};

export default Loading;
