function calculateRouteFromAtoB(platform) {
    var router = platform.getRoutingService(null, 8),
        routeRequestParams = {
          routingMode: 'fast',
          transportMode: 'car',
          origin: '52.5160,13.3779', // Brandenburg Gate
          destination: '52.5206,13.3862', // Friedrichstraße Railway Station
          return: 'polyline,turnByTurnActions,actions,instructions,travelSummary'
        };
  
    router.calculateRoute(
      routeRequestParams,
      onSuccess,
      onError
    );
  }
  
  function onSuccess(result) {
    var route = result.routes[0];
    addRouteShapeToMap(route);
    addManueversToMap(route);
  }
  
  function onError(error) {
    alert('Can\'t reach the remote server');
  }

  var mapContainer1 = document.getElementById('map');
  var platform = new H.service.Platform({
    apikey: JSON.parse(document.querySelector('#api-key').value).apiKey //pulling it from env
  });
  
  var defaultLayers = platform.createDefaultLayers();
  
  // Step 2: initialize a map - this map is centered over Berlin
  var map = new H.Map(mapContainer1,
    defaultLayers.vector.normal.map, {
    center: {lat: 52.5160, lng: 13.3779},
    zoom: 13,
    pixelRatio: window.devicePixelRatio || 1
  });
  
  // add a resize listener to make sure that the map occupies the whole container
  window.addEventListener('resize', () => map.getViewPort().resize());
  var behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(map));
  var ui = H.ui.UI.createDefault(map, defaultLayers);
  var bubble;

  function openBubble(position, text) {
    if (!bubble) {
      bubble = new H.ui.InfoBubble(
        position,
        {content: text});
      ui.addBubble(bubble);
    } else {
      bubble.setPosition(position);
      bubble.setContent(text);
      bubble.open();
    }
  }

  function addRouteShapeToMap(route) {
    route.sections.forEach((section) => {
      // decode LineString from the flexible polyline
      let linestring = H.geo.LineString.fromFlexiblePolyline(section.polyline);
  
      // Create a polyline to display the route:
      let polyline = new H.map.Polyline(linestring, {
        style: {
          lineWidth: 4,
          strokeColor: 'rgba(0, 128, 255, 0.7)'
        }
      });
      map.addObject(polyline);
      map.getViewModel().setLookAtData({
        bounds: polyline.getBoundingBox()
      });
    });
  }
  
  function addManueversToMap(route) {
    var svgMarkup = '<svg width="18" height="18" ' +
      'xmlns="http://www.w3.org/2000/svg">' +
      '<circle cx="8" cy="8" r="8" ' +
        'fill="#1b468d" stroke="white" stroke-width="1" />' +
      '</svg>',
      dotIcon = new H.map.Icon(svgMarkup, {anchor: {x:8, y:8}}),
      group = new H.map.Group(),
      i,
      j;
  
    route.sections.forEach((section) => {
      let poly = H.geo.LineString.fromFlexiblePolyline(section.polyline).getLatLngAltArray();
  
      let actions = section.actions;
      // Add a marker for each maneuver
      for (i = 0; i < actions.length; i += 1) {
        let action = actions[i];
        var marker = new H.map.Marker({
          lat: poly[action.offset * 3],
          lng: poly[action.offset * 3 + 1]},
          {icon: dotIcon});
        marker.instruction = action.instruction;
        group.addObject(marker);
      }
  
      group.addEventListener('tap', function (evt) {
        map.setCenter(evt.target.getGeometry());
        openBubble(evt.target.getGeometry(), evt.target.instruction);
      }, false);
  
      // Add the maneuvers group to the map
      map.addObject(group);
    });
  }

  function addBridgeMarker(latitude, longitude){
    var bridgeIcon = new H.map.Icon("/images/bridge.svg", {anchor: {x:8, y:8}});
    var marker = new H.map.Marker({
        lat: latitude, 
        lng: longitude},
        {icon: bridgeIcon});
    
        map.addObject(marker);
      
  }

  var geofence;
  function addGeofence(latitude, longitude){
    geofence = new H.map.Circle(
      {lat:latitude, lng:longitude},
      50,
      {
        style: {
            strokeColor: 'rgba(55, 85, 170, 0.6)', // Color of the perimeter
            lineWidth: 2,
            fillColor: 'rgba(0, 128, 0, 0.7)' 
        }
      }
    )
    map.addObject(geofence);
  }

  var vehicleMarker;
  function addVehicleMarker(lat, lng){
    var vehicleIcon = new H.map.Icon("/images/truck.svg");
    vehicleMarker = new H.map.Marker({ lat: lat, lng: lng }, {icon: vehicleIcon});
    map.addObject(vehicleMarker);
  }

  function simulateVehicleMovement(lat0, lng0){
    var lat = lat0;
    var lng = lng0;
    var changeDir = false;
    var stop = false;

    let interval = setInterval(function() {
      if(!changeDir){
        lng += 0.0001;
        lat += 0.000007;
      }
      else{
        lat += 0.00005;
      }

      if(!stop)
        vehicleMarker.setGeometry({ lat: lat + 0.0001, lng: lng});
      console.log(lat + " " + lng);
      if(lat > 52.51653899999973 && lng > 13.385599999999982){
        changeDir = true;
        console.log("Change Dir");
      }
      if(lat > 52.51740000000002){
        stop = true;
        console.log("Stop!!!");
        clearInterval(interval);
        alert("Bridge Incoming!!");
      }
  }, 100);
    }

 
  calculateRouteFromAtoB(platform);
  var lat = 52.51800
  lng = 13.385510;
  addBridgeMarker(lat, lng);
  addGeofence(lat - 0.00010, lng + 0.00010);

  var vehicleLat = 52.51670 , vehicleLng = 13.385580;
  var origLat = 52.5160, origLng = 13.3779;
  addVehicleMarker(origLat, origLng);

  $(document).on("click", "#simulate1", (event) => {
    simulateVehicleMovement(origLat, origLng);
})
  

  