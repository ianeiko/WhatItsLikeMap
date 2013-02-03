function(doc) {
  var feature_collection = {
  	'type': 'FeatureCollection',
  	'features': []
  }

  for (var i in doc.coordinates) {
  	var coordinates = doc.coordinates[i];
  	var feature = {
  		'type': 'Feature',
  		'id': i,
  		'properties': {
  			'name': doc._id
  		},
  		'geometry': {
  			'type': 'Polygon',
  			'coordinates': [[coordinates]]
  		}
  	}

  	feature_collection['features'].push(feature);
  }

  emit(doc._id, feature_collection);
}