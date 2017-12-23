var svg = d3.select("#svg-contacts")
var btn_add = d3.select("#btn-contacts-add")
var width = 800,
    height = 600


svg.attr("width", width)
svg.attr("height", height)
var simulation = d3.forceSimulation()
    .force("charge", d3.forceManyBody()) // 节点间的作用力
    .force("link", d3.forceLink()) // 连线作用力
    .force("center", d3.forceCenter(width / 2, height / 2)); // 重力，布局有一个参考位置，不会跑偏
var nodes = [{
    name: "桂林"
}, {
    name: "广州"
}, {
    name: "厦门"
}, {
    name: "杭州"
}, {
    name: "上海"
}, {
    name: "青岛"
}, {
    name: "天津"
}];
var edges = [{
    source: 0,
    target: 1
}, {
    source: 0,
    target: 2
}, {
    source: 0,
    target: 3
}, {
    source: 1,
    target: 4
}, {
    source: 1,
    target: 5
}, {
    source: 1,
    target: 6
}];
btn_add.on("click", function () {
    var newNode = {
        name: "123"
    }
    var newLink = {
        source: 0,
        target: nodes.length
    }
    edges.push(newLink)
    nodes.push(newNode)
    svg.select(".links")
        .selectAll("line")
        .data(edges)
        .enter().append("line")
        .attr("stroke", "#000000")
        .attr("stroke-width", 2)
        .on("mouseover", function () {
            d3.select(this).attr("stroke", "#ff0000")
            d3.select(this).attr("stroke-width", 5)
        })
        .on("mouseout", function () {
            d3.select(this).attr("stroke", "#000000")
            d3.select(this).attr("stroke-width", 2)
        })
        .on("click", function () {
            alert()
        })
    svg.append(".nodes")
        .selectAll("circle")
        .data(nodes)
        .enter().append("circle")
        .attr("r", 10)
        .attr("stroke", "#ffffff")
        .attr("stroke-width", 2)
        .on("mouseover", function () {
            d3.select(this).attr("r", 15)
            d3.select(this).attr("fill", "#ff0000")
        })
        .on("mouseout", function () {
            d3.select(this).attr("r", 10)
            d3.select(this).attr("fill", "#000000")
        })
        .on("click", function () {
            alert()
        })
        .call(d3.drag()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended));
})
var link = svg.append("g")
    .attr("class", "links")
    .selectAll("line")
    .data(edges)
    .enter().append("line")
    .attr("stroke", "#000000")
    .attr("stroke-width", 2)
    .on("mouseover", function () {
        d3.select(this).attr("stroke", "#00f")
        d3.select(this).attr("stroke-width", 5)
    })
    .on("mouseout", function () {
        d3.select(this).attr("stroke", "#000")
        d3.select(this).attr("stroke-width", 2)
    })
    .on("click", function () {
        alert()
    })
var node = svg.append("g")
    .attr("class", "nodes")
    .selectAll("circle")
    .data(nodes)
    .enter().append("circle")
    .attr("r", 10)
    .attr("stroke", "#ffffff")
    .attr("stroke-width", 2)
    .on("mouseover", function () {
        d3.select(this).attr("r", 15)
        d3.select(this).attr("fill", "#00f")
    })
    .on("mouseout", function () {
        d3.select(this).attr("r", 10)
        d3.select(this).attr("fill", "#000")
    })
    .on("click", function () {
        alert()
    })
    .call(d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended));

svg.on("click", function () {
    alert(1)
})
simulation
    .nodes(nodes)
    .on("tick", ticked);
simulation.force("link")
    .links(edges);

function ticked() {
    link
        .attr("x1", function (d) {
            return d.source.x;
        })
        .attr("y1", function (d) {
            return d.source.y;
        })
        .attr("x2", function (d) {
            return d.target.x;
        })
        .attr("y2", function (d) {
            return d.target.y;
        });
    node
        .attr("cx", function (d) {
            return d.x;
        })
        .attr("cy", function (d) {
            return d.y;
        });
}

function dragstarted(d) {
    if (!d3.event.active) simulation.alphaTarget(0.3).restart();
    d.fx = d.x;
    d.fy = d.y;
}

function dragged(d) {
    d.fx = d3.event.x;
    d.fy = d3.event.y;
}

function dragended(d) {
    if (!d3.event.active) simulation.alphaTarget(0);
    d.fx = null;
    d.fy = null;
}