import type { Mark } from "vega";

export const pointSpec = (
  dataPointName: string,
  xFieldName: string,
  size: number,
  fillColor: string,
  pointStrokeColor: string,
  strokeWidth: number,
  opacity: number = 1,
  zIndex: number = 1,
) => {
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
