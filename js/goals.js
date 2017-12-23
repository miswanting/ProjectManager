var svg = d3.select("#svg-goals")
var width = 800,
    height = 600
svg.attr("width", width)
svg.attr("height", height)
var data = [{
    "name": "Eve",
    "parent": ""
}, {
    "name": "Cain",
    "parent": "Eve"
}, {
    "name": "Seth",
    "parent": "Eve"
}, {
    "name": "Enos",
    "parent": "Seth"
}, {
    "name": "Noam",
    "parent": "Seth"
}, {
    "name": "Abel",
    "parent": "Eve"
}, {
    "name": "Awan",
    "parent": "Eve"
}, {
    "name": "Enoch",
    "parent": "Awan"
}, {
    "name": "Azura",
    "parent": "Eve"
}]
var tree = d3.tree()
    .size([height - 100, width - 100]);
var stratify = d3.stratify()
    .id(function (d) {
        return d.name;
    }).parentId(function (d) {
        return d.parent;
    })(data);
var link = svg.append("g")
    .attr("class", "links")
    .attr("transform", function (d) {
        return "translate(" + 50 + "," + 0 + ")"
    })
    .selectAll("g")
    .data(tree(stratify).links())
    .enter().append("path")
    .attr("d", d3.linkHorizontal()
        .x(function (d) {
            return d.y;
        })
        .y(function (d) {
            return d.x;
        }))
    .attr("stroke", "#000")
    .attr("stroke-width", 2)
    .attr("fill", "none")
var nodes = svg.append("g")
    .attr("class", "nodes")
    .attr("transform", function (d) {
        return "translate(" + 50 + "," + 0 + ")"
    })
    .selectAll("g")
    .data(stratify.descendants())
    .enter().append("g")
    .attr("transform", function (d) {
        return "translate(" + d.y + "," + d.x + ")"
    })
nodes.append("circle")
    .attr("r", 5)
    .attr("stroke", "#fff")
    .attr("stroke-width", 2)
    .on("mouseover", function () {
        d3.select(this).attr("r", 10)
        d3.select(this).attr("fill", "#00f")
    })
    .on("mouseout", function () {
        d3.select(this).attr("r", 5)
        d3.select(this).attr("fill", "#000")
    })
nodes.append("text")
    .attr("x", function (d) {
        return -6
    })
    .attr("y", function (d) {
        return 20
    })
    .text(function (d) {
        return d.id.substring(d.id.lastIndexOf(".") + 1);
    })