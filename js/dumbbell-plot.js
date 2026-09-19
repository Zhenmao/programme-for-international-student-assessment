import { KEY_ACCESSOR, SUBJECTS } from "./constants.js";

export default function dumbbellPlot({ el, data }) {
  let width;

  const dotRadius = 8;
  const comparisonDotRadius = 3;
  const rowHeight = dotRadius * 2 + 16;
  const marginTop = rowHeight / 2;
  const marginRight = 112;
  const marginBottom = rowHeight / 2;
  const marginLeft = 12;
  const height = marginTop + marginBottom + rowHeight * data.length;
  const xAxisHeight = 40;

  const x = d3
    .scaleLinear()
    .domain(
      d3.extent(data.flatMap((d) => SUBJECTS.map((s) => s.valueAccessor(d)))),
    );
  const y = d3
    .scalePoint()
    .domain(data.map(KEY_ACCESSOR))
    .range([marginTop, height - marginBottom]);

  const container = d3.select(el).classed("dumbbell-plot", true);

  const svgTop = container
    .append("div")
    .attr("class", "sticky-top")
    .append("svg");
  const svg = container.append("svg");

  new ResizeObserver((entries) =>
    entries.forEach((entry) => resized(entry.contentRect)),
  ).observe(el);

  function resized({ width: _ }) {
    if (_ === 0) return;
    width = _;

    x.range([marginLeft, width - marginRight]);

    svgTop
      .attr("width", width)
      .attr("height", xAxisHeight)
      .attr("viewBox", [0, 0, width, xAxisHeight]);

    svg
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", [0, 0, width, height]);

    render();
  }

  function render() {
    renderXAxis();
    renderRows();
  }

  function renderXAxis() {
    svgTop
      .selectChildren(".axis__title")
      .data([0])
      .join((enter) =>
        enter
          .append("text")
          .attr("class", "axis__title")
          .attr("dy", "0.71em")
          .text("Mean score"),
      );

    svgTop
      .selectChildren(".axis")
      .data([0])
      .join((enter) =>
        enter
          .append("g")
          .attr("class", "axis")
          .attr("transform", `translate(0,${xAxisHeight})`),
      )
      .call(
        d3
          .axisTop(x)
          .tickSize(8)
          .tickPadding(4)
          .ticks((width - marginLeft - marginRight) / 100),
      )
      .select(".domain")
      .remove();
  }

  function renderRows() {
    const rowG = svg
      .selectChildren(".row")
      .data(data, KEY_ACCESSOR)
      .join((enter) =>
        enter
          .append("g")
          .attr("class", "row")
          .call((g) =>
            g
              .append("text")
              .attr("class", "row__label")
              .attr("dy", "0.32em")
              .text(KEY_ACCESSOR),
          )
          .call((g) => g.append("line").attr("class", "row__line"))
          .call((g) => g.append("g").attr("class", "row__dots")),
      )
      .attr("transform", (d) => `translate(0,${y(KEY_ACCESSOR(d))})`);

    rowG
      .select(".row__label")
      .attr(
        "x",
        (d) => x(d3.max(SUBJECTS, (s) => s.valueAccessor(d))) + dotRadius + 8,
      );

    rowG
      .select(".row__line")
      .attr("x1", (d) => x(d3.min(SUBJECTS, (s) => s.valueAccessor(d))))
      .attr("x2", (d) => x(d3.max(SUBJECTS, (s) => s.valueAccessor(d))));

    rowG
      .select(".row__dots")
      .selectChildren(".row__dot")
      .data(
        (d) =>
          SUBJECTS.filter((s) => !isNaN(s.valueAccessor(d))).sort((a, b) =>
            d3.ascending(a.valueAccessor(d), b.valueAccessor(d)),
          ),
        (s) => s.name,
      )
      .join((enter) =>
        enter
          .append("g")
          .attr("class", "row__dot")
          .style("color", (s) => s.color)
          .attr("fill", "currentColor")
          .call((g) => g.append("circle").attr("r", dotRadius))
          .call((g) =>
            g
              .append("text")
              .attr("dy", "0.32em")
              .attr("text-anchor", "middle")
              .attr("fill", "var(--color-background)")
              .text((s) => s.name[0]),
          )
          .call((g) =>
            g
              .filter(function (s) {
                const d = d3.select(this.parentNode).datum();
                return s.comparisonAccessor(d) === "above";
              })
              .append("circle")
              .attr("r", comparisonDotRadius)
              .attr("cy", -dotRadius - comparisonDotRadius - 2),
          )
          .call((g) =>
            g
              .filter(function (s) {
                const d = d3.select(this.parentNode).datum();
                return s.comparisonAccessor(d) === "below";
              })
              .append("circle")
              .attr("r", comparisonDotRadius)
              .attr("cy", dotRadius + comparisonDotRadius + 2),
          ),
      )
      .attr("transform", function (s) {
        const d = d3.select(this.parentNode).datum();
        return `translate(${x(s.valueAccessor(d))},0)`;
      });
  }
}
