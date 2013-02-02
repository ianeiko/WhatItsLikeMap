function(head, req) {
  var row;
  start({
  	"headers": {
  		"Content-Type": "application/json"
  	}
  });
  
  features = []
  while (row = getRow()) {
  	features.push(row);
  }

  geojson_doc = {
  	"type": "FeatureCollection",
  	"features": features
  }

  send(JSON.stringify(geojson_doc));
}