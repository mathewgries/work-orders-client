import { API } from 'aws-amplify'

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

export async function createWorkorder(workorder) {
    const result = await API.post('workorders', '/workorders', {
        body: {
            content: {
                title: workorder.title,
                description: workorder.description
            }
        }
    })
    return result
}

export async function updateWorkorder(workorder, workorderId){
    const result = await API.put("workorders", `/workorders/${workorderId}`, {
        body: workorder
    });
    return result
}

export async function deleteWorkorder(id){
    const result = await API.del("workorders", `/workorders/${id}`);
    return result
}
