
var map;
var markers = [];
var client_id = 'QMJC2UXA51GWWTUQ2OA0KGBMV125UBDCS1QEGHI0PPJ23CXG';
var client_secret = 'M534W1PKYXZZVKOWQIWE4ZV5XDGNN5XYRIK3LQB0YOYOTTKJ';

  var initialBars = [
   {title: 'Berry Park', location: {lat: 40.7224718, lng: -73.9552525}, venueId: '4a8e031cf964a520be1120e3'},
   {title: 'Zablozkis', location: {lat: 40.7185273, lng: -73.9598372}, venueId: '4127e200f964a5205d0c1fe3'},
   {title: 'Turkeys Nest', location: {lat: 40.7206154, lng: -73.95501349999999}, venueId: '3fd66200f964a5206deb1ee3'},
   {title: 'Kent Ale House', location: {lat: 40.7223271, lng: -73.9592555}, venueId: '4fecd976e4b02235f361e034'},
   {title: 'The Levee', location: {lat: 40.7163006, lng: -73.96168489999999}, venueId: '427c0500f964a5209a211fe3'},
   {title: 'Maison Premier', location: {lat: 40.7142634, lng: -73.9616503}, venueId: '4d34a091c6cba35dec2f357a'},
   {title: 'St Mazie Bar', location: {lat: 40.7125938, lng: -73.9558236}, venueId: '4e4ea8b5aeb70f12849528ed'},
   {title: 'Soft Spot', location: {lat: 40.71943110000001, lng: -73.9562275}, venueId: '4a558eb0f964a5203cb41fe3'},
   {title: 'East River Bar', location: {lat: 40.7109477, lng: -73.96464999999999}, venueId: '40bfbb80f964a520d4001fe3'}
   ]


var Bar = function(data) {
  this.title = ko.observable(data.title);
  
  
}


var ViewModel = function() {
  var self = this;
  
  self.barList = ko.observableArray ([]);

  initialBars.forEach(function(barItem) {

    self.barList.push ( new Bar(barItem) );
  });


  self.currentBar = ko.observable(this.barList() [0]);

  this.barClick = function(bar) {
  self.currentBar(bar);

      google.maps.event.trigger(bar.marker, 'click');
      
    }

  self.filter = ko.observable("");

  self.description = '';

  this.barListMatch = ko.computed(function(){

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


  $("#menu-toggle").click(function(e) {
    e.preventDefault();
  $("#wrapper").toggleClass("toggled");

});

self.foursquare = function(venueId, marker) {
 
var foursquareUrl = 'https://api.foursquare.com/v2/venues/' + marker.info + '?client_id=' + client_id + '&client_secret=' + client_secret + '&v=20170529';
        
var settings = {
  url: foursquareUrl,
  
  cache: true,
  dataType: 'jsonp',
  success: function(results) {
    self.description = results.response.venue.description;
     

  },
  fail: function() {
    console.log('Nothing Found!');
  }
};



$.ajax(settings);


}



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

   
   
  

    marker.addListener('click', function() {

   
      self.foursquare(this.info, this);

      toggleBounce(this);

      populateInfoWindow(this, largeInfowindow);
       });
  }
 
        function toggleBounce(marker) {
        if (marker.getAnimation() !== null) {
          marker.setAnimation(null);
        } else {
          marker.setAnimation(google.maps.Animation.BOUNCE);
          setTimeout(function(){ marker.setAnimation(null); }, 750);
        }
      }

function populateInfoWindow(marker, infowindow) {
  if (infowindow.marker != marker) {
    infowindow.marker = marker;
    infowindow.setContent('<div>' + self.description + '</div>');
    
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



  

