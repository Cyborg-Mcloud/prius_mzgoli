
var infoWindow, tempMarker, geocoder;
var dirService, dirRender;
var startMarker, endMarker, positionMarker;
var startPosListener, endPosListener, selPosListener;

function geocodeLocation(position, infoWindow, markerName) {
    console.log("geocodeLocation")
    geocoder.geocode({
        latLng: position
    }, function (responses) {
        console.log("geocodeLocation: "+ markerName )
        if (responses && responses.length > 0) {
            console.log(responses[0].formatted_address)
            infoWindow.setContent(getInfoContent(responses[0].formatted_address));
        } else {
      //      infoWindow.setContent(getInfoContent(markerName));
		  console.log("position not received");
        }

    });
}

function initMap() 
	{


    var position = {lat: MyLat, lng: MyLong};

    map = new google.maps.Map(document.getElementById('gmap'), {
        zoom: 18,
        center: position,
        zIndex: 70,
        fullscreenControl: false,
        streetViewControl: false,
        mapTypeControl: false,
    });

    geocoder = new google.maps.Geocoder();
    dirRender = new google.maps.DirectionsRenderer({suppressMarkers: true});
    dirService = new google.maps.DirectionsService();
    START_ICON = {
        url: "resources/pin_start.svg", // url
        scaledSize: new google.maps.Size(30, 36), // size
        origin: new google.maps.Point(0, 0), // origin
        anchor: new google.maps.Point(15, 36), // anchor
        ratation: 30
    };
    END_ICON = {
        url: "resources/pin_end.svg", // url
        scaledSize: new google.maps.Size(30, 36), // size
        origin: new google.maps.Point(0, 0), // origin
        anchor: new google.maps.Point(15, 36), // anchor
        ratation: 30
    };
    var myicon = {
        url: "resources/pin_start.svg", // url
        scaledSize: new google.maps.Size(30, 36), // size
        origin: new google.maps.Point(0, 0), // origin
        anchor: new google.maps.Point(15, 36), // anchor
        ratation: 30
    };

    var caricon = {
        url: "resources/car.svg", // url
        scaledSize: new google.maps.Size(50, 50), // size
        origin: new google.maps.Point(0, 0), // origin
        anchor: new google.maps.Point(25, 25) // anchor
    };
    var gpsIcon = {
        url: "resources/images/Clustericon.svg", // url
        scaledSize: new google.maps.Size(30, 30), // size
        origin: new google.maps.Point(0, 0), // origin
        anchor: new google.maps.Point(29, 29) // anchor


    };
    startMarker = new google.maps.Marker({
        icon: START_ICON,
        map: map
    });
    endMarker = new google.maps.Marker({
        icon: END_ICON, map: map
    });
    positionMarker = new google.maps.Marker({
        position: position,
        map: map,
        icon: gpsIcon,
        optimized: false
    });
    infoWindow = new google.maps.InfoWindow({content: getInfoContent('')});
    tempMarker = new google.maps.Marker();

    selPosListener = map.addListener('click', function (e) {
        geocodeOnClick(e);
       // infoWindow.open(map, tempMarker);
    });

	positionMarker.addListener('click', function () {
      //  map.setOptions({zoom: map.zoom + 2, center: position});
	   geocodeOnClick(e);
    });
    //setState(0);

    var card = document.getElementById('pac-card');
    var input = document.getElementById('pac-input');

    var strictBounds = document.getElementById('strict-bounds-selector');


    map.controls[google.maps.ControlPosition.TOP_LEFT].push(card);
    var autocomplete = new google.maps.places.Autocomplete(input);

    autocomplete.bindTo('bounds', map);
    autocomplete.addListener('place_changed', function () {
        // infoWindow.close();
        tempMarker.setVisible(false);
        var place = autocomplete.getPlace();
        if (!place.geometry) {
            // User entered the name of a Place that was not suggested and
            // pressed the Enter key, or the Place Details request failed.
            window.alert("No details available for input: '" + place.name + "'");
            return;
        }

        // If the place has a geometry, then present it on a map.
        if (place.geometry.viewport) {
            map.fitBounds(place.geometry.viewport);
        } else {
            map.setCenter(place.geometry.location);
            map.setZoom(17); // Why 17? Because it looks good.
        }

        //tempMarker.setPosition(place.geometry.location);
		geocodeOnClick({latLng: place.geometry.location})

        // geocodePosition(place.geometry.location, currentField);
        tempMarker.setVisible(true);
        var address = '';
        if (place.address_components) {
            address = [
                (place.address_components[0] && place.address_components[0].short_name || ''),
                (place.address_components[1] && place.address_components[1].short_name || ''),
                (place.address_components[2] && place.address_components[2].short_name || '')
            ].join(' ');
        }

        // infoWindowContent.children['place-icon'].src = place.icon;
        // infoWindowContent.children['place-name'].textContent = place.name;
        // infoWindowContent.children['place-address'].textContent = address;
        infoWindow.open(map, tempMarker);
    });

}

