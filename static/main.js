// // Wait for the DOM to be fully loaded
// document.addEventListener('DOMContentLoaded', function () {
    
//     // /////////////////////////////////

//     // Initialize the map
//     var map = L.map('map').setView([36.6777, -121.6549], 10)

//     // Ensure drawnItems is defined globally
//     var drawnItems = new L.FeatureGroup();
//     map.addLayer(drawnItems);

//    //////// 
//    map.addControl(drawControl);

//     var firstPolygon;

//     map.on('draw:created', function (event) {
//         var layer = event.layer;

//         if (firstPolygon) {
//             drawnItems.removeLayer(firstPolygon);
//         }

//         firstPolygon = layer;
//         drawnItems.addLayer(layer);
//     });



    document.addEventListener('DOMContentLoaded', function () {
        var map = L.map('map').setView([36.6777, -121.6549], 10);

    //     
    

    
        // Ensure drawnItems is defined globally
        var drawnItems = new L.FeatureGroup();
        map.addLayer(drawnItems);
    
        var drawControl = new L.Control.Draw({
            draw: {
                polygon: {
                    shapeOptions: {
                        fillColor: '#ff5a5e',
                        color: '#ff5a5e'
                    },
                    tooltip: 'Draw your field boundaries!' // Tooltip text for the polygon button
                },
                circle: false,
                marker: false,
                polyline: false,
                rectangle: false
            },
            edit: {
                featureGroup: drawnItems,
                remove: true
            }
        });

        // // Get the Leaflet Draw toolbar
        // var drawToolbar = drawControl.getContainer();

        // // Get the polygon draw button from the toolbar
        // var drawPolygonButton = drawToolbar.querySelector('.leaflet-draw-draw-polygon');

        // // Add the tooltip using Tippy
        // tippy(drawPolygonButton, {
        // content: 'Click here to start drawing',
        // });
    
        map.addControl(drawControl);
    
        var firstPolygon;
    
        map.on('draw:created', function (event) {
            var layer = event.layer;
    
            if (firstPolygon) {
                drawnItems.removeLayer(firstPolygon);
            }
    
            firstPolygon = layer;
            drawnItems.addLayer(layer);
        }); 
        map.on('draw:drawstart', function () {
            if (firstPolygon) {
                // Show Toast message only when there is an existing shape
                tippy(document.body, {
                    content: 'Let\'s keep it simple. Draw just one field to get started. You can draw more later',
                    placement: 'top',
                    duration: 3000, // 3 seconds
                    theme: 'light',
                    arrow: false,
                    offset: [0, 10],
                });
    
                drawnItems.removeLayer(firstPolygon);
                firstPolygon = null;
            }
        });
        // map.on('draw:drawstart', function () {
        //     if (firstPolygon) {
        //         drawnItems.removeLayer(firstPolygon);
        //         firstPolygon = null;
        //     }
        // });
   ///////////



// function filterCrops() {
//     const input = document.getElementById("cropInput");
//     const filter = input.value.toLowerCase();
//     const options = document.querySelectorAll("#cropDropdown option");

//     options.forEach((option) => {
//         const cropName = option.textContent.toLowerCase();
//         if (cropName.includes(filter)) {
//             option.style.display = "block";
//         } else {
//             option.style.display = "none";
//         }
//     });
// }

// // Add the 100 most common crops dynamically (you can replace these with actual crop names)
// const commonCrops = [
//     "Rice", "Maize", "Wheat", "Soybeans", "Potatoes", "Tomatoes", "Lettuce", "Jalapeños" // ... and so on
// ];

// const cropDropdown = document.getElementById("cropDropdown");
// commonCrops.forEach((crop) => {
//     const option = document.createElement("option");
//     option.value = crop.toLowerCase();
//     option.textContent = crop;
//     cropDropdown.appendChild(option);
// });





// function filterCrops() {
//     const input = document.getElementById("cropSelection");
//     const filter = input.value.toLowerCase();
//     const options = document.querySelectorAll("#cropSelection option");

//     options.forEach((option) => {
//         const cropName = option.textContent.toLowerCase();
//         if (cropName.includes(filter)) {
//             option.style.display = "block";
//         } else {
//             option.style.display = "none";
//         }
//     });
// }

// // Add the 100 most common crops dynamically (you can replace these with actual crop names)
// const commonCrops = [
//     "Rice", "Maize", "Wheat", "Soybeans", "Potatoes", "Tomatoes", "Lettuce", "Jalapeños" // ... and so on
// ];

// const cropSelection = document.getElementById("cropSelection");
// commonCrops.forEach((crop) => {
//     const option = document.createElement("option");
//     option.value = crop.toLowerCase();
//     option.textContent = crop;
//     cropSelection.appendChild(option);
// });





    function saveField() {
        console.log('Attempting to saveField');
    
        var fieldNameElement = document.getElementById("polygonName");
        var emailElement = document.getElementById("email");
    
        if (fieldNameElement && emailElement) {
            var fieldValue = fieldNameElement.value;
            var emailValue = emailElement.value;
    
            console.log('fieldValue:', fieldValue);
            console.log('emailValue:', emailValue);
    
            var area = document.getElementById("area").value;
            var currentCrop = document.getElementById("cropSelection").value;

            var plantDateElement = document.getElementById("plantDate");
            var harvestDateElement = document.getElementById("harvestDate");


            ///
            var plantDate = plantDateElement.value ? new Date(plantDateElement.value).toISOString().split('T')[0] : null;
            var harvestDate = harvestDateElement.value ? new Date(harvestDateElement.value).toISOString().split('T')[0] : null;

            ///

            // Convert date strings to ISO 8601 format
    

            console.log('plantDate:', plantDate);
            console.log('harvestDate:', harvestDate);
    
            

            // Get all layers from the drawnItems feature group
            var allDrawnLayers = drawnItems.getLayers();

            // Extracting coordinates from allDrawnLayers
            var latLngs = allDrawnLayers.map(layer => {
                if (layer instanceof L.Polygon || layer instanceof L.Polyline) {
                    return layer.getLatLngs(); // For polygons and polylines
                } else if (layer instanceof L.Marker) {
                    return layer.getLatLng(); // For markers
                }
                // Add additional checks for other layer types if needed
            });
            // Flatten the coordinates array
            //var flatLatLngs = latLngs.flat(Infinity);
            var flatLatLngs = latLngs.flat(Infinity).map(latlng => ({ lat: latlng.lat, lng: latlng.lng }));



            console.log('latLngs from drawnItems:', flatLatLngs);

            // Prepare data object with coordinates
            var data = {
                fieldName: fieldValue,
                email: emailValue,
                area: area,
                currentCrop: currentCrop,
                plantDate: plantDate,
                harvestDate: harvestDate,
                coordinates: flatLatLngs.map(point => [point.lat, point.lng])



            };
    
            console.log('Data before sending:', data);

            console.log('Coordinates before sending:', JSON.stringify(flatLatLngs));
    
            // Send data to the backend
            fetch('/save_field', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            })
            .then(response => response.json())
            .then(result => {
                console.log('Success:', result);
                // Handle success if needed
            })
            .catch((error) => {
                console.error('Error:', error);
                // Handle error if needed
            });
    
        } else {
            console.error('Element with ID "polygonName" or "email" not found');
        }
    }
    

    
    // Make the saveField function globally accessible
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

    // var drawControl = new L.Control.Draw({

    //     draw: {
    //         polygon: {
    //             shapeOptions: {
    //                 fillColor: '#ff5a5e',
    //                 color: '#ff5a5e'
    //             },
    //             tooltip: 'Draw your field boundaries!' // Tooltip text for the polygon button
    //         },
    //         // Add more draw options with tooltips as needed
    //         circle: false,
    //         marker: false, // Disable marker drawing
    //         polyline: false, // Disable polyline drawing
    //         rectangle: false // Disable rectangle drawing
    //     },
    //     edit: {
    //         featureGroup: drawnItems,
    //         remove: true
    //     }
    // });

    // map.addControl(drawControl);

    ////
    map.on('draw:created', function (event) {
        var layer = event.layer;
        drawnItems.addLayer(layer);
        console.log('Polygon created:', layer);

        // Update the area field with the area of the drawn shape
        var areaField = document.getElementById("area");

        // Check if areaField is not null and not undefined
        if (areaField) {
            // Get the LatLngs from the layer
            var latLngs = layer.getLatLngs()[0]; // Assuming it's a polygon
            console.log('latLngs in map.on:', latLngs);

            // Calculate the area using Leaflet's getArea method
            var areaSquareMeters = L.GeometryUtil.geodesicArea(latLngs);

            // Convert square meters to hectares
            var areaHectares = (areaSquareMeters / 10000).toFixed(2);

            // Set the value of the areaField
            areaField.value = areaHectares;
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
        map.locate({ setView: true, maxZoom: 20 });
    
    }

    //scroll to map functionality 
    function scrollToMap() {
        var mapContainer = document.getElementById("map");

        if (mapContainer) {
            mapContainer.scrollIntoView({ behavior: 'smooth' });
        }
    }

    // Attach the scrollToMap function to the CTA button
    var ctaButton = document.getElementById("ctaButton");
    if (ctaButton) {
        ctaButton.addEventListener('click', scrollToMap);
    }
});


document.addEventListener('DOMContentLoaded', function () {
    // Your existing code here
  
    // Existing event listener
    var button = document.getElementById('saveFieldBtn');
    button.addEventListener('click', function (event) {
      event.preventDefault();
      toggleSaveState(button);
      saveField();
    });
  
    // New function to toggle button state
    function toggleSaveState(button) {
      button.classList.toggle('saved');
  
      if (button.classList.contains('saved')) {
        button.innerHTML = '<span class="icon">&#10003;</span> Field Saved! Check Your Email';
      } else {
        button.innerHTML = '<span class="icon">&#10003;</span> Save Field';
      }
    }
  });
  