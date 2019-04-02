import { API } from 'aws-amplify'

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

export async function getClientById(id) {
    return await API.get('clients', `/clients/${id}`)
}

/*
    Create a new client
*/
export async function createClient({name, type, email}) {
    const result = await API.post('clients', '/clients', {
        body: {
            content: {
                name,
                type,
                email,
            }
        }
    })

    return result
}

export async function updateClient(client, clientId){
    const result = await API.put('clients', `/clients/${clientId}`, {
        body: client
    });
    return result
}

