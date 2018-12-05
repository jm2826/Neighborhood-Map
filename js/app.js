function ViewModel() {

        // var wikiUrl = "http://en.wikipedia.org/w/api.php?action=opensearch=' +locations[i].title+ '&format=json&callback=wikiCallback";

        // .ajax({
        //         url: wikiUrl,
        //         dataType: "jsonp",
        //         //jsonp: "callback"
        // })
        // Defining self for the this passed in the ko.computed function
        //var self = this;

        markers = ko.observableArray([]);        
        // Chicago Map Loaded initally
        var map = new google.maps.Map(document.getElementById('map'), {
                center: {lat: 41.8781, lng: -87.6298},
                zoom: 13,
                mapTypeControl: false
        });
        // Array of 5 locations for markers
        locations = ko.observableArray([
                {title: 'Millenium Park', location: {lat: 41.8826, lng: -87.6226}},
                {title: 'Navy Pier', location: {lat: 41.8917, lng: -87.6086}},
                {title: 'AT&T Corporate Building', location: {lat: 41.8841369, lng: -87.6350657}},
                {title: 'Solider Field', location: {lat: 41.8623, lng: -87.6167}},
                {title: 'Chicago Theater', location: {lat: 41.8854, lng: -87.6275}},
        ]);

        largeInfowindow = new google.maps.InfoWindow();

        // Listings that are outside the initiale zoom areas. This fits everything we want user to see.
        bounds = new google.maps.LatLngBounds();
       
        for (var i = 0; i < locations().length; i++) {
            // Get the position from the location array.
            var position = locations()[i].location;
            var title = locations()[i].title;
            // Create a marker per location, and put into markers array.
            var marker = new google.maps.Marker({
                map: map,
                position: position,
                title: title,
                animation: google.maps.Animation.DROP,
                id: i
            });
            // Push the marker to our array of global markers.
            markers.push(marker);
            //location.push(locations);

            // Extend boundaries of the map for each marker
            bounds.extend(marker.position);
            // Create an onclick event to open an infowindow at each marker.
            marker.addListener('click', function() {
                populateInfoWindow(this, largeInfowindow);
            });
        }

         // Tell map to fit itself to the boundaries set
        map.fitBounds(bounds);

        // This function populates the infowindow when the marker is clicked. We'll only allow
        // one infowindow which will open at the marker that is clicked, and populate based
        // on that markers position.
        function populateInfoWindow(marker, infowindow) {
                // Check to make sure the infowindow is not already opened on this marker.
                if (infowindow.marker != marker) {
                        infowindow.marker = marker;
                        infowindow.setContent('<div>' + marker.title + '<br/></div>');
                        infowindow.open(map, marker);
                        //Make sure the marker property is cleared if the infowindow is closed.
                        infowindow.addListener('closeclick',function() {
                                infowindow.marker(null);
                         });

                }
        }

        // This function will loop through the markers array and display them all.
        showLocations = function () {
                for (var i = 0; i < markers.length; i++) {
                markers[i].setMap(map);
                bounds.extend(markers[i].position);
                }
        map.fitBounds(bounds);
        };

        // This function will loop through the locations and hide them all.
        hideLocations = function () {
                for (var i = 0; i < markers.length; i++) {
                  this.markers[i].setMap(null);
                }
        };

        selectedLoc = ko.observableArray([]);
        hideMarkers = function() {
                if (selectedLoc = marker.title) {
                        showLocations();
                }  else {
                       hideLocations(); 
                }    
        }

// ViewModel Closing
}

// Allow data binds in View(indexko.html) to connect with our viewmodel(app.js)
function initMap() {
        ko.applyBindings(new ViewModel())
}