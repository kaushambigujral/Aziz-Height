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

  function calculateRouteFromAtoB2(platform) {
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
      onSuccess2,
      onError
    );
  }

  function onSuccess2(result) {
    var route = result.routes[0];
    addRouteShapeToMap2(route);
    addManueversToMap2(route);
  }
  
  var mapContainer1 = document.getElementById('map');
  var mapContainer2 = document.getElementById('map2');
  var platform = new H.service.Platform({
    apikey: JSON.parse(document.querySelector('#api-key').value).apiKey //pulling it from env
  });
  var platform2 = new H.service.Platform({
    apikey: JSON.parse(document.querySelector('#api-key').value).apiKey //pulling it from env
  });
  
  var defaultLayers = platform.createDefaultLayers();
  var defaultLayers2 = platform2.createDefaultLayers();
  
  var map = new H.Map(mapContainer1,
    defaultLayers.vector.normal.map, {
    center: {lat: 52.5160, lng: 13.3779},
    zoom: 13,
    pixelRatio: window.devicePixelRatio || 1
  });

  var map2 = new H.Map(mapContainer2,
    defaultLayers2.vector.normal.map, {
    center: {lat: 52.5160, lng: 13.3779},
    zoom: 13,
    pixelRatio: window.devicePixelRatio || 1
  });
  
  // add a resize listener to make sure that the map occupies the whole container
  window.addEventListener('resize', () => map.getViewPort().resize());
  window.addEventListener('resize', () => map2.getViewPort().resize());
  var behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(map));
  var behavior2 = new H.mapevents.Behavior(new H.mapevents.MapEvents(map2));
  var ui = H.ui.UI.createDefault(map, defaultLayers);
  var ui2 = H.ui.UI.createDefault(map2, defaultLayers2);
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

  function addRouteShapeToMap2(route) {
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
      map2.addObject(polyline);
      map2.getViewModel().setLookAtData({
        bounds: polyline.getBoundingBox()
      });
    });
  }
  
  function addManueversToMap2(route) {
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
      map2.addObject(group);
    });
  }

  function addBridgeMarker(map, latitude, longitude){
    var bridgeIcon = new H.map.Icon("/images/bridge.svg", {anchor: {x:8, y:8}});
    var marker = new H.map.Marker({
        lat: latitude, 
        lng: longitude},
        {icon: bridgeIcon});
    
        map.addObject(marker);
      
  }

  function addGeofence(map, latitude, longitude){
    var geofence = new H.map.Circle(
      {lat:latitude, lng:longitude},
      50,
      {
        style: {
            strokeColor: 'rgba(55, 85, 170, 0.6)',
            lineWidth: 2,
            fillColor: 'rgba(0, 128, 0, 0.7)' 
        }
      }
    )
    map.addObject(geofence);
  }

  var vehicleMarker, vehicleMarker2;
  function addVehicleMarker(map, lat, lng){
    var vehicleIcon = new H.map.Icon("/images/truck.svg");
    vehicleMarker = new H.map.Marker({ lat: lat, lng: lng }, {icon: vehicleIcon});
    map.addObject(vehicleMarker);
  }

  function addVehicleMarker2(map2, lat, lng){
    var vehicleIcon = new H.map.Icon("/images/truck.svg");
    vehicleMarker2 = new H.map.Marker({ lat: lat, lng: lng }, {icon: vehicleIcon});
    map2.addObject(vehicleMarker2);
  }

  function simulateVehicleMovement(vehicleMarker, lat0, lng0){
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
  addBridgeMarker(map, lat, lng);
  addGeofence(map, lat - 0.00010, lng + 0.00010);

  var vehicleLat = 52.51670 , vehicleLng = 13.385580;
  var origLat = 52.5160, origLng = 13.3779;
  addVehicleMarker(map, origLat, origLng);

  $(document).on("click", "#simulate1", (event) => {
    event.preventDefault()
    simulateVehicleMovement(vehicleMarker, origLat, origLng);
  });
  //------------------------MAP 2 SETUP ---------------------
  calculateRouteFromAtoB2(platform2);
  addBridgeMarker(map2, lat, lng);
  addGeofence(map2, lat - 0.00010, lng + 0.00010);
  var lat2 = 52.51700
  lng2 = 13.385040;
  addBridgeMarker(map2, lat2, lng2);
  addGeofence(map2, lat2 - 0.00010, lng2 + 0.00010);
  addVehicleMarker2(map2, origLat, origLng);
  $(document).on("click", "#simulate2", (event) => {
    event.preventDefault();
    simulateVehicleMovement(vehicleMarker2, origLat, origLng);
  });

  