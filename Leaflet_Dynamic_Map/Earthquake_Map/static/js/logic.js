// Create query URL from https://earthquake.usgs.gov/earthquakes

var queryURL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"


//Perform a GET request to the query URL

d3.json(queryURL, function(data) {

    //Create markers that are circles and adjust based on magnitude of quake
    function createCircleMarker(feature,coords){

        let options = {
            radius:feature.properties.mag*4,
            fillColor: chooseColor(feature.properties.mag),
            color: "black",
            weight: 1,
            opacity: 1,
            fillOpacity: 1
        };

        return L.circleMarker(coords, options);
    }  
 
    //use onEachFeature to bind popups and cirlemarkers
    var earthquakes = L.geoJSON(data,{
        onEachFeature: function(feature, layer){

            layer.bindPopup("<h3>PLACE: " + feature.properties.place +
            "</h3><hr><p>TIME: " + new Date(feature.properties.time) + "</p>"+
            "</h3><hr><p>MAGNITUDE: " + feature.properties.mag + "</p>"+
            "</h3><hr><p>FELT: " + feature.properties.felt + "</p>");
        },
        pointToLayer: createCircleMarker

    });

    //call createMap function
    createMap(earthquakes);
});


//define createMap function
function createMap(earthquakes) {

    //Create streetmap layer
    var streetmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 4,
    id: "mapbox.streets-basic",
    accessToken: API_KEY
  });

  //define baseMaps
  var baseMaps = {
      "Street Map": streetmap
  };

  //define overlay
  var overlayMaps = {
      Earthquakes: earthquakes
  };

  //define actual map
  var myMap = L.map("map", {
    center: [
      37.09, -95.71
    ],
    zoom: 4,
    layers: [streetmap, earthquakes]
  });

  // Create a layer control
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);

  // Create and place legend
  var info = L.control({
    position: "bottomleft"
    });

    info.onAdd = function(){
        var div = L.DomUtil.create("div","legend");
        return div;
    }

    info.addTo(myMap);

    document.querySelector(".legend").innerHTML=displayLegend();
}

//Create function to choose a color of circle based on Magnitude of quake
function chooseColor(mag){
    switch(true){
        case (mag<1):
            return "lime";
        case (mag<2):
            return "greenyellow";
        case (mag<3):
            return "yellow";
        case (mag<4):
            return "darkorange";
        case (mag<5):
            return "red";
        default:
            return "darkred";
    };
}

//Create legend layers to call in creating the map
function displayLegend(){
    var legendInfo = [{
        limit: "Mag: 0-1",
        color: "lime"
    },{
        limit: "Mag: 1-2",
        color: "greenyellow"
    },{
        limit:"Mag: 2-3",
        color:"yellow"
    },{
        limit:"Mag: 3-4",
        color:"darkorange"
    },{
        limit:"Mag: 4-5",
        color:"red"
    },{
        limit:"Mag: 5+",
        color:"darkred"
    }];

    var header = "<h3>Magnitude</h3><hr>";

    var levels = "";
   
    for (i = 0; i < legendInfo.length; i++){
        levels += "<p style = \"background-color: "+legendInfo[i].color+"\">"+legendInfo[i].limit+"</p> ";
    }
    
    return header+levels;

}