// Example: searchRequestFromString('"clumpy galaxies" candels year:2015')

const token = "dnp7EQ5y47A222l6fOc0XCbE3YCPrb6egKygc56I"

function assembleSearchURL(searchString, rows) {
  url = "https://api.adsabs.harvard.edu/v1/search/query?q="
  url += encodeURI(searchString)
  url += "&fl=title,bibcode,citation_count,year&rows="+rows
  return url
}

function searchRequestFromString(searchString, rows=20) {
  result = $.ajax({
    url: assembleSearchURL(searchString, rows),
    type: "GET",
    headers: {
        "Authorization":"Bearer "+token,
    },
    crossDomain: true,
    success: function (response) {
        var resp = response
    },
    error: function (xhr, status) {
        console.log("Could not complete search request. ", xhr, status);
    }
  })
  return result
}

function refsRequest(bibcode) {
  searchString = 'references('+bibcode+')'
  rows = 2000
  return searchRequestFromString(searchString, rows)
}

function searchRequest(fields) {
  searchString = ""
  for(var key in fields) {
    if(key == 'searchstr') {
      searchString += fields[key] + " "
    } else {
      searchString += key + ":" + obj[key] + " "
    }
    return searchRequestFromString(searchString)
  }
}



// var res = searchRequestFromString('"clumpy galaxies" candels year:2015')

// alert_when_read = function() {console.log(res["readyState"]);if (res["readyState"]==4) {console.log(res["responseJSON"]["response"]["docs"])}}
// window.setInterval(function(){console.log(res["readyState"])},2)
