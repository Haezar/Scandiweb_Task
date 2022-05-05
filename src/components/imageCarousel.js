import React from "react";

class ImageCarousel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      slides: [],
      curSlide: 0
    };
  }
  
  nextClicked(){
    if(this.state.curSlide === this.state.slides.length - 1) {
      this.setState({curSlide: 0});
    }
    else {
      this.setState({curSlide: this.state.curSlide +1});
    }
  }
  prevClicked(){
    if (this.state.curSlide === 0) {
      this.setState({curSlide: this.state.slides.length -1 });
    }
    else {
      this.setState({curSlide: this.state.curSlide - 1});
    }
  }
  componentDidUpdate() {
    this.state.slides.forEach((slide, indx) => {
      slide.style.transform = `translateX(${100 * (indx - this.state.curSlide)}%)`;
    });
  }
  componentDidMount() {
    this.setState({slides: document.querySelectorAll('#' + (!this.props.isHeader ? this.props.id : this.props.id + "h") + " > .carousel__item")});
  }

  render () {
    return (
      <div className="carousel" id={(!this.props.isHeader ? this.props.id : this.props.id + "h")}>
        {this.props.images && this.props.images.map((image,indx)=>{
          return (
            <div key={image + indx} className="carousel__item" style={{transform: `translateX(${indx * 100}%)`}}>
              <img className="carousel__item-image" src={image}></img>
            </div>
          )
        })}
        {!this.props.isHeader && 
          <div className="carousel__btns">
            <button className="btn carousel__btn carousel__btn_prev" onClick={()=>{this.prevClicked()}}>{'<'}</button>
            <button className="btn carousel__btn carousel__btn_next" onClick={()=>{this.nextClicked()}}>{'>'}</button>
          </div>
        }
        
      </div>
  )}
}

export default ImageCarousel;