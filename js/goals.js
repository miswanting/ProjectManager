var svg_goals = d3.select("#svg-goals") // SVG元素的引用
var btn_goals_add_show = d3.select("#btn-goals-add-show") // 新增节点页面显示按钮
var btn_goals_add = d3.select("#btn-goals-add") // 新增节点确认按钮
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
// 连线集合
var link = svg_goals.append("g")
    .attr("class", "links")
    .attr("id", "goals-links")
    // 整体偏移
    .attr("transform", function (d) {
        return "translate(" + 50 + "," + 0 + ")"
    })
// 每根连线
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
    .attr("fill", "none") // 不填充
// 节点集合
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
// 圆点
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
// 文本
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
// 新增节点页面显示按钮
btn_goals_add_show.on("click", function () {
    d3.select("#goals-name")._groups[0][0].value = ""
    stratify_goals = d3.stratify()
        .id(function (d) {
            return d.name;
        }).parentId(function (d) {
            return d.parent;
        })(data)
    var l_node = stratify_goals.descendants()
    var l_id = []
    for (var i = 0; i < l_node.length; i++) {
        l_id.push(l_node[i].id)
    }
    console.log(l_id)
    d3.select("#goals-parentlist")
        .selectAll("option")
        .remove()
    d3.select("#goals-parentlist")
        .selectAll("option")
        .data(l_id)
        .enter().append("option")
        .text(function (d) {
            return d
        })
})
// 新增节点确认按钮
btn_goals_add.on("click", function () {
    if (d3.select("#goals-name")._groups[0][0].value == "") {
        d3.select("#goals-name")._groups[0][0].value = "[NONE]"
    }
    data.push({
        "name": d3.select("#goals-name")._groups[0][0].value,
        "parent": d3.select("#goals-parentlist")._groups[0][0].value
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
})