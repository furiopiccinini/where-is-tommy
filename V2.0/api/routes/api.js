/** @module */

/** Require statements */
var express = require('express');
var router = express.Router();

/** Empty JSON obj, to test against the incoming JSON data 
 * @global
*/
const emptyJson = {
  "left": 0,
  "right": 0,
  "up": 0,
  "down": 0
};

/** @global */
var incomingJson = {};

/** /api POST method */
router.post('/', function (req, res) {
  /** Check if req.body contains data */
  if (req.body) {
    /** Get the req.body object passed by Python program */
    incomingJson = req.body;
    console.log(incomingJson);
    /** Send a response to caller */
    res.send("Incoming JSON data...");
  } else {
    /** Send an error message */
    res.send("There's a problem on incoming data, body is empty");
  }
});

/** /api GET method */
router.get('/', function (req, res, next) {
  /** Validate the presence of data and forward it when receive a get request to /api  
   * @function */
  function forwardData() {
    try {
      /** Send a JSON response with the data sent by the Python script 
       * @method
      */
      res.json(incomingJson);
      /** Empty the variable, ready for next cycle */
      incomingJson = emptyJson;
    }
    catch (error) {
      console.log(error);
      /** Send an error response */
      res.send('Error: ', error);
    }
  }

  forwardData();

});

/** @exports */
module.exports = router;