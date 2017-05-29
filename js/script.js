
var map;
var markers = [];
var clientID = 'SaBftrA-Fnosl_t9Bf1R6Q';
var secret = '5wYyM3DGSpGsHhufUHvmOFOxJIoVGiVrpFjauvA01lQZIQaZrvLwkXZbN57kWAbU';
var token = 'ZJcTpj0pI_prRtNDzY_NbNsIXedTmyjXLcd6Nk8uLp2Zghq-F_HaMupMxPUzfj2nZGoDl5T-3CVOklbfaLbprqmUZ9mL8GUwJxkoHSFRDkj90DMnRw-0YjrOhUYsWXYx';

  var initialBars = [
   {title: 'Berry Park', location: {lat: 40.7224718, lng: -73.9552525}, yelpId: 'berry-park-brooklyn'},
   {title: 'Zablozkis', location: {lat: 40.7185273, lng: -73.9598372}, yelpId: 'zablozkis-brooklyn-2'},
   {title: 'Turkeys Nest', location: {lat: 40.7206154, lng: -73.95501349999999}, yelpId: 'turkeys-nest-tavern-brooklyn'},
   {title: 'Kent Ale House', location: {lat: 40.7223271, lng: -73.9592555}, yelpId: 'kent-ale-house-brooklyn'},
   {title: 'The Levee', location: {lat: 40.7163006, lng: -73.96168489999999}, yelpId: 'the-levee-brooklyn'},
   {title: 'Maison Premier', location: {lat: 40.7142634, lng: -73.9616503}, yelpId: 'maison-premiere-brooklyn'},
   {title: 'St Mazie Bar', location: {lat: 40.7125938, lng: -73.9558236}, yelpId: 'st-mazie-brooklyn-2'},
   {title: 'Soft Spot', location: {lat: 40.71943110000001, lng: -73.9562275}, yelpId: 'soft-spot-bar-brooklyn'},
   {title: 'East River Bar', location: {lat: 40.7109477, lng: -73.96464999999999}, yelpId: 'east-river-bar-brooklyn'}
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


  self.currentBar = ko.observable(this.barList() [0]);

  this.barClick = function(bar) {
  self.currentBar(bar);
console.log(self.currentBar());
      google.maps.event.trigger(bar.marker, 'click');
      
    }

  self.filter = ko.observable("");
  


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

self.yelp = function(yelpId, marker) {


         var auth = {
                consumerKey: "clientID",
                consumerSecret: "secret",
                accessToken: "token",
                accessTokenSecret: "secret",
                serviceProvider: {
                    signatureMethod: "HMAC-SHA1"
                }
            };
            var yelpUrl = 'https://api.yelp.com/v3/businesses/' + this.info;
            var parameters = {
                oauth_consumer_key: auth.consumerKey,
                oauth_token: auth.accessToken,
                oauth_nonce: nonce_generate(),
                oauth_timestamp: Math.floor(Date.now() / 1000),
                oauth_signature_method: 'HMAC-SHA1',
                oauth_version: '2.0',
                callback: 'cb'
              };
              var encodedSignature = oauthSignature.generate('GET', yelpUrl, parameters, auth.consumerSecret, auth.accessTokenSecret);
var settings = {
  url: yelpUrl,
  data: parameters,
  cache: true,
  dataType: 'jsonp',
  success: function(results) {
    console.log(results);
  },
  fail: function() {
    console.log('Nothing Found!');
  }
};

  function nonce_generate() {
  return (Math.floor(Math.random() * 1e12).toString());
}

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
    var businessId = initialBars[i].yelpId;

    var marker = new google.maps.Marker({
    
    position: position,
    title: title,
    info: businessId,
    animation: google.maps.Animation.DROP,
    id: i

    });
    
marker.addListener('click', function() {
      toggleBounce(this);

    });

    self.barList()[i].marker = marker;

    markers.push(marker);
    bounds.extend(marker.position);

    

    marker.addListener('click', function() {
     
    self.yelp(this.info, this);

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



  

