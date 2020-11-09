var listData =
{
  "addNode" :function (newNode){
    this.nodes.push(newNode)
    update(this)
  },
  "addLink" :function (newLink){
      this.links.push(newLink)
      update(this)
  },
  "clear" : function(){
    this.nodes = []
    this.links = []
    update(this)
  },
  "nodes" : [],
  "links" : [],

 }

function update(data){
  $("#results").empty();
  $("#background").empty();

  data.nodes.sort(function(a, b){return rank(b)-rank(a)});
  for (var i = 0; i < data.nodes.length; i++) {
    node = data.nodes[i]
    if (node.layer==0) {
      $("#results").append('<li>'+node.title+' '+rank(node)+'</li>');
    }
  }
  for (var i = 0; i < Math.min(25,data.nodes.length); i++) {
    node = data.nodes[i]
    if (node.layer==1) {
      $("#background").append('<li>'+node.title+' '+rank(node)+'</li>');
    }
  }


  }




function rank(d) {
  var connections = listData.links.filter(l =>   l.target  == d.id );
  return(connections.length)
}
