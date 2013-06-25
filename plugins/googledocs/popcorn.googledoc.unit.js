asyncTest( "Popcorn Google Docs Plugin", function() {

  var popped = Popcorn( "#video" ),
      expects = 9,
      count = 0,
      setupId,
      googledocdiv = document.getElementById( "googledocdiv" ),
      sources = [
        "dEx5YXNJczBhYXRzSUJIU0NuS1NzUWc6MQ", // form
        "1t8M4vzoy9pdjoiJ0Dq8CVgBRQ2lGBIWz6UJL_k9bVpM", // document
        "0AjOfr6eosPR_dDJpZHMwdGxqMHBCaU1oeGdsNVBKenc", // spreadsheet
        "1OZ_38UKI3IVwGqZJu2mMgpSHjsMmy6mcAx03Z3Y7KqY", // presentation
        "1pwj9ixd8eMdVt9byzcosMANL60HCo-xytopABFXtrFU" // drawing
      ];

  expect( expects );

  function plus() {
    if ( ++count === expects ) {
      popped.destroy();
      start();
    }
  }

  ok( "googledoc" in popped, "googledoc is a method of the popped instance" );
  plus();

  equal( googledocdiv.innerHTML, "", "initially, there is nothing inside the googledocdiv" );
  plus();
  
  var target = "googledocdiv";
  

  popped.googledoc({
                start : 1,
                end : 5,
                id : sources[0],
                type : "form",
                target : target,
                width : 480,
                height : 389
        })
        // Document
        .googledoc({
            start : 2,
            end : 10,
            id : sources[1],
            type : "document",
            target : target,
            width : 480,
            height : 389
        })
        // Spreadsheet
        .googledoc({
            start : 3,
            end : 8,
            id : sources[2],
            type : "spreadsheet",
            target : target,
            width : 500,
            height : 300
        })
        // Presentation
        .googledoc({
            start : 7,
            end : 13,
            id : sources[3],
            type : "presentation",
            target : target,
            width : 480,
            height : 389
        })
        // Drawing
        .googledoc({
            start : 8,
            end : 15,
            id : sources[4],
            type : "drawing",
            target : target,
            width : 480,
            height : 389
        });
  

  setupId = popped.getLastTrackEventId();

  popped.cue( 2, function() {
	equal( googledocdiv.childElementCount, 5, "googledocdiv now has five inner elements" );
    plus();
    equal( googledocdiv.children[ 0 ].style.display , "inline", "googledocdiv is visible on the page" );
    plus();
  });

  popped.exec( 3, function() {
    equal( googledocdiv.children[ 0 ].style.display , "inline", "form is still visible on the page" );
    plus();
    equal( googledocdiv.children[ 1 ].style.display , "inline", "document is visible on the page" );
    plus();
    equal( googledocdiv.children[ 2 ].style.display , "inline", "spreadsheet is visible on the page" );
    plus();
    equal( googledocdiv.children[ 3 ].style.display , "none", "presentation is not visible on the page" );
    plus();
    equal( googledocdiv.children[ 4 ].style.display , "none", "drawing is not visible on the page" );
    plus();
  });

  popped.exec( 5, function() {
    equal( googledocdiv.children[ 0 ].style.display , "inline", "form is still visible on the page" );
    plus();
    equal( googledocdiv.children[ 1 ].style.display , "inline", "document is visible on the page" );
    plus();
    equal( googledocdiv.children[ 2 ].style.display , "inline", "spreadsheet is visible on the page" );
    plus();
    equal( googledocdiv.children[ 3 ].style.display , "none", "presentation is not visible on the page" );
    plus();
    equal( googledocdiv.children[ 4 ].style.display , "none", "drawing is not visible on the page" );
    plus();
  });

  // TODO: it would be useful to test when an unknown type is passed to the googledoc method

  popped.volume( 0 ).play();
});

