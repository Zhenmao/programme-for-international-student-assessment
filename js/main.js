import comparisonLegend from "./comparison-legend.js";
import dumbbellPlot from "./dumbbell-plot.js";
import { subjectLegend } from "./subject-legend.js";

d3.csv("data/data.csv").then((data) => {
  console.log(data);

  subjectLegend({
    el: document.querySelector("#subjectLegend"),
  });

  comparisonLegend({
    el: document.querySelector("#comparisonLegend"),
  });

  dumbbellPlot({
    el: document.querySelector("#chart"),
    data,
  });
});
