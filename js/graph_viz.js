var graphData =
{
  "addNode" :function (newNode){

    this.nodes.push(newNode)
    test.update(this)
  },
  "addLink" :function (newLink){
      this.links.push(newLink)
      test.update(this)
  },
  "clear" : function(){
    this.nodes = []
    this.links = []
    graph.update(this)
  },
  "nodes" : [{"id":1},{"id":2}],
  "links" : []
 }
var rect = $("#main")[0].getBoundingClientRect();

var height = rect.height
    width = rect.width;

color = d3.scaleOrdinal(d3.schemeCategory10)

drag = simulation => {

  function dragstarted(event, d) {
    if (!event.active) simulation.alphaTarget(0.3).restart();
    d.fx = d.x;
    d.fy = d.y;
  }

  function dragged(event,d) {
    d.fx = event.x;
    d.fy = event.y;
  }

  function dragended(event,d) {
    if (!event.active) simulation.alphaTarget(0);
    d.fx = null;
    d.fy = null;
  }

  return d3.drag()
      .on("start", dragstarted)
      .on("drag", dragged)
      .on("end", dragended);
}



const links = graphData.links.map(d => Object.create(d));
const nodes = graphData.nodes.map(d => Object.create(d));

const simulation = d3.forceSimulation(nodes)
    .force("link", d3.forceLink(links).id(d => d.id))
    .force("charge", d3.forceManyBody().strength(-30*10))
    .force('collision', d3.forceCollide().radius(25))
    .force("x", d3.forceX())
    .force("y", d3.forceY());

const svg = d3.select("#network")
    .attr("viewBox", [-width / 2, -height / 2, width, height]);

var link = svg.append("g")
  .attr("stroke", "#999")
  .attr("stroke-opacity", 0.6)
  .selectAll("line")
  .data(links)
  .join("line")
  .attr("stroke-width", d => Math.sqrt(d.value));

var node = svg.append("g")
  .attr("stroke", "#fff")
  .attr("stroke-width", 1.5)
  .selectAll("circle")
  .data(nodes)
  .join("circle")
  .attr("r", 20)
  .attr("fill", function(d) { return color(d.group); })
  .call(drag(simulation));

node.append("title")
    .text(d => d.id);

simulation.on("tick", () => {
  link
      .attr("x1", d => d.source.x)
      .attr("y1", d => d.source.y)
      .attr("x2", d => d.target.x)
      .attr("y2", d => d.target.y);

  node
      .attr("cx", d => d.x)
      .attr("cy", d => d.y);
});

graph = Object.assign(svg.node(), {
    update({nodes, links}) {

      // Make a shallow copy to protect against mutation, while
      // recycling old nodes to preserve position and velocity.
      const old = new Map(node.data().map(d => [d.id, d]));
      nodes = nodes.map(d => Object.assign(old.get(d.id) || {}, d));
      links = links.map(d => Object.assign({}, d));

      node = node
        .data(nodes, d => d.id)
        .join(enter => enter.append("circle")
          .attr("r", 20)
          .attr("fill", d => color(d.id)))
          .call(drag(simulation));

      link = link
        .data(links, d => [d.source, d.target])
        .join("line");

      simulation.nodes(nodes);
      simulation.force("link").links(links);
      simulation.alpha(1).restart();
    }
  });
