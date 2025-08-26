import type { VisualizationSpec } from "vega-embed";
import { LIGHT_BLUE, LIGHT_GRAY, DARK_RED, MAIN_BLUE } from "../colors";
import { tooltipBoxSpec } from "./tooltip-box-spec";
import { lineSpec } from "./line-spec";
import { pointSpec } from "./point-spec";
import { verticalRuleSpec } from "./vertical-rule-spec";
import { otherSpecs } from "./other-specs";
import { dataPointSpec } from "./data-point-spec";

const SIGNAL_NAME = "lookupDate";
const ACTUAL_LEVEL_DATA_SERIES_NAME = "actuals";
const ANTICIPATED_LEVEL_DATA_SERIES_NAME = "anticipated";
const ACTUAL_LEVEL_DATA_POINT_NAME = "actuals_filtered";
const ANTICIPATED_LEVEL_DATA_POINT_NAME = "anticipated_filtered";

export const levelsChartSpec: VisualizationSpec = {
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
      format: {
        type: "json",
        parse: {
          date: "date:'%Y-%m-%d'",
        },
      },
    },
    // -------------------------------- Raw Anticipated Level Data
    {
      name: ANTICIPATED_LEVEL_DATA_SERIES_NAME,
      url: "data/anticipated.json",
      format: {
        type: "json",
        parse: {
          date: "date:'%Y-%m-%d'",
        },
      },
    },
    // -------------------------------- Anticipated Level Filtered By Current Cursor
    dataPointSpec(
      ANTICIPATED_LEVEL_DATA_SERIES_NAME,
      ANTICIPATED_LEVEL_DATA_POINT_NAME,
      SIGNAL_NAME
    ),

    // -------------------------------- Actual Level Filtered By Current Cursor
    dataPointSpec(
      ACTUAL_LEVEL_DATA_SERIES_NAME,
      ACTUAL_LEVEL_DATA_POINT_NAME,
      SIGNAL_NAME
    ),
  ],

  marks: [
    // -------------------------------- Anticipated Level Line (Dashed)
    lineSpec(ANTICIPATED_LEVEL_DATA_SERIES_NAME, MAIN_BLUE, 1.5, [1.5, 2]),

    // -------------------------------- Actual Level Line (Highlighted)
    lineSpec(ACTUAL_LEVEL_DATA_SERIES_NAME, DARK_RED, 2, []),

    // -------------------------------- Actual Level Point Based on Cursor
    pointSpec(ACTUAL_LEVEL_DATA_POINT_NAME, 100, "#fff", DARK_RED, 3),

    // -------------------------------- Anticipated Level Point Based on Cursor
    pointSpec(ANTICIPATED_LEVEL_DATA_POINT_NAME, 100, "#fff", LIGHT_BLUE, 3),

    // -------------------------------- Vertical Rule Line Based on Cursor
    verticalRuleSpec(LIGHT_GRAY, SIGNAL_NAME),

    // -------------------------------- Tooltip Box based on Cursor
    tooltipBoxSpec(
      ANTICIPATED_LEVEL_DATA_POINT_NAME,
      ACTUAL_LEVEL_DATA_POINT_NAME
    ),
  ],
};
