import React from 'react';
import './App.scss';
import Chart from './Chart';
import { gotData } from './data/Got';

const App: React.FC = () => {

  return (
    <div className="App">
      <Chart data={gotData} />
    </div>  
  );
}

export default App;
