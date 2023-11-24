'use client'

// components/Loading.tsx
import React from 'react';
import styles from './Loading.module.css';

const Loading: React.FC = () => {
    return (
        <div role="img" className={styles.wheelAndHamster}>
            <div className={styles.wheel}></div>
            <div className={styles.hamster}>
                <div className={styles.hamster__body}>
                    <div className={styles.hamster__head}>
                        <div className={styles.hamster__ear}></div>
                        <div className={styles.hamster__eye}></div>
                        <div className={styles.hamster__nose}></div>
                    </div>
                    <div className={`${styles.hamster__limb} ${styles.hamster__limb__fr}`}></div>
                    <div className={`${styles.hamster__limb} ${styles.hamster__limb__fl}`}></div>
                    <div className={`${styles.hamster__limb} ${styles.hamster__limb__br}`}></div>
                    <div className={`${styles.hamster__limb} ${styles.hamster__limb__bl}`}></div>
                    <div className={styles.hamster__tail}></div>
                </div >
            </div >
            <div className={styles.spoke}></div>
        </div >
    );
};

export default Loading;