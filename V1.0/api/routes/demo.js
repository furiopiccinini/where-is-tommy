const { json } = require('express');
var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    
    let intervalID;

    function generator(){

      try{    
        
        // const stepper = (position, solution) =>{
        //     let i;
        //     while(i <= solution){
        //         intervalID = setInterval(position++, 1000);
        //         console.log(position)
        //         return position;
        //     }
        //     clearInterval(intervalID);
        // }
        
        const resultData = {
            right: 1,
            left: 0,
            up: 0,
            down: 0,
            tap: 0
          };

        res.json(resultData);
      }
      catch(error){
        console.log(error);
        res.send('Error: ', error);
      }
    }

    generator();
    
});

module.exports = router;