export const addToCart = (product) => {
    return {
        type: 'ADD_TO_CART',
        payload: product
    }
}
export const removeFromCart = (productiD) => {
    return {
        type: 'REMOVE_FROM_CART',
        payload: productiD
    }
}

export const changeProductQTY = (productiD, quantityValue) => {
    return {
        type: 'CHANGE_PRODUCT_QTY',
        payload: {
            productiD,
            quantityValue
        }
    }
}
