function(head, req) {
  var row;
  start({
  	"headers": {
  		"Content-Type": "application/json"
  	}
  });

  shapes = {};
  while (row = getRow()) {
  	shapes[row.key] = row.value;
  }

  send(JSON.stringify(shapes));
}