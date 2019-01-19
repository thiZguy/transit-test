/**
 * @author Santiago Montero
 * @github https://github.com/thiZguy
 */

require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const gtfs = require('gtfs');
const mongoose = require('mongoose');

// GTFS CONFIGURATION
const config = {
  mongoUrl: process.env.MONGO_URL,
  agencies: [
    {
      agency_key: 'transit',
      url: 'http://www.dtpm.cl/descargas/gtfs/GTFS.zip',
      exclude: [
        'calendar',
        'calendar_dates',
        'feed_info',
        'frequencies',
        'stops',
        'stop_times'
      ]
    }
  ]
};

// We connect to the database 
mongoose.connect(config.mongoUrl, { useNewUrlParser: true });

const app = express();
const port = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


/** API calls
 * ----------------------------------------------------------------------------
*/

/* CONFIGURATION */
app.get('/api/retrieveKey', (req, res) => {
  res.send({ GoogleMapsAPIKey: process.env.REACT_APP_GoogleMapsAPIkey });
});

/* LOGIC */
app.get('/api/getRoutes', (req, res) => {
  gtfs.getRoutes({
    agency_key: 'transit',
    agency_id: 'TS',
  },{},
  { limit: 20 })
  .then(routes => {
    res.send({ routes });
  }).catch((error) => {
    res.send({error});
  });
});

app.post('/api/getShapeIdByRouteId', (req, res) => {
  gtfs.getTrips({
    agency_key: 'transit',
    route_id: req.body.routeId,
    direction_id: 0,
  },
  {
    _id: 0,
    shape_id: 1
  },
  {
    limit: 1
  }).then(trips  => {
    gtfs.getShapes(
      {
        shape_id: trips[0].shape_id
      },
      {
        _id: 0,
        shape_pt_lat: 1,
        shape_pt_lon: 1,
        shape_pt_sequence: 1,
      }
    ).then(
      (shapes) => {
        const shape_modfd = [...shapes[0]];
        res.send({ shape: shape_modfd });
      } 
    ).catch(
      (error) => {
        res.send({ error });
      }
    );
    // res.send({ trips });
  }).catch((error) => {
    res.send({ error });
  });
});

// app.get('/api/getShapeByRouteId', (req, res) => {
//   gtfs.getShapes({
//     agency_key: 'transit',
//     trip_id: req.body.tripId
//   })
//   .then(shapes => {
//     res.send({ shapes });
//   }).catch((error) => {
//     res.send({ error });
//   });
// });



/* BUILDING DO NOT TOUCH
 ----------------------------------------------------------------------------
*/

if (process.env.NODE_ENV === 'production') {
  // Serve any static files
  app.use(express.static(path.join(__dirname, 'client/build')));
  // Handle React routing, return all requests to React app
  app.get('*', function (req, res) {
    res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
  });
}

app.listen(port, () => console.log(`Listening on port ${port}`));