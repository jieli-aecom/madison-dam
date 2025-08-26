import type { Format } from "vega";

export const vegaFormatWithDateField : Format = {
  type: "json",
  parse: {
    date: "date:'%Y-%m-%d'",
  },
};
