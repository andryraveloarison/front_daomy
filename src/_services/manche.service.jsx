import Axios from "./caller.service";

// Ticket

let addManche = (manche) => {
    return Axios.put('/manche/new',manche)
}


let getManche = (id) => {
    return Axios.get('/manche/'+id)
}


export const mancheService = {
    addManche,getManche
}