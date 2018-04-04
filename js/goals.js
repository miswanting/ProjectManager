'use strict';
const {
  ipcRenderer
} = require('electron')
var goal = {
  width: 800,
  height: 600,
  currentSelectedId: '',
  data: {},
  svg: d3.select("#svg-goals"),
  detailHash: document.getElementById('goals-detail-hash'),
  detailName: document.getElementById('goals-detail-name'),
  detailDes: document.getElementById('goals-detail-description'),
  detailParentList: document.getElementById('goals-detail-parentlist'),
  detailRefreshBtn: document.getElementById('btn-goals-detail-refresh'),
  detailAddBtn: document.getElementById('btn-goals-detail-add'),
  detailRemoveBtn: document.getElementById('btn-goals-detail-remove'),
  tree: d3.tree().size([this.height - 100, this.width - 100]),
  stratify: {},
  init: function () {
    this.getData()
    this.svg.attr("width", this.width)
    this.svg.attr("height", this.height)
    this.detailRefreshBtn.addEventListener('click', this.refresh)
    this.detailAddBtn.addEventListener('click', this.add)
    this.detailRemoveBtn.addEventListener('click', this.remove)
    var link = this.svg.append("g")
      .attr("class", "links")
      .attr("id", "goals-links")
      // 整体偏移
      .attr("transform", function (d) {
        return "translate(" + 50 + "," + 0 + ")"
      })
    var nodes = this.svg.append("g")
      .attr("class", "nodes")
      .attr("id", "goals-nodes")
      // 整体偏移
      .attr("transform", function (d) {
        return "translate(" + 50 + "," + 0 + ")"
      })
    this.update()
  },
  getDataByHash: function (hash) {
    for (var i = 0; i < this.data.goals.length; i++) {
      if (this.data.goals[i].hash == hash)
        return this.data.goals[i]
    }
  },
  refresh: function () {
    for (var i = 0; i < this.data.goals.length; i++) { // 更新
      if (this.data.goals[i].hash == this.detailHash.value) {
        this.data.goals[i].name = this.detailName.value
        this.data.goals[i].description = this.detailDes.value
        if (this.data.goals.length == 1) {
          this.data.goals[i].parentHash = ""
        } else if (this.detailParentList.value == this.data.goals[i].hash) {
          alert("父节点不能为自己！")
        } else {
          this.data.goals[i].parentHash = this.detailParentList.value.split("@")[1]
        }
      }
    }
    this.update()
    this.setData(this.data)
  },
  updateParentList: function () {
    this.stratify = d3.stratify()
      .id(function (d) {
        return d.hash;
      }).parentId(function (d) {
        return d.parentHash;
      })(this.data.goals)
    var nodeList = this.stratify.descendants()
    var idList = []
    selectedIndex = 0
    for (var i = 0; i < nodeList.length; i++) {
      if (nodeList[i].data.hash == this.getDataByHash(newNode.hash).parentHash) {
        selectedIndex = i
      }
      idList.push(nodeList[i].data.name + "@" + nodeList[i].data.hash)
    }
    for (i = 0; i < this.detailParentList.options.length; i++) {
      this.detailParentList.remove[0];
    }
    for (i = 0; i < idList.length; i++) {
      var option = document.createElement("option");
      option.text = idList[i];
      this.detailParentList.add(option);
    }
    this.detailParentList.selectedIndex = selectedIndex
    this.currentSelectedId = d3.select(this)._groups[0][0].__data__.data.hash
  },
  add: function () {
    var newNode = {
      "hash": this.getHash(),
      "parentHash": d3.select("#goals-detail-hash").node().value,
      "name": "",
      "description": ""
    }
    this.data.goals.push(newNode)
    this.detailHash.value = newNode.hash
    this.detailName.value = newNode.name
    this.detailDes.value = newNode.description
    this.currentSelectedId = newNode.hash
    // 详细页面父节点列表生成
    this.updateParentList()

    //
    this.update()
    this.setData(this.data)
  },
  remove: function () {
    if (this.currentSelectedId == "") {
      alert("请选择一项！")
    } else {
      var flag = false // 是否拥有子节点
      for (var i = 0; i < this.data.goals.length; i++) {
        if (this.data.goals[i].parentHash == this.currentSelectedId) {
          flag = true
        }
      }
      if (flag) {
        alert("不能直接删除非空节点！")
      } else {
        for (var i = 0; i < this.data.goals.length; i++) {
          if (this.data.goals[i].hash == this.currentSelectedId) {
            this.data.goals.splice(i, 1)
            this.currentSelectedId = ""
            this.detailHash.value = ""
            this.detailName.value = ""
            this.detailDes.value = ""
            for (i = 0; i < this.detailParentList.options.length; i++) {
              this.detailParentList.remove[0];
            }
            this.update()
            this.setData(this.data)
          }
        }
      }
    }
  },
  getData: function () {
    // 从main获取该页面的数据。
    var data = ipcRenderer.sendSync('synchronous-message', JSON.stringify({
      'cmd': 'db'
    }))
    if (!data.goals) {
      data.goals = []
      data.goals.push({
        "hash": this.getHash(),
        "parentHash": "",
        "name": "任务根节点",
        "description": ""
      })
      this.setData(data)
    }
    this.data = data
  },
  setData: function (data) {
    ipcRenderer.sendSync('synchronous-message', JSON.stringify({
      cmd: 'save',
      data: data
    }))
  },
  getHash: function () {
    return String(Number(String(Math.random()).split('.')[1]))
  },
  update: function () {
    // 兼容性检查
    for (var i = 0; i < this.data.length; i++) {
      if (!this.data.goals[i].description) {
        this.data.goals[i].description = ""
      }
    }
    // 获取结构数据
    console.log(this.stratify)
    this.stratify = d3.stratify()
      .id(function (d) {
        return d.hash;
      }).parentId(function (d) {
        return d.parentHash;
      })(this.data.goals)
    // 删除原有图像
    this.svg.select("#goals-links")
      .selectAll("path")
      .remove()
    this.svg.select("#goals-nodes")
      .selectAll("g")
      .remove()
    // 创建新的link
    console.log(this.stratify)
    this.svg.select("#goals-links")
      .selectAll("path")
      .data(this.tree(this.stratify).links())
      .enter().append("path")
    this.svg.select("#goals-links")
      .selectAll("path")
      .data(this.tree(this.stratify).links())
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
    // 创建新的node
    var nodes = this.svg.select("#goals-nodes")
      .selectAll("g")
      .data(this.stratify.descendants())
      .enter().append("g")
      .attr("transform", function (d) {
        return "translate(" + d.y + "," + d.x + ")"
      })
    nodes.append("circle")
    nodes.append("text")
    nodes.selectAll("g")
      .attr("transform", function (d) {
        return "translate(" + d.y + "," + d.x + ")"
      })
    nodes.selectAll("circle")
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
        this.update()

        // 显示详细页面数据
        detailHash.value = d3.select(this).node().__data__.data.hash
        detailName.value = d3.select(this).node().__data__.data.name
        detailDes.value = d3.select(this).node().__data__.data.description
        // d3.select("#goals-detail-hash").node().value = d3.select(this).node().__data__.data.hash
        // d3.select("#goals-detail-name").node().value = d3.select(this).node().__data__.data.name
        // d3.select("#goals-detail-description").node().value = d3.select(this).node().__data__.data.description

        // 详细页面父节点列表生成
        this.updateParentList()
        this.svg.select("#goals-nodes")
          .selectAll("text")
          .attr("x", function (d) {
            // console.log(d.node())
            return -6
          })
          .attr("y", function (d) {
            return 20
          })
          .data(this.stratify.descendants())
          .text(function (d) {
            return d.data.name
          })
        // this.svg.select("#goals-nodes").selectAll("text")
        // console.log(svg_goals.select("#goals-nodes").selectAll("text").node().getBoundingClientRect())
      })
  }
}
goal.init()
// var svg_goals = d3.select("#svg-goals") // SVG元素的引用
// var btn_goals_detail_refresh = d3.select("#btn-goals-detail-refresh") // 详细信息刷新数据按钮
// var btn_goals_detail_add = d3.select("#btn-goals-detail-add") // 详细信息新增子节点按钮
// var btn_goals_detail_remove = d3.select("#btn-goals-detail-remove") // 详细信息删除子节点按钮
// var width = 800,
//   height = 600
// svg_goals.attr("width", width)
// svg_goals.attr("height", height)

