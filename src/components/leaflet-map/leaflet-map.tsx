import type { LeafletMouseEvent, Map } from "leaflet";
import { useEffect, useRef } from "react";
import {
  Marker,
  Popup,
  TileLayer,
  useMap,
  useMapEvent,
  useMapEvents,
} from "react-leaflet";
import L from "leaflet";

import "./leaflet-measure";
import "./leaflet-measure.css";
import { addMeasureTool } from "./add-measure-tool";

const tileAccount = "mapbox";
const tileStyle = "satellite-v9";
const tileToken = import.meta.env.VITE_MAPBOX_TOKEN;

const mapboxUrl = `https://api.mapbox.com/styles/v1/${tileAccount}/${tileStyle}/tiles/256/{z}/{x}/{y}@2x?access_token=${tileToken}`;
const mapboxAttribution =
  '© <a href="https://www.mapbox.com/about/maps/">Mapbox</a>';

export interface LeafletMapProps {
  setLatlng: (latlng: number[]) => void;
}

export function LeafletMap(props: LeafletMapProps) {
  const map = useMapEvents({
    click: (e: LeafletMouseEvent) => {
      const latlng = e.latlng;
      const lat = latlng.lat;
      const lng = latlng.lng;

      // Notify parent
      props.setLatlng([lat, lng]);

      // Add marker to location
      markerLayer.current?.clearLayers();
      L.marker([lat, lng]).addTo(markerLayer.current!);
    },
  });

  const markerLayer = useRef<L.LayerGroup>(null);
  const addMarkerLayer = () => {
    if (markerLayer.current) {
      map.removeLayer(markerLayer.current);
    }
    markerLayer.current = L.layerGroup().addTo(map);
  };

  useEffect(() => {
    if (!map) return;
    addMeasureTool(map);
    addMarkerLayer();
  }, [map]);

  return <TileLayer attribution={mapboxAttribution} url={mapboxUrl} />;
}
