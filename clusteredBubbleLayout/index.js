var width = document.getElementById('svg1').clientWidth;
var height = document.getElementById('svg1').clientHeight;

var marginLeft = 0;
var marginTop = 0;

var svg = d3.select('svg')
    .append('g')
    .attr('transform', 'translate(' + width/2 + ',' + height/2 + ')');

var colorScale = d3.scaleOrdinal().range(["#3957ff", "#d3fe14", "#c9080a", "#fec7f8", "#0b7b3e", "#0bf0e9", "#c203c8", "#fd9b39", "#888593", "#906407", "#98ba7f", "#fe6794", "#10b0ff", "#ac7bff", "#fee7c0", "#964c63", "#1da49c", "#0ad811", "#bbd9fd", "#fe6cfe", "#297192", "#d1a09c", "#78579e", "#81ffad", "#739400", "#ca6949", "#d9bf01"]);
var radiusScale = d3.scaleLinear().range([0,10]);

var clusterLookup = d3.map();

var clusterList = [];

//import the data from the .csv file
d3.csv('./banks.csv', function(banks){

    console.log(banks);

    //get an array with just the country names
    countryList = banks.map(function(d){return d.country});

    //use a filter function to get out just the unique names
    //d is our usual data point, like we always use in function(d)
    //i is the array index (first element, second element, etc)
    //a is the array itself
    uniqueList = countryList.filter(function (d, i, a) {

        //look at the whole array, and find out which data point you're looking at by looking up its index.
        //if that index is the same as its value in the original array, then it must be the first time you've seen it.
        //Add that to your current array, and keep going. This throws out all duplicate copies, and returns an array
        //with only the unique countries listed.
        return a.indexOf(d) == i;
    });

    colorScale.domain(uniqueList);
    //console.log(d3.max(countryList.map(function(d){return d.assets})));
    radiusScale.domain([0, d3.max(banks.map(function(d){return d.assets}))]);

    uniqueList.forEach(function(d, i){
         clusterLookup.set(d, i);
         clusterList.push({ cluster: i });
    });

    //console.log(clusterLookup.get("China"));

    clusterList.forEach(function(d) {
      d.maxAsset = d3.max(banks.map(function(e){
        if (e.cluster == d.cluster) {
          return +e.assets;
        } else { return 0
        }
      }))
    });

    console.log(clusterList);

    banks.forEach(function (d,i) {
        d.cluster = clusterLookup.get(d.country);
    });

    var forceCollide = d3.forceCollide()
        .radius(function(d) { return radiusScale(d.assets) + 1.5; })
        .iterations(1);

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
       .enter().append("circle")
       .attr("r", function(d) { return radiusScale(d.assets); })
       .style("fill", function(d) { return colorScale(d.cluster); });

   circle.append('title').text(function(d){return d.bank + '; ' + d.country});

   function tick() {
       circle
           .attr("cx", function(d) { return d.x; })
           .attr("cy", function(d) { return d.y; });
   }


});
