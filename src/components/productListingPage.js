import React from 'react';
import { Link } from 'react-router-dom'
import {connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as cartActions  from '../actions/cart_actions';
import cart from '../assets/cart-w.svg';

class ProductListingPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  addToCart(product){
    let currentAttributes = product.attributes.map(attribute=>(
      {attributeId: attribute.id, attributeValue:attribute.items[0].id}
    ))
    let combinedId = [product.id].concat(currentAttributes.map((attr)=> 
      attr.attributeId.replace(/ /g, '') + attr.attributeValue.replace(/ /g, '')
    ))
    let cartProduct = {
      ...product,
      id: combinedId.join(''),
      currentAttributes,
      quantity: 1
    }
    this.props.cartActions.addToCart(cartProduct)
  }

  componentDidMount() {
    fetch('http://localhost:4000/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: `
          query GetCategories {
            category {
              name
              products {
                id
                name
                inStock
                gallery
                description
                category
                attributes {
                  id
                  name
                  type
                  items {
                    id
                    displayValue
                    value
                  }
                }
                prices {
                  currency {
                    label
                  }
                  amount
                }
                brand
              }
            }
          }
        `,
        variables: {title: "all"}
      }),
    })
    .then((res) => res.json())
    .then((result) => {
      this.setState({category: result.data.category});
    });
  }
  render () {
  return (
    <div className="plp">
      <div className="plp__category-name">{this.props.store.current_cattegory}</div>
      <div className="plp__products">

        {this.state.category && 
          this.state.category.products.filter((product)=>
          {return product.category === this.props.store.current_cattegory || this.props.store.current_cattegory === "all"})
          .map(product =>
            <Link to={"/pdp/"+ product.id} style={{ textDecoration: 'none' }} key={product.id}>
              <div key={product.id} className="plp__product-card">
                <img className='plp__product-card-img' src={product.gallery[0]}></img>
                <p className='plp__product-card-name'>{product.brand + " " + product.name}</p>
                <p className='plp__product-card-price'>
                  {this.props.store.current_currency.symbol + " " + product.prices.find(item =>{
                    return item.currency.label == this.props.store.current_currency.label
                  }).amount}
                </p>
                {!product.inStock && 
                  <div className="plp__product-card_stockout">out of stock</div>
                }
                {product.inStock &&
       
                    <button className="plp__product-cart-btn" onClick={()=>{this.addToCart(product)}}>
                      <img className="plp__product-cart-btn-icon" src={cart}></img>
                    </button>
           
                }
              </div>
              
            </Link>
        )} 
      </div>
    </div>
  );
  }
}

const mapStateToProps = store => {
  return {
    store: store
  };
};
function mapDispatchToProps(dispatch) {
  return {
    cartActions: bindActionCreators(cartActions, dispatch),
  }
}

export default connect(mapStateToProps,mapDispatchToProps)(ProductListingPage);