import React from 'react';
import './Ratings.css';

class RatingsBarChart extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      starsSelected: this.props.starsSelected
    };

    this.starCheck = this.starCheck.bind(this);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.starsSelected !== this.props.starsSelected) {
      this.setState({ starsSelected: this.props.starsSelected });
    }
  }

  starCheck(num, total) {
    if (Number(num) > 0) {
      return Number(num) / total * 100 + '%';
    } else {
      return 0;
    }
  }


  render() {
    let reviewsCount = this.props.reviewsMeta.ratings;
    let test = reviewsCount;
    let reviewsTotal = Object.values(reviewsCount);
    if (reviewsTotal.length) {
      reviewsCount = reviewsTotal.reduce((prev, cur) => Number(prev) + Number(cur));
    } else { reviewsCount = 0; }
    let star5 = this.starCheck(test['5'], reviewsCount);
    let star4 = this.starCheck(test['4'], reviewsCount);
    let star3 = this.starCheck(test['3'], reviewsCount);
    let star2 = this.starCheck(test['2'], reviewsCount);
    let star1 = this.starCheck(test['1'], reviewsCount);

    let starsSelected;
    if (this.state.starsSelected.length > 0) {
      starsSelected = this.state.starsSelected.map((item, index) => {
        return (
          <span className="starFilters" key={item.toString()}>{item} Stars</span>
        );
      });
    }

    return (
      <React.Fragment>
        {starsSelected
          ? <div id="starFilterRemove">
            <span id="activeFilters">Active Filters:</span>
            <span id="removeFilters" onClick={(e) => this.props.sortStarClick(e, 0)}>{
              starsSelected ? 'Remove all filters  ⓧ' : null}
            </span>
          </div>
          : null}

        {starsSelected
          ? <div id="eachStarFilter">{starsSelected}</div>
          : null}

        <span className="starRatings" onClick={(e) => this.props.sortStarClick(e, 5)}>
          5 stars
          <div className="starBar">
            <div className="starBar5" style={{width: star5}}></div>
          </div>
          {test['5'] || 0}
        </span>

        <span className="starRatings" onClick={(e) => this.props.sortStarClick(e, 4)}>
          4 stars
          <div className="starBar">
            <div className="starBar4" style={{width: star4}}></div>
          </div>
          {test['4'] || 0}
        </span>

        <span className="starRatings" onClick={(e) => this.props.sortStarClick(e, 3)}>
          3 stars
          <div className="starBar">
            <div className="starBar3" style={{width: star3}}></div>
          </div>
          {test['3'] || 0}
        </span>

        <span className="starRatings" onClick={(e) => this.props.sortStarClick(e, 2)}>
          2 stars
          <div className="starBar">
            <div className="starBar2" style={{width: star2}}></div>
          </div>
          {test['2'] || 0}
        </span>

        <span className="starRatings" onClick={(e) => this.props.sortStarClick(e, 1)}>
          1 stars
          <div className="starBar">
            <div className="starBar1" style={{width: star1}}></div>
          </div>
          {test['1'] || 0}
        </span>
      </React.Fragment>
    );
  }
}


export default RatingsBarChart;