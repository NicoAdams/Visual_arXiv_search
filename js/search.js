search_bar = d3.select("#search")["_groups"][0][0]
var res
function myfunc(){
  listData.clear(); buildGraphData(search_bar.value)
}