function geocodeOnClick(e) 
	{
    // infoWindow.close();
	if (state==0)
		{
		startMarker.setPosition(e.latLng);
		startMarker.setMap(map);
		geocodeLocation(startMarker.getPosition(), infoWindow, 'startMarker');
	    infoWindow.open(map, startMarker);
		}
	else if (state==1)
		{
		endMarker.setPosition(e.latLng);
		endMarker.setMap(map);	
		geocodeLocation(endMarker.getPosition(), infoWindow, 'endMarker');
	    infoWindow.open(map, endMarker);
		}    
	}

function getInfoContent(address) 
	{
    return "<div style='text-align: center; color:black'><div>" + address + "</div><br>";
	}

var state = 0;
const SWITCH_TEXTS = ['დასაწყისის არჩევა', 'დანიშნულების არჩევა', 'თავიდან არჩევა'];

function setState(newState)
	{
	
	//	calcRoute(startMarker.getPosition(), endMarker.getPosition(), dirService, dirRender);
	
	}

function switchState() {
    if (state === 1 && (startMarker.getPosition() === undefined || endMarker.getPosition() === undefined)) {
//        setState(0);
        return;
    }
    //setState((state + 1) % 3);

}

function setLocation(marker, target) {
    target.setPosition(marker.getPosition());
    map.panTo(target.getPosition());

    if (marker === tempMarker || marker === positionMarker) {
        switchState();
        marker.setMap(null);
    }
}

function chooseLocation(curstate) 
	{
	if (curstate==0)
		{

		}
	}

function getPosition(loc) {
    return {
        lat: loc.lat(),
        lng: loc.lng()
    }
}

function calcRoute(from_loc, to_loc, directionsService, directionsDisplay) {
    var start = from_loc;
    var end = to_loc;
    var request = {
        origin: start,
        destination: end,
        travelMode: google.maps.TravelMode.DRIVING
    };
    directionsService.route(request, function (response, status) {
        if (status === google.maps.DirectionsStatus.OK) {
            var route = response.routes[0].legs[0];
            addMarker(startMarker, map, getPosition(route.start_location), map.getBounds());
            addMarker(endMarker, map, getPosition(route.end_location), map.getBounds());
            directionsDisplay.setDirections(response);

            directionsDisplay.setMap(map);
        } else {
            addMarkers(map, [from_loc, to_loc], map.getBounds());
        }
    });
}

function addMarkers(map, markers, bounds) {
    // Loop through our array of markers & place each one on the map

    addAndGetMarker(map, markers[0], bounds, 'A');
    addAndGetMarker(map, markers[1], bounds, 'B');
}

function addMarker(marker, map, position) {
    var bounds = map.getBounds();
    bounds.extend(position);
    marker.setPosition(position);
    marker.setMap(map);
    map.fitBounds(bounds);
}

function addAndGetMarker(map, position, bounds, label, icon) 
	{
    console.log("addAndGetMarker: "+position);
    bounds.extend(position);
    var marker = new google.maps.Marker({
        position: {lat: position['lat'], lng: position['lng']},
        map: map
    });
    if (label !== undefined) marker.setLabel(label);
    if (icon !== undefined) marker.setIcon(icon);
    console.log("addAndGetMarker: "+marker.position);
    marker.addListener('click', function () {
        map.setOptions({zoom: map.zoom + 2, center: position});
    });
    // Automatically center the map fitting all markers on the screen
    map.fitBounds(bounds);

}

var START_ICON, END_ICON;

//  mapTypeId: 'satellite',