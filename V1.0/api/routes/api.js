const { json } = require('express');
var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
   
    var val = "";
    
    function generator(){

      try{ 
      const spawn = require('child_process').spawn;
      // Call the python process 
      const  py = spawn('python3', ['numGen.py']);
        
      resultString = '';
        
    //   // As the stdout data stream is chunked,
    //   // we need to concat all the chunks.
    //   py.stdout.on('data', function (stdData) {
    //     resultString = stdData.toString();
    //   });
        
    //   py.stdout.on('end', function () {
    //     // Parse the string as JSON when stdout
    //     // data stream ends
    //     let resultData = JSON.parse(resultString);
        
    //     val = resultData['value']; // can delete...
        
        // PLACEHOLDER JSON VARIABLE, TO DELETE...
        const resultData = {
            right: 0,
            left: 0,
            up: 0,
            down: 1,
            tap: 0
          };

        console.log('Sending JSON data to /api');
        return res.json(resultData);
    //   }); 
      }
      catch(error){
        console.log(error);
        return res.send('Error: ', error);
      }
    }

    generator();
    
});

module.exports = router;