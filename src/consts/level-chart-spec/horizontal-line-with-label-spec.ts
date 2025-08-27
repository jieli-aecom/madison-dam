import type { GroupMark } from "vega";

export type HorizontalLineWithLabelSpecParams = {
  yValue?: number;
  strokeColor: string;
  textColor: string;
  text: string;
  xOffset?: number;
};

export const horizontalLineWithLabelSpec = (
  params: HorizontalLineWithLabelSpecParams
) => {
  const { yValue = 1207, strokeColor, textColor, text, xOffset = 0 } = params;
  return {
    type: "group",
    marks: [
      {
        type: "rule",
        encode: {
          enter: {
            y: { scale: "y", value: yValue },
            x2: { signal: "width" },
            stroke: { value: strokeColor },
            strokeWidth: { value: 1 },
            strokeDash: { value: [4, 4] },
          },
        },
      },

      {
        type: "text",
        encode: {
          enter: {
            x: { value: 5, offset: xOffset },
            y: { scale: "y", value: yValue, offset: -3 },
            text: { value: text },
            fontSize: { value: 9 },
            align: { value: "left" },
            baseline: { value: "bottom" },
            fill: { value: textColor },
          },
        },
      },
    ],
  } as GroupMark;
};
