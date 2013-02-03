(function( document ) {
  var name = 'lite', // YOUR LIBRARY'S FULL NAME.
      global = this,
      old$ = global.$,
      oldN = global[name];

  // YOUR LIBRARY'S FUNCTION. BE CREATIVE, OR NOT, NOBODY CARES ANYWAYS.
  function $( selector ) {
    // <ajpiano> "document.querySelectorAll() is super fast, but not to TYPE"
    return document.querySelectorAll.call(document, selector);
  };

  // Create a global reference to our library.
  global.$ = global[name] = $;

  // Calling .noConflict will restore the global $ to its previous value.
  // Passing true will do that AND restore the full global name as well.
  // Returns a reference to your library's function.
  $.noConflict = function( all ) {
    if ( all ) {
      global[name] = oldN;
    }
    global.$ = old$;
    return $;
  };

})(document);

function d3layer() {
  var f = {}, bounds, feature, collection;
  var div = d3.select(document.body)
      .append("div")
      .attr('class', 'd3-vec'),
      svg = div.append('svg'),
      g = svg.append("g");

  f.parent = div.node();

  f.project = function(x) {
    var point = f.map.locationPoint({ lat: x[1], lon: x[0] });
    return [point.x, point.y];
  };

  var first = true;
  f.draw = function() {
    first && svg.attr("width", f.map.dimensions.x)
        .attr("height", f.map.dimensions.y)
        .style("margin-left", "0px")
        .style("margin-top", "0px") && (first = false);

    path = d3.geo.path().projection(f.project);
    feature.attr("d", path);
  };

  f.data = function(x) {
      collection = x;
      bounds = d3.geo.bounds(collection);
      feature = g.selectAll("path")
          .data(collection.features)
          .enter().append("path");
      return f;
  };

  f.extent = function() {
      return new MM.Extent(
          new MM.Location(bounds[0][1], bounds[0][0]),
          new MM.Location(bounds[1][1], bounds[1][0]));
  };
  return f;
}
var new_jersey = {"type":"FeatureCollection","features":[
{"type":"Feature","id":"34","properties":{"name":"New Jersey"},"geometry":{"type":"Polygon","coordinates":[[[-74.236547,41.14083],[-73.902454,40.998429],[-74.022947,40.708151],[-74.187255,40.642428],[-74.274886,40.489074],[-74.001039,40.412397],[-73.979131,40.297381],[-74.099624,39.760641],[-74.411809,39.360824],[-74.614456,39.245808],[-74.795195,38.993869],[-74.888303,39.158177],[-75.178581,39.240331],[-75.534582,39.459409],[-75.55649,39.607286],[-75.561967,39.629194],[-75.507197,39.683964],[-75.414089,39.804456],[-75.145719,39.88661],[-75.129289,39.963288],[-74.82258,40.127596],[-74.773287,40.215227],[-75.058088,40.417874],[-75.069042,40.543843],[-75.195012,40.576705],[-75.205966,40.691721],[-75.052611,40.866983],[-75.134765,40.971045],[-74.882826,41.179168],[-74.828057,41.288707],[-74.69661,41.359907],[-74.236547,41.14083]]]}},
]};

mapbox.load('jneiku.WhatItsLike', function(o){
var map = mapbox.map('map')
map.addLayer(o.layer);
map.interaction.auto();

l = d3layer().data(new_jersey);
map.addLayer(l);
map.extent(l.extent());

map.zoom(6);

// map.interaction.on({
//     on: function(o) {
//         if (o.e.type === 'mousemove') {
          
//         }
//     }
// });
});