var MAP,
    venueTypeChecked,
    venueDogFriendlyChecked;

$(document).ready(function() {

  // Initialize & Create the google map on DOM element ID 'map-canvas'.
  MAP = Mapster.create('map-canvas', {
    center: {
      lat: -37.818667,
      lng: 144.971466
    },
    cluster: true
  });

  // Hook the Google Place Auto-Complete utility on input with ID 'txtPlaces'.
  MAP.setPlaces('txtPlaces', {
    events: [{
      name: 'place_changed',
      callback: function(e, places){
        var place = places.getPlace();

        MAP.panTo({
          lat: place.geometry.location.G,
          lng: place.geometry.location.K
        });
      }
    }],
    places: {
      types: ['(regions)'],
      componentRestrictions: {country: "au"}
    }
  });

  // Using HTML5 navigator to get geolocation if the feature is available and then pan the map to the location.
  MAP.getCurrentPosition( function(position) {
    MAP.panTo({
      lat: position.coords.latitude,
      lng: position.coords.longitude
    });
  });

  seedData();

  MAP.visibleMarkersCount('total-result');

})

// searchBox and autocomplete
function initAutocomplete() {
  var map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: -33.8688, lng: 151.2195},
    zoom: 13,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  });

  // Create the search box and link it to the UI element.
  var input = document.getElementById('pac-input');
  var searchBox = new google.maps.places.SearchBox(input);
  map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

  // Bias the SearchBox results towards current map's viewport.
  map.addListener('bounds_changed', function() {
    searchBox.setBounds(map.getBounds());
  });

  var markers = [];
  // Listen for the event fired when the user selects a prediction and retrieve
  // more details for that place.
  searchBox.addListener('places_changed', function() {
    var places = searchBox.getPlaces();

    if (places.length == 0) {
      return;
    }

    // Clear out the old markers.
    markers.forEach(function(marker) {
      marker.setMap(null);
    });
    markers = [];

    // For each place, get the icon, name and location.
    var bounds = new google.maps.LatLngBounds();
    places.forEach(function(place) {
      var icon = {
        url: place.icon,
        size: new google.maps.Size(71, 71),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(17, 34),
        scaledSize: new google.maps.Size(25, 25)
      };

      // Create a marker for each place.
      markers.push(new google.maps.Marker({
        map: map,
        icon: icon,
        title: place.name,
        position: place.geometry.location
      }));

      if (place.geometry.viewport) {
        // Only geocodes have viewport.
        bounds.union(place.geometry.viewport);
      } else {
        bounds.extend(place.geometry.location);
      }
    });
    map.fitBounds(bounds);
  });
}

// seed data
function seedData() {
  for (var i = 0; i < 40; i++) {
    MAP.addMarker({
      lat: -37.818667 + Math.random()/50,
      lng: 144.971466 + Math.random()/50,
      animation: google.maps.Animation.DROP,
      content: 'I like my girl',
      venue_type: 'romantic', // Custom attributes.
      venue_dog_friendly: 'yes'
    });
    
    MAP.addMarker({
      lat: -37.818667 + Math.random()/50,
      lng: 144.971466 + Math.random()/50,
      animation: google.maps.Animation.DROP,
      content: 'You cant get any more awesome than this',
      venue_type: 'awesome',
      venue_dog_friendly: 'yes'
    }); 
  } 

  for (var i = 0; i < 20; i++) {
    MAP.addMarker({
      lat: -37.818667 + Math.random()/50,
      lng: 144.971466 + Math.random()/50,
      animation: google.maps.Animation.DROP,
      content: 'I like my girl',
      venue_type: 'romantic',
      venue_dog_friendly: 'no'
    });
    
    MAP.addMarker({
      lat: -37.818667 + Math.random()/50,
      lng: 144.971466 + Math.random()/50,
      animation: google.maps.Animation.DROP,
      content: 'You cant get any more awesome than this',
      venue_type: 'awesome',
      venue_dog_friendly: 'no'
    }); 
  }

  for (var i = 0; i < 10; i++) {
    MAP.addMarker({
      lat: -37.818667 + Math.random()/50,
      lng: 144.971466 + Math.random()/50,
      animation: google.maps.Animation.DROP,
      content: 'This place sucks',
      venue_type: 'boring',
      venue_dog_friendly: 'no'
    });
  }
};

// evaluate the OR condition across a name category
function evaluateCondition(base, collection) {
  var result = false;
  $.each(collection, function() {
    result = result || (base === $(this).val());
  });
  return result;
}

// add on 'Change' event handler on the input checkbox
$('input[type="checkbox"]').on('change', function() {
  venueTypeChecked = $('input[name="venue_type"]:checked');
  venueDogFriendlyChecked = $('input[name="venue_dog_friendly"]:checked');
       
  MAP.findBy(function(marker) {
    var totalCond = evaluateCondition(marker.venue_type, venueTypeChecked) &&
                    evaluateCondition(marker.venue_dog_friendly, venueDogFriendlyChecked);
        
    marker.setVisible(totalCond);
  });

  MAP.markerClusterer.repaint();

  MAP.visibleMarkersCount('total-result');

});
