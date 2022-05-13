import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as cartActions from '../actions/cart_actions'
import * as categoryActions from '../actions/category_actions'
import * as currencyActions from '../actions/currencies_actions'
import * as queries from '../graphql/index.js'
import { Link } from 'react-router-dom'
import logo from '../assets/logo.svg'
import cart from '../assets/cart.svg'
import Cart from './cart'
import PropTypes from 'prop-types'

class Header extends React.Component {
  constructor (props) {
    super(props)
    this.state = { currencyActive: false, cartActive: false }
    this.handleClickCart = this.handleClickCart.bind(this)
  }

  handleClickCurrencies () {
    this.setState({ currencyActive: !this.state.currencyActive })
  }

  handleClickCart () {
    this.setState({ cartActive: !this.state.cartActive })
  }

  currencyContainer = React.createRef()
  cartContainer = React.createRef()

  handleClickOutside = (event) => {
    if (
      this.currencyContainer.current &&
      !this.currencyContainer.current.contains(event.target)
    ) {
      this.setState({
        currencyActive: false
      })
    }
    if (
      this.cartContainer.current &&
      !this.cartContainer.current.contains(event.target)
    ) {
      this.setState({
        cartActive: false
      })
    }
  }

  changeCurrency (currency) {
    this.props.currencyActions.changeCurrencies(currency)
    this.setState({
      currencyActive: false
    })
  }

  componentDidMount () {
    fetch('http://localhost:4000/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        query: queries.GET_HEADER_INFO
      })
    }).then((res) => res.json())
      .then((result) => {
        this.props.currencyActions.loadCurrencies(result.data.currencies)
        this.props.currencyActions.changeCurrencies(result.data.currencies[0])
        this.props.categoryActions.changeCategory(result.data.categories[0].name)
        this.props.categoryActions.loadCategories(result.data.categories.map(category => { return category.name }))
      })
    document.addEventListener('mousedown', this.handleClickOutside)
  }

  componentWillUnmount () {
    document.removeEventListener('mousedown', this.handleClickOutside)
  }

  render () {
    return (
      <>
        <div className='header'>
          <div className='header__category-picker'>
            {this.props.store.categories && this.props.store.categories.map(category => (
              <Link to={'/category/' + category} className='header__category-picker-link' key={category}>
                <div
                className={'header__category-picker-item ' + (this.props.store.current_cattegory === category ? 'header__category-picker-item_active' : '')}
                key={category}
                onClick={() => this.props.categoryActions.changeCategory(category)}>
                  {category}
                </div>
              </Link>
            ))}
          </div>
          <div className='header__logo'>
            <img className='header__logo-icon' src={logo} alt='header logo'></img>
          </div>
          <div className='header__tools'>
            <div className='header__currency-picker' ref={this.currencyContainer}>
              <button className='header__currency-btn' onClick={() => { this.handleClickCurrencies() }}>
                <p className='header__currency-picker-symbol'>{this.props.store.current_currency && this.props.store.current_currency.symbol }</p>
                <i className={'header__currency-picker-arrow ' + (this.state.currencyActive ? 'header__currency-picker-arrow_up' : 'header__currency-picker-arrow_down')}></i>
              </button>
              <div className={'header__currencies ' + (this.state.currencyActive ? 'header__currencies_active' : '')}>
                {this.props.store.currencies && this.props.store.currencies.map(currency => (
                  <div className='header__currency-item' key={currency.label} onClick={() => { this.changeCurrency(currency) }}>
                    {currency.symbol + ' ' + currency.label}
                  </div>
                ))}
              </div>
            </div>
            <div className='header__cart'>
              <img className='header__cart-icon' src={cart} onClick={() => { this.handleClickCart() }} alt='header cart icon'></img>
              <div className='header__cart-quantity'>{this.props.store.numberCart}</div>
              <div className={'header__cart-content ' + (this.state.cartActive ? 'header__cart-content_active' : '')} ref={this.cartContainer}>
                <Cart isHeader={true} handleClickCart={this.handleClickCart}></Cart>
              </div>
            </div>
          </div>
        </div>
        <div className={'header-overlay ' + (this.state.cartActive ? 'header-overlay_active' : '')}></div>
      </>
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
    categoryActions: bindActionCreators(categoryActions, dispatch),
    currencyActions: bindActionCreators(currencyActions, dispatch)
  }
}

Header.propTypes = {
  store: PropTypes.object,
  cartActions: PropTypes.object,
  categoryActions: PropTypes.object,
  currencyActions: PropTypes.object
}

export default connect(mapStateToProps, mapDispatchToProps)(Header)
