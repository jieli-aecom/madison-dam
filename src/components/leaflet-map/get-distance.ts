import { FEET_IN_METER } from "../../consts/factors";
import type { LatLngExpression } from "leaflet";

const toRadians = (deg: number) => {
  return deg * (Math.PI / 180);
};
const square = (x: number) => {
  return Math.pow(x, 2);
};

export const getDistanceFt = (latlng1: number[], latlng2: number[]) => {
  var earthRadius = 6378137; // radius of the earth in feet
  var lat1 = toRadians(latlng1[0]);
  var lat2 = toRadians(latlng2[0]);
  var lat_dif = lat2 - lat1;
  var lng_dif = toRadians(latlng2[1] - latlng1[1]);
  var a =
    square(Math.sin(lat_dif / 2)) +
    Math.cos(lat1) * Math.cos(lat2) * square(Math.sin(lng_dif / 2));
  return 2 * earthRadius * Math.asin(Math.sqrt(a)) * FEET_IN_METER;
};

export const getShortestDistanceFt = (
  targetLatlgn: number[],
  latlngs: number[][]
) => {
  let minDistanceFt = Number.MAX_VALUE;
  let closestLatlng: number[] = latlngs[0];
  for (const latlng of latlngs) {
    const distanceFt = getDistanceFt(targetLatlgn, latlng);
    if (distanceFt < minDistanceFt) {
      minDistanceFt = distanceFt;
      closestLatlng = latlng;
    }
  }
  return {
    distanceFt: minDistanceFt,
    closestLatlng: closestLatlng as LatLngExpression,
  };
};
