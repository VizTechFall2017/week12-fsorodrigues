var width = document.getElementById('svg-container').clientWidth;
var height = document.getElementById('svg-container').clientHeight;

var margin = { top: height/5, right: width/12, bottom: height/5, left: width/6 };

var currencies;

var svg = d3.select("#svg-container")
            .append("svg")
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var scaleX = d3.scaleTime()
                .range([0, (width - (margin.left + margin.right)) ]);

var scaleY = d3.scaleLinear()
                .range([ (height - (margin.top + margin.bottom)), 0]);

var closeLine = d3.line()
                 .x(function(d) { return scaleX(d.dateObject); })
                 .y(function(d) { return scaleY(d.close) });

var rangeArea = d3.area()
                .x(function(d) { return scaleX(d.dateObject); })
                .y0(function(d) { return scaleY(d.close - 2*d.variance) })
                .y1(function(d) { return scaleY(d.high + 2*d.variance) });

queue()
  .defer(d3.csv, "./data/crypto-markets.csv")  // import data from csv file
  .await(function(err, dataIn) {

    dataIn.forEach(function(d,i) {
      d.open = +d.open;
      d.low = +d.low;
      d.high = +d.high;
      d.close = +d.close;
      d.volume = +d.volume;
      d.market = +d.market;
      d.ranknow = +d.ranknow
      d.variance = +d.variance
      d.volatility = +d.volatility;

      d.dateObject = dateParse(d.date);
    });

    var cf = crossfilter(dataIn);

    var bySymbol = cf.dimension(function(d) { return d.symbol; });

    currencies = bySymbol;

    var bitcoin = updateData("BTC");
    var ethereum = updateData("ETH");
    var bitcash = updateData("BCH");

    scaleX.domain(d3.extent(bitcoin, function(d) { return d.dateObject; }) );
    // scaleY.domain(d3.extent(bitcoin, function(d) { return d.close; }) );
    scaleY.domain([0, 2]);

    drawArea(bitcoin, "red");
    drawLine(bitcoin);
    drawArea(ethereum, "blue");
    drawLine(ethereum);
    drawArea(bitcash, "yellow");
    drawLine(bitcash);

  });

function drawArea(data, color) {
  svg.append("path")
   .data([data])
   .attr("class", "line")
   .attr("fill", color)
   .attr("fill-opacity", 0)
   .attr("stroke", color)
   .attr("stroke-width", .05)
   .attr("d", rangeArea);
 };

function drawLine(data) {
  svg.append("path")
   .data([data])
   .attr("class", "line")
   .attr("fill", "none")
   .attr("stroke", "black")
   .attr("stroke-width", .05)
   .attr("d", closeLine);
 };

var dateParse = d3.timeParse("%Y-%m-%e");

var sortByDate = crossfilter.quicksort.by(function(d) { return d.dateObject; });

function updateData(currency) {
  var filter = currencies.filterExact(currency).top(Infinity);
  return sortByDate(filter, 0, filter.length)
}
