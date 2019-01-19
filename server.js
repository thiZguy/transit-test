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
  })
  .then(routes => {
    res.send({ routes });
  }).catch((error) => {
    res.send({error});
  });
});

app.get('/api/getTripsByRouteId', (req, res) => {
  gtfs.getRoutes({
    agency_key: 'transit',
    agency_id: req.body.routeId,
  })
  .then(trips => {
    res.send({ trips });
  }).catch((error) => {
    res.send({error});
  });
});

app.get('/api/getShapesByTripId', (req, res) => {
  gtfs.getShapes({
    agency_key: 'caltrain',
    trip_id: req.body.tripId
  })
  .then(shapes => {
    res.send({ shapes });
  }).catch((error) => {
    res.send({ error });
  });
});



/*
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