export const KEY_ACCESSOR = (d) => d["Economy"];

export const SUBJECTS = [
  {
    name: "Science",
    valueAccessor: (d) => +d["Science"],
    comparisonAccessor: (d) => d["Science vs OECD average"],
    color: "var(--color-science)",
  },
  {
    name: "Reading",
    valueAccessor: (d) => +d["Reading"],
    comparisonAccessor: (d) => d["Reading vs OECD average"],
    color: "var(--color-reading)",
  },
  {
    name: "Mathematics",
    valueAccessor: (d) => +d["Mathematics"],
    comparisonAccessor: (d) => d["Mathematics vs OECD average"],
    color: "var(--color-mathematics)",
  },
  {
    name: "Computational problem solving",
    valueAccessor: (d) => +d["Computational problem solving"],
    comparisonAccessor: (d) =>
      d["Computational problem solving vs OECD average"],
    color: "var(--color-computational-problem-solving)",
  },
];
