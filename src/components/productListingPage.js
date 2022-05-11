import React from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as cartActions from '../actions/cart_actions'
import cart from '../assets/cart-w.svg'
import * as queries from '../graphql/index.js'
import PropTypes from 'prop-types'

class ProductListingPage extends React.Component {
  constructor (props) {
    super(props)
    this.state = {}
  }

  addToCart (product) {
    const currentAttributes = product.attributes.map(attribute => (
      { attributeId: attribute.id, attributeValue: attribute.items[0].id }
    ))
    const combinedId = [product.id].concat(currentAttributes.map((attr) =>
      attr.attributeId.replace(/ /g, '') + attr.attributeValue.replace(/ /g, '')
    ))
    const cartProduct = {
      ...product,
      id: combinedId.join(''),
      currentAttributes,
      quantity: 1
    }
    this.props.cartActions.addToCart(cartProduct)
  }

  getProducts () {
    fetch('http://localhost:4000/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        query: queries.GET_PRODUCTS,
        variables: { category: this.props.store.current_cattegory }
      })
    }).then((res) => res.json())
      .then((result) => {
        this.setState({ category: result.data.category })
      })
  }

  componentDidUpdate (previousProps, previousState) {
    if (this.props.store.current_cattegory && (previousProps.store.current_cattegory !== this.props.store.current_cattegory)) {
      this.getProducts()
    }
  }

  componentDidMount () {
    if (this.props.store.current_cattegory) {
      this.getProducts()
    }
  }

  render () {
    return (
    <div className='plp'>
      <div className='plp__category-name'>{this.props.store.current_cattegory}</div>
      <div className='plp__products'>
        {this.state.category &&
          this.state.category.products
            .map(product =>
              <div key={product.id} className='plp__product-card'>
                <Link to={'/pdp/' + product.id} className='plp__product-card-link'>
                  <img className='plp__product-card-img' src={product.gallery[0]} alt='product images'></img>
                  <p className='plp__product-card-name'>{product.brand + ' ' + product.name}</p>
                  <p className='plp__product-card-price'>
                    {this.props.store.current_currency.symbol + ' ' + product.prices.find(item => {
                      return item.currency.label === this.props.store.current_currency.label
                    }).amount}
                  </p>
                  {!product.inStock &&
                    <div className='plp__product-card_stockout'>out of stock</div>
                  }
                </Link>
                {product.inStock &&
                  <Link to={'/cart'}>
                    <button className='plp__product-cart-btn' onClick={() => { this.addToCart(product) }}>
                      <img className='plp__product-cart-btn-icon' src={cart} alt='cart icon'></img>
                    </button>
                  </Link>
                }
              </div>
            )}
      </div>
    </div>
    )
  }
}

const mapStateToProps = store => {
  return {
    store
  }
}
function mapDispatchToProps (dispatch) {
  return {
    cartActions: bindActionCreators(cartActions, dispatch)
  }
}

ProductListingPage.propTypes = {
  store: PropTypes.object,
  cartActions: PropTypes.object
}

export default connect(mapStateToProps, mapDispatchToProps)(ProductListingPage)
