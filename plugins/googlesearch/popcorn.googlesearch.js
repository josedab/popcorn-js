
// PLUGIN: Google Search
var googleSearchCallback;
(function ( Popcorn ) {

  var i = 1,
    _gsearchFired = false,
    _gsearchLoaded = false,
    gsearch, loadGsearch;
  //google api callback
  googleSearchCallback = function ( data ) {
    // ensure all of the search functions needed are loaded
    // before setting _gsearchLoaded to true
    if ( typeof google !== "undefined" && 
        google.search && 
        google.search.SearchControl && google.search.WebSearch &&
        google.search.ImageSearch && google.search.VideoSearch &&
        google.search.NewsSearch && google.search.BlogSearch &&
        google.search.PatentSearch && google.search.LocalSearch) {
        
      gsearch = new google.search.SearchControl();
        _gsearchLoaded = true;
    } else {
      setTimeout(function () {
        googleSearchCallback( data );
      }, 1);
    }
  };
  
  googleLoaderCallback = function ( data ) {
    if( typeof google !== "undefined") {
        google.load('search', '1', {"callback" : googleSearchCallback});
    }
  };
  
  // function that loads the google api
  loadGsearch = function () {
    if ( document.body ) {
    // The search is loaded once the document has been created and also the body element...
    // Probably, this can be changed to be loaded once the popcorn instance is instantiated (even before creating the document...)
    // TODO
      _gsearchFired = true;
      Popcorn.getScript( "http://www.google.com/jsapi?key=AIzaSyA5m1Nc8ws2BbmPRwKu5gFradvD_hgq6G0&callback=googleLoaderCallback" );
    } else {
      setTimeout(function () {
        loadGsearch();
      }, 1);
    }
  };
  
  function addGsearchType(searchController, type) {
    switch (type) {
    case "web":
        searchController.addSearcher(new google.search.WebSearch());
        break;
    case "images":
        searchController.addSearcher(new google.search.ImageSearch());
        break;
    case "video":
        searchController.addSearcher(new google.search.VideoSearch());
        break;
    case "news":
        searchController.addSearcher(new google.search.NewsSearch());
        break;
    case "blogs":
        searchController.addSearcher(new google.search.BlogSearch());
        break;
    case "patents":
        searchController.addSearcher(new google.search.PatentSearch());
        break;
    case "local":
        searchController.addSearcher(new google.search.LocalSearch());
        break;
    }
  }

  function buildGsearch( searchController, options, elemDiv ) {
    
    var types = options.searchtypes;
    
    // Set the result size of the search
    searchController.setResultSetSize( options.results );
    
    // Creates the searches for the types of information specified in the searchtypes array
    for (var i = 0; i < types.length; i++){
        addGsearchType(searchController, types[i]);
    }
    
    // draw in tabbed layout mode
    var drawOptions = new google.search.DrawOptions();
    drawOptions.setDrawMode(google.search.SearchControl.DRAW_MODE_TABBED);

    // Draw the tabbed view in the content div
    // searchController.draw(document.getElementById(elemDiv), drawOptions);
    searchController.draw(document.getElementById(options.target), drawOptions);

    // Perform the search
    searchController.execute(options.term);
    
  }

  /**
   * Googlesearch popcorn plug-in
   * Adds a google search related to a term to the target div specified by the user.
   * As the google search api provides different search types, we support this option through the searchtypes option. 
   * If this parameter is not specified, the search is done only for the web, images and blogs.
   * 
   * @param {Object} options
   *
   * Example:
   *    var p = Popcorn("#video")
   *    .googlesearch({
   *        start: 5, // seconds
   *        end: 15, // seconds
   *        term: "surf",
   *        target: "g-search-container",
   *        searchTypes: ["web", "blogs", "news"]
   *    } )
   *
   */
  Popcorn.plugin( "googlesearch", function ( options ) {
    var newdiv, map, location,
        target = document.getElementById( options.target );

    options.searchtypes = options.searchtypes || ["web"];
    options.results = options.results || 3;
    options.term = options.term || "utiltube";

    // if this is the firest time running the plugins
    // call the function that gets the sctipt
    if ( !_gsearchFired ) {
      loadGsearch();
    }

    // create a new div this way anything in the target div is left intact
    // this is later passed on to the maps api
    newdiv = document.createElement( "div" );
    newdiv.id = "actualsearch" + i;
    newdiv.style.width = options.width || "100%";

    // height is a little more complicated than width.
    if ( options.height ) {
      newdiv.style.height = options.height;
    } else if ( target && target.clientHeight ) {
      newdiv.style.height = target.clientHeight + "px";
    } else {
      newdiv.style.height = "100%";
    }

    i++;

    // ensure the target container the user chose exists
    if ( !target && Popcorn.plugin.debug ) {
      throw new Error( "target container doesn't exist" );
    }
    target && target.appendChild( newdiv );

    // ensure that google search and its functions are loaded
    // before setting up the map parameters
    var isGsearchReady = function () {
      if ( _gsearchLoaded ) {
          
          buildGsearch( gsearch, options, newdiv );
        
      } else {
          setTimeout(function () {
            isGsearchReady();
          }, 5);
        }
      };

    isGsearchReady();

    return {
      /**
       * @member webpage
       * The start function will be executed when the currentTime
       * of the video reaches the start time provided by the
       * options variable
       */
      start: function( event, options ) {
        var that = this,
            sView;

      },
      /**
       * @member webpage
       * The end function will be executed when the currentTime
       * of the video reaches the end time provided by the
       * options variable
       */
      end: function ( event, options ) {
        // if the map exists hide it do not delete the map just in
        // case the user seeks back to time b/w start and end
        if ( map ) {
          gsearch.getDiv().style.display = "none";
        }
      },
      _teardown: function ( options ) {

        var target = document.getElementById( options.target );

        // the search must be manually removed
        target && target.removeChild( newdiv );
        newdiv = gsearch = null;
      }
    };
  }, {
    about: {
      name: "Popcorn Google Search Plugin",
      version: "0.1",
      author: "@josedab",
      website: "josedab.com"
    },
    options: {
      start: {
        elem: "input",
        type: "text",
        label: "In"
      },
      end: {
        elem: "input",
        type: "text",
        label: "Out"
      },
      target: "gsearch-container",
      type: {
        elem: "select",
        options: [ "web", "images", "video", "news", "blogs", "patents", "local" ],
        label: "Type",
        optional: true
      },
      term: {
        elem: "input",
        type: "text",
        label: "Search string",
        optional: false
      }
    }
  });
})( Popcorn );


