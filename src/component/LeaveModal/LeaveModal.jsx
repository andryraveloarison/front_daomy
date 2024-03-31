import React, { useState } from 'react';
import styles from './leaveModal.module.css';

const LeaveModal = ({ isOpen, children }) => {
    if (!isOpen) {
        return null;
    }

    return (
        <section className={styles.modalBox}>
                   
            <h3>Le jeu est interrompu car un joueur à quitter le jeu, veuillez recommencer avec des joueurs plus sérieux!</h3>
        
        <div className={styles.divButton}>
            {children}
        </div>
    
    </section>
    );
};

export default LeaveModal;
