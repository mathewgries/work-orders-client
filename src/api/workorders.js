import { API } from 'aws-amplify'
import uuid from 'uuid'

/*
    Get all workorders related to the user
    Home.js
*/
export async function getWorkorders() {
        return await API.get('workorders', '/workorders')
}

export async function getWorkorderById(id) {
    const result = await API.get('workorders', `/workorders/${id}`)
    return result
}

export async function createWorkorder(attachment, workorder) {
    const result = await API.post('workorders', '/workorders', {
        body: {
            attachment,
            content: {
                workorderId: uuid.v1(),
                title: workorder.title,
                clientId: workorder.client.clientId,
                contactId: workorder.contact.contactId,
                description: workorder.description
            }
        }
    })

    return result
}
