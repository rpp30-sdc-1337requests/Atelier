import React from 'react';
import './Ratings.css';
import RatingsBarChart from './RatingsBarChart.jsx';
import RatingsArrowCharts from './RatingsArrowCharts.jsx';
import EmptyStar from '../svgImages/EmptyStar.svg';


class Ratings extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      productRating: this.props.productRating,
      productStars: this.props.productStars
    };
  }


  render() {
    let reviewsCount = this.props.reviewsMeta.ratings;
    let reviewsTotal = Object.values(reviewsCount);
    if (reviewsTotal.length) {
      reviewsCount = reviewsTotal.reduce((prev, cur) => Number(prev) + Number(cur));
    } else { reviewsCount = 0; }

    let {productStars} = this.props;
    let totalRecommends = this.props.reviewsMeta.recommended.true;
    let percentReviewsRecommend = Math.round(totalRecommends / reviewsCount * 100);
    if (percentReviewsRecommend > 99) { percentReviewsRecommend = 100; }


    return (
      <>
        <div id="ratingOverviews">
          <div id="ratingOverviewNumber">{this.props.productRating || 0.0}</div>
          <div id="starDiv">
            <img src={productStars ? productStars[0] : EmptyStar} className="ratingOverviewStars"/>
            <img src={productStars ? productStars[1] : EmptyStar} className="ratingOverviewStars"/>
            <img src={productStars ? productStars[2] : EmptyStar} className="ratingOverviewStars"/>
            <img src={productStars ? productStars[3] : EmptyStar} className="ratingOverviewStars"/>
            <img src={productStars ? productStars[4] : EmptyStar} className="ratingOverviewStars"/>
          </div>
        </div>

        <div id="ratingBreakdown">
          Rating Breakdown:
        </div>

        <div id="percentRecommended">
          <span id="percentReviews">{percentReviewsRecommend || 0}%</span> of reviews recommend this product
        </div>

        <div id="starBarChart">
          <RatingsBarChart
            reviewsMeta={this.props.reviewsMeta}
            sortStarClick={this.props.sortStarClick}
          />
        </div>

        <div id="arrowCharts">
          <RatingsArrowCharts reviewsMeta={this.props.reviewsMeta.characteristics}/>
        </div>
      </>
    );
  }
}

export default Ratings;