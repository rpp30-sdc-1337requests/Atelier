import React from 'react';
import './Reviews.css';

class ReviewsRateDate extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      stars: this.props.stars,
      username: this.props.username,
      date: this.props.date,
      starAndMonthTile: {
        '0': '☆☆☆☆☆', 'Jan': 'January', 'Jul': 'July',
        '1': '★☆☆☆☆', 'Feb': 'February', 'Aug': 'August',
        '2': '★★☆☆☆', 'Mar': 'March', 'Sep': 'September',
        '3': '★★★☆☆', 'Apr': 'April', 'Oct': 'October',
        '4': '★★★★☆', 'May': 'May', 'Nov': 'November',
        '5': '★★★★★', 'Jun': 'June', 'Dec': 'December'
      }
    };
  }


  render() {
    let stars, date, summary, recommend, response;

    // if (reviews.results) {
    // stars = reviews.results.map((item, index) => {
    //   let starRating = this.state.starAndMonthTile[item.rating.toString()];
    //   return ( <p key={index}>{starRating}</p> );
    // });
    // }

    return (
      <React.Fragment>
        <div id="starsUsernameDate">
          {/* <p>{this.state.starAndMonthTile[item.rating.toString()]}</p> */}
          {this.state.starAndMonthTile[this.state.stars]}
          {/* <p id="usernameDate">{item.reviewer_name}, {date}</p> */}
        </div>
      </React.Fragment>
    );
  }
}


export default ReviewsRateDate;