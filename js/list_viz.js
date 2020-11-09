var listData =
{
  "addNode" :function (newNode){
    this.nodes.push(newNode)
    update(newNode)
  },
  "addLink" :function (newLink){
      this.links.push(newLink)
      // update(this)
  },
  "clear" : function(){
    this.nodes = []
    this.links = []
    $("#results").empty();
  },
  "nodes" : [],
  "links" : [],

 }

function update(newNode){
  console.log(newNode)
  if (newNode.layer==0) {
    $("#results").append('<li>'+newNode.title+'</li>');
  }

}
