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

  data.nodes.sort(function(a, b){return b.citationCount-a.citationCount});
  for (var i = 0; i < data.nodes.length; i++) {
    node = data.nodes[i]
    if (node.layer==0) {
      url = "https://ui.adsabs.harvard.edu/abs/"+node.id+"/abstract"
      $("#results").append('<li>'+node.displayName+': '+'<a href = '+url+'>'+node.title+ '</a> ('+rank(node)+" "+node.citationCount+')</li>');
    }
  }
  data.nodes.sort(function(a, b){return rank(b)-rank(a)});
  for (var i = 0; i < Math.min(25,data.nodes.length); i++) {
    node = data.nodes[i]
    if (node.layer==1) {
      url = "https://ui.adsabs.harvard.edu/abs/"+node.id+"/abstract"
      $("#background").append('<li>'+node.displayName+'. '+'<a href = '+url+'>'+node.title+ '</a> ('+rank(node)+" "+node.citationCount+')</li>');
    }
  }


  }




function rank(d) {
  var connections = listData.links.filter(l =>   l.target  == d.id );
  return(connections.length)
}
