'use client'

import React from 'react';
import styles from './Button.module.css';

interface ButtonProps {
    children: React.ReactNode;
    disabled?: boolean;
    size?: string;
    click: () => any;
}

const Button: React.FC<ButtonProps> = ({ children, disabled = false, size = "lg", click }) => {
    return (
        <button
            className={`${styles.btn} ${styles[size]}`}
            disabled={disabled}
            onClick={click}
        >
            {children}
        </button>
    );
};

export default Button;
