import type { VisualizationSpec } from "vega-embed";
import "./App.css";
import { VegaChart } from "./components/vega-chart";
import { LIGHT_BLUE, MAIN_BLUE } from "./consts/colors";

const spec: VisualizationSpec = {
  description: "A line chart showing values over time.",
  width: 600,
  height: 400,
  padding: 5,

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
      // Filter actuals by matching the lookupDate (X-value)
      name: "anticipated_filtered",
      source: "anticipated", // Filtering from the actuals dataset
      transform: [
        {
          type: "filter",
          expr: "datum.date < lookupDate",
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
      range: [MAIN_BLUE, LIGHT_BLUE],
      domain: ['Actual Level', 'Anticipated Level'],
    }
  ],

  axes: [
    {
      orient: "bottom",
      scale: "x",
      format: "%b %Y",
      title: "Date",
      tickCount: 9,
    },
    {
      orient: "left",
      scale: "y",
      title: "Level",
    },
  ],

  marks: [
    {
      type: "line",
      from: { data: "actuals" },
      encode: {
        enter: {
          x: { scale: "x", field: "date" },
          y: { scale: "y", field: "value" },
          stroke: { value: "steelblue" },
          strokeWidth: { value: 2 },
          tooltip: {
            signal:
              "{'Date': timeFormat(datum.date, '%b %d, %Y'), 'Level': datum.value}",
          },
        },
      },
    },

    {
      type: "line",
      from: { data: "anticipated" },
      clip: true,
      encode: {
        enter: {
          x: { scale: "x", field: "date" },
          y: { scale: "y", field: "value" },
          stroke: { value: LIGHT_BLUE },
          strokeWidth: { value: 2 },
        },
      },
    },

    {
      type: "symbol",
      from: { data: "actuals" },
      encode: {
        update: {
          x: { scale: "x", field: "date" },
          y: { scale: "y", field: "value" },
          stroke: { value: MAIN_BLUE },
          fill: { value: MAIN_BLUE },
          size: { value: 10 },
          strokeWidth: { value: 0 },
          opacity: { value: 0.5 },
        },
        hover: {
          x: { scale: "x", field: "date" },
          y: { scale: "y", field: "value" },
          stroke: { value: MAIN_BLUE },
          fill: { value: "#fff" },
          size: { value: 100 },
          strokeWidth: { value: 3 },
          tooltip: {
            signal:
              "{'Date': timeFormat(datum.date, '%b %d, %Y'), 'Level': datum.value}",
          },
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
          stroke: { value: "firebrick" },
        },
      },
    },

    {
      type: "rule",
      from: { data: "anticipated_filtered" },
      clip: true,
      encode: {
        update: {
          x: { field: { group: "x" } },
          x2: { field: { group: "width" } },
          y: { scale: "y", field: "min" },
          stroke: { value: "red" },
          strokeWidth: { value: 2 },
        },
      },
    },

    {
      type: "text",
      from: { data: "anticipated_filtered" },
      encode: {
        update: {
          // "x": {"scale": "x", "field": "date", "offset": 2},
          // "y": {"scale": "y", "field": "indexed_price"},
          text: { signal: "datum.min + timeFormat(datum.argmin.date, '%b %d, %Y')" },
          baseline: { value: "middle" },
        },
      },
    },
  ],

  "legends": [
    {
      "fill": "color",
      "title": "Levels",
      "orient": "bottom-left",
      "offset": 8,
      "encode": {
        "symbols": {
          "update": {
            "strokeWidth": {"value": 0},
            "shape": {"value": "square"},
            "opacity": {"value": 0.3}
          }
        }
      }
    }
  ]
};

function App() {
  return (
    <section className="w-full h-[100vh] flex items-center justify-center">
      <VegaChart spec={spec} />
    </section>
  );
}

export default App;
