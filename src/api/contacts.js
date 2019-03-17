import { API } from 'aws-amplify'

export async function getContacts() {
    const results = await API.get('contacts', '/contacts')
    return results
}

/*
    Return contact based on contactId
    WorkordersView.js
*/
export async function getContactById(id) {
    return await API.get('contacts', `/contacts/${id}`)
}

export async function getContactsByClientId(clientId){
    const contacts = await getContacts()
    return contacts.filter((contact) => contact.clientId === clientId)
    
}

/*
    Format the contacts list for the dropdowns
    NewWorkorder.js
*/
export async function getContactsForDropDown() {
    const contacts = await getContacts()
    return contacts.sort().map((contact) => {
        return {
            key: contact.contactId,
            text: contact.name,
            value: contact.name,
        }
    })
}


export async function addClientToContact(contact, clientId) {
    const result = await API.put('/contacts', '/contacts', {
        body: {
            contents: {
                contactId: contact.contactId,
                name: contact.name,
                email: contact.email,
                preferredContactMethod: contact.preferredContactMethod,
                clientId
            }
        }
    })

    return result
}

export async function createContactOnNewWorkorder(clientId, contact) {
    const result = await API.post('contacts', '/contacts', {
        body: {
            content: {
                name: contact.name,
                clientId
            }
        }
    })

    return result
}