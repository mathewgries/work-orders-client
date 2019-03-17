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
export async function createWorkordersItem(workorderId, workorderItem) {
    const result = await API.post('workordersItems', '/workordersItems', {
        body: {
            content: {
                workorderId,
                workordersItemType: workorderItem.workordersItemType,
                description: workorderItem.description,
                quanity: workorderItem.quanity,
                unitPrice: workorderItem.unitPrice,
                total: workorderItem.total
            }
        }
    })

    return result
}