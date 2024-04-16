import * as d3 from "npm:d3";

function convertTextToNumbers(d) {
  let dateString = d.day + "/" + d.month + "/" + d.year;
  d.date = dateParse(dateString);
  d.extent = +d.extent;
  d.year = +d.year;
  d.month = +d.month;
  d.day = +d.day;
  d.dayOfYear = +dayOfYear(d.date);
  return d;
}

const arcLabels = [
  { month: "Jan", start: 0, days: 31 },
  { month: "Feb", start: 31, days: 28 },
  { month: "Mar", start: 59, days: 31 },
  { month: "Apr", start: 90, days: 30 },
  { month: "May", start: 120, days: 31 },
  { month: "Jun", start: 151, days: 30 },
  { month: "Jul", start: 181, days: 31 },
  { month: "Aug", start: 212, days: 31 },
  { month: "Sep", start: 243, days: 30 },
  { month: "Oct", start: 273, days: 31 },
  { month: "Nov", start: 304, days: 30 },
  { month: "Dec", start: 334, days: 31 }
];

let dateParse = d3.timeParse("%d/%m/%Y");
let monthFormat = d3.timeFormat("%b");
let dateFormat = d3.timeFormat("%d%m");
let yearFormat = d3.timeFormat("%Y");
let dayOfYear = d3.timeFormat("%j");

function labelX(angle, radius) {
    // change to clockwise
    let a = 360 - angle
    // start from 12 o'clock
    a = a + 180;
    return radius * Math.sin(a * radians)
}

function labelY(angle, radius) {
    // change to clockwise
    let a = 360 - angle
    // start from 12 o'clock
    a = a + 180;
    return radius * Math.cos(a * radians)
}

let radians = 0.0174532925;

let margin = 40;

