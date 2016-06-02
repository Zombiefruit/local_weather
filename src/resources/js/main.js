window.onload = function() {
  var startPos;
  var geoSuccess = function( position ) {
    startPos = position;
    getWeather( startPos );
  };
  navigator.geolocation.getCurrentPosition( geoSuccess );
};

function getWeather(position) {
  var latitude = position.coords.latitude;
  var longitude = position.coords.longitude;

  console.log( "The latitude is " + latitude + ", and the longitude is " + longitude );

  var xmlRequest = new XMLHttpRequest();

  xmlRequest.onreadystatechange = function() {
    if ( xmlRequest.readyState == 4 && xmlRequest.status == 200 ) {
      // Request was a success
      var response = xmlRequest.responseText;
      var weatherObject = JSON.parse(response);

      var city = weatherObject.name;
      var temp = "<br>" + (Math.round( weatherObject.main.temp - 273 )) + "&deg Celsius";
      var humidity = "<br>" + "Humidity: " + weatherObject.main.humidity + "%";
      var weather = "<br>" + toTitleCase( weatherObject.weather[0].description );


      addToElement( 'weather', city, temp, humidity, weather );
    }
  };

  // YOU WOULD NEVER WANT TO EXPOSE AN API KEY IN A "REAL" APP. I'm running this on my local machine and
  // it's a free key so I'm taking the liberty to do it this way.
  var key = "af1515bf3429c1c7bf62fc74f5c2066f";
  var url = "http://api.openweathermap.org/data/2.5/weather?lat=" + latitude + "&lon=" + longitude + "&appid=" + key;
  xmlRequest.open( "GET", url, true );
  xmlRequest.send();

};


// From http://stackoverflow.com/questions/196972/convert-string-to-title-case-with-javascript/196991#196991
// Not a bad function to write, but why reinvent the wheel...
function toTitleCase(str)
{
    return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
};

function addToElement(id, string) {
  document.getElementById(id).innerHTML = "";
  for (i = 1; i < arguments.length; i++) {
    document.getElementById(id).innerHTML += arguments[i];
  }
};