// 抓取数据
// var data = ipcRenderer.sendSync('synchronous-message', JSON.stringify({
//   'cmd': 'db'
// }))
// if (!data.goals) {
//   data.goals = []
//   data.goals.push({
//     "hash": getHash(),
//     "parentHash": "",
//     "name": "任务根节点",
//     "description": ""
//   })
//   saveData()
// }
// var currentSelect = ""
// var tree = d3.tree()
//   .size([height - 100, width - 100]);
// var stratify_goals
// var link = svg_goals.append("g")
//   .attr("class", "links")
//   .attr("id", "goals-links")
//   // 整体偏移
//   .attr("transform", function(d) {
//     return "translate(" + 50 + "," + 0 + ")"
//   })
// var nodes = svg_goals.append("g")
//   .attr("class", "nodes")
//   .attr("id", "goals-nodes")
//   // 整体偏移
//   .attr("transform", function(d) {
//     return "translate(" + 50 + "," + 0 + ")"
//   })
// updateTree()

// // 更新数据
// btn_goals_detail_refresh.on("click", function() {
//   for (var i = 0; i < data.goals.length; i++) { // 更新
//     if (data.goals[i].hash == d3.select("#goals-detail-hash").node().value) {
//       data.goals[i].name = d3.select("#goals-detail-name").node().value
//       data.goals[i].description = d3.select("#goals-detail-description").node().value
//       if (data.goals.length == 1) {
//         data.goals[i].parentHash = ""
//       } else if (d3.select("#goals-detail-parentlist").node().value == data.goals[i].hash) {
//         alert("父节点不能为自己！")
//       } else {
//         data.goals[i].parentHash = d3.select("#goals-detail-parentlist").node().value.split("@")[1]
//       }
//     }
//   }
//   updateTree()
//   saveData()
// })

