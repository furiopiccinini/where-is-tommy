var express = require('express');
var router = express.Router();

const emptyJson = { // Empty JSON obj, to test against the incoming JSON data
  "left": 0,
  "right": 0,
  "up": 0,
  "down": 0
};

var incomingJson = {};

/* POST method */
router.post('/', function (req, res) {
  if (req.body) { // Check if req.body contains data
    incomingJson = req.body; // Get the req.body object passed by Python program
    res.send("Incoming JSON data...");
  } else {
    res.send("There's a problem on incoming data, body is empty");
  }
});

/* GET method */
router.get('/', function (req, res, next) {
  // validate the presence of data and forward it when receive a get request to /api
  function forwardData() {
    try {
      // console.log(incomingJson);
      res.json(incomingJson);
      incomingJson = emptyJson;
    }
    catch (error) {
      console.log(error);
      res.send('Error: ', error);
    }
  }

  forwardData();

});

module.exports = router;