
let addImage = (domino, action,  gauche, droite) => {

    domino= domino.replace(":", "_") + ".jpg";
    let rep =   action == "addReverseGauche" ? addReverseGauche(domino,gauche,droite) :
                action == "addReverseDroite" ? addReverseDroite(domino,gauche,droite) :
                action == "addGauche" ? addGauche(domino,gauche,droite) :
                action == "addDroite" ? addDroite(domino,gauche,droite) : addGauche(domino,gauche,droite);
    return rep;            
}

    

let addGauche = (domino, gauche,droite) => {
    let rotation="rotate0"
    if(gauche == 6 || gauche == 7){
        rotation = "rotateGauche"
    }else if(gauche>7){
        rotation = "rotate180"
    }
    let position = "gauche"+gauche
    return {
        domino: domino,
        position: position,
        rotation: rotation,
        idGauche: gauche+1,
        idDroite:droite
    }
}

let addDroite = (domino,gauche, droite) => {
    let rotation="rotate0"
    if(droite == 4 || droite == 5){
        rotation = "rotateDroite"
    }else if(droite > 5){
        rotation = "rotate180"
    }

    let position = "droite"+droite
    return {
        domino: domino,
        position: position,
        rotation: rotation,
        idGauche: gauche,
        idDroite: droite+1
    }
}

let addReverseGauche = (domino, gauche, droite) => {
    let rotation="rotate180"
    if(gauche == 6 || gauche == 7){
        rotation = "rotateInverseGauche"
    }else if(gauche>7){
        rotation = "rotate0"
    }

    let position = "gauche"+gauche
    return {
        domino: domino,
        position: position,
        rotation: rotation,
        idGauche: gauche+1,
        idDroite:droite
    }
}


let addReverseDroite = (domino,gauche, droite) => {
    let rotation="rotate180"
    if(droite == 4 || droite == 5){
        rotation = "rotateInverseDroite"
    }else if(droite > 5){
        rotation ="rotate0"
    }


    let position = "droite"+droite
    return {
        domino: domino,
        position: position,
        rotation: rotation,
        idGauche: gauche,
        idDroite:droite+1
    }
}

export default addImage