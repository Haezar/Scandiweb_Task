import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { useParams } from 'react-router-dom'
import * as cartActions from '../actions/cart_actions'
import * as categoryActions from '../actions/category_actions'
import * as queries from '../graphql/index.js'
import parse from 'html-react-parser'
import PropTypes from 'prop-types'

function withParams (Component) {
  return props => <Component {...props} params={useParams()} />
}

class ProductDetailsPage extends React.Component {
  constructor (props) {
    super(props)
    this.state = { currentAttributes: [], currentImage: '' }
  }

  selectAttribute (attributeId, AttributeValueId) {
    const attributes = [...this.state.currentAttributes]
    const item = this.state.currentAttributes.find((attribute) =>
      attribute.attributeId === attributeId
    )
    item.attributeValue = AttributeValueId
    const index = attributes.findIndex(attribute => {
      return attribute.attributeId === attributeId
    })
    attributes[index] = item
    this.setState({ currentAttributes: attributes })
  }

  addToCart () {
    const combinedId = [this.props.params.id].concat(this.state.currentAttributes.map((attr) =>
      attr.attributeId.replace(/ /g, '') + attr.attributeValue.replace(/ /g, '')
    ))
    const cartProduct = {
      id: combinedId.join(''),
      ...this.state.product,
      currentAttributes: this.state.currentAttributes,
      quantity: 1
    }
    this.props.cartActions.addToCart(cartProduct)
  }

  componentDidMount () {
    fetch('http://localhost:4000/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        query: queries.GET_PRODUCT,
        variables: { id: this.props.params.id }
      })
    })
      .then((res) => res.json())
      .then((result) => {
        const currentAttributes = result.data.product.attributes.map(attribute => (
          { attributeId: attribute.id, attributeValue: attribute.items[0].id }
        ))
        this.setState({ product: result.data.product, currentAttributes, currentImage: result.data.product.gallery[0] })
        this.props.categoryActions.changeCategory(result.data.product.category)
      })
  }

  render () {
    return (
      this.state.product &&
      <div className='pdp'>
        <div className='pdp__gallery'>
          <div className='pdp__gallery-items'>
            {this.state.product.gallery.map((item) => {
              return (
                <div className='pdp__gallery-item' key={item} >
                  <img onClick={() => { this.setState({ currentImage: item }) }} className='pdp__gallery-item-img' src={item} alt='gallery item'></img>
                </div>
              )
            })}
          </div>
          <div className='pdp__gallery-showcase'>
            <img className='pdp__gallery-showcase-img' src={this.state.currentImage} alt='product img'></img>
            {!this.state.product.inStock &&
              <div className='pdp__gallery-showcase-stockout'>out of stock</div>
            }
          </div>
        </div>
        <div className='pdp__content'>
          <h2 className='pdp__product-brand'>{this.state.product.brand}</h2>
          <h2 className='pdp__product-name'>{this.state.product.name}</h2>
          <div className='pdp__product-attributes'>
            {this.state.product.attributes.map(attribute => {
              return (
              <div key={attribute.id} className='pdp__product-attribute'>
                <p className='pdp__product-attribute-name'>{attribute.name + ':'}</p>
                {attribute.type === 'swatch' && <div className='pdp__product-attribute-swatch'>
                  {attribute.items.map(item => {
                    return (
                      <div key={attribute.id + item.id}
                        className={'pdp__product-attribute-swatch-wrapper ' +
                        (this.state.currentAttributes &&
                        this.state.currentAttributes.find(attr =>
                          (attr.attributeId === attribute.id && attr.attributeValue === item.id))
                          ? 'pdp__product-attribute-swatch-wrapper_active'
                          : '')}>
                          <div
                            style={{ background: item.value }}
                            className='pdp__product-attribute-swatch-value'
                            onClick={() => { this.selectAttribute(attribute.id, item.id) }}>
                          </div>
                      </div>
                    )
                  })}
                </div>}
                {attribute.type === 'text' &&
                  <div className='pdp__product-attribute-text'>
                    {attribute.items.map(item => {
                      return (
                      <div
                        className={'pdp__product-attribute-text-value ' +
                          (this.state.currentAttributes &&
                          this.state.currentAttributes.find(attr =>
                            (attr.attributeId === attribute.id && attr.attributeValue === item.id))
                            ? 'pdp__product-attribute-text-value_active'
                            : '')}
                        key={attribute.id + item.id}
                        onClick={() => { this.selectAttribute(attribute.id, item.id) }}>
                        {item.value}
                      </div>
                      )
                    })}
                  </div>
                }
              </div>
              )
            })}
          </div>
          <div className='pdp__product-price'>
            <div className='pdp__product-price-label'>
              price:
            </div>
            {this.props.store.current_currency.symbol + ' ' + this.state.product.prices.find(item => {
              return item.currency.label === this.props.store.current_currency.label
            }).amount}
          </div>
            <button disabled={!this.state.product.inStock} className='pdp__product-cart-btn' onClick={() => this.addToCart()}>
              {!this.state.product.inStock ? 'out of stock' : 'add to cart'}
              </button>
          <div className='pdp__product-description-wrapper'>
            <div className='pdp__product-description'>
              {parse(this.state.product.description)}
            </div>
          </div>
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

ProductDetailsPage.propTypes = {
  store: PropTypes.object,
  cartActions: PropTypes.object,
  categoryActions: PropTypes.object,
  params: PropTypes.any
}

export default connect(mapStateToProps, mapDispatchToProps)(withParams(ProductDetailsPage))
