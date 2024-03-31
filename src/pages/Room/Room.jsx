import React, { useEffect, useRef, useState } from 'react'
import {over} from 'stompjs';
import SockJS from 'sockjs-client/dist/sockjs';
import styles from './Room.module.css'
import addImage from '../../_services/addImage.service';
import ActionModal from '../../component/ActionModal/ActionModal';
import ResultatModal from '../../component/ResultModal/ResultatModal';
import LeaveModal from '../../component/LeaveModal/LeaveModal';
import {initialise, reInitialise} from '../../_services/initialise.service';
import { useNavigate } from 'react-router-dom';
import PointModal from '../../component/PointModal/PointModal';
import stylesPage from './JoinPage.module.css'
import { motion, AnimatePresence } from "framer-motion";

import { Home, Fuse, Tasse, envoyer, information, Commencez, Processus, Exit } from '../../component/import';

// Utilisation de Home, Fuse, Tasse, envoyer, information, Commencez, Processus, Exit ici


var stompClient =null;
const Room = () => {
    const [isCreated, setIsCreated] = useState(false)
    const [isJoined, setIsJoined] = useState(false)
    let navigate = useNavigate()
    const resultat = useRef([])
    const [showPoints, setShowPoints] = useState(false);
    const [showLeave, setShowLeave] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [showResult, setShowResult] = useState(false);
    const [discussion, setdiscussion] = useState([]);  
    const [isTour, setIsTour]=useState(false); 
    const [publicChats, setPublicChats] = useState([]); 
    const [listeDominos, setListeDominos] = useState([]);
    const [action, setAction]=useState()
    const [imageDominos, setImageDominos] = useState([]);
    const party = useRef(0)
    const [dominoThrowing, setDominoThrowing] = useState([[]]);
    const [dominoCliked, setDominoClicked] = useState()
    const section = document.querySelector("section");
    const [points, setPoints]=useState([]);
    const position = useRef({
        gauche:0,
        droite:0,
    });
    const [tab,setTab] =useState("CHATROOM");
    const [userData, setUserData] = useState({
        username: '',
        receivername: '',
        connected: false,
        message: '',
        maxPoint: '',
      });

    const [currentDominos, setCurrentDominos]= useState({
        gauche:"null",
        droite: "null"
    })


    useEffect(() => {
      console.log(userData);
      console.log(points)
    }, [userData]);

    const connect =()=>{
        
        let Sock = new SockJS('http://localhost:8080/ws');
        stompClient = over(Sock);
        stompClient.connect({},onConnected, onError);
    }

    const onConnected = () => {
        stompClient.subscribe('/chatroom/public', onMessageReceived);
        stompClient.subscribe('/chat', onMessage);
        userJoin();
    }

    const userJoin=()=>{

          var chatMessage = {
            senderName: userData.username,
            status:"JOIN",
            message: userData.maxPoint
          };
          stompClient.send("/app/message", {}, JSON.stringify(chatMessage));
    }

    const onMessageReceived = async (payload)=>{
        var payloadData = JSON.parse(payload.body);
        switch(payloadData.status){
            
            case "JOIN":
                setUserData({...userData,"connected": true});
   
                if(payloadData.listeDominos != null && payloadData.receiverName!=null){
                    let data = initialise(payloadData, userData.username)
                    setListeDominos(data.listeDominos)
                    setImageDominos(data.map)
                    setIsTour(data.isTour)
                    setAction("Le jeux commence")
                }else{
                    setAction("Attente")
                }
                break;
            case "MESSAGE":
                console.log(userData.username+"===="+payloadData.receiverName)
                if(userData.username == payloadData.receiverName ){
                    setIsTour(true)
                }
                setAction(payloadData.message)
                publicChats.push(payloadData);
                setPublicChats([...publicChats]);
                break;

            case "REFUSED":
                if(payloadData.senderName == userData.username ){
                    alert(payloadData.message);
                    stompClient.disconnect();
                    window.location.reload()
                }
                break;

            case "SUCCES":

            console.log(dominoThrowing)
             
                if(userData.username == payloadData.receiverName ){
                    setIsTour(true)
                    setAction(payloadData.message+ " | C'est votre tour")

                }else if(userData.username == payloadData.senderName){
                    removeDomino(payloadData.domino)
                    if(payloadData.domino != "passer"){
                        setAction("Vous avez envoyé(e) "+payloadData.domino)
                    }else{
                        setAction("Vous avez passé(e)")
                    }
                }else{
                    setAction(payloadData.message)
                }

                setCurrentDominos({
                    gauche: payloadData.gauche,
                    droite: payloadData.droite
                })

                if(payloadData.domino != "passer") {
                    let newDomino =addImage(payloadData.domino,payloadData.action,position.current.gauche,position.current.droite)
                    if(showResult){
                        console.log("show")
                        dominoThrowing[(party.current)+1].push(newDomino)
                    }else{
                        dominoThrowing[party.current].push(newDomino)
                    }
                    setDominoThrowing(currentDominoThrowing => [
                        ...dominoThrowing, // Ajoute les éléments de dominoThrowing au premier tableau
                        ...currentDominoThrowing.slice(1) // Conserve les autres tableaux sans modification
                      ]);
                    position.current= {
                        gauche: newDomino.idGauche,
                        droite: newDomino.idDroite
                    };
                    setImageDominos(prevImageDominos => prevImageDominos.filter(domino => domino !== payloadData.domino.replace(":", "_") + ".jpg"));
       
                }
               
                publicChats.push(payloadData);
                setPublicChats([...publicChats]);
                break;

            case "RESULT":
                setAction("Partie terminée")
                dominoThrowing.push([])

                if(userData.username == payloadData.lastSender && payloadData.lastDomino != "passer"){
                    removeDomino(payloadData.lastDomino)
                }
                if(payloadData.lastDomino != "passer"){
                    let newDomino =addImage(payloadData.lastDomino,payloadData.lastAction,position.current.gauche,position.current.droite)
                    dominoThrowing[party.current].push(newDomino)
                    setDominoThrowing([...dominoThrowing])
                    setImageDominos(prevImageDominos => prevImageDominos.filter(domino => domino !== payloadData.lastDomino.replace(":", "_") + ".jpg"));
                }
                let newResultat = payloadData
                resultat.current=newResultat;
                setShowResult(true)
                //section.classList.add("active");
                let points = []

                payloadData.result.map((element, index) => {
                    let data = {
                        name: element.name,
                        point: payloadData.pointJoueurs[index]
                    }
                    points.push(data)
                })

                setPoints(points)
                console.log(" -------------------------------------------------------")
                console.log("RESULTAT"+payloadData)
                console.log(" -------------------------------------------------------")
                break;

            case "NewParty":
                    if(payloadData.message == "3"){
                        updateData()
                    }
                break;

            case "LEAVE":
                    setAction(payloadData.message)
                    setShowLeave(true)
                    setShowResult(false)
                break;
        }
    }
    
    const onMessage = async(payload)=>{
        console.log(payload);
        var payloadData = JSON.parse(payload.body);
        discussion.push(payloadData);
        setdiscussion([...discussion]);
    }

    const onError = (err) => {
        console.log(err);
        
    }

    const handleMessage =(event)=>{
        const {value}=event.target;
        setUserData({...userData,"message": value});
    }
    const sendValue=(domino)=>{

        if(domino != "passer"){
            domino = domino.replace("_", ":"); // Replaces the underscore with a colon
            domino = domino.replace(".jpg", ""); 
        }
        setDominoClicked(domino)

         let isAccepted = true;
        // Split the message into an array of strings
        const [gauche, droite] = domino.split(":");

        let action=null;

        if(isExist()){
            if(listeDominos.includes(domino)){

                if(Object.values(currentDominos).includes("null")){
                    action="initialise"
                }else if(((gauche == currentDominos.gauche && droite == currentDominos.droite)|| (gauche == currentDominos.droite && droite == currentDominos.gauche)) && currentDominos.droite != currentDominos.gauche){
                    setShowModal(true)
                    isAccepted=false;
                }else{
                    action= gauche == (currentDominos.gauche) ? "addReverseGauche" :
                            droite == (currentDominos.droite) ? "addReverseDroite" :
                            droite == (currentDominos.gauche) ? "addGauche" :
                            gauche == (currentDominos.droite) ? "addDroite" : null;
        
                    isAccepted = action != null;
                }

            }else{
                isAccepted=false;
            }
        }else {
            if(domino=="passer"){
                isAccepted=true
            }else{
                isAccepted=false
            }
        }

        if ( isAccepted && isTour) {
            if (stompClient) {
                var chatMessage = {
                  senderName: userData.username,
                  message: domino,
                  status:"MESSAGE",
                  action:action
                };
                console.log(chatMessage);
                setIsTour(false)
                stompClient.send("/app/message", {}, JSON.stringify(chatMessage));
                setUserData({...userData,"message": ""});
              }
        }
    }

    const sendDiscussion=()=>{
        if (stompClient) {
          var chatMessage = {
            senderName: userData.username,
            receiverName:tab,
            message: userData.message,
            status:"MESSAGE"
          };
          
          stompClient.send("/app/discussion", {}, JSON.stringify(chatMessage));
          setUserData({...userData,"message": ""});
        }
    }

    const removeDomino = (dominoToRemove) => {
        setListeDominos(prevListeDominoes => prevListeDominoes.filter(domino => domino !== dominoToRemove));
      };

    const handleUsername=(event)=>{
        const {value}=event.target;
        setUserData({...userData,"username": value});
    }

    const handleMaxPoint=(event)=>{
        const {value}=event.target;
        setUserData({...userData,"maxPoint": value});
    }

    const registerUser=()=>{
        connect();
    }

   

    const isExist=()=>{
        let exist = false;

        if(currentDominos.gauche && currentDominos.droite != "null"){
            listeDominos.map((element) => {
                let [g,d] = element.split(":");
                if(currentDominos.gauche == g ||currentDominos.gauche == d || currentDominos.droite == g ||currentDominos.droite == d){
                    exist=true;
                }
            })
        }else{
            exist=true;
        }
        
        return exist
    }

    const handleUserChoice = (choice) => {
        setShowModal(false);
        let [g,d] =dominoCliked.split(":")
        if(g == currentDominos.gauche && d == currentDominos.droite){
            choice = `${choice.slice(0,  3)}Reverse${choice.slice(3)}`; 
        }
        if (stompClient) {
            var chatMessage = {
              senderName: userData.username,
              message: dominoCliked,
              status:"MESSAGE",
              action:choice
            };
            console.log(chatMessage);
            setIsTour(false)
            stompClient.send("/app/message", {}, JSON.stringify(chatMessage));
            setUserData({...userData,"message": ""});
          }
        // Continue with the rest of your logic
    };


    const updateData = () => {
        party.current = party.current+1
        let data = reInitialise(resultat.current, userData.username)
        setListeDominos(data.listeDominos)
        setImageDominos(data.map)
        setIsTour(data.isTour)
        setDominoThrowing(prevListeDominoes => prevListeDominoes.filter(domino => domino == "0+1"));
        position.current= {
            gauche: 0,
            droite: 0
        };
        setCurrentDominos({
            gauche: "null",
            droite: "null"
        })

        data.isTour ? setAction("Vous commencer la nouvelle partie"): setAction("Nouvelle partie")
        setShowResult(false)
    }

    const newParty = () => {
        setAction("En attente des autres joueurs pour continuer le jeux")
        setShowResult(false)
        if (stompClient) {
            var chatMessage = {
              senderName: userData.username,
              status:"NewParty",
            };
            stompClient.send("/app/message", {}, JSON.stringify(chatMessage));
            setUserData({...userData,"message": ""});
          }
    }

    const disconnect=()=>{
        if (stompClient) {
            var chatMessage = {
              senderName: userData.username,
              status:"LEAVE",
            };
            stompClient.send("/app/message", {}, JSON.stringify(chatMessage));
            setUserData({...userData,"message": ""});
          }

        stompClient.disconnect();
        window.location.reload();

    } 

    const newGame=()=>{
        stompClient.disconnect();
        window.location.reload();
    } 

    const onPoints= () => {
        if(showPoints){
            setShowPoints(false)
        }else{
            console.log(points)
            setShowPoints(true)
        }
    }
    
    return (
    <div className={ (listeDominos.length > 0 || dominoThrowing.length > 1) && styles.body}>
        {userData.connected?
        
        <div className={ action != "Attente" && styles.body2}>
            
                    <div className={styles.item1}>

                        {action == "Attente" ? 
                        <div className={styles.waiting}>
                            <div className={styles.waitingTitle} >
                                <span>En attente des autres joueurs {action} </span>
                                <img src={Tasse} alt="Tasse"  className = { styles.waitingTasse}/>
                    
                            </div>
                            <AnimatePresence mode='wait'>
                                    <motion.div
                                        initial={{ marginTop: '30vh' }}
                                        animate={{ marginTop: '10%' }}
                                        exit={{ marginTop: '0%' }}
                                        transition={{ duration: 1 }} // Ajoutez cette ligne pour définir la durée de l'animation
                                    >
                                    <img src={Fuse} alt="Fuse"  className = { styles.waitingFuse}/> 
                                    </motion.div>
                            </AnimatePresence>


                        </div>
                        :
                        <span>{action}</span>}

                    </div>
                    {(action != "Attente") && 
                    <div className={styles.item2}>
                        <div className={styles.item21}>
                            
                        {dominoThrowing.length >  0 &&
                        dominoThrowing[party.current].map((imageDom, index) => (
                            
                                <img key={index} src={`./images/rotated/${imageDom.domino}`} alt="image"  width="30" height="50"   className={` ${styles[imageDom.position]} ${styles[imageDom.rotation]}`}/>
                            
                        ))    
                        }
                        </div>


                        <div className={styles.item22}>
                        {imageDominos.length >  0 &&
                            <div className={styles.listeDominos}>
                            {imageDominos.map((imageDom, index) => (
                                <div key={index}>
                                    <img src={`./images/${imageDom}`} alt={imageDom+".jpg"}  className = { styles.click} width="30" height="50" onClick={() => sendValue(imageDom) }/>
                                </div>
                            ))}       
                            <button type="button" className={styles.passer}  width="30" height="50" onClick={() => sendValue("passer")}> passer</button> 
                            </div>
                            }
                        </div>    
                        </div>
                    }
            
            
                    {(action != "Attente") &&  
            
            
                    <div className={styles.item3}>
                    
                        <div className={styles.item31}>
                            <h3 className={styles.chat}>CHAT </h3>
                            <img src={information} alt="Image eh" className={styles.pointButton} onClick={onPoints}/>
                            <img src={Exit} alt="Exit " className={styles.exitButton} onClick={disconnect}/>
                            
                        </div>

                        <div className={styles.item32}>
                            <ul >
                                                           
                            {discussion.map((chat,index)=>(
                                <li className={` ${chat.senderName === userData.username? styles.self : styles.other}`} key={index}>
                                    <div className={styles.message}>
                                    
                                    {chat.senderName != userData.username && chat.senderName + " : "} {chat.message} 
                                    </div>
                                </li>
                            ))} 
                        
                            </ul> 
                        </div>
                        
                        <div className={styles.item33}>
                            <input type="text" className={styles.inputChat} placeholder="Ecrire un message" value={userData.message} onChange={handleMessage} /> 
                            <img src={envoyer} alt="Image eh" className={styles.chatButton} onClick={sendDiscussion}/>
                        </div>
                                  
                    </div>
                    }

        </div>
        :
        <Home>
            <div className={stylesPage.divButton}>
                <button className={stylesPage.btn} onClick={()=>{
                    setIsJoined(false) 
                    setIsCreated(true) }}> Créer </button>
                <button className={stylesPage.btn} onClick={()=>{
                    setIsJoined(true) 
                    setIsCreated(false) }}> Rejoindre </button>
            </div>
            {
                isCreated && 
                <div className={stylesPage.joinPage}>

                    <div class={stylesPage.inputBx1}>
                        <input type="text"
                            id="user-name"
                            required="required"
                            name="userName"
                            value={userData.maxPoint}
                            onChange={handleMaxPoint}
                        />
                        <span>Maximum de point</span>
                     </div>      
                     <img src={Processus} alt="commencez" className={stylesPage.createButton} onClick={()=>{
                    setIsJoined(true) 
                    setIsCreated(false) }}/>
  
                </div>
            }
            {
                isJoined && 
                <div className={stylesPage.joinPage}>

                    <div class={stylesPage.inputBx}>
                        <input type="text"
                            id="user-name"
                            required="required"
                            name="userName"
                            value={userData.username}
                            onChange={handleUsername}
                        />
                        <span>pseudo</span>
                     </div>      
                     <img src={Commencez} alt="commencez" className={stylesPage.playButton} onClick={registerUser}/>
  
    
                </div>
            }
            
            
        </Home>
       
        
        
        }

        {showModal && (
            <ActionModal isOpen={true}>
                <button onClick={() => handleUserChoice('addGauche')}>Gauche</button>
                <button onClick={() => handleUserChoice('addDroite')}>Droite</button>
            </ActionModal>
        )}

        {showResult && (

            <AnimatePresence>
            <motion.div
                initial={{ y: '-100vh', opacity:0 }}
                animate={{ y: '-50vh' , opacity : 1}}
                exit={{ y: '-100vh', opacity: 1 }}
                transition={{ duration: 0.1, type: "spring", damping:25, stiffness: 500 }} // Ajoutez cette ligne pour définir la durée de l'animation
            >
                 <ResultatModal isOpen={true} resultat={resultat.current} userName={userData.username}>
                    {
                        !(resultat.current).finished? <button onClick={newParty}>Continuer</button>:                     
                        <button onClick={newGame}>Rejouer</button>

                    }
                    <button onClick={disconnect}>Quitter</button>
                    
                </ResultatModal>
            </motion.div>
            </AnimatePresence>
           

        )}

        {showLeave && (
            <LeaveModal isOpen={true}>
                <button onClick={() => window.location.reload()}>Ok</button>
            </LeaveModal>
        )}

        {
            showPoints && (
                <PointModal isOpen={true} points={points}/>
            )
        }

    </div>
    )
}

export default Room