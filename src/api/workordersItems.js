import { API } from 'aws-amplify'

export async function getWorkordersItems(){
    return await API.get('workordersItems', '/workordersItems')
}

export async function getWorkorderItemsByWorkorderId(workorderId){
    const workordersItems = await getWorkordersItems()
    return workordersItems.filter((item) => workordersItems.workorderId === workorderId)
}