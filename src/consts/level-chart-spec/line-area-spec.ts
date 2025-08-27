import type { Mark } from "vega";

export type LineAreaSpecParams = {
  sourceSeriesName: string;
  xFieldName: string;
  y1FieldName: string;
  y2FieldName: string;
  fillColor?: string;
  fillOpacity?: number;
};

export const lineAreaSpec = (params: LineAreaSpecParams) => {
  const {
    sourceSeriesName,
    xFieldName,
    y1FieldName,
    y2FieldName,
    fillColor = "#fff",
    fillOpacity = 0.3,
  } = params;
  return {
    type: "area",
    from: { data: sourceSeriesName },
    clip: true,
    encode: {
      enter: {
        x: { scale: "x", field: xFieldName },
        y: { scale: "y", field: y1FieldName },
        y2: { scale: "y", field: y2FieldName },
        fill: { value: fillColor },
        fillOpacity: { value: fillOpacity },
      },
    },
  } as Mark;
};
