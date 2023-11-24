'use client'

import React from 'react';
import styles from './Button.module.css';

interface ButtonProps {
    children: React.ReactNode;
    click: () => any;
}

const Button: React.FC<ButtonProps> = ({ children, click }) => {
    return (
        <button className={styles.btn} onClick={click}>{children}</button>
    );
};

export default Button;
