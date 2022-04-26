const { json } = require('express');
var express = require('express');
var router = express.Router();

var incomingJson = {}; // Declare a varaible to hold Json data from [post] and forward it to [get]


/* POST method */
router.post('/', function(req, res) {
  incomingJson = req.body;
  console.log(req.body);
});

/* GET method */
router.get('/', function(req, res, next) {
    
    // validate presence of data and forward it when receive a get request to /api
    function forwardData(){
      try{ 
        const resultData = incomingJson;
        console.log(resultData);
        res.json(resultData);
      }
      catch(error){
        console.log(error);
        res.send('Error: ', error);
      }
    }

    forwardData();
    
});

module.exports = router;