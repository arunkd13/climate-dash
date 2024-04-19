import * as Plot from "npm:@observablehq/plot";
import * as d3 from "npm:d3";

import { daysBeforeMonth, getMonth } from "./dates.js";

export function heatmap(data, width, scale) {
    return Plot.plot({
        width,
        padding: 0,
        x: { label: null, ticks: daysBeforeMonth, tickFormat: getMonth },
        y: { tickFormat: "d" },
        color: {
            interpolate: d3.interpolateYlGnBu, legend: true,
            zero: true,
            type: scale
        },
        marks: [
            Plot.cell(data, Plot.group({ fill: "max" }, {
                x: "dayOfYear",
                y: "year",
                fill: "value",
            })),
            Plot.gridX(daysBeforeMonth, { stroke: "#fff", strokeOpacity: 0.5, strokeWidth: 1 })
        ]
    })
}