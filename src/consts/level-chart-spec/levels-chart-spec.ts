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
import { lineAreaSpec } from "./line-area-spec";
import { horizontalLineWithLabelSpec } from "./horizontal-line-with-label-spec";

const SIGNAL_NAME = "lookupDate";
const ACTUAL_LEVEL_DATA_SERIES_NAME = "actuals";
const ANTICIPATED_LEVEL_DATA_SERIES_NAME = "anticipated";
const ANTICIPATED_LEVEL_RANGE_DATA_SERIES_NAME = "anticipated_range";
const ACTUAL_LEVEL_DATA_POINT_NAME = "actuals_filtered";
const ANTICIPATED_LEVEL_DATA_POINT_NAME = "anticipated_filtered";

// Drawdown data points
const NORMAL_WINTER_DRAWDOWN_2025_DATA_POINT_NAME = "normalWinterDrawdown2025";
const NORMAL_WINTER_DRAWDOWN_2025_DATE_STRING = "2025-11-03";

const BEGIN_CONSTRUCTION_DATA_POINT_NAME = "beginConstruction";
const BEGIN_CONSTRUCTION_DATE_STRING = "2026-03-15";

const ACHIEVE_10FT_DRAWDOWN_DATA_POINT_NAME = "achieve10ftDrawdown";
const ACHIEVE_10FT_DRAWDOWN_DATE_STRING = "2026-05-15";

const BEGIN_REFILL_DATA_POINT_NAME = "beginRefill";
const BEGIN_REFILL_DATE_STRING = "2027-12-31";

const NORMAL_WINTER_DRAWDOWN_2028_DATA_POINT_NAME = "normalWinterDrawdown2028";
const NORMAL_WINTER_DRAWDOWN_2028_DATE_STRING = "2028-11-03";

