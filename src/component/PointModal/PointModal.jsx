import React, { useState, useEffect } from 'react';
import styles from './pointModal.module.css';

const PointModal = ({ isOpen, points }) => {
    if (!isOpen) {
        return null;
    }

    useEffect(() => {
        const section = document.querySelector("section");
        if (section) {
            section.classList.add("active");
        }

        console.log("point ========================= "+ points)


    }, []); // Empty dependency array means this effect runs once on mount

 


    return (
        
        <section className={styles.modalBox}>

                {points.length > 0 && <h2>Point des joueurs</h2>}

            {               

                points.length > 0 ?
                <div className={styles.divResult} >

                    {
                        points.map((point, index) => {
                            return (
                                <div key={index}>
                                    <h3>{point.name}</h3>
                                    <h3>{point.point}</h3>
                                </div>
                            );
                        })
                    }
                </div>
                :
                <div>
                    <h3>Vous avez tous 0 point</h3>
                </div>
               
            }
                   

        </section>
    );
};

export default PointModal;
