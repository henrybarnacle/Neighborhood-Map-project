
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
  
}


var ViewModel = function() {
  var self = this;
  
  self.barList = ko.observableArray ([]);

  initialBars.forEach(function(barItem) {

    self.barList.push ( new Bar(barItem) );
  });


  this.currentBar = ko.observable(this.barList() [0]);

  this.barClick = function(bar) {
  self.currentBar(bar);

      google.maps.event.trigger(bar.marker, 'click');
    }

  self.filter = ko.observable("");
  


  this.barListMatch = ko.computed(function(){

    var filter = self.filter().toLowerCase();

    for (var i = 0; i < self.barList.length; i++) {
      self.barList()[i].marker.setVisible(true);
    }

    if (!filter || filter == '') {
      return self.barList();
        for (var i = 0; i < self.barList.length; i++) {
      self.barList()[i].marker.setVisible(true);
    }



    } else {

      return ko.utils.arrayFilter(self.barList(), function(item) {

     var match = item.title().toLowerCase().indexOf(filter) != -1;

      item.marker.setVisible(match);
      return match; 

            
      });
    }

  });


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


    self.barList()[i].marker = marker;
   
   
    
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

showListings();


}

 

function initApp() {
var viewModel = new ViewModel();
ko.applyBindings(viewModel);

}



  

