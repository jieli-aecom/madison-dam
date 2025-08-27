import type { Data } from "vega";

const MILLISECONDS_BY_DAY = 60 * 60 * 24 * 1000;

const isoDateStringToMillisTimestamp = (dateString: string) => {
  return new Date(dateString).getTime();
};

export type DateFilteredDataPointSpecParams = {
  sourceSeriesName: string;
    dataPointName: string;
    dateFieldName: string;
    isoDateString: string;
};

export const dateFilteredDataPointSpec = (
    params: DateFilteredDataPointSpecParams
) => {
    const { sourceSeriesName, dataPointName, dateFieldName, isoDateString } = params;
  const targetTimestamp = isoDateStringToMillisTimestamp(isoDateString);
  return {
    name: dataPointName,
    source: sourceSeriesName, // Filtering from the actuals dataset
    transform: [
      {
        type: "filter",
        expr: `(datum.${dateFieldName} < ${targetTimestamp}) & (datum.${dateFieldName} > ${targetTimestamp} - ${MILLISECONDS_BY_DAY})`,
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
