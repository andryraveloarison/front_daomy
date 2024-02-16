import Axios from "./caller.service";

// Ticket

let addManche = (manche: JSON) => {
    return Axios.put('/manche/new',manche)
}


let getManche = (id: Number) => {
    return Axios.get('/manche/'+id)
}


export const mancheService = {
    addManche,getManche
}