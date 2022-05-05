import React,{ Component} from "react";
import {connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { useParams, Link } from "react-router-dom";
import * as cartActions  from '../actions/cart_actions';

function withParams(Component) {
  return props => <Component {...props} params={useParams()} />;
}

class ProductDetailsPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {currentAttributes: [], currentImage:""};
  }

  selectAttribute(attributeId, AttributeValueId){
    let attributes = [...this.state.currentAttributes];
    let item = this.state.currentAttributes.find((attribute)=>
      attribute.attributeId === attributeId
    )
    item.attributeValue = AttributeValueId;
    const index = attributes.findIndex(attribute => {
      return attribute.attributeId === attributeId;
    });
    attributes[index] = item;
    this.setState({currentAttributes: attributes})
  }

  addToCart(){
    let combinedId = [this.props.params.id].concat(this.state.currentAttributes.map((attr)=> 
      attr.attributeId.replace(/ /g, '') + attr.attributeValue.replace(/ /g, '')
    ))
    let cartProduct = {
      id: combinedId.join(''),
      ...this.state.product,
      currentAttributes: this.state.currentAttributes,
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
          query GetProduct($id: String!) {
            product (id: $id ){
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
        `,
        variables: {id: this.props.params.id}
      }),
    })
    .then((res) => res.json())
    .then((result) => {
      let currentAttributes = result.data.product.attributes.map(attribute=>(
         {attributeId: attribute.id, attributeValue:attribute.items[0].id}
      ));
      this.setState({product: result.data.product, currentAttributes: currentAttributes, currentImage: result.data.product.gallery[0]});
    });
  }
  render () {
    return (
      <div className="pdp">
        <div className="pdp__gallery">
          <div className="pdp__gallery-items">
            {this.state.product && this.state.product.gallery && this.state.product.gallery.map((item)=>{
              return (
                <div className="pdp__gallery-item" key={item} >
                  <img onClick={()=>{this.setState({currentImage: item})}} className="pdp__gallery-item-img" src={item}></img>
                </div>
              )
            })}
          </div>
          <div className="pdp__gallery-showcase">
            <img className="pdp__gallery-showcase-img" src={this.state.product && this.state.currentImage}></img>
            {this.state.product && !this.state.product.inStock &&
              <div className="pdp__gallery-showcase-stockout">out of stock</div>
            }
          
          </div>
        </div>
        {this.state.product && 
          <div className="pdp__content">
            <h2 className="pdp__product-brand">{this.state.product.brand}</h2>
            <h2 className="pdp__product-name">{this.state.product.name}</h2>
            <div className="pdp__product-attributes">
              {this.state.product.attributes.map(attribute => {
                return (
                <div key={attribute.id} className="pdp__product-attribute">
                  <p className="pdp__product-attribute-name">{attribute.name + ":"}</p>
                  {attribute.type === "swatch" && <div className="pdp__product-attribute-swatch">
                    {attribute.items.map(item => {
                      return (
                        <div key={attribute.id + item.id}
                          className={"pdp__product-attribute-swatch-wrapper " + 
                          (this.state.currentAttributes && 
                          this.state.currentAttributes.find(attr=> 
                            (attr.attributeId === attribute.id && attr.attributeValue === item.id)) ? 
                          "pdp__product-attribute-swatch-wrapper_active" : "")}>
                            <div 
                              style={{background: item.value}} 
                              className="pdp__product-attribute-swatch-value"  
                              onClick={() => {this.selectAttribute(attribute.id, item.id)}}>
                            </div>
                        </div>
                      )
                    })}
                  </div>}
                  {attribute.type === "text" && 
                    <div className="pdp__product-attribute-text">
                      {attribute.items.map(item => {
                        return (
                        <div
                          className={"pdp__product-attribute-text-value " + 
                            (this.state.currentAttributes && 
                            this.state.currentAttributes.find(attr=> 
                              (attr.attributeId === attribute.id && attr.attributeValue === item.id)) ? 
                            "pdp__product-attribute-text-value_active" : "")} 
                          key={attribute.id + item.id} 
                          onClick={() => {this.selectAttribute(attribute.id, item.id)}}>
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
            <div className="pdp__product-price">
              <div className="pdp__product-price-label">
                price:
              </div>
              {this.props.store.current_currency.symbol + " " + this.state.product.prices.find(item =>{
                return item.currency.label == this.props.store.current_currency.label
              }).amount}
            </div>
            <Link to={"/cart"}>
              <button disabled={!this.state.product.inStock} className="pdp__product-cart-btn" onClick={()=> this.addToCart()}>
                {!this.state.product.inStock ? "out of stock":"add to cart"}
                </button>
            </Link>
            <div className="pdp__product-description-wrapper">
              <div className="pdp__product-description" dangerouslySetInnerHTML={{ __html: this.state.product.description }}>
              </div>
            </div>
          </div>
        }
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

export default connect(mapStateToProps,mapDispatchToProps)(withParams(ProductDetailsPage));