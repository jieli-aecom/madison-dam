import type { VisualizationSpec } from "vega-embed";
import { DARK_RED, MAIN_BLUE } from "../colors";

export const otherSpecs: VisualizationSpec = {
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

  data: [],

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
      labelFontSize: 10,
    },
    {
      orient: "left",
      scale: "y",
      title: "Reservoir Elevation (ft)",
      format: "~d",
    },
  ],

  marks: [],
};