const REFILL_RANGE_DATA_POINT_NAME = "refillRange";
const REFILL_RANGE_DATE_STRING = "2028-06-03";

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
    cursorFilteredDataPointSpec({
      sourceSeriesName: ANTICIPATED_LEVEL_DATA_SERIES_NAME,
      xFieldName: X_FIELD_NAME,
      dataPointName: ANTICIPATED_LEVEL_DATA_POINT_NAME,
      signalName: SIGNAL_NAME,
    }),

    // -------------------------------- Actual Level Filtered By Current Cursor
    cursorFilteredDataPointSpec({
      sourceSeriesName: ACTUAL_LEVEL_DATA_SERIES_NAME,
      xFieldName: X_FIELD_NAME,
      dataPointName: ACTUAL_LEVEL_DATA_POINT_NAME,
      signalName: SIGNAL_NAME,
    }),

    // -------------------------------- Markup data points for labels
    dateFilteredDataPointSpec({
      sourceSeriesName: ANTICIPATED_LEVEL_DATA_SERIES_NAME,
      dataPointName: NORMAL_WINTER_DRAWDOWN_2025_DATA_POINT_NAME,
      dateFieldName: X_FIELD_NAME,
      isoDateString: NORMAL_WINTER_DRAWDOWN_2025_DATE_STRING,
    }),

    dateFilteredDataPointSpec({
      sourceSeriesName: ANTICIPATED_LEVEL_DATA_SERIES_NAME,
      dataPointName: BEGIN_CONSTRUCTION_DATA_POINT_NAME,
      dateFieldName: X_FIELD_NAME,
      isoDateString: BEGIN_CONSTRUCTION_DATE_STRING,
    }),

    dateFilteredDataPointSpec({
      sourceSeriesName: ANTICIPATED_LEVEL_DATA_SERIES_NAME,
      dataPointName: ACHIEVE_10FT_DRAWDOWN_DATA_POINT_NAME,
      dateFieldName: X_FIELD_NAME,
      isoDateString: ACHIEVE_10FT_DRAWDOWN_DATE_STRING,
    }),

    dateFilteredDataPointSpec({
      sourceSeriesName: ANTICIPATED_LEVEL_DATA_SERIES_NAME,
      dataPointName: BEGIN_REFILL_DATA_POINT_NAME,
      dateFieldName: X_FIELD_NAME,
      isoDateString: BEGIN_REFILL_DATE_STRING,
    }),

    dateFilteredDataPointSpec({
      sourceSeriesName: ANTICIPATED_LEVEL_DATA_SERIES_NAME,
      dataPointName: NORMAL_WINTER_DRAWDOWN_2028_DATA_POINT_NAME,
      dateFieldName: X_FIELD_NAME,
      isoDateString: NORMAL_WINTER_DRAWDOWN_2028_DATE_STRING,
    }),

    dateFilteredDataPointSpec({
      sourceSeriesName: ANTICIPATED_LEVEL_RANGE_DATA_SERIES_NAME,
      dataPointName: REFILL_RANGE_DATA_POINT_NAME,
      dateFieldName: X_FIELD_NAME,
      yFieldName: Y1_FIELD_NAME,
      isoDateString: REFILL_RANGE_DATE_STRING,
    }),
  ],

  marks: [
    // -------------------------------- Anticipated Level Range Area
    lineAreaSpec({
      sourceSeriesName: ANTICIPATED_LEVEL_RANGE_DATA_SERIES_NAME,
      xFieldName: X_FIELD_NAME,
      y1FieldName: Y1_FIELD_NAME,
      y2FieldName: Y2_FIELD_NAME,
      fillColor: LIGHT_BLUE,
      fillOpacity: 0.3,
    }),

    // -------------------------------- Anticipated Level Line (Dashed)
    lineSpec({
      dataSeriesName: ANTICIPATED_LEVEL_DATA_SERIES_NAME,
      xFieldName: X_FIELD_NAME,
      yFieldName: Y_FIELD_NAME,
      strokeColor: MAIN_BLUE,
      strokeWidth: 1.5,
      dash: [1.5, 2],
    }),

    // -------------------------------- Actual Level Line (Highlighted)
    lineSpec({
      dataSeriesName: ACTUAL_LEVEL_DATA_SERIES_NAME,
      xFieldName: X_FIELD_NAME,
      yFieldName: Y_FIELD_NAME,
      strokeColor: DARK_RED,
      strokeWidth: 2,
    }),

    // -------------------------------- Horizontal Zero Line
    horizontalLineWithLabelSpec({
      yValue: 1208.2,
      strokeColor: LIGHT_GRAY,
      textColor: MAIN_BLUE,
      text: "Normal Target Winter Drawdown Level 1208.2 ft",
      xOffset: 270,
    }),
    horizontalLineWithLabelSpec({
      yValue: 1211.2,
      strokeColor: LIGHT_GRAY,
      textColor: MAIN_BLUE,
      text: "Normal Pool (Existing Spillway Crest Elevation) 1211.2 ft",
      xOffset: 250,
    }),
    horizontalLineWithLabelSpec({
      yValue: 1201.2,
      strokeColor: LIGHT_GRAY,
      textColor: MAIN_BLUE,
      text: "Target Construction Drawdown Level 1201.2 ft",
      xOffset: 280,
    }),

    // ------------------------------- Permenant labels for drawdown milestones
    pointLabelSpec({
      dataPointName: NORMAL_WINTER_DRAWDOWN_2025_DATA_POINT_NAME,
      xFieldName: X_FIELD_NAME,
      offsetDistanceFactor: 1.5,
      textLines: ["Normal Winter", "Drawdown", "November 2025"],
      width: 90,
      position: "top-right",
    }),

    pointLabelSpec({
      dataPointName: BEGIN_CONSTRUCTION_DATA_POINT_NAME,
      xFieldName: X_FIELD_NAME,
      offsetDistanceFactor: 1.5,
      textLines: ["Begin Construction", "March 2026"],
      width: 100,
      position: "bottom-left",
    }),

    pointLabelSpec({
      dataPointName: ACHIEVE_10FT_DRAWDOWN_DATA_POINT_NAME,
      xFieldName: X_FIELD_NAME,
      offsetDistanceFactor: 2,
      textLines: ["Achieve 10 ft", "Drawdown", "May 2026"],
      width: 75,
      position: "top-right",
    }),

    pointLabelSpec({
      dataPointName: BEGIN_REFILL_DATA_POINT_NAME,
      xFieldName: X_FIELD_NAME,
      offsetDistanceFactor: 2,
      textLines: ["Begin Refill", "January 2028"],
      width: 75,
      position: "top-left",
    }),

    pointLabelSpec({
      dataPointName: NORMAL_WINTER_DRAWDOWN_2028_DATA_POINT_NAME,
      xFieldName: X_FIELD_NAME,
      offsetDistanceFactor: 1.5,
      textLines: ["Normal Winter", "Drawdown", "November 2028"],
      width: 90,
      position: "top-left",
    }),

    // ------------------------------- Labels for Refill Range
    pointLabelSpec({
      dataPointName: REFILL_RANGE_DATA_POINT_NAME,
      xFieldName: X_FIELD_NAME,
      offsetDistanceFactor: 1.5,
      textLines: ["Range of Reservoir Refill", "Time (Dependent on", "Precipitation / Weather"],
      width: 125,
      position: "bottom-right",
      textColor: MAIN_BLUE,
      boxFillColor: LIGHT_BLUE,
      boxStrokeColor: LIGHT_BLUE,
      lineStrokeColor: LIGHT_BLUE,
    }),

    // -------------------------------- Actual Level Point Based on Cursor
    pointSpec({
      dataPointName: ACTUAL_LEVEL_DATA_POINT_NAME,
      xFieldName: X_FIELD_NAME,
      size: 100,
      fillColor: "#fff",
      pointStrokeColor: DARK_RED,
      strokeWidth: 3,
    }),

    // -------------------------------- Anticipated Level Point Based on Cursor
    pointSpec({
      dataPointName: ANTICIPATED_LEVEL_DATA_POINT_NAME,
      xFieldName: X_FIELD_NAME,
      size: 100,
      fillColor: "#fff",
      pointStrokeColor: LIGHT_BLUE,
      strokeWidth: 3,
    }),

    // -------------------------------- Vertical Rule Line Based on Cursor
    verticalRuleSpec(LIGHT_GRAY, SIGNAL_NAME),

    // -------------------------------- Tooltip Box based on Cursor
    tooltipBoxSpec(
      ANTICIPATED_LEVEL_DATA_POINT_NAME,
      ACTUAL_LEVEL_DATA_POINT_NAME
    ),
  ],
};
