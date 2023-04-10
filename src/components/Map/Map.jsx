import {useEffect, useRef, useState} from 'react';
import { YMaps, Map as YMap, Polygon, Placemark } from '@pbe/react-yandex-maps';
import classes from './Map.module.scss';
import {
  mkadPoints,
  YMAP_API_KEY,
  center,
  zoom,
  expandMkadMeters,
  mkadPlaneRouteColor,
  mkadRoadsRouteColor,
  expandedMkadPlaneRouteColor,
  expandedMkadRoadsRouteColor,
  mkadPolygonColor,
  expandedMkadPolygonColor,
  polygonOpacity
} from '../../constants/map.constants';
import useSnackbar from '../Snackbar/useSnackbar';
import { getAddress, createRoutesToPolygon, expandPolygon } from '../../utils/map.utils';

function Map({
  addPoint,
  currentPoint
}) {
  const {enqueueSnackbar} = useSnackbar();

  const [map, setMap] = useState();
  const [yMaps, setYMaps] = useState();
  const [mkadPolygon, setMkadPolygon] = useState();
  const [expandedMkadPolygon, setExpandedMkadPolygon] = useState();
  const [visibleObjCollection, setVisibleObjCollection] = useState();
  const [expandCoords, setExpandCoords] = useState();

  useEffect(() => {
    if (!yMaps) return;
    const expandedPolygon = expandPolygon(yMaps, mkadPoints, center, expandMkadMeters);
    setExpandCoords(expandedPolygon);
  }, [yMaps]);

  useEffect(() => {
    if (!yMaps || !map) return;
    const myGeoObjects = new yMaps.GeoObjectCollection();
    setVisibleObjCollection(myGeoObjects);
    map.geoObjects.add(myGeoObjects);
  }, [yMaps, map]);

  useEffect(() => {
    if (!map || !yMaps || !addPoint) return;
    async function onClick(e) {
      const coords = e.get('coords');
      const address = await getAddress(yMaps, coords);
      addPoint({
        coords,
        address
      });
      enqueueSnackbar(
        address ? address : 'Адрес не найден',
        'showAddress'
      );
      visibleObjCollection?.removeAll();
    }
    map.events.add('click', onClick);
    return () => {
      map.events.remove('click', onClick);
    }
  }, [map, yMaps, addPoint, visibleObjCollection]);

  useEffect(() => {
    if (!yMaps || !map || !visibleObjCollection || !currentPoint || !mkadPolygon || !expandedMkadPolygon) return; 

    let isCanceled = false;

    createRoutesToPolygon(yMaps, map, currentPoint.coords, mkadPolygon, mkadPlaneRouteColor, mkadRoadsRouteColor)
      .then(mkadRoutes => {
        if (isCanceled) return;
        visibleObjCollection.add(mkadRoutes.planeRoute);
        visibleObjCollection.add(mkadRoutes.roadsRoute);
      })

    /**
     * Промис, который возвращает маршруты для полигона МКАД и для полигона ближнего Подмосковья
     */

    // Promise.all([
    //   createRoutesToPolygon(yMaps, map, currentPoint.coords, mkadPolygon, mkadPlaneRouteColor, mkadRoadsRouteColor),
    //   createRoutesToPolygon(yMaps, map, currentPoint.coords, expandedMkadPolygon, expandedMkadPlaneRouteColor, expandedMkadRoadsRouteColor)
    // ]).then(([mkadRoutes, expandedMkadRoutes]) => {
    //   if (isCanceled) return;
    //   visibleObjCollection.add(mkadRoutes.planeRoute);
    //   visibleObjCollection.add(mkadRoutes.roadsRoute);
    //   visibleObjCollection.add(expandedMkadRoutes.planeRoute);
    //   visibleObjCollection.add(expandedMkadRoutes.roadsRoute);
    // });

    return () => {
      isCanceled = true;
      visibleObjCollection.removeAll();
    };
  }, [map, yMaps, visibleObjCollection, currentPoint, mkadPolygon, expandedMkadPolygon]);

  return (
    <div id={'map'} className={classes.Map}>
      <YMaps
        query={{ 
          apikey: YMAP_API_KEY,
          ns: 'use-load-option',
          load: 'GeoObjectCollection',
        }}
      >
        <YMap
          className={classes.Map__YMap}
          defaultState={{ 
            center: center, 
            zoom: zoom,
            controls: [
              'zoomControl', 
              'fullscreenControl'
            ]
          }}
          instanceRef={mapInstance => {
            setMap(mapInstance);
          }}
          onLoad={ymaps => setYMaps(ymaps)}
          modules={[
            'control.ZoomControl', 
            'control.FullscreenControl',
            'route',
            'geoQuery',
            'GeoObject',
            'geocode',
            // 'coordSystem'
            'coordSystem.geo'
          ]}
        >
          <Polygon
            geometry={[mkadPoints]}
            options={{
              fillColor: mkadPolygonColor,
              opacity: polygonOpacity
            }}
            instanceRef={polygon => setMkadPolygon(polygon)}
          />
          {
            expandCoords &&
            <Polygon
              geometry={[mkadPoints, expandCoords]}
              options={{
                fillColor: expandedMkadPolygonColor,
                opacity: polygonOpacity
              }}
              instanceRef={polygon => setExpandedMkadPolygon(polygon)}
            />
          }
          {
            currentPoint &&
            <Placemark
              geometry={currentPoint.coords}
              properties={{
                hintContent: currentPoint.address,
                balloonContentBody: currentPoint.address
              }}
            />
          }
        </YMap>
      </YMaps>
    </div>
  );
}

export default Map;