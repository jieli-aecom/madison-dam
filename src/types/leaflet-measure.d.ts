import * as L from 'leaflet';

declare module 'leaflet' {
  // Extend the L namespace
  namespace control {
    function measure(options?: Record<string, any>): L.Control;
  }

  interface MeasureStrings {
    title?: string;
    linearMeasurement?: string;
    areaMeasurement?: string;
    start?: string;
    feet?: string;
    mile?: string;
    sqft?: string;
    acres?: string;
    color?: string;
    feetDecimals?: number;
    mileDecimals?: number;
    sqftDecimals?: number;
    acresDecimals?: number;
  }

  let Measure: MeasureStrings;
}