function spiralHeatmap(chartRadius) {
    // constants
    const radians = 0.0174532925;

    // All options that are accessible to caller
    // Default values
    var radius = 250;
    var holeRadiusProportion = 0.3; // proportion of radius
    var arcsPerCoil = 12; // assuming months per year
    var coilPadding = 0; // no padding
    var arcLabel = ''; // no labels
    var coilLabel = ''; // no labels

    function chart(selection) {
        selection.each(function (data) {
            const arcAngle = 360 / arcsPerCoil;
            const labelRadius = radius + 20;

            var arcLabelsArray = [];

            for (var i = 0; i < arcsPerCoil; i++) {
                arcLabelsArray.push(i);
            }

            // Create/update the x/y coordinates for the vertices and control points for the paths
            // Stores the x/y coordinates on the data
            updatePathData(data);

            let thisSelection = d3
                .select(this)
                .append('g')
                .attr('class', 'spiral-heatmap');

            var arcLabelsG = thisSelection
                .selectAll('.arc-label')
                .data(arcLabelsArray)
                .enter()
                .append('g')
                .attr('class', 'arc-label');

            arcLabelsG
                .append('text')
                .text(function (d) {
                    return data[d][arcLabel];
                })
                .attr('x', function (d, i) {
                    let labelAngle = i * arcAngle + arcAngle / 2;
                    return x(labelAngle, labelRadius);
                })
                .attr('y', function (d, i) {
                    let labelAngle = i * arcAngle + arcAngle / 2;
                    return y(labelAngle, labelRadius);
                })
                .style('text-anchor', function (d, i) {
                    return i < arcLabelsArray.length / 2 ? 'start' : 'end';
                });

            arcLabelsG
                .append('line')
                .attr('x2', function (d, i) {
                    let lineAngle = i * arcAngle;
                    let lineRadius = chartRadius + 10;
                    return x(lineAngle, lineRadius);
                })
                .attr('y2', function (d, i) {
                    let lineAngle = i * arcAngle;
                    let lineRadius = chartRadius + 10;
                    return y(lineAngle, lineRadius);
                });

            var arcs = thisSelection
                .selectAll('.arc')
                .data(data)
                .enter()
                .append('g')
                .attr('class', 'arc');

            arcs.append('path').attr('d', function (d) {
                // start at vertice 1
                let start = 'M ' + d.x1 + ' ' + d.y1;
                // inner curve to vertice 2
                let side1 =
                    ' Q ' +
                    d.controlPoint1x +
                    ' ' +
                    d.controlPoint1y +
                    ' ' +
                    d.x2 +
                    ' ' +
                    d.y2;
                // straight line to vertice 3
                let side2 = 'L ' + d.x3 + ' ' + d.y3;
                // outer curve vertice 4
                let side3 =
                    ' Q ' +
                    d.controlPoint2x +
                    ' ' +
                    d.controlPoint2y +
                    ' ' +
                    d.x4 +
                    ' ' +
                    d.y4;
                // combine into string, with closure (Z) to vertice 1
                return start + ' ' + side1 + ' ' + side2 + ' ' + side3 + ' Z';
            });

            // create coil labels on the first arc of each coil
            let coilLabels = arcs
                .filter(function (d) {
                    return d.arcNumber == 0;
                })
                .raise();

            coilLabels
                .append('path')
                .attr('id', function (d) {
                    return 'path-' + d[coilLabel];
                })
                .attr('d', function (d) {
                    // start at vertice 1
                    let start = 'M ' + d.x1 + ' ' + d.y1;
                    // inner curve to vertice 2
                    let side1 =
                        ' Q ' +
                        d.controlPoint1x +
                        ' ' +
                        d.controlPoint1y +
                        ' ' +
                        d.x2 +
                        ' ' +
                        d.y2;
                    return start + side1;
                })
                .style('opacity', 0);

            coilLabels
                .append('text')
                .attr('class', 'coil-label')
                .attr('x', 3)
                .attr('dy', -4)
                .append('textPath')
                .attr('xlink:href', function (d) {
                    return '#path-' + d[coilLabel];
                })
                .text(function (d) {
                    return d[coilLabel];
                });
        });

        function updatePathData(data) {
            let holeRadius = radius * holeRadiusProportion;
            let arcAngle = 360 / arcsPerCoil;
            let dataLength = data.length;
            let coils = Math.ceil(dataLength / arcsPerCoil); // number of coils, based on data.length / arcsPerCoil
            let coilWidth = (chartRadius * (1 - holeRadiusProportion)) / (coils + 1); // remaining chartRadius (after holeRadius removed), divided by coils + 1. I add 1 as the end of the coil moves out by 1 each time

            data.forEach(function (d, i) {
                let coil = Math.floor(i / arcsPerCoil);
                let position = i - coil * arcsPerCoil;
                let startAngle = position * arcAngle;
                let endAngle = (position + 1) * arcAngle;
                let startInnerRadius = holeRadius + (i / arcsPerCoil) * coilWidth;
                let startOuterRadius =
                    holeRadius +
                    (i / arcsPerCoil) * coilWidth +
                    coilWidth * (1 - coilPadding);
                let endInnerRadius = holeRadius + ((i + 1) / arcsPerCoil) * coilWidth;
                let endOuterRadius =
                    holeRadius +
                    ((i + 1) / arcsPerCoil) * coilWidth +
                    coilWidth * (1 - coilPadding);

                // vertices of each arc
                d.x1 = x(startAngle, startInnerRadius);
                d.y1 = y(startAngle, startInnerRadius);
                d.x2 = x(endAngle, endInnerRadius);
                d.y2 = y(endAngle, endInnerRadius);
                d.x3 = x(endAngle, endOuterRadius);
                d.y3 = y(endAngle, endOuterRadius);
                d.x4 = x(startAngle, startOuterRadius);
                d.y4 = y(startAngle, startOuterRadius);

                // CURVE CONTROL POINTS
                let midAngle = startAngle + arcAngle / 2;
                let midInnerRadius = holeRadius + ((i + 0.5) / arcsPerCoil) * coilWidth;
                let midOuterRadius =
                    holeRadius +
                    ((i + 0.5) / arcsPerCoil) * coilWidth +
                    coilWidth * (1 - coilPadding);

                // MID POINTS, WHERE THE CURVE WILL PASS THRU
                d.mid1x = x(midAngle, midInnerRadius);
                d.mid1y = y(midAngle, midInnerRadius);
                d.mid2x = x(midAngle, midOuterRadius);
                d.mid2y = y(midAngle, midOuterRadius);

                d.controlPoint1x = (d.mid1x - 0.25 * d.x1 - 0.25 * d.x2) / 0.5;
                d.controlPoint1y = (d.mid1y - 0.25 * d.y1 - 0.25 * d.y2) / 0.5;
                d.controlPoint2x = (d.mid2x - 0.25 * d.x3 - 0.25 * d.x4) / 0.5;
                d.controlPoint2y = (d.mid2y - 0.25 * d.y3 - 0.25 * d.y4) / 0.5;

                d.arcNumber = position;
                d.coilNumber = coil;
            });

            return data;
        }

        function x(angle, radius) {
            // change to clockwise
            let a = 360 - angle;
            // start from 12 o'clock
            a = a + 180 - startAngle;
            return radius * Math.sin(a * radians);
        }

        function y(angle, radius) {
            // change to clockwise
            let a = 360 - angle;
            // start from 12 o'clock
            a = a + 180 - startAngle;
            return radius * Math.cos(a * radians);
        }

        function chartWH(r) {
            return r * 2;
        }
    }

    chart.radius = function (value) {
        if (!arguments.length) return radius;
        radius = value;
        return chart;
    };

    chart.holeRadiusProportion = function (value) {
        if (!arguments.length) return holeRadiusProportion;
        holeRadiusProportion = value;
        return chart;
    };

    chart.arcsPerCoil = function (value) {
        if (!arguments.length) return arcsPerCoil;
        arcsPerCoil = value;
        return chart;
    };

    chart.coilPadding = function (value) {
        if (!arguments.length) return coilPadding;
        coilPadding = value;
        return chart;
    };

    chart.arcLabel = function (value) {
        if (!arguments.length) return arcLabel;
        arcLabel = value;
        return chart;
    };

    chart.coilLabel = function (value) {
        if (!arguments.length) return coilLabel;
        coilLabel = value;
        return chart;
    };

    chart.startAngle = function (value) {
        if (!arguments.length) return startAngle;
        startAngle = value;
        return chart;
    };

    return chart;
}

