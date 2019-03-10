export function currencyRounder(q, u){
    const quanity = Number(q)
    const unitPrice = Number(u)
    const preTotal = (quanity * unitPrice)
    const finalTotal = (Math.floor(preTotal * 100) / 100)
    
    return finalTotal
}