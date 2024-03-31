import React, { useState } from 'react';
import styles from './actionModal.module.css';

const ActionModal = ({ isOpen, children }) => {
    if (!isOpen) {
        return null;
    }

    return (
        <section className={styles.modalBox}>
                   
            <h3>Veuillez choisir l'emplacement </h3>
        
        <div className={styles.divButton}>
            {children}
        </div>
    
    </section>
    );
};

export default ActionModal;
