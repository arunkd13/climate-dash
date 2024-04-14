import * as Plot from "npm:@observablehq/plot";

export function ridgeline(data, width, overlap) {
    return Plot.plot({
        height: 40 + new Set(data.map(d => d.year)).size * 17,
        width,
        marginBottom: 1,
        marginLeft: 120,
        x: { axis: "top" },
        y: { axis: null, range: [2.5 * 17 - 2, (2.5 - overlap) * 17 - 2] },
        fy: { label: null, domain: data.map(d => d.year) },
        marks: [
            Plot.areaY(data, {x: "dayOfYear", y: "value", fy: "year", curve: "basis", sort: "dayOfYear", fill: "#ccc"}),
            Plot.lineY(data, { x: "dayOfYear", y: "value", fy: "year", curve: "basis", sort: "dayOfYear", strokeWidth: 1} )
        ]
    })
}
