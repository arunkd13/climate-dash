
import * as Plot from "npm:@observablehq/plot";
import { daysBeforeMonth, getMonth } from "./dates.js";

export function stream(data, width) {
    return Plot.plot({
        width,
        x: { label: null, ticks: daysBeforeMonth, tickFormat: getMonth },
        y: {
            grid: true,
            label: "rainfall (mm)",
        },
        marks: [
            Plot.areaY(data, { x: "dayOfYear", y: "value", z: "year", fill: "year"})
        ]
    })
}
