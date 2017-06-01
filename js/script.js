//gloabl variables
var map;
var markers = [];
var client_id = 'QMJC2UXA51GWWTUQ2OA0KGBMV125UBDCS1QEGHI0PPJ23CXG';
var client_secret = 'M534W1PKYXZZVKOWQIWE4ZV5XDGNN5XYRIK3LQB0YOYOTTKJ';
// the model containing hard-coded data on the locations used, the rest of the data on these locations is pulled from the 
// Foursquare API.
var initialBars = [{
    title: 'Berry Park',
    location: {
      lat: 40.7224718,
      lng: -73.9552525
    },
    venueId: '4a8e031cf964a520be1120e3'
  }, {
    title: 'Zablozkis',
    location: {
      lat: 40.7185273,
      lng: -73.9598372
    },
    venueId: '4127e200f964a5205d0c1fe3'
  }, {
    title: 'Turkeys Nest',
    location: {
      lat: 40.7206154,
      lng: -73.95501349999999
    },
    venueId: '3fd66200f964a5206deb1ee3'
  }, {
    title: 'Kent Ale House',
    location: {
      lat: 40.7223271,
      lng: -73.9592555
    },
    venueId: '4fecd976e4b02235f361e034'
  }, {
    title: 'The Levee',
    location: {
      lat: 40.7163006,
      lng: -73.96168489999999
    },
    venueId: '427c0500f964a5209a211fe3'
  }, {
    title: 'Maison Premier',
    location: {
      lat: 40.7142634,
      lng: -73.9616503
    },
    venueId: '4d34a091c6cba35dec2f357a'
  }, {
    title: 'St Mazie Bar',
    location: {
      lat: 40.7125938,
      lng: -73.9558236
    },
    venueId: '4e4ea8b5aeb70f12849528ed'
  }, {
    title: 'Soft Spot',
    location: {
      lat: 40.71943110000001,
      lng: -73.9562275
    },
    venueId: '4a558eb0f964a5203cb41fe3'
  }, {
    title: 'East River Bar',
    location: {
      lat: 40.7109477,
      lng: -73.96464999999999
    },
    venueId: '40bfbb80f964a520d4001fe3'
  }];
  // The view Item used to populate the list with bar titles, called by the viewmodel.
var Bar = function(data) {
    this.title = ko.observable(data.title);
  };
  // The viewmodel contains functions that create many of the DOM elements and pull data from the model for their use.
  // Utilizing knockout.js to update list items and map markers in real time with the filtering search box.