export function spiral(data, width) {
    let cw = width * 0.73;
    let chartRadius = cw / 2;
    let startAngle = (data[0].dayOfYear / 365) * 360 - 1;

    let colour = d3.scaleSequentialSymlog(d3.interpolateYlGnBu)
        .domain(d3.extent(data, function (d) { return d.extent; }));

    const chartWidth = width > 660 ? 660 : width - margin * 3;
    const chartHeight = chartWidth;

    const svg = d3
        .create("svg")
        .attr("viewBox", [
            0,
            0,
            chartWidth + margin + margin,
            chartHeight + margin + margin
        ]);

    const heatmap = spiralHeatmap(chartRadius)
        .radius(chartRadius)
        .holeRadiusProportion(0.2)
        .arcsPerCoil(365)
        .startAngle(startAngle)
        .coilPadding(0.1)
        .coilLabel("year");

    const g = svg
        .append("g")
        .attr(
            "transform",
            "translate(" + (margin + chartRadius) + "," + (margin + chartRadius) + ")"
        );

    g.datum(chartData).call(heatmap);

    let arcs = g.select(".spiral-heatmap").selectAll(".arc");

    let arcPaths = arcs.selectAll("path").style("fill", function (d) {
        return colour(d.extent);
    });

    svg.selectAll(".arc-label").remove();

    let arcLabelsG = g
        .selectAll('.arc-label')
        .data(arcLabels)
        .enter()
        .append('g')
        .attr('class', 'arc-label');

    let dayAngle = 360 / 365;

    arcLabelsG
        .append('text')
        .text(function (d) {
            return d.month;
        })
        .attr('x', function (d) {
            let monthAngle = 360 * (d.days / 365);
            let labelAngle = d.start * dayAngle + monthAngle / 2;
            let labelRadius = chartRadius + 20;
            return labelX(labelAngle, labelRadius);
        })
        .attr('y', function (d) {
            let monthAngle = 360 * (d.days / 365);
            let labelAngle = d.start * dayAngle + monthAngle / 2;
            let labelRadius = chartRadius + 20;
            return labelY(labelAngle, labelRadius);
        })
        .style('text-anchor', function (d, i) {
            return i < arcLabels.length / 2 ? 'start' : 'end';
        });

    arcLabelsG
        .append('line')
        .attr('x2', function (d, i) {
            let lineAngle = d.start * dayAngle;
            let lineRadius = chartRadius + 40;
            return labelX(lineAngle, lineRadius);
        })
        .attr('y2', function (d, i) {
            let lineAngle = d.start * dayAngle;
            let lineRadius = chartRadius + 40;
            return labelY(lineAngle, lineRadius);
        })
        .style("stroke", "grey");

    //////////////////////////////////////

    //////////////////////////////////////

    g.selectAll('text').attr("font-size", "10px");

    return svg.node();
}