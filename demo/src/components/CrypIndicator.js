import GaugeChart from 'react-gauge-chart';
import React from 'react';

const CryptIndicator = ({percent}) => {
    // const gaugeVal = 0.38;
    const chartStyle = {
    width: 390
  };

    return(
        <div className="gaugecontainer">
        <GaugeChart id="gauge-1" nrOfLevels={4} percent={percent} 
        style={chartStyle} needleColor="#a87b14" hideText="true" 
        colors={["#a4a3a8"]} />
      </div>
    )
}

export default CryptIndicator;