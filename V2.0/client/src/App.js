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
are integrated to the required range of values and converted in a Json 
string. The string is sent to the host via the USB-Serial interface and captured by HTTP
the Node.js server.

This App.js is the main React file, which fetches the /api endpoint from the Node.js server and populates the
"state" of the app.

\author Furio Piccinini <furiopiccinini@gmail.com>
\date Apr 2022
\version 0.3
*/

// Import statements
import React, { Component } from 'react';
import '@fortawesome/fontawesome-svg-core'; // Fontawesome import
import '@fortawesome/free-regular-svg-icons'; // Fontawesome import
import { faCircleQuestion } from "@fortawesome/free-solid-svg-icons"; // Fontawesome import
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"; // Fontawesome import
import CountUp from 'react-countup'; // react-countup import
import CrypIndicator from './components/CrypIndicator.js'; // react-gauge-chart component import
import logo from './logo.svg'; // React logo import
import './App.css';
import parkingBg from './parking-meter.png';
import './fonts/LCDN.TTF'; // LCDN font import

let currentBank = 0; // Defines the first bank in use 
let maxBank = 3; // Max number of banks accepted, starting from 0
const incomingJson = {};

//main class
class App extends Component{
  constructor(props){
    super(props);
    // Instantiation of app state
    this.state={
        right: false,
        left: false,
        up: false,
        down: false,
        isHidden: true,
        // hardcoded values for display, to be replaced with JSON values from /api
        firstVal: 9,
        secondVal: 7,
        thirdVal: 3,
        fourthVal: 6,
        reachVal1: false, // comparison with firstVal, set to True when the counter stops
        reachVal2: false,
        reachVal3: false,
        reachVal4: false,
        percent: 0.125, // gauge starting percentage
        completed: false, // game completed, so we can show the curtain
        gaugePosition1: 0.125,
        gaugePosition2: 0.38,
        gaugePosition3: 0.63,
        gaugePosition4: 0.89,
        bankCounter: 1,
        bank: [0, 0, 0, 0],
        solution1: 6,
        solution2: 7,
        solution3: 3,
        solution4: 6
      };
  }
  
  // Function to toggle visibility of help message under the parking meter, 
  // based on the state of isHidden
  toggleHidden () {
    this.setState({
      isHidden: !this.state.isHidden
    })
  }

  // Function to fetch data from /api and modify the state
  // with setState method (with a Promise)
  callAPI(){
    fetch('http://localhost:9000/api')
    .then((res) => res.json())
    .then((incomingJson) => {
      this.checkIncomingJson();
      this.bankSelection();
      this.updateCounters();
    });
  }

  // Gets the right or left signal and update the currentBank value,
  // evaluating it against maxBank limit value
  bankSelection(){
    if(this.state.right){
      currentBank += 1;
      if(currentBank > maxBank){
        currentBank = 0;
      }
    } else if(this.state.left){
      currentBank -= 1;
      if(currentBank < 0){
        currentBank = 3;
      }
    }
  }

  // If up or down signal is given, increment or decrement the counter based on the current bank
  updateCounters(){
          if(this.state.up){
            if(this.state.bank[currentBank] < 9){
            this.setState({ bank: this.state.bank[currentBank] + 1});
            } else {
              const circularCounter = 
              this.setState({ bank: this.state.bank[currentBank] = 0 });
            }
          } else if(this.state.down){
            if(this.state.bank[currentBank] > 0){
            this.setState({ bank: this.state.bank[currentBank] - 1});
            } else {
              this.setState({ bank: this.state.bank[currentBank] = 9 });
            }
          }
    }

  checkIncomingJson(){
          // Check incoming signals and update state if it's different from previous
          if(this.state.right !== incomingJson.right){
            this.setState({right: incomingJson.right});
            } else if (this.state.left !== incomingJson.left){
              this.setState({left: incomingJson.left});
            } else if(this.state.up !== incomingJson.up){
              this.setState({up: incomingJson.up});
            } else if(this.state.down !== incomingJson.down){
              this.setState({down: incomingJson.down});
          }
  }

  componentDidMount(){
    this.intervalID = setInterval(() => this.callAPI(), 500); //call to function when interface is loaded, for fetching data from /api
  }

  componentWillUnmount(){
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
          <CrypIndicator percent={this.state.percent} /> 
          <div id='led1' className={`${LEDClass} ${this.state.reachVal1 ? "LEDon" : ""}`}></div>
          <div id='led2' className={`${LEDClass} ${this.state.reachVal2 ? "LEDon" : ""}`}></div>
          <div id='led3' className={`${LEDClass} ${this.state.reachVal3 ? "LEDon" : ""}`}></div>
          <div id='led4' className={`${LEDClass} ${this.state.reachVal4 ? "LEDon" : ""}`}></div>
          <div id='box' className='BOX'>
            <span>{this.state.firstVal}{this.state.firstVal===this.state.solution1 ? this.setState({reachVal1: 1}) : "" }</span>:
            {/* <span>{this.state.secondVal}{this.state.secondVal===this.state.solution2 ? this.setState({reachVal2: 1}) : "" }</span>:
            <span>{this.state.thirdVal}{this.state.thirdVal===this.state.solution3 ? this.setState({reachVal3: 1}) : "" }</span>:
            <span>{this.state.fourthVal}{this.state.fourthVal===this.state.solution4 ? this.setState({reachVal4: 1}) : "" }</span> */}
            {/* <CountUp end={this.state.firstVal} onEnd={()=>this.setState({reachVal1: 1})}/>: */}
            <CountUp end={this.state.secondVal} delay={10} duration={7} onEnd={()=>this.setState({reachVal2: 1})}/>:
            <CountUp end={this.state.thirdVal} delay={19} duration={3} onEnd={()=>this.setState({reachVal3: 1})}/>:
            <CountUp end={this.state.fourthVal} delay={24} duration={6} onEnd={()=>this.setState({reachVal4: 1, completed: 1})}/>
          </div>
          <div className='half-circle'></div>
            <FontAwesomeIcon id="icon" icon={faCircleQuestion} size="xl" onClick={this.toggleHidden.bind(this)} />
          {!this.state.isHidden && <Info />}
          {this.state.completed && <div className='curtain'>Reload the page to start again</div>}
        </div>
      </header>
      <p>{this.state.right}, {this.state.left}, {this.state.up}, {this.state.down}, {this.state.tap}</p>
      <p>{this.state.firstVal}</p>
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