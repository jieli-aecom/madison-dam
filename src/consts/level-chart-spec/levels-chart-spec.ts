import type { VisualizationSpec } from "vega-embed";
import { LIGHT_BLUE, LIGHT_GRAY, DARK_RED, MAIN_BLUE } from "../colors";
import { tooltipBoxSpec } from "./tooltip-box-spec";
import { lineSpec } from "./line-spec";
import { pointSpec } from "./point-spec";
import { verticalRuleSpec } from "./vertical-rule-spec";
import { otherSpecs } from "./other-specs";
import { cursorFilteredDataPointSpec } from "./cursor-filtered-data-point-spec";
import type { Mark, Signal } from "vega";
import { vegaFormatWithDateField } from "./consts";
import { dateFilteredDataPointSpec } from "./const-filtered-data-point-spec";
import { pointLabelSpec } from "./label-spec";

const SIGNAL_NAME = "lookupDate";
const ACTUAL_LEVEL_DATA_SERIES_NAME = "actuals";
const ANTICIPATED_LEVEL_DATA_SERIES_NAME = "anticipated";
const ANTICIPATED_LEVEL_RANGE_DATA_SERIES_NAME = "anticipated_range";
const ACTUAL_LEVEL_DATA_POINT_NAME = "actuals_filtered";
const ANTICIPATED_LEVEL_DATA_POINT_NAME = "anticipated_filtered";

// Drawdown data points
const NORMAL_WINTER_DRAWDOWN_2025_DATA_POINT_NAME = "normalWinterDrawdown2025";
const NORMAL_WINTER_DRAWDOWN_2025_DATE_STRING = "2025-12-03";

const X_FIELD_NAME = "date";
const Y_FIELD_NAME = "value";
const Y1_FIELD_NAME = "low";
const Y2_FIELD_NAME = "high";

// Only to avoid type error from vega-lite
// as `signals` and `marks` are essential parts of the spec
// but when it's defined dynamically like here, TS fails to recognize them.
type Corrected = VisualizationSpec & {
  signals?: Signal[];
  marks?: Mark[];
};

export const levelsChartSpec: Corrected = {
  ...otherSpecs,
  signals: [
    {
      name: SIGNAL_NAME,
      on: [
        {
          events: "pointermove",
          update: "invert('x', clamp(x(), 0, width))",
        },
      ],
    },
  ],

  data: [
    // -------------------------------- Raw Actual Level Data
    {
      name: ACTUAL_LEVEL_DATA_SERIES_NAME,
      url: "data/actuals.json",
      format: vegaFormatWithDateField,
    },
    // -------------------------------- Raw Anticipated Level Data
    {
      name: ANTICIPATED_LEVEL_DATA_SERIES_NAME,
      url: "data/anticipated.json",
      format: vegaFormatWithDateField,
    },
    // -------------------------------- Anticipated Level (Range), with `low` and `high` fields
    {
      name: ANTICIPATED_LEVEL_RANGE_DATA_SERIES_NAME,
      url: "data/anticipated_range.json",
      format: vegaFormatWithDateField,
    },

    // -------------------------------- Anticipated Level Filtered By Current Cursor
    cursorFilteredDataPointSpec(
      ANTICIPATED_LEVEL_DATA_SERIES_NAME,
      X_FIELD_NAME,
      ANTICIPATED_LEVEL_DATA_POINT_NAME,
      SIGNAL_NAME
    ),

    // -------------------------------- Actual Level Filtered By Current Cursor
    cursorFilteredDataPointSpec(
      ACTUAL_LEVEL_DATA_SERIES_NAME,
      X_FIELD_NAME,
      ACTUAL_LEVEL_DATA_POINT_NAME,
      SIGNAL_NAME
    ),

    dateFilteredDataPointSpec(
      ANTICIPATED_LEVEL_DATA_SERIES_NAME,
      NORMAL_WINTER_DRAWDOWN_2025_DATA_POINT_NAME,
      X_FIELD_NAME,
      NORMAL_WINTER_DRAWDOWN_2025_DATE_STRING
    ),
  ],

  marks: [
    // -------------------------------- Anticipated Level Range Area
    {
      type: "area",
      from: { data: ANTICIPATED_LEVEL_RANGE_DATA_SERIES_NAME },
      clip: true,
      encode: {
        enter: {
          x: { scale: "x", field: X_FIELD_NAME },
          y: { scale: "y", field: Y1_FIELD_NAME },
          y2: { scale: "y", field: Y2_FIELD_NAME },
          fill: { value: LIGHT_BLUE },
          fillOpacity: { value: 0.3 },
        },
      },
    },

    // -------------------------------- Anticipated Level Line (Dashed)
    lineSpec(
      ANTICIPATED_LEVEL_DATA_SERIES_NAME,
      X_FIELD_NAME,
      Y_FIELD_NAME,
      MAIN_BLUE,
      1.5,
      [1.5, 2]
    ),

    // -------------------------------- Actual Level Line (Highlighted)
    lineSpec(
      ACTUAL_LEVEL_DATA_SERIES_NAME,
      X_FIELD_NAME,
      Y_FIELD_NAME,
      DARK_RED,
      2,
      []
    ),
    // ------------------------------- Background box for label
    pointLabelSpec({
      dataPointName: NORMAL_WINTER_DRAWDOWN_2025_DATA_POINT_NAME,
      xFieldName: X_FIELD_NAME,
    }),

    // -------------------------------- Actual Level Point Based on Cursor
    pointSpec(
      {dataPointName: ACTUAL_LEVEL_DATA_POINT_NAME,
      xFieldName:X_FIELD_NAME,
      size: 100,
      fillColor: "#fff",
      pointStrokeColor: DARK_RED,
      strokeWidth: 3}
    ),

    // -------------------------------- Anticipated Level Point Based on Cursor
    pointSpec(
      {dataPointName:ANTICIPATED_LEVEL_DATA_POINT_NAME,
      xFieldName:X_FIELD_NAME,
      size:100,
      fillColor:"#fff",
      pointStrokeColor:LIGHT_BLUE,
      strokeWidth:3}
    ),

    // -------------------------------- Vertical Rule Line Based on Cursor
    verticalRuleSpec(LIGHT_GRAY, SIGNAL_NAME),

    // -------------------------------- Tooltip Box based on Cursor
    tooltipBoxSpec(
      ANTICIPATED_LEVEL_DATA_POINT_NAME,
      ACTUAL_LEVEL_DATA_POINT_NAME
    ),
  ],
};
