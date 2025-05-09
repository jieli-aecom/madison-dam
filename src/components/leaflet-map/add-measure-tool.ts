import type { Map } from "leaflet";
import L from "leaflet";

import "./leaflet-measure";

export const addMeasureTool = (map: Map) => {
  const existingControl = document.querySelector(".leaflet-control-measure");
  if (existingControl) return;

  L.Measure = {
    title: "Measure Yourself",
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
};