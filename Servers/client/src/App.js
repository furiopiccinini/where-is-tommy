/**
@summary Tales for Makers - Where is Tommy? \n
Project: parking meter remake\n

The project is made with different tecnologies:

----- Nicla Sense ME board
            |
            |
        Python script
            |
            |
        Node.js server
            |
            |
        React app



At the root we have a Nicla Sense ME firmware to create the motion gestures sensor. Sensor data
are integrated to the required range of values and converted in a JSON string. 
The string is sent to the host via the USB-Serial interface and captured by HTTP
the Node.js server.

This App.js is the main React file, which fetches the /api endpoint from the Node.js server and populates the
"state" of the app.
In the project root you can find the file named "Where is Tommy.postman_collection.json": this is the exported collection 
of all the APIs available in the Node.js server, along with an example JSON payload.

This project uses JSDoc as a documentation tool. After installing JSDoc with "npm install -g jsdoc" (global install)
or with "npm install --save-dev jsdoc" (local install as dev dependency), to generate the documentation for the source 
simply cd into the client/src folder and run "jsdoc App.js". All the documentation will be generated in the "out" folder.

@author Furio Piccinini <furiopiccinini@gmail.com>
Date Apr 2022
@version 0.8.6
@license: Apache

*/

/**  Import statements */
import React, { Component } from 'react';
import '@fortawesome/fontawesome-svg-core'; /*** Fontawesome import */
import '@fortawesome/free-regular-svg-icons'; /***  Fontawesome import */
import { faCircleQuestion } from "@fortawesome/free-solid-svg-icons"; /*** Fontawesome import */
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"; /*** Fontawesome import */
/** @external */
import CrypIndicator from './components/CrypIndicator.js'; /*** react-gauge-chart component import */
import logo from './logo.svg'; /*** React logo import */
import './App.css';
import parkingBg from './parking-meter.png';
import './fonts/LCDN.TTF'; /*** LCDN font import */

/** Holds the current bank, defined in bankSelection() 
 * @global */
var currentBank = 0;

/** Holds the max number for banks, starting from 0
 * @global */
const maxBank = 3;

/** Hardcoded solution var for the cryptex 
 * @global */
const solution1 = 6;
/** @global */
const solution2 = 7;
/** @global */
const solution3 = 3;
/** @global */
const solution4 = 6;

/** Var set to false, to check against the reached value of the counter
 * @global */
var reachVal1 = false;
/** @global */
var reachVal2 = false;
/** @global */
var reachVal3 = false;
/** @global */
var reachVal4 = false;

/** Default empty JSON object, used for comparison in callAPI() 
 * @global */
const defaultEmptyJson = {
  "right": 0,
  "left": 0,
  "up": 0,
  "down": 0,
};

/** Holds the parsed incoming JSON data from Node.js server 
 * @global */
var parsedJsonData = {};

/** 
 * Main App class derived by Component
 * @class
 * @classdesc Main App class derived by Component
 * main class */
class App extends Component {
  /** @constructs */
  constructor(props) {
    super(props);
    /** Instantiation of app state 
     * @params */
    this.state = {
      right: 0, /*** set all motion variables to false */
      left: 0,
      up: 0,
      down: 0,
      isHidden: 1, /** @params Property for '?' help message button, set to true on start */
      gameCompleted: 0, /** @params game completed, so we can show the curtain, initially set to false */
      /** @params Array with 4 gauge position, based on selected bank 
       * @type {Array}
      */
      gaugePosition: [0.125, 0.38, 0.63, 0.89],
      /** @params Bank array, stores the 4 counters 
       * @type {Array}
      */
      bank: [0, 0, 0, 0]
    };
  }

  /** Function to toggle visibility of help message under the parking meter, 
   * based on the state of isHidden
   * @function toggleHidden */
  toggleHidden() {
    this.setState({
      isHidden: !this.state.isHidden
    })
  }

  /**  Function to fetch data from /api and modify the state
   * with setState method (with a Promise) 
   * @function callAPI */
  callAPI() {
    fetch('http://localhost:9000/api')
      .then((res) => res.json())
      .then((incomingJson) => {
        /** Check if incoming JSON data is different from JSON obj with all zeroes */
        if (JSON.stringify(incomingJson) !== JSON.stringify(defaultEmptyJson)) {
          parsedJsonData = incomingJson;
          this.checkIncomingJson();
          this.bankSelection();
          this.updateCounters();
        } else {
          console.log("No incoming data, or no valid JSON object");
        }
      });
  }

  /**  Gets the right or left signal and update the currentBank value,
  * evaluating it against maxBank limit value 
  @function bankSelection */
  bankSelection() {
    /** If right signal is true, increment the bank number */
    if (parsedJsonData.right) {
      currentBank += 1;
      if (currentBank > maxBank) {
        /** If reached maxBank value, set it to zero */
        currentBank = 0;
        this.forceUpdate();
      }
    } else if (parsedJsonData.left) {
      /** If left signal is true, decrement the bank number */
      currentBank -= 1;
      if (currentBank < 0) {
        /** If reached zero, set it to maxBank */
        currentBank = maxBank;
        this.forceUpdate();
      }
    }
  }

