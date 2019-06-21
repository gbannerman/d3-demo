import * as d3 from 'd3';
import Season from './models/Season';
import Episode from './models/Episode';

export const render = (element: HTMLElement | null, data: Season[]) => {

  if (!element) {
    return;
  }

  const animationDuration = 250;

  const margin = {
    top: 50,
    right: 200,
    bottom: 50,
    left: 200
  };

  const getSeasonName = (season: Season) => `Season ${season.number}`;

  const color = d3.scaleOrdinal<number, string>(d3.schemeCategory10);

  const width = element.clientWidth - margin.left - margin.right;
  const height = element.clientHeight - margin.top - margin.bottom;

  const scale = {
    x: d3.scaleLinear().domain([1, 10]).range([0, width]),
    y: d3.scaleLinear().domain([
      40,
      d3.max(data, s => d3.max(s.episodes, v => v.rating)) as number
    ]).range([height, 0])
  };

  const axes = {
    x: d3.axisBottom(scale.x),
    y: d3.axisLeft(scale.y)
  };

  const line = d3.line<Episode>()
    .x((d) => scale.x(d.number))
    .y((d) => scale.y(d.rating))

  const svg = d3.select(element).append('svg')
    .attr('width', element.clientWidth)
    .attr('height', element.clientHeight)
    .append('g').attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

  svg.append('g').attr('class', 'x axis').attr("transform", "translate(0," + height + ")").call(axes.x);
  svg.append('g').attr('class', 'y axis').call(axes.y);

  color.domain(data.map(s => s.number));

  const season = svg.selectAll(".season").data(data)
    .enter().append("g").attr("class", "season");

  season.append("path")
  .attr("class", "line")
  .attr("d", d => line(d.episodes))
  .attr("data-legend", d => getSeasonName(d))
  .style("stroke", d => color(d.number))
  .on('mouseover', (d, i, nodes) => {
    d3.selectAll(nodes as d3.ArrayLike<SVGPathElement>)
      .attr("class", "line fade");
    season.select('.circle-group')
      .attr("class", "circle-group fade");
    d3.select(nodes[i])
      .attr("class", "line focus");
  })
  .on('mouseout', (d, i, nodes) => {
    d3.selectAll(nodes as d3.ArrayLike<SVGPathElement>)
      .attr("class", "line");
    season.select('.circle-group')
      .attr("class", "circle-group");
  });

  season
  .append("g")
  .attr("class", "circle-group")
  .style("fill", d => color(d.number))
  .selectAll("circle")
  .data(d => d.episodes).enter()
  .append("g")
  .attr("class", "circle")
  .on('mouseover', (d, i, nodes) => {
    d3.select(nodes[i])
    .attr("r", 10)
    .append("text")
    .attr("class", "ep-label")
    .text(`E${d.number}: ${d.title} - ${d.rating}%`)
    .attr("x", scale.x(d.number) + 5)
    .attr("y", scale.y(d.rating) - 10);
  })
  .on('mouseout', (d, i, nodes) => {
    d3.select(nodes[i])
      .attr("r", 5)
      .selectAll('.ep-label').remove();
  })
  .append("circle")
  .attr("cx", d => scale.x(d.number))
  .attr("cy", d => scale.y(d.rating))
  .attr("r", 5)
  .on('mouseover', (d, i, nodes) => {
    d3.select(nodes[i])
      .transition()
      .duration(animationDuration)
      .attr("r", 8);
  })
  .on('mouseout', (d, i, nodes) => {
    d3.select(nodes[i])
      .transition()
      .duration(animationDuration)
      .attr("r", 5);
  });

  var legend = svg.selectAll('.legend')
    .data(data)
    .enter()
    .append('g')
    .attr('class', 'legend')
    .attr("transform", (d, i, nodes) => "translate(10," + (height - 30*nodes.length + i*30)+")");

  legend.append('rect')
    .attr('width', 20)
    .attr('height', 20)
    .style('fill', s => color(s.number))
    .style('stroke', s => color(s.number));
    
  legend.append('text')
    .attr('x', 20 + 20)
    .attr('y', 20 - 20)
    .attr("transform", "translate(-10, 14)")
    .text(d => getSeasonName(d));

  return color;
}