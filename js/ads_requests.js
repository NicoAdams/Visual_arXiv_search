// Example: searchRequestFromString('"clumpy galaxies" candels year:2015')

const token = "dnp7EQ5y47A222l6fOc0XCbE3YCPrb6egKygc56I"

function assembleSearchURL(searchString, rows) {
  url = "https://api.adsabs.harvard.edu/v1/search/query?q="
  url += encodeURI(searchString)
  url += "&fl=title,author,bibcode,citation_count,year&rows="+rows
  return url
}

function searchRequestFromString(searchString, rows=20, success=(response)=>{}) {
  $.ajax({
    url: assembleSearchURL(searchString, rows),
    type: "GET",
    headers: {
        "Authorization":"Bearer "+token,
    },
    crossDomain: true,
    success: function (response) {
        success(respose)
    },
    error: function (xhr, status) {
        console.log("Could not complete search request. ", xhr, status);
    }
  })
}

function refsRequest(bibcode, success=()=>{}) {
  searchString = 'references('+bibcode+')'
  searchRequestFromString(searchString, rows=2000, success=success)
}


// var res = searchRequestFromString('"clumpy galaxies" candels year:2015')

// alert_when_read = function() {console.log(res["readyState"]);if (res["readyState"]==4) {console.log(res["responseJSON"]["response"]["docs"])}}
// window.setInterval(function(){console.log(res["readyState"])},2)
