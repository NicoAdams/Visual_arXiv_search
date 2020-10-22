search_bar = d3.select("#search")["_groups"][0][0]
var res
function myfunc(){
  res = searchRequestFromString(search_bar.value);
  setTimeout(
    function(){
      console.log(res["responseJSON"]["response"]["docs"])
    },1000
  )
}
