import React from 'react'
import PropTypes from 'prop-types'

class ImageCarousel extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      curSlide: 0
    }
  }

  nextClicked () {
    if (this.state.curSlide === this.props.images.length - 1) {
      this.setState({ curSlide: 0 })
    } else {
      this.setState({ curSlide: this.state.curSlide + 1 })
    }
  }

  prevClicked () {
    if (this.state.curSlide === 0) {
      this.setState({ curSlide: this.props.images.length - 1 })
    } else {
      this.setState({ curSlide: this.state.curSlide - 1 })
    }
  }

  render () {
    return (
      <div className="carousel">
        {this.props.images && this.props.images.map((image, indx) => {
          if (indx === this.state.curSlide) {
            return (
              <div key={image + indx} className="carousel__item">
                <img className="carousel__item-image" src={image} alt="carousel item"></img>
              </div>
            )
          } else {
            return null
          }
        })}
        {!this.props.isHeader && this.props.images.length > 1 &&
          <div className="carousel__btns">
            <button className="btn carousel__btn carousel__btn_prev" onClick={() => { this.prevClicked() }}>{'<'}</button>
            <button className="btn carousel__btn carousel__btn_next" onClick={() => { this.nextClicked() }}>{'>'}</button>
          </div>
        }
      </div>
    )
  }
}

ImageCarousel.propTypes = {
  isHeader: PropTypes.bool,
  images: PropTypes.array
}

export default ImageCarousel
