import { API } from 'aws-amplify'

export async function getContacts(){
    return await API.get('contacts', '/contacts')
}

export async function getContactById(id){
    const contacts = await getContacts()
    const contactsArray = contacts.filter((contact) => contact.contactId === id)
    return contactsArray[0]
}