//Load the GeoJSOn data
let geoData = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

//Get the data with D3
d3.json(geoData).then(function(earthquakeinfo){

    console.log(earthquakeinfo);
    createFeatures(earthquakeinfo.features);
});

//Creating markers whose size increses with magnitude and color with depth
function createMarker(feature, latlng){

    return L.circleMarker(latlng, {
        radius: markerSize(feature.properties.mag),
        fillColor: markerColor(feature.geometry.coordinates[2]),
        color : "#000",
        weight: 0.5,
        opacity: 0.5,
        fillOpacity: 1
    });
}

function createFeatures(earthquakeinfo){

    //Define a dunction for each fature and give a popup for each feature with info
    function onEachFeature(feature, layer) {
        layer.bindPopup(`<h3>Location:</h3> ${feature.properties.place}<h3> Magnitude:</h3> ${feature.properties.place}<h3> Depth:</h3> 
        ${feature.geometry.coordinates[2]}`);
    }

    // Create a GeoJSON layer that contains the features array on the earthquakeData object and run the onEachFeature function for each piece of data in the array.
    let earthquakes = L.geoJSON(earthquakeinfo, {
        onEachFeature: onEachFeature,
        pointToLayer: createMarker
    });

    //Sending the earthquake layer to the createmap 
    createMap(earthquakes);
}

function createMap(earthquakes) {

    //Creating the layer that will be the background
    let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      });
    
    //Creating the map object with options
    let myMap = L.map("map", {
        center: [37.09, -95.71],
        zoom: 5,
        layers: [street, earthquakes]
    });

    //Creating a baseMaps object to hold the street layer
    let baseMaps = {
        "street Map": street
    };

    //Creating a overlayMaps object to hold the earthquakes layer
    let overlayMaps = {
        Earthquakes: earthquakes
      };
    
    //Creating a layer control and pass it to baseMaps and overlayMaps. Also add the layer control to the map.
    L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
    }).addTo(myMap);

    //Adding legend
    let legend = L.control({position: 'bottomright'});

    legend.onAdd = function () {

        let div = L.DomUtil.create('div', 'info legend'),
        grades = [-10, 10, 30, 50, 70, 90],
        labels = [],
        legendInfo = "<h5>Magnitude</h5>";

        for (let i = 0; i < grades.length; i++) {
            div.innerHTML +=
                '<i style="background:' + markerColor(grades[i] + 1) + '"></i> ' +
                grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
        }  

        return div;
        };
        
        //Adding legend to map
        legend.addTo(myMap);
}

//Have to increase the marker size based on the mag
function markerSize(magnitude) {
    return magnitude * 5;
}

//Changing the marker color based on the depth
function markerColor(depth) {
    return depth > 90 ? '#d73027' :
            depth > 70 ? '#fc8d59' :
            depth > 50 ? '#fee08b' :
            depth > 30 ? '#d9ef8b' :
            depth > 10 ? '#91cf60' :
                         '#1a9850' ;          
}