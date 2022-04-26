import React, { Component } from 'react';
import '@fortawesome/fontawesome-svg-core';
import '@fortawesome/free-regular-svg-icons';
import { faCircleQuestion } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import CountUp from 'react-countup';
import CrypIndicator from './components/CrypIndicator.js';
import logo from './logo.svg';
import './App.css';
import parkingBg from './parking-meter.png';
import './fonts/LCDN.TTF';

class App extends Component{
  constructor(props){
    super(props);
    this.state={
        right: "",
        left: "",
        up: "",
        down: "",
        tap: "",
        isHidden: true,
        // hardcoded values for display, to be replaced with JSON values from /api
        firstVal: 6,
        secondVal: 7,
        thirdVal: 3,
        fourthVal: 6,
        reachVal1: false, // comparison with firstVal, set to True when the counter stops
        reachVal2: false,
        reachVal3: false,
        reachVal4: false,
        percent: 0.0, // gauge percentage
        completed: false // game completed, so we can show the curtain
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
    fetch('http://localhost:9000/demo')
    .then((res) => res.json())
    .then((findresponse) => {
      this.setState({
        right: findresponse.right,
        left: findresponse.left,
        up: findresponse.up,
        down: findresponse.down,
        tap: findresponse.tap
      });
    });
  }

  componentDidMount(){
    this.callAPI(); //call to function when interface is loaded, for fetching data from /api
  }

render() {
  var LEDClass = "LED"; // instantiate a LED class for leds, which are turned off.
  return (
    <div className="App">
      <header className="App-header">     
        <img src={logo} className="App-logo" alt="logo" />
        <div className="container">
          <img src={parkingBg} className="bg" alt="background" />
          <CrypIndicator percent={this.state.percent}/>
          <div id='led1' className={`${LEDClass} ${this.state.reachVal1 ? "LEDon" : ""}`} ></div>
          <div id='led2' className={`${LEDClass} ${this.state.reachVal2 ? "LEDon" : ""}`} ></div>
          <div id='led3' className={`${LEDClass} ${this.state.reachVal3 ? "LEDon" : ""}`} ></div>
          <div id='led4' className={`${LEDClass} ${this.state.reachVal4 ? "LEDon" : ""}`} ></div>
          <div id='box' className='BOX' > 
            <CountUp end={this.state.firstVal} delay={2} duration={6} onEnd={()=>this.setState({percent: 0.12, reachVal1: 1})}/>:
            <CountUp end={this.state.secondVal} delay={10} duration={7} onEnd={()=>this.setState({percent: 0.38, reachVal2: 1})}/>:
            <CountUp end={this.state.thirdVal} delay={19} duration={3} onEnd={()=>this.setState({percent: 0.63, reachVal3: 1})}/>:
            <CountUp end={this.state.fourthVal} delay={24} duration={6} onEnd={()=>this.setState({percent: 0.89, reachVal4: 1, completed: 1})}/>
          </div>
          <div className='half-circle'></div>
            <FontAwesomeIcon id="icon" icon={faCircleQuestion} size="xl" onClick={this.toggleHidden.bind(this)} />
          {!this.state.isHidden && <Info />}
          {this.state.completed && <div className='curtain'>Reload the page to start again</div>}
        </div>
      </header>
      <p>{this.state.right}, {this.state.left}, {this.state.up}, {this.state.down}, {this.state.tap}</p>
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
