/* eslint-disable camelcase */
import React from 'react';
import axios from 'axios';
import './App.css';
import RnR from './RnR/RnR.jsx';
import '../fa-icons/fa-icons.js';
import RelatedProducts from './RelatedProducts/RelatedProducts.jsx';
import OutfitProducts from './RelatedProducts/OutfitProducts.jsx';
import QuestionsNAnswersContainer from './QnA/QuestionsNAnswersContainer.jsx';
import ProductDetailContainer from './ProductDetail/productDetailContainer.jsx';
import DefaultState from './defaultState';
//=====SVG Images=====//
import EmptyStar from './svgImages/EmptyStar.svg';
import FullStar from './svgImages/FullStar.svg';
import HalfStar from './svgImages/HalfStar.svg';
import OneQStar from './svgImages/OneQStar.svg';
import ThreeQStar from './svgImages/ThreeQStar.svg';
import dEmptyStar from './svgImages/dEmptyStar.svg';
import dFullStar from './svgImages/dFullStar.svg';
import dHalfStar from './svgImages/dHalfStar.svg';
import dOneQStar from './svgImages/dOneQStar.svg';
import dThreeQStar from './svgImages/dThreeQStar.svg';

class App extends React.Component {
  constructor(props) {
    // this.idd = 47425
    super(props);
    this.state = {
      productId: 2,
      displayProduct: DefaultState.displayProduct,
      displayStyles: DefaultState.diplayStyles,
      reviews: DefaultState.reviews,
      ratings: DefaultState.reviewsMeta,
      questionList: DefaultState.questionList,
      productName: DefaultState.displayProduct.name,
      didUpdate: false,
      productRating: 3.5, // <---- default rating for 47425
      productRatingStars: [FullStar, FullStar, HalfStar, EmptyStar, EmptyStar],
      nightShift: window.sessionStorage.getItem('theme') || 'nightShiftOff'
    };

    this.formatBody = this.formatBody.bind(this);
    this.productAverageRating = this.productAverageRating.bind(this);
    this.starRatingRender = this.starRatingRender.bind(this);
    this.grabNightShift = this.grabNightShift.bind(this);
  }

  formatBody(method, apiRoute, params = {}, data = {}) {
    let bodyObj = {
      method: method,
      url: `https://app-hrsei-api.herokuapp.com/api/fec2/hr-rpp${apiRoute}`,
      data: data,
      params: params,
      headers: { Authorization: '' },
    };

    return bodyObj;
  }

  componentDidMount() {
    let saveNightMode = this.state.nightShift;

    let productId = window.location.pathname.substring(1);
    productId = Number(productId);
    if (productId === 0) {
      this.setState({ didUpdate: true, productId: 47425 });
      return;
    }
    let compare = this.state.productId;
    let truth = productId === compare;
    console.log('Product ID is: ', productId);
    if (!truth) {
      console.log('GET New Product info and styles');
      axios.get(`/detailState/products/${productId}`)
        .then((results) => {
          console.log('results', results.data);

          if (results.data[1].length === 0) {
            console.log('no length to this style ');
            let styles = [];
          } else {
            let styles = results.data[1].results;
          }


          const starRatingObj = results.data[3].ratings;
          // const starRatingObj = this.productAverageRating(
          //   results.data[2].results
          // );
          let starRating = 0;
          let vals = 0;
          let starRatingGenerator = [
            EmptyStar,
            EmptyStar,
            EmptyStar,
            EmptyStar,
            EmptyStar,
          ];
          vals = Object.values(starRatingObj);
          if (vals.length > 0) {
            vals = vals.reduce((prev, cur) => Number(prev) + Number(cur));
            for (let key in starRatingObj) {
              starRating += Number(key) * Number(starRatingObj[key]);
            }
            starRatingGenerator = this.starRatingRender(starRating / vals);
            starRating = Math.round((starRating / vals) * 10) / 10;
          } else {
            starRating = 0;
          }

          console.log(`StarRating: ${starRating}\nGenerated: ${starRatingGenerator}`);

          this.setState({
            displayProduct: results.data[0],
            didUpdate: true,
            productId: results.data[0].product_id,
            displayStyles: results.data[1].results,
            productName: results.data[0].name,
            reviews: results.data[2],
            ratings: results.data[3],
            productRating: starRating,
            productRatingStars: starRatingGenerator,
            productRatingStars: window.sessionStorage.getItem('theme') === 'nightShiftOff' ? starRatingGenerator : this.starRatingRender(this.state.productRating, true),
            productRatingStars: this.starRatingRender(this.state.productRating, true),
            nightShift: saveNightMode
          });
          // console.log('MAINSTATE AFTER CALL', this.state);
        })
        .catch((err) => {
          console.log('error', err);
          this.setState({ productId: 47425, didUpdate: true });
        });
    } else {
      let originalState = this.state;

      originalState.didUpdate = true;
      this.setState({ originalState });
    }
  }

