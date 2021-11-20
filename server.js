const path = require('path');
const express = require('express');
// const config = require('./.config.js');
// const TOKEN = config.token;
const axios = require('axios').default;
const _ = require('underscore');
const multer = require('multer');
const { indexOf } = require('underscore');
const AWS = require('aws-sdk');
const fs = require('fs');
const cors = require('cors');
const compression = require('compression');


const app = express();
const port = 3001;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(compression());
app.use(express.static(path.join(__dirname, '/client/dist')));
app.use(cors());


// other configuration...
const PHOTO_UPLOAD_FOLDER = path.join(__dirname, '/client/UploadedPhotos');
app.use(express.static(PHOTO_UPLOAD_FOLDER));
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, PHOTO_UPLOAD_FOLDER);
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage: storage });

// initialize S3 Bucket
// AWS.config.update({region: ''});
// const s3 = new AWS.S3({
//   accessKeyId: config.awsS3id,
//   secretAccessKey: config.awss3SecretKey
// });


// router for handling valid products url string
app.get('/detailState/*', async (req, res) => {
  // let base = 'https://app-hrsei-api.herokuapp.com/api/fec2/hr-rpp';
  // let base = 'http://localhost:3009';
  let base = 'http://ec2-3-85-51-45.compute-1.amazonaws.com:80';
  // console.log(req.url, req.params);
  base += `/${req.params['0']}`;

  let indexOfProductId = req.params['0'].indexOf('/');
  let productId = req.params['0'].slice(indexOfProductId + 1);

  // console.log('PRODID', req.body);
  let optionsReviews = {
    method: 'GET',
    url: `http://ec2-54-234-5-16.compute-1.amazonaws.com:1337/reviews?product_id=${productId}`
  };
  let optionsReviewsMeta = {
    method: 'GET',
    url: `http://ec2-54-234-5-16.compute-1.amazonaws.com:1337/reviews/meta?product_id=${productId}`
  };

  let optionsDetail = {
    method: req.method,
    url: base,
    // headers: { Authorization: TOKEN },
    data: req.body,
  };
  let optionsStyle = {
    method: req.method,
    url: `${base}/styles`,
    // headers: { Authorization: TOKEN },
    data: req.body,
  };
  const detailRequest = axios(optionsDetail);
  const styleRequest = axios(optionsStyle);
  const reviewsRequest = axios(optionsReviews);
  const reviewsRequestMeta = axios(optionsReviewsMeta);

  try {
    // let result = await detailRequest;
    // let result2 = await styleRequest;
    // let result3 = await reviewsRequest;
    // let result4 = await reviewsRequestMeta;
    Promise.all([detailRequest, styleRequest, reviewsRequest, reviewsRequestMeta])
      .then((response) => {
        let detail = response[0].data;
        let style = response[1].data;
        let reviews = response[2].data;
        let meta = response[3].data;

        res.send([detail, style, reviews, meta]);
      }).catch((error) => {
        console.log('Promise.all error: ', error);
      });

    // res.send([detail, style]);
    // res.send([detail], []);
  } catch (err) {
    res.send(err);
  }
});

// REVIEWS HELPFUL ROUTE
app.put('/reviews/*/helpful', (req, res) => {
  let base = 'https://ec2-54-234-5-16.compute-1.amazonaws.com:1337';
  let method = req.method;
  let url = req.url.substring(4);
  let query = req.query;

  base += url;
  let options = {
    method: req.method,
    url: base
  };

  axios(options)
    .then((results) => {
      // console.log('IN HERE', results.data);
      // console.log('======================');
      res.status(results.status).send(results.data);
    })
    .catch((err) => {
      console.log(err);
    });
});

// REVIEWS REPORT ROUTE
app.put('/reviews/*/report', (req, res) => {
  let base = 'https://ec2-54-234-5-16.compute-1.amazonaws.com:1337';
  let method = req.method;
  let url = req.url.substring(4);
  let query = req.query;

  base += url;
  let options = {
    method: req.method,
    url: base
  };

  axios(options)
    .then((results) => {
      // console.log('IN HERE', results.data);
      // console.log('======================');
      res.status(results.status).send(results.data);
    })
    .catch((err) => {
      console.log(err);
    });
});

app.all('/api/*', (req, res) => {
  console.log('===========\n|  App ALL  |\n===========');
  // let base = 'https://app-hrsei-api.herokuapp.com/api/fec2/hr-rpp';
  let base = 'http://localhost:3001';
  let method = req.method;
  let url = req.url.substring(4);
  let query = req.query;
  console.log('"url": ', url);
  if (req.url.substring(4) === '/interactions') {
    base = 'https://app-hrsei-api.herokuapp.com/api/fec2/hr-rpp';
  }

  base += url;
  let options = {
    method: req.method,
    url: base,
    // headers: { Authorization: TOKEN },
    data: req.body,
  };


  axios(options)
    .then((results) => {
      // console.log('IN HERE', results.data);
      // console.log('======================');
      res.status(results.status).send(results.data);
    })
    .catch((err) => {
      console.log(err);
    });
});

// Router for storing photos uploaded by user
app.post('/photos', upload.array('photos', 5), (req, res) => {
  // console.log('react.files', req.files);
  for (let [i, photo] of req.files.entries()) {
    fs.readFile(photo.path, (err, data) => {
      if (err) {
        res.status(500).send('Error happened while uploading to S3');
      } else {
        const params = {
          Bucket: 'fec-atelier-photo-bucket',
          Key: photo.originalname,
          Body: data
        };
        s3.upload(params, (err, data) => {
          if (err) {
            res.status(500).send('Error happened while uploading to S3');
          } else {
            if (i === req.files.length - 1) {
              res.status(201).send('Successully uploaded all photos to S3');
            }
          }
        });
      }
    });
  }
});

// Router handler for url change
app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, '/client/dist/index.html'));
});

app.listen(port, () => {
  console.log(`Express Server is running on port ${port}`);
});
