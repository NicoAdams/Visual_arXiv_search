// This file makes requests using the ADS API, then processes the results into
// a network structure to be processed by the network generation functions

getPaperDisplayName = paper => paper['author'][0]+' '+paper['year']
getFullName = paper => paper["title"][0]+ ' \n '+paper['author'].join(', ');

function makeNode(paper, layer) {
  return {
    'id': paper['bibcode'],
    'title':paper["title"][0],
    'authors':paper['author'].join(', '),
    'firstAuthor':paper["author"][0],
    'year': paper['year'],
    'displayName': getPaperDisplayName(paper),
    'citationCount': paper['citation_count'],
    'layer': layer,
    'radius': 15
  }
}

function buildGraphData(searchString) {
  bibcodeNodes = {} // A node needs an "id" and a "displayName"
  bibcodeEdges = [] // An edge needs a "source" and a "target"

  // First step: Initial search
  searchRequestFromString(searchString, rows=5, success=(responseInit)=>{
    // console.log(responseInit)
    dataInit = responseInit['response']['docs']


    // Adds nodes for the central group
    dataInit.forEach(paper => {
      nodeCurr = makeNode(paper, 0)
      bibcodeNodes[paper['bibcode']] = nodeCurr
      listData.addNode(nodeCurr)
    })

    // Adds nodes and edges for references
    dataInit.forEach(paperSource => {
      var bibcodeSource = paperSource['bibcode']
      refsRequest(bibcodeSource, success=(responseRefs)=>{
        dataRefs = responseRefs['response']['docs']
        // console.log(dataRefs)
        // dataRefs = dataRefs.filter(function(element){ return element["citation_count"] > 50; })
        dataRefs.forEach((paperRef)=>{
           bibcodeRef = paperRef['bibcode']
          // console.log(bibcodeNodes)
          if(!(bibcodeRef in bibcodeNodes)) {
            nodeRef = makeNode(paperRef, 1)
            bibcodeNodes[paperRef['bibcode']] = nodeRef
            listData.addNode(nodeRef)
          }
          edgeRef = {
            'source': bibcodeSource,
            'target': bibcodeRef,
            'value': 1
          }
          bibcodeEdges.push(edgeRef)
          listData.addLink(edgeRef)
        })
      })
    })
  })
}
