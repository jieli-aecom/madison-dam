import type { VisualizationSpec } from "vega-embed";
import { LIGHT_BLUE, LIGHT_GRAY, DARK_RED, MAIN_BLUE } from "./colors";

const MILLISECONDS_BY_DAY = 60 * 60 * 24 * 1000;
const TOOLTIP_WIDTH = 155;
const TEXT_LINE_HEIGHT = 15;
const TOOLTIP_PADDING_X = 6;
const TOOLTIP_PADDING_Y = 14;
const TOOLTIP_HEIGHT = TOOLTIP_PADDING_X * 2 + TEXT_LINE_HEIGHT * 3;
const TOOLTIP_KEY_WIDTH = 110;

export const levelsChartSpec: VisualizationSpec = {
  description: "A line chart showing values over time.",
  width: 700,
  height: 300,
  padding: 5,

  config: {
    legend: {
      titleFontSize: 14,
      labelFontSize: 12,
    },
    axis: {
      titleFontSize: 14,
      labelFontSize: 12,
    },
  },

  signals: [
    {
      name: "lookupDate",
      on: [
        {
          events: "pointermove",
          update: "invert('x', clamp(x(), 0, width))",
        },
      ],
    },
  ],

  data: [
    {
      name: "actuals",
      url: "data/actuals.json",
      format: {
        type: "json",
        parse: {
          date: "date:'%Y-%m-%d'",
        },
      },
    },
    {
      name: "anticipated",
      url: "data/anticipated.json",
      format: {
        type: "json",
        parse: {
          date: "date:'%Y-%m-%d'",
        },
      },
    },
    {
      name: "anticipated_filtered",
      source: "anticipated", // Filtering from the actuals dataset
      transform: [
        {
          type: "filter",
          expr: `(datum.date < lookupDate) & (datum.date > lookupDate - ${MILLISECONDS_BY_DAY})`,
        },
        {
          type: "aggregate",
          fields: ["value", "value"],
          ops: ["min", "argmin"],
          as: ["min", "argmin"],
        },
      ],
    },
    {
      name: "actuals_filtered",
      source: "actuals", // Filtering from the actuals dataset
      transform: [
        {
          type: "filter",
          expr: `(datum.date < lookupDate) & (datum.date > lookupDate - ${MILLISECONDS_BY_DAY})`,
        },
        {
          type: "aggregate",
          fields: ["value", "value"],
          ops: ["min", "argmin"],
          as: ["min", "argmin"],
        },
      ],
    },
  ],

  scales: [
    {
      name: "x",
      type: "time",
      domain: {
        fields: [
          {
            data: "actuals",
            field: "date",
          },
          {
            data: "anticipated",
            field: "date",
          },
        ],
      },
      range: "width",
    },
    {
      name: "y",
      type: "linear",
      domain: { data: "anticipated", field: "value" },
      range: "height",
      nice: true,
      zero: false,
    },
    {
      name: "color",
      type: "ordinal",
      range: [DARK_RED, MAIN_BLUE],
      domain: ["Actual Reservoir Level", "Target Reservoir Level"],
    },
  ],

  axes: [
    {
      orient: "bottom",
      scale: "x",
      format: "%b %Y",
      title: "Date",
      tickCount: 8,
      labelAngle: -45,
      labelPadding: 18,
      labelOffset: -16,
      titlePadding: 8,
      labelFontSize: 10
    },
    {
      orient: "left",
      scale: "y",
      title: "Reservoir Elevation (ft)",
      format: "~d",
    },
  ],

  marks: [
    {
      type: "line",
      from: { data: "anticipated" },
      clip: true,
      encode: {
        enter: {
          x: { scale: "x", field: "date" },
          y: { scale: "y", field: "value" },
          stroke: { value: MAIN_BLUE },
          strokeWidth: { value: 1.5 },
          strokeDash: { value: [1.5, 2] },
        },
      },
    },
    {
      type: "line",
      from: { data: "actuals" },
      encode: {
        enter: {
          x: { scale: "x", field: "date" },
          y: { scale: "y", field: "value" },
          stroke: { value: DARK_RED },
          strokeWidth: { value: 2 },
        },
      },
    },
    {
      type: "symbol",
      from: { data: "actuals_filtered" },
      encode: {
        update: {
          x: { scale: "x", field: "argmin.date" },
          y: { scale: "y", field: "min" },
          stroke: { value: DARK_RED },
          fill: { value: "#fff" },
          size: { value: 100 },
          strokeWidth: { value: 3 },
          opacity: { value: 1 },
          zindex: { value: 1 },
        },
      },
    },

    {
      type: "symbol",
      from: { data: "anticipated_filtered" },
      encode: {
        update: {
          x: { scale: "x", field: "argmin.date" },
          y: { scale: "y", field: "min" },
          stroke: { value: LIGHT_BLUE },
          fill: { value: "#fff" },
          size: { value: 100 },
          strokeWidth: { value: 2 },
          opacity: { value: 1 },
          zindex: { value: 1 },
        },
      },
    },

    {
      type: "rule",
      encode: {
        update: {
          x: { scale: "x", signal: "lookupDate", offset: 0.5 },
          y: { value: 0 },
          y2: { field: { group: "height" } },
          stroke: { value: LIGHT_GRAY },
          strokeDash: { value: [3, 3] },
        },
      },
    },

    {
      type: "group",
      from: { data: "anticipated_filtered" },
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
          from: { data: "anticipated_filtered" },
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
          from: { data: "anticipated_filtered" },
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
          from: { data: "actuals_filtered" },
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
    },
  ],

  legends: [
    {
      fill: "color",
      title: "Reservoir Levels",
      orient: "bottom-right",
      offset: 8,
      encode: {
        symbols: {
          update: {
            strokeWidth: { value: 1 },
            shape: { value: "circle" },
            opacity: { value: 1 },
          },
        },
      },
    },
  ],
};
