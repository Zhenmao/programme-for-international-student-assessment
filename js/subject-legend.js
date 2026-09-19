import { SUBJECTS } from "./constants.js";

export function subjectLegend({ el }) {
  const swatch = d3
    .select(el)
    .classed("subject-legend", true)
    .selectChildren()
    .data(SUBJECTS)
    .join("div")
    .attr("class", "swatch");

  swatch
    .append("div")
    .attr("class", "swatch__swatch")
    .style("--color-subject", (d) => d.color)
    .text((d) => d.name[0]);

  swatch
    .append("div")
    .attr("class", "swatch__label")
    .text((d) => d.name);
}