  /**  If up or down signal is given, increment or decrement the counter 
   * based on the current bank
   * @function updateCounters */
  updateCounters() {
    if (parsedJsonData.up) {
      /** With up signal, checks the value of the counter in bank array in the state
       * and increase it if it's < 9
       */
      if (this.state.bank[currentBank] < 9) {
        var newArrayUp = [...this.state.bank];
        newArrayUp[currentBank] += 1;
        this.setState({ bank: [...newArrayUp] });
      } else {
        /** Set the counter to zero and update the state */
        var zeroArray = [...this.state.bank];
        zeroArray[currentBank] = 0;
        this.setState({ bank: [...zeroArray] });
        this.forceUpdate();
      }
    } else if (parsedJsonData.down) {
      /** With down signal, checks the value of the counter in bank array in the state
      * and decrease it if it's > 0
      */
      if (this.state.bank[currentBank] > 0) {
        var newArrayDown = [...this.state.bank];
        newArrayDown[currentBank] -= 1;
        this.setState({ bank: [...newArrayDown] });
      } else {
        /** Set the counter to nine and update the state */
        var nineArray = [...this.state.bank];
        nineArray[currentBank] = 9;
        this.setState({ bank: [...nineArray] });
      }
    }
    this.checkCompleted();
  }

  /**
   * Check incoming signals and update state if it's different from previous one.
   * @function checkIncomingJson */
  checkIncomingJson() {
    if (this.state.right !== parsedJsonData.right) {
      this.setState({ right: parsedJsonData.right });
    } else if (this.state.left !== parsedJsonData.left) {
      this.setState({ left: parsedJsonData.left });
    } else if (this.state.up !== parsedJsonData.up) {
      this.setState({ up: parsedJsonData.up });
    } else if (this.state.down !== parsedJsonData.down) {
      this.setState({ down: parsedJsonData.down });
    }
  }

  /**  Check if 4 reachVal'X' vars are all set to True, set completed to True, 
  * which activates curtain effect 
  * @function checkCompleted */
  checkCompleted() {
    if (reachVal1 && reachVal2 && reachVal3 && reachVal4 === true) {
      this.setState({ gameCompleted: 1 }, () => this.forceUpdate());
    }
  }
  /** React's Lifecycle method.
   * Set an interval to fire callAPI every 2Hz, only when the interface is loaded.
   * @function componentDidMount 
   * @fires callAPI to fetch data from Node.js server*/
  componentDidMount() {
    this.intervalID = setInterval(() => this.callAPI(), 500);
  }

  /** React's Lifecycle method.
   * Clears the setInterval function opened in componentDidMount()
  * @function componentWillUnmount */
  componentWillUnmount() {
    clearInterval(this.intervalID); // clear the setInterval timer
  }

  /** Class' render method
   * @function render */
  render() {
    /** Instantiate a LED class for leds, 
     * which are turned off by default. 
     * @param */
    var LEDClass = "LED";
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <div className="container">
            <img src={parkingBg} className="bg" alt="foreground" />
            <CrypIndicator percent={this.state.gaugePosition[currentBank]} />
            <div id='led1' className={`${LEDClass} ${reachVal1 ? "LEDon" : ""}`}></div>
            <div id='led2' className={`${LEDClass} ${reachVal2 ? "LEDon" : ""}`}></div>
            <div id='led3' className={`${LEDClass} ${reachVal3 ? "LEDon" : ""}`}></div>
            <div id='led4' className={`${LEDClass} ${reachVal4 ? "LEDon" : ""}`}></div>
            <div id='box' className='BOX'>
              <span>{this.state.bank[0]}{this.state.bank[0] === solution1 ? reachVal1 = true : ""}</span>:
              <span>{this.state.bank[1]}{this.state.bank[1] === solution2 ? reachVal2 = true : ""}</span>:
              <span>{this.state.bank[2]}{this.state.bank[2] === solution3 ? reachVal3 = true : ""}</span>:
              <span>{this.state.bank[3]}{this.state.bank[3] === solution4 ? reachVal4 = true : ""}</span>
            </div>
            <div className='half-circle'></div>
            <FontAwesomeIcon id="icon" icon={faCircleQuestion} size="xl" onClick={this.toggleHidden.bind(this)} />
            {!this.state.isHidden && <Info />}
            {this.state.gameCompleted && <div className='curtain'>Reload the page to start again</div>}
          </div>
        </header>
      </div>
    );
  }
}

/** Function to show a modal for help
 * @function Info */
const Info = () => (
  <div className='modal'>
    <h5>Keep trying, you can do it...</h5>
  </div>
)

/** @exports */
export default App;
