const {
    ipcRenderer
} = require('electron')
var svg_goals = d3.select("#svg-goals") // SVG元素的引用
var btn_goals_add_show = d3.select("#btn-goals-add-show") // 新增节点页面显示按钮
var btn_goals_remove = d3.select("#btn-goals-remove") // 新增节点页面显示按钮
var btn_goals_add = d3.select("#btn-goals-add") // 新增节点确认按钮

var btn_goals_detail_refresh = d3.select("#btn-goals-detail-refresh") // 详细信息刷新数据按钮
var btn_goals_detail_add = d3.select("#btn-goals-detail-add") // 详细信息新增子节点按钮
var btn_goals_detail_remove = d3.select("#btn-goals-detail-remove") // 详细信息删除子节点按钮
var width = 800,
    height = 600
svg_goals.attr("width", width)
svg_goals.attr("height", height)

// 抓取数据
var data = ipcRenderer.sendSync('synchronous-message', JSON.stringify({
    'cmd': 'db'
}))
var currentSelect = ""
var tree = d3.tree()
    .size([height - 100, width - 100]);
var stratify_goals
var link = svg_goals.append("g")
    .attr("class", "links")
    .attr("id", "goals-links")
    // 整体偏移
    .attr("transform", function (d) {
        return "translate(" + 50 + "," + 0 + ")"
    })
var nodes = svg_goals.append("g")
    .attr("class", "nodes")
    .attr("id", "goals-nodes")
    // 整体偏移
    .attr("transform", function (d) {
        return "translate(" + 50 + "," + 0 + ")"
    })
updateTree()

// 新增节点页面显示按钮
btn_goals_add_show.on("click", function () {
    d3.select("#goals-name")._groups[0][0].value = ""
    stratify_goals = d3.stratify()
        .id(function (d) {
            return d.hash;
        }).parentId(function (d) {
            return d.parentHash;
        })(data)
    var l_node = stratify_goals.descendants()
    console.log(l_node)
    var l_id = []
    for (var i = 0; i < l_node.length; i++) {
        l_id.push(l_node[i].id)
    }
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

// 删除节点按钮
btn_goals_remove.on("click", function () {
    if (currentSelect == "") { // 排除空选择
        alert('请选择一项！')
    } else {
        flag = false // 是否拥有子节点
        for (var i = 0; i < data.length; i++) {
            if (data[i].parent == currentSelect) {
                flag = true
            }
        }
        if (flag) {
            alert("不能直接删除非空节点！")
        } else {
            for (var i = 0; i < data.length; i++) { // 修改data并更新
                if (data[i].name == currentSelect) {
                    data.splice(i, 1)
                    updateTree()
                    saveData()
                }
            }
        }
    }
})

// 新增节点确认按钮
btn_goals_add.on("click", function () {
    if (d3.select("#goals-name")._groups[0][0].value == "") {
        d3.select("#goals-name")._groups[0][0].value = "[NONE]"
    }
    data.push({
        "hash": getHash(),
        "parentHash": d3.select("#goals-parentlist")._groups[0][0].value,
        "name": d3.select("#goals-name")._groups[0][0].value
    })
    updateTree()
    saveData()
})


// var btn_goals_detail_refresh = d3.select("#btn-goals-detail-refresh") // 详细信息刷新数据按钮
// 更新数据
btn_goals_detail_refresh.on("click", function () {
    for (var i = 0; i < data.length; i++) { // 更新
        if ("@" + data[i].hash == d3.select("#goals-detail-hash").text()) {
            data[i].name = d3.select("#goals-detail-name").node().value
            data[i].description = d3.select("#goals-detail-description").node().value
            data[i].parentHash = d3.select("#goals-detail-parentlist").node().value.split("@")[1]
        }
    }
    updateTree()
    saveData()
})
// var btn_goals_detail_add = d3.select("#btn-goals-detail-add") // 详细信息新增子节点按钮
// var btn_goals_detail_remove = d3.select("#btn-goals-detail-remove") // 详细信息删除子节点按钮

// ## 私有函数 ## //

// 全局智能刷新
function updateTree() {
    // 兼容性检查
    for (var i = 0; i < data.length; i++) {
        if (!data[i].description) {
            data[i].description = ""
        }
    }
    // 刷新数据
    stratify_goals = d3.stratify()
        .id(function (d) {
            return d.hash;
        }).parentId(function (d) {
            return d.parentHash;
        })(data)
    // link = svg_goals.select("#goals-links")
    svg_goals.select("#goals-links")
        .selectAll("path")
        .remove()
    svg_goals.select("#goals-links")
        .selectAll("path")
        .data(tree(stratify_goals).links())
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

    svg_goals.select("#goals-nodes")
        .selectAll("g")
        .remove()
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
            if (d3.select(this)._groups[0][0].__data__.id != currentSelect) {
                d3.select(this).attr("r", 5)
                d3.select(this).attr("fill", "#000")
            }
        })
        .on("click", function () {
            updateTree()
            d3.select("#goals-detail-hash")
                .text("@" + d3.select(this).node().__data__.data.hash)
            d3.select("#goals-detail-name").node()
                .value = d3.select(this).node().__data__.data.name
            d3.select("#goals-detail-description").node()
                .value = d3.select(this).node().__data__.data.description

            // 详细页面父节点列表生成
            stratify_goals = d3.stratify()
                .id(function (d) {
                    return d.hash;
                }).parentId(function (d) {
                    return d.parentHash;
                })(data)
            var l_node = stratify_goals.descendants()
            var l_id = []
            selectedIndex = 0
            for (var i = 0; i < l_node.length; i++) {
                if (l_node[i].data.hash == d3.select(this).node().__data__.data.parentHash) {
                    selectedIndex = i
                }
                l_id.push(l_node[i].data.name + "@" + l_node[i].data.hash)
            }
            d3.select("#goals-detail-parentlist")
                .selectAll("option")
                .remove()
            d3.select("#goals-detail-parentlist")
                .selectAll("option")
                .data(l_id)
                .enter().append("option")
                .text(function (d) {
                    return d
                })
            d3.select("#goals-detail-parentlist").node().selectedIndex = selectedIndex
            //

            currentSelect = d3.select(this)._groups[0][0].__data__.id
        })
    svg_goals.select("#goals-nodes")
        .selectAll("text")
        .attr("x", function (d) {
            // console.log(d.node())
            return -6
        })
        .attr("y", function (d) {
            return 20
        })
        .data(stratify_goals.descendants())
        .text(function (d) {
            return d.data.name
        })
    svg_goals.select("#goals-nodes").selectAll("text")
    // console.log(svg_goals.select("#goals-nodes").selectAll("text").node().getBoundingClientRect())
}

function saveData() {
    ipcRenderer.sendSync('synchronous-message', JSON.stringify({
        'cmd': 'save',
        'data': data
    }))
}

function getHash() {
    return String(Number(String(Math.random()).split('.')[1]))
}