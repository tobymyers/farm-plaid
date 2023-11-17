// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function () {

    // Initialize the map
    var map = L.map('map').setView([0, 0], 10);

    function saveField() {
        console.log('Attempting to saveField');
    
        // Get form data
        var fieldNameElement = document.getElementById("polygonName");
        var areaField = document.getElementById("area");
        var currentCrop = document.getElementById("cropSelection").value;
        var plantDate = document.getElementById("plantDate").value;
        var harvestDate = document.getElementById("harvestDate").value;
    
        if (fieldNameElement && areaField) {
            var fieldValue = fieldNameElement.value;
            var areaValue = areaField.value;
            console.log('Field Name:', fieldValue);
            console.log('Area:', areaValue);
            console.log('Current Crop:', currentCrop);
            console.log('Plant Date:', plantDate);
            console.log('Harvest Date:', harvestDate);
    
            // Get polygon coordinates
            var drawnItems = map._layers[Object.keys(map._layers)[1]]; // Assuming the drawnItems is the second layer
            var coordinates = drawnItems.toGeoJSON().features[0].geometry.coordinates[0];
            console.log('Polygon Coordinates:', coordinates);
    
            // Prepare data object
            var data = {
                fieldName: fieldValue,
                area: areaValue,
                currentCrop: currentCrop,
                plantDate: plantDate,
                harvestDate: harvestDate,
                coordinates: coordinates
            };
    
            console.log('Data before sending:', data);
    
            // Make a POST request with JSON data
            fetch('http://127.0.0.1:8000/save-field', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.json();
                })
                .then(data => {
                    console.log('Success:', data);
                    // Reload the page to see flash messages
                    location.reload();
                })
                .catch(error => {
                    console.error('Error:', error);
                });
        } else {
            console.error('Element with ID "polygonName" or "area" not found');
        }
    }
    
    window.saveField = saveField;

    // Add a tile layer ( satellite layer )
    var satelliteLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        attribution: '© Esri'
    });

    satelliteLayer.addTo(map); // Add the satellite layer to the map

    // Initialize geocoding control with auto-complete
    var geocoder = L.Control.geocoder({
        defaultMarkGeocode: false,
        collapsed: true,
        geocoder: L.Control.Geocoder.nominatim({ geocodingQueryParams: { language: 'en', limit: 5 } }),
        autoComplete: true, // Enable auto-complete
        autoCompleteDelay: 250, // Set the delay for auto-complete
        autoCollapse: true // Collapse the control after selecting a result
    }).on('markgeocode', function (e) {
        var bbox = e.geocode.bbox;
        var poly = L.polygon([
            bbox.getSouthEast(),
            bbox.getNorthEast(),
            bbox.getNorthWest(),
            bbox.getSouthWest(),
        ]).addTo(map);
        map.fitBounds(poly.getBounds());
    }).addTo(map);

    // Add the Leaflet Draw control
    var drawnItems = new L.FeatureGroup();
    map.addLayer(drawnItems);

    var drawControl = new L.Control.Draw({
        draw: {
            polygon: true,
            circle: false,
            marker: false, // Disable marker drawing
            polyline: false, // Disable polyline drawing
            rectangle: false // Disable rectangle drawing
        },
        edit: {
            featureGroup: drawnItems,
            remove: true
        }
    });

    map.addControl(drawControl);

    map.on('draw:created', function (event) {
        var layer = event.layer;
        drawnItems.addLayer(layer);

        // Update the area field with the area of the drawn shape
        var areaField = document.getElementById("area");

        // Check if areaField is not null and not undefined
        if (areaField) {
            // Get the LatLngs from the layer
            var latLngs = layer.getLatLngs()[0]; // Assuming it's a polygon

            // Calculate the area using Leaflet's getArea method
            var areaSquareMeters = L.GeometryUtil.geodesicArea(latLngs);

            // Convert square meters to hectares
            var areaHectares = (areaSquareMeters / 10000).toFixed(2);

            // Set the value of the areaField
            areaField.value = areaHectares + " hectares";
        }

        // Update the coordinates field with the coordinates of the drawn shape
        var coordinatesField = document.getElementById("coordinates");

        // Check if coordinatesField is not null and not undefined
        if (coordinatesField) {
            coordinatesField.value = JSON.stringify(latLngs);
        }
    });


    // locate user button
    window.locateUser = function locateUser() {
        map.locate({ setView: true, maxZoom: 16 });
    }

});
