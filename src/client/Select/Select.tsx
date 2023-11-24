'use client'

import React from 'react';
import styles from './Select.module.css';

interface SelectProps {
    options: any[];
    multiple?: boolean;
    change?: () => any;
}

const Select: React.FC<SelectProps> = ({ options, multiple = false, change }) => {
    return (
        <button className={styles.btn} onChange={change}>ads</button>
    );
};

export default Select;
