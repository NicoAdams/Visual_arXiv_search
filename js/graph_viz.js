var graphData =
{
  "addNode" :function (newNode){
    this.nodes.push(newNode)
    graph.update(this)
  },
  "addLink" :function (newLink){
      this.links.push(newLink)
      graph.update(this)
  },
  "clear" : function(){
    this.nodes = []
    this.links = []
    graph.update(this)
  },
  "nodes" : [],
  "links" : []
 }

var rect = $("#main")[0].getBoundingClientRect();

var height = rect.height
    width = rect.width;

color = d3.scaleOrdinal(d3.schemeCategory10)
radius = d => 4*Math.log(1.1+d.citationCount/100)
radius = d => d.citationCount/300+5

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

const linksData = graphData.links.map(d => Object.create(d));
const nodesData = graphData.nodes.map(d => Object.create(d));

const simulation = d3.forceSimulation(nodesData)
    .force("link", d3.forceLink(linksData).id(d => d.id))
    .force("charge", d3.forceManyBody().strength(d => -10+-15*radius(d)))
    .force('collision', d3.forceCollide().radius(d=> radius(d)))
    .force("x", d3.forceX())
    .force("y", d3.forceY());

const svg = d3.select("#network")
    .attr("viewBox", [-width / 2, -height / 2, width, height]);

var linkGroup = svg.append("g")
  .attr("class","linksGroup")
  .attr("stroke", "#666")
  .attr("stroke-opacity", 0.6)
  .selectAll("line")
  .data(linksData);

var nodeGroup = svg.append("g")
  .attr("class","nodesGroup")
  .selectAll("circle")
  .data(nodesData);

simulation.on("tick", () => {
  linkGroup
      .attr("x1", d => d.source.x)
      .attr("y1", d => d.source.y)
      .attr("x2", d => d.target.x)
      .attr("y2", d => d.target.y);

  nodeGroup.select("circle")
      .attr("cx", d => d.x)
      .attr("cy", d => d.y);

  nodeGroup.select("text")
      .attr("x", d => -radius(d)+d.x)
      .attr("y", d => d.y);
});

graph = Object.assign(svg.node(), {
    update({nodes, links}) {

      // Make a shallow copy to protect against mutation, while
      // recycling old nodes to preserve position and velocity.
      const old = new Map(nodeGroup.data().map(d => [d.id, d]));
      nodes = nodes.map(d => Object.assign(old.get(d.id) || {}, d));
      links = links.map(d => Object.assign({}, d));

      nodeGroup = nodeGroup
        .data(nodes, d => d.id)
        .join(function(enter){
          var nodeG =  enter.append("g").attr("class","node")
          nodeG.append("circle")
          .attr("r", radius)
          .attr("fill", d=> color(d.layer))

          nodeG.append("text")
          .text(d=> d.displayName)
          .attr("x",0)
          .attr("y",0)
          .attr("fill","#222");
          // .attr("stroke","#222")

          return(nodeG)
        })
        .call(drag(simulation));


      linkGroup = linkGroup
        .data(links, d => [d.source, d.target])
        .join("line");


      simulation.nodes(nodes);
      simulation.force("link").links(links);
      simulation.alpha(1).restart();
    }
  });
