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