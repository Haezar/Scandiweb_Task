import React from 'react'
import { Link, useParams } from 'react-router-dom'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as cartActions from '../actions/cart_actions'
import * as categoryActions from '../actions/category_actions'
import cart from '../assets/cart-w.svg'
import * as queries from '../graphql/index.js'
import PropTypes from 'prop-types'

function withParams (Component) {
  return props => <Component {...props} params={useParams()} />
}

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

  getProducts (categoryInput) {
    fetch('http://localhost:4000/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        query: queries.GET_PRODUCTS,
        variables: { category: categoryInput }
      })
    }).then((res) => res.json())
      .then((result) => {
        this.setState({ category: result.data.category })
        this.props.categoryActions.changeCategory(this.props.params.category)
      })
  }

  getProductsDefault () {
    fetch('http://localhost:4000/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        query: queries.GET_PRODUCTS_DEFAULT
      })
    }).then((res) => res.json())
      .then((result) => {
        this.setState({ category: result.data.categories[0] })
        this.props.categoryActions.changeCategory(result.data.categories[0].name)
      })
  }

  componentDidUpdate (previousProps, previousState) {
    if (this.props.params.category !== previousProps.params.category) {
      if (this.props.params.category) {
        this.getProducts(this.props.params.category)
      } else {
        this.getProductsDefault()
      }
    }
  }

  componentDidMount () {
    if (this.props.params.category) {
      this.getProducts(this.props.params.category)
    } else {
      this.getProductsDefault()
    }
  }

  render () {
    return (
    <div className='plp'>
      <div className='plp__category-name'>{this.props.params.category}</div>
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
                  <button className='plp__product-cart-btn' onClick={() => { this.addToCart(product) }}>
                    <img className='plp__product-cart-btn-icon' src={cart} alt='cart icon'></img>
                  </button>
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
    cartActions: bindActionCreators(cartActions, dispatch),
    categoryActions: bindActionCreators(categoryActions, dispatch)
  }
}

ProductListingPage.propTypes = {
  store: PropTypes.object,
  cartActions: PropTypes.object,
  categoryActions: PropTypes.object,
  params: PropTypes.object
}

export default connect(mapStateToProps, mapDispatchToProps)(withParams(ProductListingPage))
