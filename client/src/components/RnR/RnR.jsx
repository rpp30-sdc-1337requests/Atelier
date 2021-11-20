import React from 'react';
import Ratings from './Ratings.jsx';
import Reviews from './Reviews.jsx';
import './RnR.css';
import axios from 'axios';
import HOC from '../HOC/withInteractionApi.jsx';



class RnR extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      reviews: this.props.reviews,
      reviewsMeta: this.props.reviewsMeta,
      productRating: this.props.productRating,
      productStars: this.props.productStars,
      sortStarClick: []
    };

    this.sortStarClick = this.sortStarClick.bind(this);
  }


  sortStarClick(e, starNum) {
    let newArr = this.state.sortStarClick;

    if (starNum === 0) {
      this.setState({ sortStarClick: [] });
    } else if (!newArr.includes(starNum)) {
      newArr.push(starNum);
      this.setState({ sortStarClick: newArr });
    } else {
      let newArr2 = [];
      for (let i = 0; i < newArr.length; i++) {
        if (newArr[i] !== starNum) {
          newArr2.push(newArr[i]);
        }
      }
      this.setState({ sortStarClick: newArr2 });
    }
    this.props.sendInteraction('Rating Breakdown');
  }


  render() {
    // console.log('RnR this.state:', this.state);
    // console.log(this.props);

    if (this.props.validProduct.length === 0) {
      return (
        <React.Fragment></React.Fragment>
      );
    }

    return (
      <>
        <h1 id="RnRtitle">RATINGS & REVIEWS</h1>

        <div id="box">
          <div id="ratingsComp">
            <Ratings
              ratings={this.state.meta}
              productRating={this.state.productRating}
              productStars={this.props.productStars}
              starGenerator={this.props.starGenerator}
              reviewsMeta={this.state.reviewsMeta}
              reviews={this.state.reviews}
              formatBody={this.props.formatBody}
              sortStarClick={this.sortStarClick}
              starsSelected={this.state.sortStarClick}
              productAverageRating={this.props.productAverageRating}
              nightShift={this.props.nightShift}
            />
          </div>
          <div id="reviewsComp">
            <Reviews
              reviews={this.state.reviews}
              reviewsMeta={this.state.reviewsMeta}
              starGenerator={this.props.starGenerator}
              formatBody={this.props.formatBody}
              productName={this.props.productName}
              sortStarClick={this.state.sortStarClick}
              productAverageRating={this.props.productAverageRating}
              nightShift={this.props.nightShift}
            />
          </div>
        </div>
      </>
    );
  }
}

export default HOC(RnR, 'Ratings & Reviews');