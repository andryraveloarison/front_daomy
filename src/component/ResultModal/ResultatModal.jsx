import React, { useState, useEffect } from 'react';
import styles from './resultModal.module.css';
import Prix from '/prix.gif'
import Cible from '/cible.gif'
import Pleurer from '/pleurer.gif'

const ResultatModal = ({ isOpen, resultat,userName, children,  }) => {
    if (!isOpen) {
        return null;
    }

    const [rep, setRep]=useState("")
    const [showResultats, setShowResultats] = useState(false)
    const [showPoints, setShowPoints] = useState(false)


    const afficherResult = () => {
        setShowPoints(false)
        setShowResultats(true)
        setRep("obtenu(e) !")
    }    

    const afficherPoint = () => {
        setRep("gagné(e) !")
        setShowPoints(true)
        setShowResultats(false)
    }  

    useEffect(() => {
        const section = document.querySelector("section");
        if (section) {
            section.classList.add("active");
        }
        if(!resultat.finished){
            setRep("obtenu(e) !")
        }else{
            setRep("gagné(e) !")
            setShowPoints(true)
        }

    }, []); // Empty dependency array means this effect runs once on mount

 


    return (
        
        <section className={styles.modalBox}>
            
           {
                resultat.finished ?  
                resultat.winnerName == userName ?
                <img src={Prix} alt="commencez" className={styles.prix} />
                :                
                <img src={Pleurer} alt="pleurer" className={styles.prix} />
            :
                resultat.winnerName == userName &&
                <img src={Cible} alt="cible" className={styles.prix} />
           }  


            {
                resultat.winnerName == userName ?             
                <h1>Vous avez {rep}  </h1>
                :        
                <div>
                    {resultat.winnerName != "null"? 
                        <h1> {resultat.winnerName} a {rep} </h1>:
                        <h1> Personne n'a gagné la partie</h1>  
                    }
                </div>
                
            }
            
            {
                resultat.finished && showPoints? 
                
                <div className={styles.divResult} >
                    
                    {
                        resultat.result.map((resultats, index) => {
                            return (
                                <div key={index}>
                                    <h3>{resultats.name}</h3>
                                    <h3>{resultat.pointJoueurs[index]}</h3>
                                </div>
                            );
                        })
                    }
                </div>
                : 
                
                <h2> { resultat.winnerPoints != 0 && resultat.winnerPoints + "points"}  </h2>
            }
                

            {
                showResultats && 

                <div className={styles.divResult} >
                    {
                        resultat.result.map((resultat, index) => {
                            return (
                                <div key={index}>
                                    <h3>{resultat.name}</h3>
                                    <h3>{resultat.point}</h3>
                                </div>
                            );
                        })
                    }
                </div>
            }
            <div className={styles.divButton}>
                {
                    resultat.finished?
                    <div>
                        <button onClick={afficherResult}> résultats</button>
                        <button onClick={afficherPoint}> points</button>
                        {children}    
                    </div>
                    :
                    <div>
                        <button onClick={afficherResult}> résultats</button>
                        {children}
                    </div>
                }
                

            </div>
          

        </section>
    );
};

export default ResultatModal;
