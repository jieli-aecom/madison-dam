import type { LatLngBoundsExpression } from "leaflet";
import { LIGHT_BLUE, MAIN_BLUE } from "./colors";

export const CENTER_LAT = 42.85646962232206;
export const CENTER_LNG = -75.51577425201897;

export const MAX_BOUNDS: LatLngBoundsExpression = [
  [42.824167, -75.569728],
  [42.897029, -75.461208],
];

export const MARKER_OPTIONS = {
  radius: 20,
  color: LIGHT_BLUE,
  fillColor: LIGHT_BLUE,
  fillOpacity: 0.5,
  stroke: true,
  weight: 2,
};

export const REF_MARKER_OPTIONS = {
  radius: 20,
  color: MAIN_BLUE,
  fillColor: MAIN_BLUE,
  fillOpacity: 0.5,
  stroke: true,
  weight: 2,
};