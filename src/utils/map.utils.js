export function getAddress(yMaps, coords) {
  return yMaps.geocode(coords, {results: 1, kind: 'house'})
    .then(function (res) {
      const firstGeoObject = res.geoObjects.get(0);
      if (!firstGeoObject) return null;
      const address = [
        firstGeoObject.getCountry(),
        firstGeoObject.getAddressLine()
      ].filter(Boolean).join(', ');
      return address;
    });
}

export function createPlaneRoute(yMaps, coordinates, color) {
  return new yMaps.GeoObject ({
    geometry: {
      type: "LineString",
      coordinates: coordinates
    },
  }, {
    geodesic: true,
    strokeWidth: 3,
    strokeColor: color,
    strokeStyle: "shortdash"
  });
}

export function createRoadsRoute(yMaps, coordinates, polygon, color) {
  return yMaps.route(coordinates, {
    boundsAutoApply: true,
    routeActiveStrokeWidth: 3,
    routeActiveStrokeColor: color,
    wayPointVisible: false,
    pinVisible: false
  }).then(route => {
    const paths = yMaps.geoQuery(route.getPaths());
    let allPoints = [];

    paths.each(path => {
      allPoints = allPoints.concat(path.geometry.getCoordinates());
    });
    const firstPointInsidePolygonIndex = allPoints.findIndex(point => {
      return polygon.geometry.contains(point);
    });
    allPoints.splice(firstPointInsidePolygonIndex);

    const lineObject = new yMaps.GeoObject ({
      geometry: {
        type: "LineString",
        coordinates: allPoints
      }
    }, {
      geodesic: true,
      strokeWidth: 3,
      strokeColor: color
    });

    return lineObject;
  });
}

export function createRoutesToPolygon(yMaps, map, clickedPointCoords, polygon, planeRouteColor, roadRouteColor) {
  if (!polygon.getMap()) map.geoObjects.add(polygon);
  const polygonClosestPoint = polygon.geometry.getClosest(clickedPointCoords).position;
  const coordinatesArr = [clickedPointCoords, polygonClosestPoint]

  const planeRoute = createPlaneRoute(yMaps, coordinatesArr, planeRouteColor);
  return createRoadsRoute(yMaps, coordinatesArr, polygon, roadRouteColor).then(roadsRoute => {
    return {
      planeRoute,
      roadsRoute
    };
  });
}

export function expandPolygon (yMaps, polygonCoords, centerCoords, expandDistance) {
  const newPoints = [];
  for(let i = 0; i < polygonCoords.length; i++) {
    const point = polygonCoords[i];
    const initialDistance = yMaps.coordSystem.geo.getDistance(centerCoords, point);
    const direction = [
      point[0] - centerCoords[0],
      point[1] - centerCoords[1]
    ];

    const result = yMaps.coordSystem.geo.solveDirectProblem(centerCoords, direction, initialDistance + expandDistance);
    
    newPoints.push(result.endPoint);
  }
  return newPoints;
}
