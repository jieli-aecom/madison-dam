import type { Mark } from "vega";
import { DARK_RED } from "../colors";

const TOOLTIP_WIDTH = 155;
const TEXT_LINE_HEIGHT = 15;
const TOOLTIP_PADDING_X = 6;
const TOOLTIP_PADDING_Y = 14;
const TOOLTIP_HEIGHT = TOOLTIP_PADDING_X * 2 + TEXT_LINE_HEIGHT * 3;
const TOOLTIP_KEY_WIDTH = 110;

export type PointLabelSpecParams = {
  dataPointName: string;
  xFieldName: string;
};

export const pointLabelSpec = (params: PointLabelSpecParams) => {
  const { dataPointName, xFieldName } = params;
  return {
    type: "group",
    from: { data: dataPointName },
    marks: [
      {
        type: "rect",
        from: { data: dataPointName },
        encode: {
          update: {
            x: { scale: "x", field: `argmin.${xFieldName}`, offset: 5 }, // 5px to the right
            y: { scale: "y", field: "min", offset: -25 }, // Position above point
            width: { value: 150 }, // Adjust width as needed
            height: { value: 18 }, // Adjust height as needed
            fill: { value: "#fff" },
            stroke: { value: DARK_RED },
            strokeWidth: { value: 1 },
            cornerRadius: { value: 3 },
            fillOpacity: { value: 0.9 },
            zindex: { value: 1 },
          },
        },
      },

      // ------------------------------- Connecting line from point to label
      {
        type: "rule",
        from: { data: dataPointName },
        encode: {
          update: {
            x: { scale: "x", field: `argmin.${xFieldName}` }, // Start at point
            y: { scale: "y", field: "min" }, // Start at point
            x2: { scale: "x", field: `argmin.${xFieldName}`, offset: 10 }, // End at label start
            y2: { scale: "y", field: "min", offset: -10 }, // End at label
            stroke: { value: DARK_RED },
            strokeWidth: { value: 1 },
            strokeDash: { value: [2, 2] }, // Optional: dashed line
            opacity: { value: 0.7 },
            zindex: { value: 1 },
          },
        },
      },

      // ------------------------------- Label text
      {
        type: "text",
        from: { data: dataPointName },
        encode: {
          update: {
            x: { scale: "x", field: `argmin.${xFieldName}`, offset: 10 }, // 10px to the right
            y: { scale: "y", field: "min", offset: -10 }, // 10px above
            text: { value: "Normal Winter Drawdown" },
            fontSize: { value: 12 },
            fontWeight: { value: "bold" },
            fill: { value: DARK_RED },
            align: { value: "left" },
            baseline: { value: "bottom" },
            zindex: { value: 2 }, // Above background box
          },
        },
      },
    ],
  } as Mark;
};
