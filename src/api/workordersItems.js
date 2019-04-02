import { API } from 'aws-amplify'
/*
    Get all workorders related to the user
    This is used locally in this file.
*/
export async function getWorkordersItems() {
     const results = await API.get('workordersItems', '/workordersItems')
     return results
}

/*
    Return all workordersItems related to a workorder
    WorkordersView.js
*/
export async function getWorkorderItemsByWorkorderId(workorderId) {
        const results = await getWorkordersItems()
        const workorderItems = results.filter((item) => item.workorderId === workorderId)
        return workorderItems
}

/*
    Create a new workordersItem
    NewWorkorder.js
*/
export async function createWorkordersItem(workorderId, workordersItem) {
    const result = await API.post('workordersItems', '/workordersItems', {
        body: {
            content: {
                workordersItemId: workordersItem.workordersItemId,
                workorderId,
                workordersItemType: workordersItem.workordersItemType,
                description: workordersItem.description,
                quanity: workordersItem.quanity,
                unitPrice: workordersItem.unitPrice,
                total: workordersItem.total
            }
        }
    })

    return result
}

export async function updateWorkordersItem(workordersItem){
    const result = await API.put('workordersItems', `/workordersItems/${workordersItem.workordersItemId}`, {
        body : workordersItem
    })
    return result
}