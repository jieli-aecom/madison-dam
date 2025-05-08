import type { Map } from "leaflet";
import { useEffect } from "react";
import { Marker, Popup, TileLayer, useMap } from "react-leaflet";
import L from "leaflet";

import "./leaflet-measure";
import "./leaflet.css";
import "./leaflet-measure.css";

const tileAccount = "mapbox";
const tileStyle = "satellite-v9";
const tileToken = import.meta.env.VITE_MAPBOX_TOKEN;

const mapboxUrl = `https://api.mapbox.com/styles/v1/${tileAccount}/${tileStyle}/tiles/256/{z}/{x}/{y}@2x?access_token=${tileToken}`;
const mapboxAttribution =
  '© <a href="https://www.mapbox.com/about/maps/">Mapbox</a>';

export function LeafletMap() {
  const map: Map = useMap();
  useEffect(() => {
    if (!map) return;

    // Do not add if already added
    const existingControl = document.querySelector(".leaflet-control-measure");
    if (existingControl) return;

    L.Measure = {
      title: "Measure",
      linearMeasurement: "Distance",
      areaMeasurement: "Area",
      start: "Start",
      feet: "ft",
      mile: "miles",
      sqft: "sqft",
      acres: "acres",
      feetDecimals: 0,
      mileDecimals: 2,
      sqftDecimals: 0,
      acresDecimals: 2,
    };

    L.control.measure().addTo(map);
  }, [map]);
  return (
    <>
      <TileLayer attribution={mapboxAttribution} url={mapboxUrl} />
      <Marker position={[51.505, -0.09]}>
        <Popup>
          A pretty CSS3 popup. <br /> Easily customizable.
        </Popup>
      </Marker>
    </>
  );
}
