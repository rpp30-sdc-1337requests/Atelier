/* eslint-disable camelcase */
import React, { Fragment, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import dummydata from './productInformationDummy.js';
import Tracker from './imageGallery.jsx';
import _ from 'underscore';
import AddToCart from './addToCart.jsx';
import EmptyStar from '../svgImages/EmptyStar.svg';
import SizeAndQuantitySelector from './sizeAndQuantitySelector.jsx';
import StyleSelector from './styleSelector.jsx';
import CategoryName from './categoryName.jsx';
import GalleryModal from './galleryModal.jsx';
import withInteractionsApi from '../HOC/withInteractionApi.jsx';
// const productStyles = dummydata.productStyles;
// const productInfo = dummydata.productInfo;

class ProductInformation extends React.Component {
  constructor(props) {
    super(props);


    this.state = {
      productId: this.props.productId,
      productStyles: this.props.sortedStyles,
      productInfo: this.props.productInfo,
      selectedPhoto: this.props.sortedStyles[0].photos[0].url,
      selectedPhotoThumb: this.props.sortedStyles[0].photos[0].thumbnail_url,
      selectedThumbIndex: 0,
      expandedImageIndex: 0,
      selectedPhotos: this.props.sortedStyles[0].photos,
      defaultStyle: this.props.sortedStyles[0].name,
      originalPrice: this.props.sortedStyles[0].original_price,
      checkedId: this.props.sortedStyles[0].style_id,
      salesPrice: this.props.sortedStyles[0].sale_price,
      selectedSize: 'Select Size',
      Skus: [this.props.sortedStyles[0].skus],
      SkusObj: this.props.sortedStyles[0].skus,
      quantity: 0,
      selectedQuantity: 1,
      sizeMenu: 1,
      hasStock: true,
      expanded: false,
      zoomed: false,
    };



    this.styleClickHandler = this.styleClickHandler.bind(this);
    this.sizeAndQuantityClickHandler =
      this.sizeAndQuantityClickHandler.bind(this);
    this.quantityOnChange = this.quantityOnChange.bind(this);
    this.addToCartClickHandler = this.addToCartClickHandler.bind(this);
    this.totalStock = this.totalStock.bind(this);
    this.thumbnailClick = this.thumbnailClick.bind(this);
    this.arrowClick = this.arrowClick.bind(this);

    this.displayModal = this.displayModal.bind(this);
  }

  styleClickHandler(e, originalPrice, salesPrice, def) {

    const newCheckedId = Number(e.target['id']);
    let newSkus = _.findWhere(this.props.sortedStyles, {
      style_id: newCheckedId,
    });

    let newStockIsTrue = this.totalStock(newSkus.skus);
    let thumbIndex = this.state.selectedThumbIndex;
    if (newSkus.photos[thumbIndex] === undefined) {
      console.log('there are no photos herer');
      thumbIndex = 0;
    }

    this.setState({
      defaultStyle: e.target.name,
      originalPrice,
      checkedId: newCheckedId,
      salesPrice,
      SkusObj: newSkus.skus,
      selectedThumbIndex: thumbIndex,
      expandedImageIndex: thumbIndex,
      selectedPhoto: newSkus.photos[thumbIndex].url || newSkus.photos[0].url,
      selectedPhotos: newSkus.photos,
      quantity: 0,
      selectedSize: 'Select Size',
      sizeMenu: 1,
      hasStock: newStockIsTrue,
    });
  }
  thumbnailClick(e) {
    let idx = e.target.id;
    if (!this.state.selectedPhotos[idx]) {
      // handle edge case of no corresponding image
      console.log('NO Image here ');
      return;
    }

    let correspondingImage = this.state.selectedPhotos[idx].url;

    this.setState({
      selectedPhoto: correspondingImage,
      selectedThumbIndex: Number(idx),
      expandedImageIndex: Number(idx),
    });
  }

  displayModal() {
    this.setState({
      expanded: !this.state.expanded,
      zoomed: !this.state.zoomed,
    });
  }

  arrowClick(e) {
    let arrow = e.target.id;

    if (
      (arrow === 'left-arrow' ||
        arrow === 'arrow-up' ||
        arrow === 'arrow-up-icon' ||
        arrow === 'left-arrow-icon' ||
        arrow === 'expanded-left-arrow') &&
      this.state.selectedThumbIndex > 0
    ) {
      let lowerIndex = this.state.selectedThumbIndex - 1;

      let lowerIndexImage = this.state.selectedPhotos[lowerIndex].url;

      // element.scrollIntoView(true)
      this.setState(
        {
          selectedThumbIndex: lowerIndex,
          expandedImageIndex: lowerIndex,
          selectedPhoto: lowerIndexImage,
        },
        () => {
          let classname =
            document.getElementsByClassName('thumbnails')[
              this.state.selectedThumbIndex
            ];
          var element = document.getElementById(this.state.selectedThumbIndex);
          classname.scrollIntoView({
            behavior: 'smooth',
            block: 'end',
            inline: 'nearest',
          });
        }
      );
    }

    let max = this.state.selectedPhotos.length - 1;
    if (
      (arrow === 'right-arrow' ||
        arrow === 'arrow-down' ||
        arrow === 'arrow-down-icon' ||
        arrow === 'right-arrow-icon' ||
        arrow === 'expanded-right-arrow') &&
      this.state.selectedThumbIndex < max
    ) {
      let higherIndex = this.state.selectedThumbIndex + 1;
      let higherIndexImage = this.state.selectedPhotos[higherIndex].url;
      this.setState(
        {
          selectedThumbIndex: higherIndex,
          expandedImageIndex: higherIndex,
          selectedPhoto: higherIndexImage,
        },
        () => {
          let classname =
            document.getElementsByClassName('thumbnails')[
              this.state.selectedThumbIndex
            ];

          classname.scrollIntoView({
            behavior: 'smooth',
            block: 'end',
            inline: 'nearest',
          });
        }
      );
    }
  }

  componentDidMount() {
    let SKU = Object.assign({}, this.state.SkusObj);
    let stockGreaterThanZero = this.totalStock(SKU);
    this.setState({ hasStock: stockGreaterThanZero });
  }
  addToCartClickHandler(e) {
    e.preventDefault();
    let skuLength = Object.keys(this.state.SkusObj).length;

    if (this.state.selectedSize === 'Select Size') {
      this.setState({ sizeMenu: skuLength });
    }
  }
  totalStock(SKU) {
    let currentSku = _.pairs(SKU);
    let sizesStock = currentSku.reduce((quantity, current) => {
      quantity += current[1].quantity;
      return quantity > 0;
    }, 0);
    return sizesStock;
  }

  sizeAndQuantityClickHandler(e) {
    let idx = e.target.selectedIndex;
    let skuId = Number(e.target.options[idx]['id']);
    let size = e.target.options[idx].value;
    let quantity = Number(e.target.options[idx].dataset.quantity);
    let newSkus = _.findWhere(this.props.sortedStyles, {
      // eslint-disable-next-line camelcase
      style_id: this.state.checkedId,
    }).skus;

    this.setState({
      quantity: quantity,
      SkusObj: newSkus,
      selectedQuantity: 1,
      selectedSize: size,
      sizeMenu: 1,
    });
  }

  quantityOnChange(e) {
    let newSelectedQuantity = Number(e.target.value);
    this.setState({ selectedQuantity: newSelectedQuantity });
  }

  render() {
    let productStars = this.props.productRatingStars;
    return (
      <div className='gallery-info-container'>
        <div className='product-info-container'>
          <div className='ratings'>
            <img
              src={productStars ? productStars[0] : EmptyStar}
              className='ratingOverviewStars'
              alt="Star 1"
              width="15" height="8"
            />
            <img
              src={productStars ? productStars[1] : EmptyStar}
              className='ratingOverviewStars'
              alt="Star 2"
              width="15" height="8"
            />
            <img
              src={productStars ? productStars[2] : EmptyStar}
              className='ratingOverviewStars'
              alt="Star 3"
              width="15" height="8"
            />
            <img
              src={productStars ? productStars[3] : EmptyStar}
              className='ratingOverviewStars'
              alt="Star 4"
              width="15" height="8"
            />
            <img
              src={productStars ? productStars[4] : EmptyStar}
              className='ratingOverviewStars'
              alt="Star 5"
              width="15" height="8"
            />
            {/* <FontAwesomeIcon icon={['far', 'star']} />
            <FontAwesomeIcon icon={['far', 'star']} />
            <FontAwesomeIcon icon={['far', 'star']} />
            <FontAwesomeIcon icon={['far', 'star']} /> */}
            <a href="#RnRtitle" style={{ textDecoration: ' underline' }}> Read All Reviews</a>
          </div>
          <CategoryName
            originalPrice={this.state.originalPrice}
            salesPrice={this.state.salesPrice}
            productInfo={this.state.productInfo}
            productStyles={this.props.sortedStyles}
          />

          <StyleSelector
            checkedId={this.state.checkedId}
            defaultStyle={this.state.defaultStyle}
            productStyles={this.state.productStyles}
            sortedStyles={this.props.sortedStyles}
            photos={this.props.sortedStyles[0].photos}
            styleClickHandler={this.styleClickHandler}
          />

          <SizeAndQuantitySelector
            totalStock={this.totalStock}
            hasStock={this.state.hasStock}
            sizeMenu={this.state.sizeMenu}
            selectedSize={this.state.selectedSize}
            selectedQuantity={this.state.selectedQuantity}
            quantityOnChange={this.quantityOnChange}
            quantity={this.state.quantity}
            sizeAndQuantityClickHandler={this.sizeAndQuantityClickHandler}
            productStyles={this.state.productStyles}
            SkusObj={this.state.SkusObj}
            selectedSkus={this.state.Skus}
            checkedId={this.state.checkedId}
          />
          <AddToCart
            hasStock={this.state.hasStock}
            addToCartClickHandler={this.addToCartClickHandler}
            selectedSize={this.state.selectedSize}
            quantity={this.state.quantity}
            selectedQuantity={this.state.selectedQuantity}
          />
        </div>
        <GalleryModal
          defaultStyle={this.state.defaultStyle}
          zoomed={this.state.zoomed}
          thumbnailClick={this.thumbnailClick}
          expanded={this.state.expanded}
          displayModal={this.displayModal}
          onClick={this.props.arrowClick}
          arrowClick={this.arrowClick}
          image={this.state.selectedPhoto}
          selectedIndex={this.state.expandedImageIndex}
          selectedPhotos={this.state.selectedPhotos}
        />
        <Tracker
          defaultStyle={this.state.defaultStyle}
          expanded={this.state.expanded}
          displayModal={this.displayModal}
          arrowClick={this.arrowClick}
          selectedThumbIndex={this.state.selectedThumbIndex}
          thumbnailClick={this.thumbnailClick}
          selectedPhotoThumb={this.state.selectedPhotoThumb}
          checkedId={this.state.checkedId}
          image={this.state.selectedPhoto}
          selectedPhotos={this.state.selectedPhotos}
          sortedStyles={this.props.sortedStyles}
        />
      </div>
    );
  }
}

export default ProductInformation;
