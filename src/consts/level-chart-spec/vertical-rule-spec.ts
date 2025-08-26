import type { Mark } from "vega";

export const verticalRuleSpec = (ruleColor: string, signalName: string) => {
  return {
    type: "rule",
    encode: {
      update: {
        x: { scale: "x", signal: signalName, offset: 0.5 },
        y: { value: 0 },
        y2: { field: { group: "height" } },
        stroke: { value: ruleColor },
        strokeDash: { value: [3, 3] },
      },
    },
  } as Mark;
};
