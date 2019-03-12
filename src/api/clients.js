import { API } from 'aws-amplify'

export async function getClients(){
    return await API.get('clients', '/clients')
}

export async function getClientById(id){
    const clients = await getClients()
    const clientArray = clients.filter((client) => client.clientId === id)
    return clientArray[0]
}