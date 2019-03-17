import { API } from 'aws-amplify'
import uuid from 'uuid'

/*
    Return a raw list of all clients for user
*/
export async function getClients() {
    const results = await API.get('clients', '/clients')
    return results
}

/*
    Format the clients list for the dropdowns
    NewWorkorder.js
*/
export async function getClientsForDropDown() {
    const clients = await getClients()
    return clients.map((client) => {
        return {
            key: client.clientId,
            text: client.name,
            value: client.name
        }
    })
}

/*
    Load full client based on the client
    associated to the workorder being viewed
    WorkordersView.js
*/
export async function getClientById(id) {
    return await API.get('clients', `/clients/${id}`)
}

/*
    Create a new client
    NewWorkorder.js
    NewClient.js
*/
export async function createClientOnNewWorkorder(client) {
    const result = await API.post('clients', '/clients', {
        body: {
            content: {
                clientId: uuid.v1(),
                name: client.name,
            }
        }
    })

    return result
}