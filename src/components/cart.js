import React,{ Component} from "react";
import {connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Link } from "react-router-dom";
import * as cartActions  from '../actions/cart_actions';
import ImageCarousel from './imageCarousel';


class Cart extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  incProductQTY(productID)  {
    this.props.cartActions.changeProductQTY(productID, 1);
  }

  decProductQTY(productID, productQty) {
    if (productQty === 1) {
      this.props.cartActions.removeFromCart(productID);
    }
    else {
      this.props.cartActions.changeProductQTY(productID, -1);
    }
  }

  componentDidMount() {
   
  }

  render () {
    return (
      (!this.props.isHeader && 
      <div className="cart">
        <h3 className="cart__header">cart</h3>
        <div className="cart__products">
          {this.props.store.cart.map((cartItem)=>(
            <div className="cart__product" key={cartItem.id}>
              <div className="cart__product-content">
                <div className="cart__product-info">
                  <h2 className="cart__product-brand">{cartItem.brand}</h2>
                  <h2 className="cart__product-name">{cartItem.name}</h2>
                  <div className="cart__product-price">
                      {this.props.store.current_currency.symbol + " " + cartItem.prices.find(item =>{
                        return item.currency.label == this.props.store.current_currency.label
                      }).amount}
                  </div>
                  <div className="cart__product-attributes">
                    {cartItem.attributes.map(attribute => {
                      return (
                      <div key={attribute.id} className="cart__product-attribute">
                        <p className="cart__product-attribute-name">{attribute.name + ":"}</p>
                        {attribute.type === "swatch" && <div className="cart__product-attribute-swatch">
                          {attribute.items.map(item => {
                            return (
                              <div key={attribute.id + item.id} 
                                className={"cart__product-attribute-swatch-wrapper " + 
                                (cartItem.currentAttributes && 
                                cartItem.currentAttributes.find(attr=> 
                                (attr.attributeId === attribute.id && 
                                attr.attributeValue === item.id)) ? 
                                "cart__product-attribute-swatch-wrapper_active" : "")}>
                                  <div 
                                    style={{background: item.value}} 
                                    className="cart__product-attribute-swatch-value" 
                                    >
                                  </div>
                              </div>
                            )
                          })}
                        </div>}
                        {attribute.type === "text" && 
                          <div className="cart__product-attribute-text">
                            {attribute.items.map(item => {
                              return (
                              <div key={attribute.id + item.id}
                                className={"cart__product-attribute-text-value " + 
                                (cartItem.currentAttributes && 
                                  cartItem.currentAttributes.find(attr=> 
                                  (attr.attributeId === attribute.id && 
                                  attr.attributeValue === item.id)) ? 
                                  "cart__product-attribute-text-value_active" : "")} 
                                >
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
                </div>
                <div className="cart__product-qnt-btns">
                    <button className="cart__product-qnt" onClick={()=>this.incProductQTY(cartItem.id)}>+</button>
                    <p className="cart__product-qnt-label">{cartItem.quantity}</p>
                    <button className="cart__product-qnt" onClick={()=>this.decProductQTY(cartItem.id, cartItem.quantity)}>-</button>
                </div>
              </div>
              <div className="cart__product-imgs">
                    <ImageCarousel images={cartItem.gallery} id={cartItem.id}></ImageCarousel>
              </div>
            </div>
          ))}
        </div>
        <div className="cart__total">
          <div className="cart__total-labels">
            <span className="cart__total-label">Tax 21%:</span>
            <span className="cart__total-label">Quantity:</span>
            <span className="cart__total-label cart__total-label_total">Total:</span>
          </div>
          <div className="cart__total-values">
            <span className="cart__total-value">
              {this.props.store.current_currency.symbol +  Math.round(100 * this.props.store.cart.reduce((total, item)=>{
                return total + item.prices.find((price)=>{return price.currency.label === this.props.store.current_currency.label}).amount * item.quantity
              }, 0)* 0.21) / 100}
            </span>
            <span className="cart__total-value">{this.props.store.numberCart}</span>
            <span className="cart__total-value">
              {this.props.store.current_currency.symbol + Math.round(100 * this.props.store.cart.reduce((total, item)=>{
                return total + item.prices.find((price)=>{return price.currency.label === this.props.store.current_currency.label}).amount * item.quantity
              }, 0)) / 100}
            </span>
          </div> 
        </div>
        <div className="cart__order-btn-wrapper">
          <button className="cart__order-btn">order</button>
        </div>
      </div>) || 
      (this.props.isHeader && 
      <div className="cart cart_header">
        <div onClick={e=>e.stopPropagation()}>
          <div className="cart__header-label">
            <span className="cart__header-label-text">My bag,</span>
            <span className="cart__header-label-items">

              {" " + this.props.store.numberCart + ((this.props.store.numberCart === 1 && " item")||(" items"))}
            </span>
          </div>
          <div className="cart__products cart__products_header">
            {this.props.store.cart.map((cartItem)=>(
              <div className="cart__product cart__product_header" key={cartItem.id + "h"}>
                <div className="cart__product-content cart__product-content_header">
                  <div className="cart__product-info cart__product-info_header">
                    <h2 className="cart__product-brand cart__product-brand_header">{cartItem.brand}</h2>
                    <h2 className="cart__product-name cart__product-name_header">{cartItem.name}</h2>
                    <div className="cart__product-price cart__product-price_header">
                        {this.props.store.current_currency.symbol + " " + cartItem.prices.find(item =>{
                          return item.currency.label == this.props.store.current_currency.label
                        }).amount}
                    </div>
                    <div className="cart__product-attributes cart__product-attributes_header">
                      {cartItem.attributes.map(attribute => {
                        return (
                        <div key={attribute.id+ "h"} className="cart__product-attribute cart__product-attribute_header">
                          <p className="cart__product-attribute-name cart__product-attribute-name_header">{attribute.name + ":"}</p>
                          {attribute.type === "swatch" && <div className="cart__product-attribute-swatch cart__product-attribute-swatch_header">
                            {attribute.items.map(item => {
                              return (
                                <div key={attribute.id + item.id + "h"}
                                  className={"cart__product-attribute-swatch-wrapper cart__product-attribute-swatch-wrapper_header " + 
                                  (cartItem.currentAttributes && 
                                  cartItem.currentAttributes.find(attr=> 
                                  (attr.attributeId === attribute.id && 
                                  attr.attributeValue === item.id)) ? 
                                  "cart__product-attribute-swatch-wrapper_active" : "")}>
                                    <div 
                                      style={{background: item.value}} 
                                      className="cart__product-attribute-swatch-value cart__product-attribute-swatch-value_header" 
                                      >
                                    </div>
                                </div>
                              )
                            })}
                          </div>}
                          {attribute.type === "text" && 
                            <div className="cart__product-attribute-text cart__product-attribute-text_header">
                              {attribute.items.map(item => {
                                return (
                                <div key={attribute.id + item.id + "h"}
                                  className={"cart__product-attribute-text-value cart__product-attribute-text-value_header " + 
                                  (cartItem.currentAttributes && 
                                    cartItem.currentAttributes.find(attr=> 
                                    (attr.attributeId === attribute.id && 
                                    attr.attributeValue === item.id)) ? 
                                    "cart__product-attribute-text-value_active" : "")} 
                                  >
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
                  </div>
                  <div className="cart__product-qnt-btns cart__product-qnt-btns_header">
                      <button className="cart__product-qnt cart__product-qnt_header" onClick={()=>this.incProductQTY(cartItem.id)}>+</button>
                      <p className="cart__product-qnt-label cart__product-qnt-label_header">{cartItem.quantity}</p>
                      <button className="cart__product-qnt cart__product-qnt_header" onClick={()=>this.decProductQTY(cartItem.id, cartItem.quantity)}>-</button>
                  </div>
                </div>
                <div className="cart__product-imgs cart__product-imgs_header">
                      <ImageCarousel images={cartItem.gallery} id={cartItem.id} isHeader={true}></ImageCarousel>
                </div>
              </div>
            ))}
          </div>
        
          <div className="cart__total cart__total_header">
              <span className="cart__total-label cart__total-label_header">Total</span>
              <span className="cart__total-value cart__total-value_header">
                {(this.props.store.current_currency.symbol + Math.round(100 *  this.props.store.cart.reduce((total, item)=>{
                  return total + item.prices.find((price)=>{return price.currency.label === this.props.store.current_currency.label}).amount * item.quantity
                }, 0)) / 100) || 0}
              </span>
          </div>
        </div>
        <div className="cart__btns_header">
          <Link to={"/cart"} className="cart__btn_header" onClick={this.props.handleClickCart}>View bag</Link>
          <button className="cart__btn_header cart__btn_header_primary">check out</button>
        </div>
      </div>
      )  
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

export default connect(mapStateToProps,mapDispatchToProps)(Cart);