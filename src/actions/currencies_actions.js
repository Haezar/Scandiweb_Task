export const changeCurrencies = (currency) => {
    return {
        type: 'CHANGE_CURRENCY',
        payload: currency
    }
}
export const loadCurrencies = (currencies) => {
    return {
        type: 'LOAD_CURRENCIES',
        payload: currencies
    }
}