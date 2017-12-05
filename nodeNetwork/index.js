var width = document.getElementById('svg1').clientWidth;
var height = document.getElementById('svg1').clientHeight;

var marginLeft = 0;
var marginTop = 0;

var link;
var nodes;

var svg = d3.select('svg')
    .append('g')
    .attr('transform', 'translate(' + marginLeft + ',' + marginTop + ')');

var color = d3.scaleOrdinal(d3.schemeCategory20);

var simulation = d3.forceSimulation()
                   .force("link", d3.forceLink().id(function(d){ return d.id; }))
                   .force("charge", d3.forceManyBody())
                   .force("center", d3.forceCenter(width/2, height/2));

//import the data from the .csv file
d3.json('./GOT_nodenetwork.json', function(graph){

    console.log(graph.nodes);
    console.log(graph.links);

    simulation.nodes(graph.nodes)
              .on("tick", ticked);

    simulation.force("link")
              .links(graph.links);

    link = svg.append("g")
              .attr("class", "links")
              .selectAll("line")
              .data(graph.links)
              .enter()
              .append("line")
              .attr("stroke", "gainsboro")
              .attr("stroke-width", function(d) { return Math.sqrt(d.value); });

    nodes = svg.append("g")
                .attr("class", "nodes")
                .selectAll("circle")
                .data(graph.nodes)
                .enter()
                .append("circle")
                .attr("r", 5)
                .attr("fill", function(d) { return color(d.group)})
                // .call(d3.drag()
                //         .on("start", dragStarted)
                //         .on("drag", dragged)
                //         .on("end", dragEnded) );

    nodes.append("title")
         .text(function(d) { return d.id; });

});

function ticked() {

  link.attr("x1", function(d) { return d.source.x })
      .attr("y1", function(d) { return d.source.y })
      .attr("x2", function(d) { return d.target.x })
      .attr("y2", function(d) { return d.target.y });

  nodes.attr("cx", function(d) { return d.x })
       .attr("cy", function(d) { return d.y })
}

// function dragStarted(d) {
//   if (!d3.event.active) {
//     simulation.alphaTarget(2).restart();q
//     d.fx = d.x;
//     d.fy = d.y;
//     }
// }
//
// function dragged(d) {
//   d.fx = d3.event.x;
//   d.fy = d3.event.y;
// }
//
// function dragEnded(d) {
//   simulation.alphaTarget(.3).restart();
//   d.fx = null;
//   d.fy = null;
// }
