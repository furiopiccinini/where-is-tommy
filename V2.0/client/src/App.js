/**
\brief Tales for Makers - Where is Tommy? \n
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

\Author Furio Piccinini <furiopiccinini@gmail.com>
\Date Apr 2022
\Version 0.3
\License: Apache

*/

// Import statements
import React, { Component } from 'react';
import '@fortawesome/fontawesome-svg-core'; // Fontawesome import
import '@fortawesome/free-regular-svg-icons'; // Fontawesome import
import { faCircleQuestion } from "@fortawesome/free-solid-svg-icons"; // Fontawesome import
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"; // Fontawesome import
import CrypIndicator from './components/CrypIndicator.js'; // react-gauge-chart component import
import logo from './logo.svg'; // React logo import
import './App.css';
import parkingBg from './parking-meter.png';
import './fonts/LCDN.TTF'; // LCDN font import

var currentBank = 0; // Defines the first bank in use 

var maxBank = 3; // Max number of banks accepted, starting from 0

const solution1 = 6; // Hardcoded solution for cryptex's banks
const solution2 = 7;
const solution3 = 3;
const solution4 = 6;

var reachVal1 = 0;
var reachVal2 = 0;
var reachVal3 = 0;
var reachVal4 = 0;

const defaultEmptyJson = {
  "left": 0, // Empty object, will be used for comparison by callAPI method
  "right": 0,
  "up": 0,
  "down": 0,
};

var parsedJsonData = {}; // global variable for parsed incoming JSON data from Node server

//main class
class App extends Component {
  constructor(props) {
    super(props);
    // Instantiation of app state
    this.state = {
      right: 0, // set all motion variables to false
      left: 0,
      up: 0,
      down: 0,
      isHidden: 1, // property for '?' help message button, set to true on start
      lreachVal1: 0, // comparison with firstVal, set to True when the counter reaches the correct value
      lreachVal2: 0,
      lreachVal3: 0,
      lreachVal4: 0,
      completed: 0, // game completed, so we can show the curtain, initially set to false
      gaugePosition: [0.125, 0.38, 0.63, 0.89], // 4 gauge position, based on bank selected
      bank: [0, 0, 0, 0] // Bank array, stores the 4 counters
    };
  }

  // Function to toggle visibility of help message under the parking meter, 
  // based on the state of isHidden
  toggleHidden() {
    this.setState({
      isHidden: !this.state.isHidden
    })
  }

  // Function to fetch data from /api and modify the state
  // with setState method (with a Promise)
  callAPI() {
    fetch('http://localhost:9000/api')
      .then((res) => res.json())
      .then((incomingJson) => {
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

  // Gets the right or left signal and update the currentBank value,
  // evaluating it against maxBank limit value
  bankSelection() {
    if (parsedJsonData.right) {
      currentBank += 1;
      this.forceUpdate();
      if (currentBank > maxBank) { // restart from zero
        currentBank = 0;
        this.forceUpdate();
      }
    } else if (parsedJsonData.left) {
      currentBank -= 1;
      this.forceUpdate();
      if (currentBank < 0) { // restart from 3
        currentBank = 3;
        this.forceUpdate();
      }
    }
  }

  // If up or down signal is given, increment or decrement the counter 
  // based on the current bank
  updateCounters() {
    if (parsedJsonData.up) {
      if (this.state.bank[currentBank] < 9) {
        // let bankValue = this.state.bank[currentBank] + 1;
        var newArrayUp = this.state.bank;
        newArrayUp[currentBank] += 1;
        console.log("array clonato dopo aggiornamento " + [...newArrayUp]);
        this.setState({ bank: newArrayUp }, () => {
          this.forceUpdate();
        });
      } else {
        var zeroArray = [...this.state.bank];
        zeroArray[currentBank] = 0;
        console.log(zeroArray[currentBank]);
        this.setState({ bank: [...zeroArray] });
        // this.setState({ bank: this.state.bank[currentBank] = 0 });
        this.forceUpdate();
      }
    } else if (parsedJsonData.down) {
      if (this.state.bank[currentBank] > 0) {
        var newArrayDown = this.state.bank;
        newArrayDown[currentBank] -= 1;
        console.log("array clonato dopo aggiornamento " + [...newArrayDown]);
        this.setState({ bank: newArrayDown }, () => {
          this.forceUpdate();
        });
      } else {
        var nineArray = [...this.state.bank];
        zeroArray[currentBank] = 9;
        console.log(nineArray[currentBank]);
        this.setState({ bank: [...nineArray] });
        // this.setState({ bank: this.state.bank[currentBank] = 0 });
        this.forceUpdate();
        // this.setState({ bank: this.state.bank[currentBank] = 9 });

      }
    }
  }

  checkIncomingJson() {
    // Check incoming signals and update state if it's different from previous
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

  componentDidMount() {
    this.intervalID = setInterval(() => this.callAPI(), 500); //call to function when interface is loaded, for fetching data from /api
  }

  componentWillUnmount() {
    clearInterval(this.intervalID); // clear the setInterval timer
  }

  render() {
    var LEDClass = "LED"; // instantiate a LED class for leds, which are turned off by default.
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
              <span>{this.state.bank[0]}{this.state.bank[0] === solution1 ? reachVal1 = 1 : ""}</span>:
              <span>{this.state.bank[1]}{this.state.bank[1] === solution2 ? reachVal2 = 1 : ""}</span>:
              <span>{this.state.bank[2]}{this.state.bank[2] === solution3 ? reachVal3 = 1 : ""}</span>:
              <span>{this.state.bank[3]}{this.state.bank[3] === solution4 ? reachVal4 = 1 : ""}</span>
            </div>
            <div className='half-circle'></div>
            <FontAwesomeIcon id="icon" icon={faCircleQuestion} size="xl" onClick={this.toggleHidden.bind(this)} />
            {!this.state.isHidden && <Info />}
            {this.state.completed && <div className='curtain'>Reload the page to start again</div>}
          </div>
        </header>
        <p>{this.state.left}, {this.state.right}, {this.state.up}, {this.state.down}</p>
      </div>
    );
  }
}

const Info = () => (
  <div className='modal'>
    <h5>Keep trying, you can do it...</h5>
  </div>
)

export default App;

// ENRICO'S IDEA
// if(res.up)
//      counter[this.bank] += 1
//       if(counter[this.bank] > 9)
//            counter[this.bank] = 0

//            for(j = 0; j < 4; j++) {
//      this.counter[j] => aggiorna la grafica