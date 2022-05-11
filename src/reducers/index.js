const reducer = function (state = { numberCart: 0, cart: [], cartIds: {}, total: 0, current_currency: 'all' }, action) {
  switch (action.type) {
    case 'CHANGE_CATEGORY':
      return { ...state, current_cattegory: action.payload }
    case 'LOAD_CATEGORIES':
      return { ...state, categories: action.payload }
    case 'CHANGE_CURRENCY':
      return { ...state, current_currency: action.payload }
    case 'LOAD_CURRENCIES':
      return { ...state, currencies: action.payload }
    case 'ADD_TO_CART': {
      let cartItems = [...state.cart]
      const existedProduct = state.cart.findIndex(item => item.id === action.payload.id)
      if (existedProduct === -1) {
        cartItems.push(action.payload)
      } else {
        cartItems = cartItems.map((item, i) => existedProduct === i ? { ...item, quantity: item.quantity + action.payload.quantity } : item)
      }
      return {
        ...state,
        cart: cartItems,
        numberCart: state.numberCart + 1
      }
    }
    case 'CHANGE_PRODUCT_QTY': {
      const index = state.cart.findIndex(item => item.id === action.payload.productiD)
      const newCart = state.cart.map((item, i) => index === i ? { ...item, quantity: item.quantity + action.payload.quantityValue } : item)

      return {
        ...state,
        cart: newCart,
        numberCart: state.numberCart + action.payload.quantityValue
      }
    }
    case 'REMOVE_FROM_CART': {
      const productIndex = state.cart.findIndex(item => item.id === action.payload)
      const updatedCart = state.cart.filter((item, i) => productIndex !== i)
      return {
        ...state,
        cart: updatedCart,
        numberCart: state.numberCart - 1
      }
    }
    default:
      return state
  }
}

export default reducer
