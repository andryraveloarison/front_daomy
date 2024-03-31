
const initialise = (payloadData, username) => {

    let data = {
        listeDominos:null,
        map:null,
        isTour:false
    }

    let map =[];
    payloadData.listeDominos.map(function(domino) {
        let dom=[]
        domino.map(function (element){
            dom.push(element.replace(":", "_") + ".jpg");
        })
        map.push(dom)
    });

    if(username == payloadData.receiverName ){       
        data.listeDominos=payloadData.listeDominos[0]
        data.map=map[0]
        data.isTour = true        
        alert("Vous commencer le jeux");
    }else if(username == payloadData.senderName && payloadData.listeDominos){
        data.listeDominos=payloadData.listeDominos[2]
        data.map=map[2]

    }else{
        data.listeDominos=payloadData.listeDominos[1]
        data.map=map[1]

    }
    return data

}


const reInitialise = (payloadData, username) => {

    let data = {
        listeDominos:null,
        map:null,
        isTour:false
    }
    let map = mapping(payloadData)
    
    if(username == payloadData.result[payloadData.tete].name){
        data.isTour=true
    }
    if(username == payloadData.result[0].name ){       
        data.listeDominos=payloadData.newListeDominos[0]
        data.map=map[0]

    }else if(username == payloadData.result[2].name && payloadData.newListeDominos){
        data.listeDominos=payloadData.newListeDominos[2]
        data.map=map[2]

    }else{
        data.listeDominos=payloadData.newListeDominos[1]
        data.map=map[1]

    }
    return data

}


const mapping = (payloadData) =>{
    let map =[];
    payloadData.newListeDominos.map(function(domino) {
        let dom=[]
        domino.map(function (element){
            dom.push(element.replace(":", "_") + ".jpg");
        })
        map.push(dom)
    });
    return map
}

export {initialise, reInitialise} 