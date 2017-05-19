
var map;
var markers = [];


  var initialBars = [
   {title: 'Berry Park', location: {lat: 40.7224718, lng: -73.9552525}},
   {title: 'Zablozkis', location: {lat: 40.7185273, lng: -73.9598372}},
   {title: 'Turkeys Nest', location: {lat: 40.7206154, lng: -73.95501349999999}},
   {title: 'Kent Ale House', location: {lat: 40.7223271, lng: -73.9592555}},
   {title: 'The Levee', location: {lat: 40.7163006, lng: -73.96168489999999}},
   {title: 'Maison Premier', location: {lat: 40.7142634, lng: -73.9616503}},
   {title: 'St Mazie Bar', location: {lat: 40.7125938, lng: -73.9558236}},
   {title: 'Soft Spot', location: {lat: 40.71943110000001, lng: -73.9562275}},
   {title: 'East River Bar', location: {lat: 40.7109477, lng: -73.96464999999999}}
   ];


var Bar = function(data) {
  this.title = ko.observable(data.title);
  this.marker = new google.maps.Marker;
}


var ViewModel = function() {
  var self = this;

  

  this.barList = ko.observableArray ([]);

  initialBars.forEach(function(barItem) {

    self.barList.push ( new Bar(barItem) );
  });

  self.barList().forEach(function(myItem) {
    
      var marker = new google.maps.Marker
      myItem.marker = marker;
  })

  this.currentBar = ko.observable(this.barList() [0]);

  this.barClick = function(bar) {
  self.currentBar(bar);

      google.maps.event.trigger(bar.marker, 'click');
    }

  this.filter = ko.observable("");
  
  this.barListMatch = ko.computed(function(){
    var filter = self.filter().toLowerCase();

    if (!filter) {
      return self.barList();
    } else { 
      return ko.utils.arrayFilter(self.barList(), function(item) {
        return item.title().toLowerCase().indexOf(filter) != -1;
        item.marker.setVisible(visible);
      });
    }
  });
      
  /*self.barList().forEach(function(barItem) {
    var marker = new google.maps.Marker({
      title: barItem.title,
      position: barItem.location,
      map: map

    });
    barItem.marker = marker;
  })*/
  


  $("#menu-toggle").click(function(e) {
    e.preventDefault();
  $("#wrapper").toggleClass("toggled");

});


  map = new google.maps.Map(document.getElementById('map'),{
    center: {lat: 40.7613779, lng: -73.9346765},
    zoom: 13,
    
    mapTypeControl: false
  });


   var largeInfowindow = new google.maps.InfoWindow();

   var bounds = new google.maps.LatLngBounds();

   for (var i = 0; i < initialBars.length; i++) {

    var position = initialBars[i].location;
    var title = initialBars[i].title;

    var marker = new google.maps.Marker({
    
    position: position,
    title: title,
    animation: google.maps.Animation.DROP,
    id: i
    });

    self.barListMatch()[i].marker = marker;
    markers.push(marker);
    bounds.extend(marker.position);

    marker.addListener('click', function() {
      populateInfoWindow(this, largeInfowindow);

    });
  }
  
    
    //document.getElementById('show-listings').addEventListener('click', showListings);
   // document.getElementById('hide-listings').addEventListener('click', hideListings);
   // document.getElementById('zoom-to-area').addEventListener('click', function() {
    //  zoomToArea();
    //});
    

showListings();


}

 

function initApp() {
var viewModel = new ViewModel();
ko.applyBindings(viewModel);

}


function populateInfoWindow(marker, infowindow) {
  if (infowindow.marker != marker) {
    infowindow.marker = marker;
    infowindow.setContent('<div>' + marker.title + '</div>');
    infowindow.open(map, marker);
    //infowindow.addListener('closeclick', function() {
      //infowindow.setMarker(null);
      
    //});
  }
}

function showListings() {
  var bounds = new google.maps.LatLngBounds();

  for (i = 0; i < markers.length; i++) {
    markers[i].setMap(map);
    bounds.extend(markers[i].position);
  }
  map.fitBounds(bounds);
}


  
  function hideListings() {
    for (i = 0; i < markers.length; i++) {
      markers[i].setMap(null);
    }
  }



function zoomToArea() {
  var geocoder = new google.maps.Geocoder();

  var address = document.getElementById('zoom-to-area-text').value;

  if (address == '') {
    window.alert('You must enter an area, or address.');
  } else {
    geocoder.geocode(
      { address: address
        //componentRestrictions: {locality: 'New York'}
      }, function(results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
          map.setCenter(results[0].geometry.location);
          map.setZoom(15);
        } else {
          window.alert('We could not find that location - try entering a more specific place');
        }
      });
    }
  }
