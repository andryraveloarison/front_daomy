import styles from './Home.module.css'
import { useState } from 'react';
import Domino from '/domino.png'

const Home = ( props ) => {

    const [isStart, setIsStart]=useState(false)

    
    const onStart=() =>{
        setIsStart(true)
    }

    return (
        <div className={styles.home}>

              
                <div className={styles.welcome}>

                    <div className={styles.welcome0}>
                        <h1 className={styles.daomy}> Daomy </h1> 
                    </div>
                    <div className={styles.welcome2}>
                        <img src={Domino} alt="domino" className={styles.domino}/>
                    </div>
                    <div className={styles.welcome1}>
                        <h2 className={styles.title}> Bienvenue dans daomy ! </h2> 
                        <p>
                        Plongez dans l'univers classique du dominos en ligne .
                        </p>
                       
                        <div>
                            {props.children}
                        </div>
                        

                    </div>


                </div>
               

        </div>
    );
};

export default Home;