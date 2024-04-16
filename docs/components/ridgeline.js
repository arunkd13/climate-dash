import * as Plot from "npm:@observablehq/plot";
import { daysBeforeMonth, getMonth } from "./dates.js";

export function ridgeline(data, width, overlap) {
    let ridgeHeight = 17;
    let param = 2.5;
    let curve = "basis";
    return Plot
        .plot({
            height: 40 + new Set(data.map(d => d.year)).size * ridgeHeight,
            width,
            marginBottom: 1,
            marginLeft: 120,
            x: { axis: "top", ticks: daysBeforeMonth, tickFormat: getMonth },
            y: { axis: null, range: [param * ridgeHeight - 2, (param - overlap) * ridgeHeight - 2] },
            fy: { label: null, domain: data.map(d => d.year) },
            marks: [
                Plot.areaY(data, { x: "dayOfYear", y: "value", fy: "year", curve, sort: "dayOfYear", fill: "#ccc" }),
                Plot.lineY(data, { x: "dayOfYear", y: "value", fy: "year", curve, sort: "dayOfYear", strokeWidth: 1 }),
                Plot.gridX(daysBeforeMonth, { stroke: "#000", strokeOpacity: 0.5, strokeWidth: 1 })
            ]
        })
}