// // 新增节点
// btn_goals_detail_add.on("click", function() {
//   var newNode = {
//     "hash": getHash(),
//     "parentHash": d3.select("#goals-detail-hash").node().value,
//     "name": "",
//     "description": ""
//   }
//   data.goals.push(newNode)
//   d3.select("#goals-detail-hash").node().value = newNode.hash
//   d3.select("#goals-detail-name").node().value = newNode.name
//   d3.select("#goals-detail-description").node().value = newNode.description
//   currentSelect = newNode.hash
//   // 详细页面父节点列表生成
//   stratify_goals = d3.stratify()
//     .id(function(d) {
//       return d.hash;
//     }).parentId(function(d) {
//       return d.parentHash;
//     })(data.goals)
//   var l_node = stratify_goals.descendants()
//   var l_id = []
//   selectedIndex = 0
//   for (var i = 0; i < l_node.length; i++) {
//     if (l_node[i].data.hash == getDataByHash(newNode.hash).parentHash) {
//       selectedIndex = i
//     }
//     l_id.push(l_node[i].data.name + "@" + l_node[i].data.hash)
//   }
//   d3.select("#goals-detail-parentlist")
//     .selectAll("option")
//     .remove()
//   d3.select("#goals-detail-parentlist")
//     .selectAll("option")
//     .data(l_id)
//     .enter().append("option")
//     .text(function(d) {
//       return d
//     })
//   d3.select("#goals-detail-parentlist").node().selectedIndex = selectedIndex
//   //
//   updateTree()
//   saveData()
// })

// 删除节点
// btn_goals_detail_remove.on("click", function() {
//   if (currentSelect == "") {
//     alert("请选择一项！")
//   } else {
//     flag = false // 是否拥有子节点
//     for (var i = 0; i < data.goals.length; i++) {
//       if (data.goals[i].parentHash == currentSelect) {
//         flag = true
//       }
//     }
//     if (flag) {
//       alert("不能直接删除非空节点！")
//     } else {
//       for (var i = 0; i < data.goals.length; i++) {
//         if (data.goals[i].hash == currentSelect) {
//           data.goals.splice(i, 1)
//           currentSelect = ""
//           d3.select("#goals-detail-hash").node().value = ""
//           d3.select("#goals-detail-name").node().value = ""
//           d3.select("#goals-detail-description").node().value = ""
//           d3.select("#goals-detail-parentlist").selectAll("option").remove()
//           updateTree()
//           saveData()
//         }
//       }
//     }
//   }
// })

// ## 私有函数 ## // -- -- -- --

