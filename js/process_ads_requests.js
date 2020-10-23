// This file makes requests using the ADS API, then processes the results into
// a network structure to be processed by the network generation functions

function getPaperDisplayName(paper) {
  return paper['author'][0]+'+'+paper['year']+' ('+paper['bibcode']+')'
}

function makeNode(paper, layer) {
  return {
    'id': paper['bibcode'],
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
  searchRequestFromString(searchString, rows=20, success=(responseInit)=>{
    console.log(responseInit)
    dataInit = responseInit['response']['docs']

    // Adds nodes for the central group
    dataInit.forEach(paper => {
      node = makeNode(paper, 0)
      bibcodeNodes[paper['bibcode']] = node
      graphData.addNode(node)
    })

    // Adds nodes and edges for references
    dataInit.forEach(paperSource => {
      bibcodeSource = paperSource['bibcode']
      refsRequest(bibcodeSource, success=(responseRefs)=>{
        dataRefs = responseRefs['responseJSON']['response']['docs']
        dataRefs.forEach((paperRef)=>{
          bibcodeRef = paperRef['bibcode']
          if(!(bibcodeRef in bibcodeNodes.values)) {
            node = makeNode(paperRef, 1)
            bibcodeNodes[paper['bibcode']] = node
            graphData.addNode(node)
          }
          edge = {
            'source': bibcodeSource,
            'ref': bibcodeRef,
            'value': 1
          }
          bibcodeEdges.push(edge)
          graphData.addEdge(edge)
        })
      })
    })
  })
}
