import type { LeafletMouseEvent } from "leaflet";
import { useEffect, useRef } from "react";
import {
  TileLayer,
  useMapEvents,
} from "react-leaflet";
import L from "leaflet";

import "./leaflet-measure";
import "./leaflet-measure.css";
import { addMeasureTool } from "./add-measure-tool";
import { boundary } from "../../consts/boundary";
import type { GeoJsonObject } from "geojson";
import { LIGHT_BLUE } from "../../consts/colors";
import { getShortestDistanceFt } from "./get-distance";
import { boundaryPoints } from "../../consts/boundary-points";
import { MARKER_OPTIONS, REF_MARKER_OPTIONS } from "../../consts/map";
import type { LatLngExpression } from "leaflet";

const tileAccount = "mapbox";
const tileStyle = "satellite-v9";
const tileToken = import.meta.env.VITE_MAPBOX_TOKEN;

const mapboxUrl = `https://api.mapbox.com/styles/v1/${tileAccount}/${tileStyle}/tiles/256/{z}/{x}/{y}@2x?access_token=${tileToken}`;
const mapboxAttribution =
  '© <a href="https://www.mapbox.com/about/maps/">Mapbox</a>';

export interface LeafletMapProps {
  setDistanceFt: (distanceFt: number) => void;
}

export function LeafletMap(props: LeafletMapProps) {
  const map = useMapEvents({
    click: (e: LeafletMouseEvent) => {
      const latlng = e.latlng;
      const lat = latlng.lat;
      const lng = latlng.lng;

      // Closest distance and closest latlng
      const { distanceFt, closestLatlng } = getShortestDistanceFt(
        [lat, lng],
        boundaryPoints
      );
      props.setDistanceFt(distanceFt);

      // Add both markers
      markerLayer.current?.clearLayers();
      L.circle([lat, lng], MARKER_OPTIONS).addTo(markerLayer.current!);
      L.circle(closestLatlng as LatLngExpression, REF_MARKER_OPTIONS).addTo(
        markerLayer.current!
      );

      // Add another line betwen the two markers
      const line = L.polyline([latlng, closestLatlng], {
        color: LIGHT_BLUE,
        weight: 2,
        opacity: 0.85,
        dashArray: "2, 4",
      });
      line.addTo(markerLayer.current!);
      line.bringToBack();
    },
  });

  const markerLayer = useRef<L.LayerGroup>(null);
  const boundaryLayer = useRef<L.Layer>(null);

  const addMarkerLayer = () => {
    if (markerLayer.current) {
      map.removeLayer(markerLayer.current);
    }
    markerLayer.current = L.layerGroup().addTo(map);
  };

  const addBoundaryLayer = () => {
    if (boundaryLayer.current) {
      map.removeLayer(boundaryLayer.current);
    }

    boundaryLayer.current = L.geoJSON(boundary as GeoJsonObject);
    boundaryLayer.current.addTo(map);
  };

  useEffect(() => {
    if (!map) return;
    // addMeasureTool(map);
    addBoundaryLayer();
    addMarkerLayer();
  }, [map]);

  return <TileLayer attribution={mapboxAttribution} url={mapboxUrl} />;
}
