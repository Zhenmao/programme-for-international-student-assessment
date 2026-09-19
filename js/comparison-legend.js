export default function comparisonLegend({ el }) {
  const swatch = d3
    .select(el)
    .classed("comparison-legend", true)
    .selectChildren()
    .data([
      {
        type: "above",
        label: "Mean performance <b>above</b> the OECD average",
      },
      {
        type: "",
        label:
          "Mean performance <b>not significantly different</b> from the OECD average",
      },
      {
        type: "below",
        label: "Mean performance <b>below</b> the OECD average",
      },
    ])
    .join("div")
    .attr("class", "swatch")
    .attr("data-type", (d) => d.type);

  swatch.append("div").attr("class", "swatch__swatch");

  swatch
    .append("div")
    .attr("class", "swatch__label")
    .html((d) => d.label);
}