  productAverageRating(reviewsData) {
    /*CREATES REVIEW COUNT ON REVIEW DATA NOT META*/
    let newObj = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };

    for (let i = 0; i < reviewsData.length; i++) {
      if (reviewsData[i].rating === 5) {
        newObj['5'] += 1;
      }
      if (reviewsData[i].rating === 4) {
        newObj['4'] += 1;
      }
      if (reviewsData[i].rating === 3) {
        newObj['3'] += 1;
      }
      if (reviewsData[i].rating === 2) {
        newObj['2'] += 1;
      }
      if (reviewsData[i].rating === 1) {
        newObj['1'] += 1;
      }
    }
    return newObj;
  }

  starRatingRender(rating, darkMode = false) {
    let result = [];
    let count = 0;
    rating = (Math.round(rating * 4) / 4).toFixed(2);

    if (darkMode) {
      while (count !== 5) {
        if (rating >= 1) {
          result.push(dFullStar);
          rating -= 1;
          count += 1;
        } else if (rating === 0.5) {
          result.push(dHalfStar);
          rating -= 0.5;
          count += 1;
        } else if (rating === 0.75) {
          result.push(dThreeQStar);
          rating -= 0.75;
          count += 1;
        } else if (rating === 0.25) {
          result.push(dOneQStar);
          rating -= 0.25;
          count += 1;
        } else {
          result.push(dEmptyStar);
          count += 1;
        }
      }
      return result;
    }
    while (count !== 5) {
      if (rating >= 1) {
        result.push(FullStar);
        rating -= 1;
        count += 1;
      } else if (rating === 0.5) {
        result.push(HalfStar);
        rating -= 0.5;
        count += 1;
      } else if (rating === 0.75) {
        result.push(ThreeQStar);
        rating -= 0.75;
        count += 1;
      } else if (rating === 0.25) {
        result.push(OneQStar);
        rating -= 0.25;
        count += 1;
      } else {
        result.push(EmptyStar);
        count += 1;
      }
    }
    return result;
  }

  grabNightShift(input) {
    window.sessionStorage.setItem('theme', input);

    if (input === 'nightShiftOn') {
      this.setState({
        nightShift: 'nightShiftOn',
        productRatingStars: this.starRatingRender(this.state.productRating, true)
      });
    } else {
      this.setState({
        nightShift: 'nightShiftOff',
        productRatingStars: this.starRatingRender(this.state.productRating)
      });
    }
  }


  render() {
    if (this.state.didUpdate) {
      return (
        <React.Fragment>
          <div id={this.state.nightShift}>
            <ProductDetailContainer
              productRatingStars={this.state.productRatingStars}
              productId={this.state.productId}
              displayProduct={this.state.displayProduct}
              displayStyles={this.state.displayStyles}
              formatBody={this.formatBody}
              nightShift={this.state.nightShift}
              grabNightShift={this.grabNightShift}
            />

            <RelatedProducts
              relatedProd={this.state.displayProduct}
              validProduct={this.state.displayStyles}
            />
            <OutfitProducts
              validProduct={this.state.displayStyles}
            />

            <QuestionsNAnswersContainer
              formatBody={this.formatBody}
              productId={this.state.productId}
              productName={this.state.productName}
              displayStyles={this.state.displayStyles}
            />

            <RnR
              validProduct={this.state.displayStyles}
              productID={this.state.productId}
              formatBody={this.formatBody}
              productRating={this.state.productRating}
              productStars={this.state.productRatingStars}
              reviews={this.state.reviews}
              reviewsMeta={this.state.ratings}
              starGenerator={this.starRatingRender}
              productName={this.state.productName}
              productAverageRating={this.productAverageRating}
              nightShift={this.state.nightShift}
            />
          </div>
        </React.Fragment>
      );
    } else {
      return <div>loading data</div>;
    }
  }
}

export default App;