// 全局刷新
// function updateTree() {
//   // 兼容性检查
//   for (var i = 0; i < data.length; i++) {
//     if (!data.goals[i].description) {
//       data.goals[i].description = ""
//     }
//   }
//   // 刷新数据
//   stratify_goals = d3.stratify()
//     .id(function(d) {
//       return d.hash;
//     }).parentId(function(d) {
//       return d.parentHash;
//     })(data.goals)
//   svg_goals.select("#goals-links")
//     .selectAll("path")
//     .remove()
//   svg_goals.select("#goals-links")
//     .selectAll("path")
//     .data(tree(stratify_goals).links())
//     .enter().append("path")
//   svg_goals.select("#goals-links")
//     .selectAll("path")
//     .data(tree(stratify_goals).links())
//     .attr("d", d3.linkHorizontal()
//       .x(function(d) {
//         return d.y;
//       })
//       .y(function(d) {
//         return d.x;
//       }))
//     .attr("stroke", "#000")
//     .attr("stroke-width", 2)
//     .attr("fill", "none")
//
//   svg_goals.select("#goals-nodes")
//     .selectAll("g")
//     .remove()
//   nodes = svg_goals.select("#goals-nodes")
//     .selectAll("g")
//     .data(stratify_goals.descendants())
//     .enter().append("g")
//     .attr("transform", function(d) {
//       return "translate(" + d.y + "," + d.x + ")"
//     })
//   nodes.append("circle")
//   nodes.append("text")
//   svg_goals.select("#goals-nodes")
//     .selectAll("g")
//     .attr("transform", function(d) {
//       return "translate(" + d.y + "," + d.x + ")"
//     })
//   svg_goals.select("#goals-nodes")
//     .selectAll("circle")
//     .attr("r", 5)
//     .attr("stroke", "#fff")
//     .attr("stroke-width", 2)
//     .on("mouseover", function() {
//       d3.select(this).attr("r", 10)
//       d3.select(this).attr("fill", "#00f")
//     })
//     .on("mouseout", function() {
//       if (d3.select(this)._groups[0][0].__data__.id != currentSelect) {
//         d3.select(this).attr("r", 5)
//         d3.select(this).attr("fill", "#000")
//       }
//     })
//     .on("click", function() {
//       updateTree()
//
//       d3.select("#goals-detail-hash").node().value = d3.select(this).node().__data__.data.hash
//       d3.select("#goals-detail-name").node().value = d3.select(this).node().__data__.data.name
//       d3.select("#goals-detail-description").node().value = d3.select(this).node().__data__.data.description
//
//       // 详细页面父节点列表生成
//       stratify_goals = d3.stratify()
//         .id(function(d) {
//           return d.hash;
//         }).parentId(function(d) {
//           return d.parentHash;
//         })(data.goals)
//       var l_node = stratify_goals.descendants()
//       var l_id = []
//       selectedIndex = 0
//       for (var i = 0; i < l_node.length; i++) {
//         if (l_node[i].data.hash == d3.select(this).node().__data__.data.parentHash) {
//           selectedIndex = i
//         }
//         l_id.push(l_node[i].data.name + "@" + l_node[i].data.hash)
//       }
//       d3.select("#goals-detail-parentlist")
//         .selectAll("option")
//         .remove()
//       d3.select("#goals-detail-parentlist")
//         .selectAll("option")
//         .data(l_id)
//         .enter().append("option")
//         .text(function(d) {
//           return d
//         })
//       d3.select("#goals-detail-parentlist").node().selectedIndex = selectedIndex
//       //
//
//       currentSelect = d3.select(this)._groups[0][0].__data__.data.hash
//     })
//   svg_goals.select("#goals-nodes")
//     .selectAll("text")
//     .attr("x", function(d) {
//       // console.log(d.node())
//       return -6
//     })
//     .attr("y", function(d) {
//       return 20
//     })
//     .data(stratify_goals.descendants())
//     .text(function(d) {
//       return d.data.name
//     })
//   svg_goals.select("#goals-nodes").selectAll("text")
//   // console.log(svg_goals.select("#goals-nodes").selectAll("text").node().getBoundingClientRect())
// }

// function saveData() {
//   ipcRenderer.sendSync('synchronous-message', JSON.stringify({
//     'cmd': 'save',
//     'data': data
//   }))
// }

// function getHash() {
//   return String(Number(String(Math.random()).split('.')[1]))
// }

// function getDataByHash(hash) {
//   for (var i = 0; i < data.goals.length; i++) {
//     if (data.goals[i].hash == hash)
//       return data.goals[i]
//   }
// }