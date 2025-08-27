import type { GroupMark } from "vega";
import { MAIN_BLUE } from "../colors";

const PADDING_X = 6;
const PADDING_Y = 6;

const BASE_OFFSET = 10;
const LINE_EXTEND_FACTOR = 1.1;

export type PointLabelSpecParams = {
  dataPointName: string;
  xFieldName: string;
  position?:
    | "top"
    | "bottom"
    | "left"
    | "right"
    | "top-right"
    | "top-left"
    | "bottom-right"
    | "bottom-left";
  offsetDistanceFactor?: number;
  width?: number;
  zIndex?: number;
  boxStrokeColor?: string;
  boxFillColor?: string;
  boxStrokeWidth?: number;
  boxFillOpacity?: number;
  boxCornerRadius?: number;
  lineStrokeColor?: string;
  lineStrokeWidth?: number;
  lineStrokeDash?: number[];
  lineHeight?: number;
  fontSize?: number;
  textColor?: string;
  textLines?: string[];
};

export const pointLabelSpec = (params: PointLabelSpecParams) => {
  const {
    dataPointName,
    xFieldName,
    width = 150,
    position = "top-right",
    offsetDistanceFactor = 1,
    zIndex = 1,
    boxStrokeColor = MAIN_BLUE,
    boxFillColor = MAIN_BLUE,
    boxStrokeWidth = 1,
    boxFillOpacity = 0.9,
    boxCornerRadius = 3,
    lineStrokeColor = MAIN_BLUE,
    lineStrokeWidth = 1,
    lineStrokeDash = [1, 0],
    lineHeight = 12,
    fontSize = 10,
    textColor = "#fff",
    textLines = ["Label Text"],
  } = params;

  const height = textLines.length * lineHeight + PADDING_Y * 2;

  const isDiagonalOffset = position.split("-").length === 2;
  const isHorizontalOffset = position === "left" || position === "right";
  const isVerticalOffset = position === "top" || position === "bottom";

  const offsetFactor = isDiagonalOffset ? 1 : Math.sqrt(2);
  const xOffsetDirection = position.includes("left") ? -1 : 1;
  const xAdditionalLeftOffset = position.includes("left") ? -width : 0;
  const yOffsetDirection = position.includes("bottom") ? 1 : -1;
  const yAdditionalTopOffset = position.includes("top") ? -height : 0;

  const boxXOffset = !isVerticalOffset
    ? BASE_OFFSET * offsetFactor * xOffsetDirection * offsetDistanceFactor +
      xAdditionalLeftOffset
    : -width / 2;
  const boxYOffset = !isHorizontalOffset
    ? BASE_OFFSET * offsetFactor * yOffsetDirection * offsetDistanceFactor +
      yAdditionalTopOffset
    : -height / 2;

  const lineXOffset = !isVerticalOffset
    ? BASE_OFFSET * LINE_EXTEND_FACTOR * xOffsetDirection * offsetDistanceFactor * offsetFactor
    : 0;
  const lineYOffset = !isHorizontalOffset
    ? BASE_OFFSET * LINE_EXTEND_FACTOR * yOffsetDirection * offsetDistanceFactor * offsetFactor
    : 0;

  const firstLineXOffset = boxXOffset + PADDING_X;
  const firstLineYOffset = boxYOffset + lineHeight + PADDING_Y;

  const mark = {
    type: "group",
    from: { data: dataPointName },
    marks: [
      // ------------------------------- Background box for label
      {
        type: "rect",
        from: { data: dataPointName },
        encode: {
          update: {
            x: {
              scale: "x",
              field: `argmin.${xFieldName}`,
              offset: boxXOffset,
            },
            y: { scale: "y", field: "min", offset: boxYOffset },
            width: { value: width },
            height: { value: height },
            fill: { value: boxFillColor },
            stroke: { value: boxStrokeColor },
            strokeWidth: { value: boxStrokeWidth },
            cornerRadius: { value: boxCornerRadius },
            fillOpacity: { value: boxFillOpacity },
            zindex: { value: zIndex },
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
            x2: {
              scale: "x",
              field: `argmin.${xFieldName}`,
              offset: lineXOffset,
            }, // End at label start
            y2: { scale: "y", field: "min", offset: lineYOffset }, // End at label
            stroke: { value: lineStrokeColor },
            strokeWidth: { value: lineStrokeWidth },
            strokeDash: { value: lineStrokeDash },
            zindex: { value: zIndex },
          },
        },
      },
    ],
  } as GroupMark;

  for (const textLine of textLines) {
    const lineYOffset =
      firstLineYOffset + textLines.indexOf(textLine) * lineHeight;
    mark?.marks?.push({
      type: "text",
      from: { data: dataPointName },
      encode: {
        update: {
          x: {
            scale: "x",
            field: `argmin.${xFieldName}`,
            offset: firstLineXOffset,
          }, // 10px to the right
          y: { scale: "y", field: "min", offset: lineYOffset }, // 10px above
          text: { value: textLine },
          fontSize: { value: fontSize },
          fill: { value: textColor },
          baseline: { value: "bottom" },
          zindex: { value: zIndex + 1 }, // Above background box
        },
      },
    });
  }
  return mark;
};
