import React, { Fragment, useState } from 'react';

let CategoryName = function (props) {
  return (
    <Fragment>
      {props.productInfo.map((productData) => {
        return (
          <div key={productData.product_id}>
            <div className='product-category'>
              Category:{productData.category}
            </div>
            <h2 className='expanded-product-name'>{productData.name}</h2>
          </div>
        );
      })}
      {props.salesPrice === null ? (
        <div className='product-category' id='test-content'>${props.originalPrice}</div>
      ) : (
        <div className='product-category'>
          <span style={{ color: 'red' }}>${props.salesPrice}</span>{' '}
          <span style={{ textDecoration: 'line-through' }}>
            ${props.originalPrice}
          </span>
        </div>
      )}
    </Fragment>
  );
};

export default CategoryName;