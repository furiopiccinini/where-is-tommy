import GaugeChart from 'react-gauge-chart';
import React from 'react';

/**
 * This is the gauge component, based on react-gauge-chart.
 * * @component
 */

const CryptIndicator = ({ percent }) => {
  /** Defining basic styling for the gauge */
  const chartStyle = {
    width: 390
  };

  return (
    <div className="gaugecontainer">
      <GaugeChart id="gauge-1" nrOfLevels={4} percent={percent}
        style={chartStyle} needleColor="#a87b14" hideText="true"
        colors={["#a4a3a8"]} />
    </div>
  )
}

/** @exports */
export default CryptIndicator;