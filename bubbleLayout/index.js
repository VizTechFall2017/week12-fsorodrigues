var width = document.getElementById('svg1').clientWidth;
var height = document.getElementById('svg1').clientHeight;

var marginLeft = 0;
var marginTop = 0;

var svg = d3.select('svg')
            .append('g')
            .attr('transform', 'translate(' + width/2 + ',' + height/2 + ')');

var color = d3.scaleOrdinal(["#3957ff", "#d3fe14", "#c9080a", "#fec7f8", "#0b7b3e",
                             "#0bf0e9", "#c203c8", "#fd9b39", "#888593", "#906407",
                             "#98ba7f", "#fe6794", "#10b0ff", "#ac7bff", "#fee7c0",
                             "#964c63", "#1da49c", "#0ad811", "#bbd9fd", "#fe6cfe",
                             "#297192", "#d1a09c", "#78579e", "#81ffad", "#739400"]);

var radiusScale = d3.scaleLinear().range([0,20]);

var forceCollide = d3.forceCollide()
                     .radius(function(d) { return radiusScale(d.assets) + 1.5; })
                     .iterations(1);

//import the data from the .csv file
d3.csv('./banks.csv', function(banks){

    console.log(banks);

    var countryList = banks.map(function(d) { return d.country; })

    var uniqueList = countryList.filter(function(d,i,a) {
        return a.indexOf(d) == i;
    });

    var clusterLookup = d3.map()

    uniqueList.forEach(function(d,i) {
      clusterLookup.set(d,i);
    });

    console.log(clusterList)

    banks.forEach(function(d) {
      d.cluster = clusterLookup.get(d.country);
    });

    color.domain(uniqueList);
    radiusScale.domain([0, d3.max(banks.map(function(d) { return d.assets; }))]);

    var force = d3.forceSimulation()
                  .nodes(banks)
                  .force("center", d3.forceCenter())
                  .force("collide", forceCollide)
                  .force("gravity", d3.forceManyBody(30))
                  .force("x", d3.forceX().strength(.7))
                  .force("y", d3.forceY().strength(.7))
                  .on("tick", tick);

    var circle = svg.selectAll("circle")
                    .data(banks)
                    .enter()
                    .append("circle")
                    .attr("class", "circles")
                    .attr("r", function(d) { return radiusScale(d.assets); })
                    .attr("fill", function(d) { return color(d.cluster); })

    circle.append("title")
          .text(function(d) { return d.bank + ", " + d.country; });

    function tick() {
      circle.attr("cx", function(d) { return d.x; })
            .attr("cy", function(d) { return d.y; })
    };




});
