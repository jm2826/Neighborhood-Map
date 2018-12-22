//base data, think of this as a database store
//which has all the locations data
var locations = [{
  title: 'Millenium Park',
  location: {
    lat: 41.8826,
    lng: -87.6226
    },
  category: 'Sightseeing'
  }, {
  title: 'Navy Pier',
  location: {
    lat: 41.8917,
	lng: -87.6086
  },
  category: 'Entertainment'
  }, {
  title: 'United Center',
  location: {
	lat: 41.8749965,
	lng: -87.67116
  },
  category: 'NBA Arena'
  }, {
  title: 'Solider Field',
  location: {
    lat: 41.8623,
	lng: -87.6167
  },
  category: 'NFL Stadium'
  }, {
  title: 'Chicago Theater',
  location: {
    lat: 41.8854,
	lng: -87.6275
  },
  category: 'Arts'
}];

var markers = [];

function LocationViewModel() {

  var self = this;

  // import starting data from your data store and put it in your vm
  self.locations = locations;
  self.markers = markers;

  // Chicago Map Loaded initally
  var map = new google.maps.Map(document.getElementById('map'), {
    center: {
      lat: 41.8781,
	  lng: -87.6298
	},
	zoom: 13,
	mapTypeControl: false
  });

  largeInfowindow = new google.maps.InfoWindow();

  // Listings that are outside the initiale zoom areas. This fits everything we want user to see.
  var bounds = new google.maps.LatLngBounds();

  for (var i = 0; i < locations.length; i++) {
    var position = locations[i].location;
	var title = locations[i].title;
	var category = locations[i].category;


	// Create a marker per location, and put into markers array.
	var marker = new google.maps.Marker({
	  map: map,
	  position: position,
	  title: title,
      category: category,
      animation: google.maps.Animation.DROP,
	  id: i,
	});

	// Push the marker to our array of global markers.
	markers.push(marker);

	// Extend boundaries of the map for each marker
	bounds.extend(marker.position);
	// Create an onclick event to open an infowindow at each marker.

	marker.addListener('click', function() {
	  populateInfoWindow(this, largeInfowindow);
	});

	this.toggleBounce = function() {
		markers.forEach (function (marker) {
	  if (marker.getAnimation() !== null) {
	    marker.setAnimation(null);
	  } else {
	    marker.setAnimation(google.maps.Animation.BOUNCE);
	  }
	})
}

	// Tell map to fit itself to the boundaries set
	map.fitBounds(bounds);

	// This function populates the infowindow when the marker is clicked. We'll only allow
	// one infowindow which will open at the marker that is clicked, and populate based
	// on that markers position.
	function populateInfoWindow(marker, infowindow) {
	  var wikiAPI = 'http://en.wikipedia.org/w/api.php?action=opensearch&search=' + marker.title + '&generator=allpages&gaplimit=max&prop=redirects&format=json&callback=wikiCallback';

	    $.ajax({
	      url: wikiAPI,
	      dataType: "jsonp",
	      success: function(response) {
	        var articleList = response[3];

	          for (var i = 0; i < articleList.length; i++) {
	            var articleStr = articleList[i];
	              console.log(articleStr);

	              if (infowindow.marker != marker) {
	                infowindow.marker = marker;
	                infowindow.setContent('<a href="' + articleStr + '" target= "_blank">' + marker.title + '</a>');
	                infowindow.open(map, marker);
	                 //Make sure the marker property is cleared if the infowindow is closed.
	                infowindow.addListener('closeclick', function() {
	                  infowindow.marker = null;
					});
                  }                 
              }
            },
            error: function() {
              alert("wikpedia resource failed to load !!!!!!!!");
            }
        });
    }
  }

  // import dropdown options
  self.dropdownOptions = ko.observableArray(['All']); //this is required to reset the selected filter
  self.locations.forEach(function(item) {
    self.dropdownOptions.push(item.category);
  });

  // currently selected category i.e default option
  self.selectedOption = ko.observable("All");

  // set up filtered list of locations using computed observables
  // this value gets updated if any of the observable its listening to changes
 // eg., selectedOption
  self.filteredLocations = ko.computed(function() {
    var categories = self.selectedOption();

	if (categories === "All") {
	  markers.forEach(function(marker) {
	  marker.setVisible(true);
	});
	  return self.locations;
	} else {
	  // Loop through each marker and set visibility true if it matches selected option
	  // or update visibility to false if it dosn't match selected option                               
	  markers.forEach(function(marker) {
	    if (marker.category === categories) {
	      marker.setVisible(true);
		} else {
	        marker.setVisible(false);
          }
	  });
      // Return the filterd locations
	  return self.locations.filter(function(location) {
	  return location.category === categories;
	  });
	}
  });
// LocationViewModel Closing
}

// Allow data binds in View(indexko.html) to connect with our viewmodel(app.js)
function initMap() {
	ko.applyBindings(new LocationViewModel());
}