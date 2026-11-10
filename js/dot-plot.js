import { KEY_ACCESSOR, SUBJECTS } from "./constants.js";

export default function dotPlot({ el, data }) {
  let width,
    activeData = null;

  const [avgData, ...restData] = data;

  const dotRadius = 8;
  const comparisonDotRadius = 3;
  const trackRadius = dotRadius + 2;
  const marginTop = 24;
  const marginRight = trackRadius;
  const marginBottom = 28;
  const marginLeft = trackRadius;
  const height = marginTop + marginBottom + trackRadius + 2;

  const x = d3
    .scaleLinear()
    .domain(
      d3.extent(data.flatMap((d) => SUBJECTS.map((s) => s.valueAccessor(d)))),
    );

  const container = d3.select(el);

  const title = container.append("div").attr("class", "tooltip__title");

  const section = container
    .selectChildren(".dot-plot")
    .data(SUBJECTS, (s) => s.name)
    .join("div")
    .attr("class", "dot-plot");

  section
    .append("div")
    .attr("class", "title")
    .text((s) => s.name);

  const svg = section.append("svg");

  new ResizeObserver((entries) =>
    entries.forEach((entry) => resized(entry.contentRect)),
  ).observe(el);

  container.on("tooltipdatachanged", activeDataChanged);

  function resized({ width: _ }) {
    if (_ === 0 || width === _) return;
    width = _;

    x.range([marginLeft, width - marginRight]);

    svg
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", [0, -marginTop - trackRadius, width, height]);

    render();
    renderActive();
  }

  function render() {
    svg
      .selectChildren(".track")
      .data((s) => [s])
      .join((enter) =>
        enter
          .append("rect")
          .attr("class", "track")
          .attr("y", -trackRadius)
          .attr("height", trackRadius * 2)
          .attr("rx", trackRadius)
          .attr("x", marginLeft - trackRadius),
      )
      .attr("width", width - marginLeft - marginRight + trackRadius * 2);

    svg
      .selectChildren(".dots")
      .data((s) => [s])
      .join((enter) =>
        enter
          .append("g")
          .attr("class", "dots")
          .style("color", (s) => s.color)
          .attr("fill", "currentColor"),
      )
      .selectChildren(".dot")
      .data(
        (s) =>
          restData
            .map((d) => ({
              key: KEY_ACCESSOR(d),
              value: s.valueAccessor(d),
            }))
            .filter((d) => !isNaN(d.value))
            .sort((a, b) => d3.ascending(a.value, b.value)),
        (d) => d.key,
      )
      .join((enter) =>
        enter.append("circle").attr("class", "dot").attr("r", dotRadius),
      )
      .attr("cx", (d) => x(d.value));

    svg
      .selectChildren(".avg")
      .data((s) => [s])
      .join((enter) =>
        enter
          .append("g")
          .attr("class", "avg")
          .call((g) =>
            g
              .append("line")
              .attr("class", "avg__line")
              .attr("y1", -trackRadius)
              .attr("y2", trackRadius + 6),
          )
          .call((g) =>
            g
              .append("text")
              .attr("class", "avg__label")
              .attr("text-anchor", "middle")
              .attr("dy", "0.71em")
              .attr("y", trackRadius + 10)
              .text((s) => `OECD avg. ${s.valueAccessor(avgData)}`),
          ),
      )
      .attr("transform", (s) => `translate(${x(s.valueAccessor(avgData))},0)`);
  }

  function renderActive() {
    title.text(activeData ? KEY_ACCESSOR(activeData) : "");

    const activeG = svg
      .selectChildren(".active-dot")
      .data((s) =>
        activeData && !isNaN(s.valueAccessor(activeData)) ? [s] : [],
      )
      .join((enter) =>
        enter
          .append("g")
          .attr("class", "active-dot")
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
              .append("text")
              .attr("text-anchor", "middle")
              .attr("class", "active-dot__value")
              .attr("y", -trackRadius - 10),
          ),
      )
      .attr(
        "transform",
        (s) => `translate(${x(s.valueAccessor(activeData))},0)`,
      );

    activeG
      .selectChildren(".above")
      .data((s) => (s.comparisonAccessor(activeData) === "above" ? [s] : []))
      .join((enter) =>
        enter
          .append("circle")
          .attr("class", "above")
          .attr("r", comparisonDotRadius)
          .attr("cy", -dotRadius - comparisonDotRadius - 2),
      );

    activeG
      .selectChildren(".below")
      .data((s) => (s.comparisonAccessor(activeData) === "below" ? [s] : []))
      .join((enter) =>
        enter
          .append("circle")
          .attr("class", "below")
          .attr("r", comparisonDotRadius)
          .attr("cy", dotRadius + comparisonDotRadius + 2),
      );

    activeG
      .select(".active-dot__value")
      .text((s) => s.valueAccessor(activeData));
  }

  function activeDataChanged(event) {
    activeData = event.detail;
    renderActive();
  }
}
