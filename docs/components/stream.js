
import * as Plot from "npm:@observablehq/plot";
import { daysBeforeMonth, getMonth } from "./dates.js";

export function stream(data, width, scale) {
    return Plot.plot({
        width,
        x: { label: null, ticks: daysBeforeMonth, tickFormat: getMonth },
        y: {
            grid: true,
            label: "rainfall (mm)",
            type: scale
        },
        marks: [
            Plot.areaY(data, { x: "dayOfYear", y: "value", z: "year", fill: "year"})
        ]
    })
}
