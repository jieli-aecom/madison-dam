import type { Mark } from "vega";

export type PointSpecParams = {
  dataPointName: string;
  xFieldName: string;
  size: number;
  fillColor: string;
  pointStrokeColor: string;
  strokeWidth: number;
  opacity?: number;
  zIndex?: number;
};

export const pointSpec = (
  params: PointSpecParams,
) => {
  const {
    dataPointName,
    xFieldName,
    size,
    fillColor,
    pointStrokeColor,
    strokeWidth,
    opacity = 1,
    zIndex = 0,
  } = params;
  const mark = {
    type: "symbol",
    from: { data: dataPointName },
    encode: {
      update: {
        x: { scale: "x", field: `argmin.${xFieldName}` },
        y: { scale: "y", field: "min" },
        stroke: { value: pointStrokeColor },
        fill: { value: fillColor },
        size: { value: size },
        strokeWidth: { value: strokeWidth },
        opacity: { value: opacity },
        zindex: { value: zIndex },
      },
    },
  } as Mark;

  return mark;
};
