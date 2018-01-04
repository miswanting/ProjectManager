var svg_goals = d3.select("#svg-goals")
var btn_goals_add = d3.select("#btn-goals-add")
var width = 800,
    height = 600
svg_goals.attr("width", width)
svg_goals.attr("height", height)
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
var stratify_goals = d3.stratify()
    .id(function (d) {
        return d.name;
    }).parentId(function (d) {
        return d.parent;
    })(data);
var link = svg_goals.append("g")
    .attr("class", "links")
    .attr("id", "goals-links")
    .attr("transform", function (d) {
        return "translate(" + 50 + "," + 0 + ")"
    })
// .selectAll("g")
link.selectAll("#goals-links")
    .data(tree(stratify_goals).links())
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
var nodes = svg_goals.append("g")
    .attr("class", "nodes")
    .attr("id", "goals-nodes")
    .attr("transform", function (d) {
        return "translate(" + 50 + "," + 0 + ")"
    })
    .selectAll("g")
    .data(stratify_goals.descendants())
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
    .on("click", function () {
        d3.select("#goals-detail")
            .text(d3.select(this)._groups[0][0].__data__.id)
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
btn_goals_add.on("click", function () {
    data.push({
        "name": "HYH",
        "parent": "Abel"
    })
    stratify_goals = d3.stratify()
        .id(function (d) {
            return d.name;
        }).parentId(function (d) {
            return d.parent;
        })(data)

    link = svg_goals.select("#goals-links")
        .selectAll("path")
        .data(tree(stratify_goals).links())
        // .exit().remove()
        .enter().append("path")
    console.log(link)
    svg_goals.select("#goals-links")
        .selectAll("path")
        .data(tree(stratify_goals).links())
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

    nodes = svg_goals.select("#goals-nodes")
        .selectAll("g")
        .data(stratify_goals.descendants())
        .enter().append("g")
        .attr("transform", function (d) {
            return "translate(" + d.y + "," + d.x + ")"
        })
    nodes.append("circle")
    nodes.append("text")
    svg_goals.select("#goals-nodes")
        .selectAll("g")
        .attr("transform", function (d) {
            return "translate(" + d.y + "," + d.x + ")"
        })
    svg_goals.select("#goals-nodes")
        .selectAll("circle")
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
        .on("click", function () {
            d3.select("#goals-detail")
                .text(d3.select(this)._groups[0][0].__data__.id)
        })
    svg_goals.select("#goals-nodes")
        .selectAll("text")
        .attr("x", function (d) {
            return -6
        })
        .attr("y", function (d) {
            return 20
        })
        .data(stratify_goals.descendants())
        .text(function (d) {
            return d.id.substring(d.id.lastIndexOf(".") + 1);
        })
    console.log(d3)
    var a = JSON.stringify(d3)
    console.log(a)
    var b = JSON.parse(a)
    console.log(b)
})