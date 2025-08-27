import type { Mark } from "vega";

const TOOLTIP_WIDTH = 155;
const TEXT_LINE_HEIGHT = 15;
const TOOLTIP_PADDING_X = 6;
const TOOLTIP_PADDING_Y = 14;
const TOOLTIP_HEIGHT = TOOLTIP_PADDING_X * 2 + TEXT_LINE_HEIGHT * 3;
const TOOLTIP_KEY_WIDTH = 110;

export const tooltipBoxSpec = (
  anticipatedDataPointName: string,
  actualDataPointName: string
) => {
  return {
    type: "group",
    from: { data: anticipatedDataPointName },
    encode: {
      update: {
        x: {
          scale: "x",
          signal: `min(datum.argmin.date, invert('x', clamp(x(), 0, width - ${TOOLTIP_WIDTH})))`,
          offset: 0,
        },
        y: {
          scale: "y",
          signal: "max(datum.min, invert('y', clamp(y(), 0, height - 60)))",
          offset: 15,
        },
        width: { value: TOOLTIP_WIDTH },
        height: { value: TOOLTIP_HEIGHT },
        fill: { value: "#fff" },
        fillOpacity: { value: 0.85 },
        stroke: { value: "#aaa" },
        strokeWidth: { value: 0.5 },
      },
    },

    marks: [
      {
        type: "text",
        from: { data: anticipatedDataPointName },
        encode: {
          update: {
            x: { value: TOOLTIP_PADDING_X },
            y: { value: TOOLTIP_PADDING_Y },
            text: {
              signal: "timeFormat(datum.argmin.date, '%b %d, %Y')",
            },
            baseline: { value: "middle" },
            fontWeight: { value: "bold" },
          },
        },
      },

      {
        type: "text",
        encode: {
          update: {
            x: { value: TOOLTIP_PADDING_X },
            y: { value: TOOLTIP_PADDING_Y + TEXT_LINE_HEIGHT },
            text: {
              signal: "'Anticipated Level:'",
            },
            baseline: { value: "middle" },
            fontWeight: { value: "bold" },
          },
        },
      },

      {
        type: "text",
        from: { data: anticipatedDataPointName },
        encode: {
          update: {
            x: { value: TOOLTIP_KEY_WIDTH },
            y: { value: TOOLTIP_PADDING_Y + TEXT_LINE_HEIGHT },
            text: {
              signal: "round(datum.min * 100) / 100",
            },
            baseline: { value: "middle" },
          },
        },
      },

      {
        type: "text",
        encode: {
          update: {
            x: { value: TOOLTIP_PADDING_X },
            y: { value: TOOLTIP_PADDING_Y + TEXT_LINE_HEIGHT * 2 },
            text: {
              signal: "'Actual Level:'",
            },
            baseline: { value: "middle" },
            fontWeight: { value: "bold" },
          },
        },
      },

      {
        type: "text",
        from: { data: actualDataPointName },
        encode: {
          update: {
            x: { value: TOOLTIP_KEY_WIDTH },
            y: { value: TOOLTIP_PADDING_Y + TEXT_LINE_HEIGHT * 2 },
            text: {
              signal: "round(datum.min * 100) / 100",
            },
            baseline: { value: "middle" },
          },
        },
      },
    ],
  } as Mark;
};
