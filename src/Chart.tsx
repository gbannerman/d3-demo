import React, { useEffect, useRef } from 'react';
import { render } from './renderChart';
import './Chart.scss';
import Season from './models/Season';

interface ChartProps {
  data: Season[];
}

const Chart: React.FC<ChartProps> = ({data}) => {
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    render(container.current, data);
  }, [data]);

  return (
    <div ref={container}  className="Chart"></div>
  );
}

export default Chart;