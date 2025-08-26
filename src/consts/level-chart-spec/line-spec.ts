import type { Mark } from "vega";

export const lineSpec = (dataSeriesName: string, strokeColor: string, strokeWidth: number, dash: number[]) => {
  const mark = {
    type: "line",
    from: { data: dataSeriesName },
    clip: true,
    encode: {
      enter: {
        x: { scale: "x", field: "date" },
        y: { scale: "y", field: "value" },
        stroke: { value: strokeColor },
        strokeWidth: { value: strokeWidth },
      },
    },
  } as Mark

  if (dash?.length > 0) {
    mark.encode!.enter!.strokeDash = { value: dash };
  }
  return mark;
};
