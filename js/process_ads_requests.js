// This file makes requests using the ADS API, then processes the results into
// a network structure to be processed by the network generation functions

function getPaperDisplayName(paper) {
  return paper['title'][0]+' '+paper['year']+' ('+paper['bibcode']+')'
}

function buildNetworkData(searchString) {
  bibcodeNodes = [] // A node needs an "id", a "displayName", a "group" and a "radius"
  bibcodeEdges = [] // An edge needs a "source", a "target" and a "value"

  // First step: Initial search

  responseInit = searchRequestFromString(searchString)
  dataInit = response['responseJSON']['response']['docs']

  dataInit.forEach(paper => {
    node = {
      'id': paper['bibcode'],
      'name': getPaperDisplayName(paper),
      'group': 1,
      'radius': 15
    }
  })



}