var ViewModel = function() {
    var self = this;
    self.barList = ko.observableArray([]);
    initialBars.forEach(function(barItem) {
      self.barList.push(new Bar(barItem));
    });
    self.currentBar = ko.observable(this.barList()[0]);
    this.barClick = function(bar) {
      self.currentBar(bar);
      google.maps.event.trigger(bar.marker, 'click');
    };
    self.filter = ko.observable("");
    self.contentString = " ";
    this.barListMatch = ko.computed(function() {
      var filter = self.filter().toLowerCase();
      for (var i = 0; i < self.barList().length; i++) {
        if (self.barList()[i].marker) {
          self.barList()[i].marker.setVisible(true);
        }
      }
      if (!filter) {
        return self.barList();
      } else {
        return ko.utils.arrayFilter(self.barList(), function(item) {
          var match = item.title().toLowerCase().indexOf(filter) != -1;
          item.marker.setVisible(match);
          return match;
        });
      }
    });
    /*!
     * Start Bootstrap - Simple Sidebar HTML Template (http://startbootstrap.com)
     * Code licensed under the Apache License v2.0.
     * For details, see http://www.apache.org/licenses/LICENSE-2.0.
     */
    $("#menu-toggle").click(function(e) {
      e.preventDefault();
      $("#wrapper").toggleClass("toggled");
    });
    //gets the foursquare provided info from their Venue API
    //upon successful retrieval of venue data object, the chosen data is placed into the content string for each marker's infowindow.
    //failure to retrieve fousquare data results in an error alert being displayed.
    self.foursquare = function(venueId, marker) {
        var foursquareUrl = 'https://api.foursquare.com/v2/venues/' + marker.info + '?client_id=' + client_id + '&client_secret=' + client_secret + '&v=20170529';
        $.ajax({
          url: foursquareUrl,
          cache: true,
          dataType: 'jsonp'
          }).done(function(results) {
            var venueDetails = results.response.venue;
            var name = venueDetails.name;
            var pricey = venueDetails.hasOwnProperty('price') ? venueDetails.price : '';
            if (pricey.hasOwnProperty('message')) {
              var pricey = venueDetails.price.message;
            }
            var hours = venueDetails.hasOwnProperty('hours') ? venueDetails.hours : '';
            if (hours.hasOwnProperty('status')) {
              var hours = venueDetails.hours.status;
            }
            var address = venueDetails.hasOwnProperty('location') ? venueDetails.location : '';
            if (address.hasOwnProperty('formattedAddress')) {
              var address = venueDetails.location.formattedAddress;
            }
            var photo = (venueDetails.bestPhoto.prefix + '150x150' + venueDetails.bestPhoto.suffix);
            self.contentString = ('<div class="infoTitle">' + name + '</div>' + '<div>' + hours + '</div>' + '<hr>' + '<div>' + ' $ = ' + pricey + '</div>' + '<hr>' + '<img src="' + photo + '">' + '<hr>' + '<div class="address">' + address + '</div>');
            populateInfoWindow(marker, largeInfowindow);
          }).fail(function(jqXHR, textStatus) {
            alert('Nothing Found!');
          });
        };
      //creates the map, centered around the markers
    map = new google.maps.Map(document.getElementById('map'), {
      center: {
        lat: 40.7613779,
        lng: -73.9346765
      },
      zoom: 13,
      styles: [{
        "featureType": "all",
        "elementType": "all",
        "stylers": [{
          "visibility": "on"
        }]
      }, {
        "featureType": "all",
        "elementType": "labels",
        "stylers": [{
          "visibility": "on"
        }, {
          "saturation": "-100"
        }]
      }, {
        "featureType": "all",
        "elementType": "labels.text.fill",
        "stylers": [{
          "saturation": 36
        }, {
          "color": "#000000"
        }, {
          "lightness": -100
        }, {
          "visibility": "on"
        }]
      }, {
        "featureType": "all",
        "elementType": "labels.text.stroke",
        "stylers": [{
          "visibility": "on"
        }, {
          "color": "#fff"
        }, {
          "lightness": +100
        }]
      }, {
        "featureType": "all",
        "elementType": "labels.icon",
        "stylers": [{
          "visibility": "off"
        }]
      }, {
        "featureType": "administrative",
        "elementType": "geometry.fill",
        "stylers": [{
          "color": "#A9A9A9"
        }, {
          "lightness": -100
        }]
      }, {
        "featureType": "administrative",
        "elementType": "geometry.stroke",
        "stylers": [{
          "color": "#A9A9A9"
        }, {
          "lightness": -80
        }, {
          "weight": 1
        }]
      }, {
        "featureType": "landscape",
        "elementType": "geometry",
        "stylers": [{
          "color": "#A9A9A9"
        }, {
          "lightness": -100
        }]
      }, {
        "featureType": "landscape",
        "elementType": "geometry.fill",
        "stylers": [{
          "color": "#A9A9A9"
        }]
      }, {
        "featureType": "landscape",
        "elementType": "geometry.stroke",
        "stylers": [{
          "color": "#A9A9A9"
        }]
      }, {
        "featureType": "landscape.natural",
        "elementType": "geometry.fill",
        "stylers": [{
          "color": "#A9A9A9"
        }]
      }, {
        "featureType": "poi",
        "elementType": "geometry",
        "stylers": [{
          "lightness": -100
        }]
      }, {
        "featureType": "poi",
        "elementType": "geometry.fill",
        "stylers": [{
          "color": "#A9A9A9"
        }]
      }, {
        "featureType": "poi",
        "elementType": "geometry.stroke",
        "stylers": [{
          "color": "#A9A9A9"
        }]
      }, {
        "featureType": "road",
        "elementType": "geometry",
        "stylers": [{
          "visibility": "on"
        }, {
          "color": "#7f8d89"
        }]
      }, {
        "featureType": "road",
        "elementType": "geometry.fill",
        "stylers": [{
          "color": "#7f8d89"
        }]
      }, {
        "featureType": "road.highway",
        "elementType": "geometry.fill",
        "stylers": [{
          "color": "#7f8d89"
        }, {
          "lightness": 17
        }]
      }, {
        "featureType": "road.highway",
        "elementType": "geometry.stroke",
        "stylers": [{
          "color": "#7f8d89"
        }, {
          "lightness": 29
        }, {
          "weight": 0.2
        }]
      }, {
        "featureType": "road.arterial",
        "elementType": "geometry",
        "stylers": [{
          "color": "#000000"
        }, {
          "lightness": 18
        }]
      }, {
        "featureType": "road.arterial",
        "elementType": "geometry.fill",
        "stylers": [{
          "color": "#7f8d89"
        }]
      }, {
        "featureType": "road.arterial",
        "elementType": "geometry.stroke",
        "stylers": [{
          "color": "#7f8d89"
        }]
      }, {
        "featureType": "road.local",
        "elementType": "geometry",
        "stylers": [{
          "color": "#000000"
        }, {
          "lightness": 16
        }]
      }, {
        "featureType": "road.local",
        "elementType": "geometry.fill",
        "stylers": [{
          "color": "#7f8d89"
        }]
      }, {
        "featureType": "road.local",
        "elementType": "geometry.stroke",
        "stylers": [{
          "color": "#7f8d89"
        }]
      }, {
        "featureType": "transit",
        "elementType": "geometry",
        "stylers": [{
          "color": "black"
        }, {
          "lightness": -100
        }]
      }, {
        "featureType": "water",
        "elementType": "all",
        "stylers": [{
          "color": "black"
        }, {
          "visibility": "on"
        }]
      }, {
        "featureType": "water",
        "elementType": "geometry",
        "stylers": [{
          "color": "black"
        }, {
          "lightness": -90
        }]
      }, {
        "featureType": "water",
        "elementType": "geometry.fill",
        "stylers": [{
          "color": "black"
        }]
      }, {
        "featureType": "water",
        "elementType": "geometry.stroke",
        "stylers": [{
          "color": "black"
        }]
      }, {
        "featureType": "water",
        "elementType": "labels",
        "stylers": [{
          "visibility": "off"
        }]
      }, {
        "featureType": "water",
        "elementType": "labels.text",
        "stylers": [{
          "visibility": "off"
        }]
      }, {
        "featureType": "water",
        "elementType": "labels.text.fill",
        "stylers": [{
          "visibility": "off"
        }]
      }, {
        "featureType": "water",
        "elementType": "labels.text.stroke",
        "stylers": [{
          "visibility": "off"
        }]
      }, {
        "featureType": "water",
        "elementType": "labels.icon",
        "stylers": [{
          "visibility": "off"
        }]
      }],
      mapTypeControl: false
    });
    var largeInfowindow = new google.maps.InfoWindow();
    var bounds = new google.maps.LatLngBounds();
    //creating the markers and dropping them in place on page load
    for (var i = 0; i < initialBars.length; i++) {
      var position = initialBars[i].location;
      var title = initialBars[i].title;
      var businessId = initialBars[i].venueId;
      var marker = new google.maps.Marker({
        position: position,
        title: title,
        info: businessId,
        animation: google.maps.Animation.DROP,
        id: i
      });
      self.barList()[i].marker = marker;
      markers.push(marker);
      bounds.extend(marker.position);
      // Giving click functionality to markers. A click on a marker (or a simulated click from clicking a corresponding list
      // item) calls the foursquare function and boucnes the marker.
      marker.addListener('click', function() {
        self.foursquare(this.info, this);
        toggleBounce(this);
      });
    }
    // marker bounce function
    function toggleBounce(marker) {
      if (marker.getAnimation() !== null) {
        marker.setAnimation(null);
      } else {
        marker.setAnimation(google.maps.Animation.BOUNCE);
        setTimeout(function() {
          marker.setAnimation(null);
        }, 1400);
      }
    }
    // fills infowindow, called upon successful retrieval of foursquare data
    function populateInfoWindow(marker, infowindow) {
      if (infowindow.marker != marker) {
        infowindow.marker = marker;
        infowindow.setContent(self.contentString);
        infowindow.open(map, marker);
        //infowindow.addListener('closeclick', function() {
        //infowindow.setMarker(null);
        //});
      }
    }
    //drops the markers on to the map on page load
    function showListings() {
      var bounds = new google.maps.LatLngBounds();
      for (i = 0; i < markers.length; i++) {
        markers[i].setMap(map);
        bounds.extend(markers[i].position);
      }
      map.fitBounds(bounds);
    }
    showListings();
  };
//starts the app on callback from google maps script in index.html 
function initApp() {
  var viewModel = new ViewModel();
  ko.applyBindings(viewModel);
}
// error alert for if google map should fail.
function googleError() {
  alert("google map not ready");
}

  

