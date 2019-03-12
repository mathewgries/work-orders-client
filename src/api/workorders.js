import { API } from 'aws-amplify'

export async function getWorkorders(){
    return await API.get('workorders', '/workorders')
}

export async function getWorkorderById(id){
    return await API.get('workorders', `/workorders/${id}`)
}