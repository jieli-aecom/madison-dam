import type { Data } from "vega";

const MILLISECONDS_BY_DAY = 60 * 60 * 24 * 1000;

export type CursorFilteredDataPointSpecParams = {
  sourceSeriesName: string;
  xFieldName: string;
  dataPointName: string;
  signalName: string;
};

export const cursorFilteredDataPointSpec = (
  params: CursorFilteredDataPointSpecParams
) => {
  const { sourceSeriesName, xFieldName, dataPointName, signalName } = params;
  return {
    name: dataPointName,
    source: sourceSeriesName, // Filtering from the actuals dataset
    transform: [
      {
        type: "filter",
        expr: `(datum.${xFieldName} < ${signalName}) & (datum.${xFieldName} > ${signalName} - ${MILLISECONDS_BY_DAY})`,
      },
      {
        type: "aggregate",
        fields: ["value", "value"],
        ops: ["min", "argmin"],
        as: ["min", "argmin"],
      },
    ],
  } as Data;
};
