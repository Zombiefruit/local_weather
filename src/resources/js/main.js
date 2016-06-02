var temp = undefined;
var state = 0;

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

      var city = "<p id='city'>" + weatherObject.name + "</p>";
      temp = (Math.round( weatherObject.main.temp - 273 ));
      var tempDisplay = "<p id='temp'>" + temp + "&deg Celsius" + "</p>";
      var humidity = "<p id='humidity'>" + "Humidity: " + weatherObject.main.humidity + "%" + "</p>";
      var weatherType = weatherObject.weather[0].main;
      weatherType = 'Clear';

      var tieBreak = Math.round(Math.random());
      switch (weatherType) {
        case 'Clouds':
          if (tieBreak === 0) {
            addToElement('bgvid', '<source src="resources/videos/blueSkyClouds.mp4" type="video/mp4">');
          } else {
            addToElement('bgvid', '<source src="resources/videos/cloudsOverField.mp4" type="video/mp4">');
          }
          break;
        case 'Drizzle':
          addToElement('bgvid', '<source src="resources/videos/lightRain.mp4" type="video/mp4">');
          break;
        case 'Thunderstorm':
        case 'Rain':
          addToElement('bgvid', '<source src="resources/videos/heavyRain.mp4" type="video/mp4">');
          break;
        case 'Snow':
          addToElement('bgvid', '<source src="resources/videos/lightSnow.mp4" type="video/mp4">');
          break;
        case 'Clear':
          if (tieBreak === 0) {
            addToElement('bgvid', '<source src="resources/videos/sunsetGrass.mp4" type="video/mp4">');
          } else {
            addToElement('bgvid', '<source src="resources/videos/sunny.mp4" type="video/mp4">');
          }
          break;
        default:
          addToElement('bgvid', '<source src="resources/videos/sunsetClouds.mp4" type="video/mp4">');
      }

      addToElement( 'weather', city, tempDisplay, humidity );
    }
  };

  // YOU WOULD NEVER WANT TO EXPOSE AN API KEY IN A "REAL" APP. I'm running this on my local machine and
  // it's a free key so I'm taking the liberty to do it this way.
  var key = "af1515bf3429c1c7bf62fc74f5c2066f";
  var url = "http://api.openweathermap.org/data/2.5/weather?lat=" + latitude + "&lon=" + longitude + "&appid=" + key;
  xmlRequest.open( "GET", url  + ((/\?/).test(url) ? "&" : "?") + (new Date()).getTime(), true );
  xmlRequest.send();

};

function addToElement(id, string) {
  document.getElementById(id).innerHTML = "";
  for (i = 1; i < arguments.length; i++) {
    document.getElementById(id).innerHTML += arguments[i];
  }
};

function changeTemp(changeState) {
  // The temperature is in Celsius
  if (changeState === 0 && state === 1) {
    // temp should be in C but is in F
    temp = Math.round((temp - 32) / 1.8);
    document.getElementById('temp').innerHTML = temp + "&deg Celsius";
    state = 0;
  } else if (changeState === 1 && state === 0) {
    // temp should be in F but is in C
    temp = Math.round((temp * 1.8) + 32);
    document.getElementById('temp').innerHTML = temp + "&deg Fahrenheit";
    state = 1;
  } else {
    return -1;
  }
};
