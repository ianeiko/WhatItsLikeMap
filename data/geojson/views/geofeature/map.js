function(doc) {
  emit(doc._id, {
  	"type": "feature",
  	"id": doc._id,
  	"properties":{
  		"iso_a3": doc._id,
  		"precipitation": doc.pr,
  		"temperature": doc.tas
  	}
  });
}