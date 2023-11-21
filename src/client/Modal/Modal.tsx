'use client'

// components/Modal.tsx
import React from 'react';
import styles from './Modal.module.css'; // CSS module for styling

interface ModalProps {
    show: boolean;
    children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ show, children }) => {
    if (!show) {
        return null;
    }

    return (
        <div className={styles.modal}>
            <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
                <div className={styles.modalBody}>
                    {children}
                </div>
            </div>
        </div>
    );
};

export default Modal;
