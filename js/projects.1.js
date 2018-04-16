var PT = d3.select("#projects-table") // 引用projects-table元素
var PTT = d3.select("#projects-table-tbody") // 引用projects-table元素
var data = ipcRenderer.sendSync('synchronous-message', JSON.stringify({
    'cmd': 'db'
}))
if (!data.projects) {
    data.projects = []
    // test node generate
    data.projects.push({
        'hash': getHash(),
        'name': 'test',
        'missions': [{
            'hash': getHash(),
            'name': 'ed',
            'status': 'done',
            'description': 'des'
        }, {
            'hash': getHash(),
            'name': 'ing',
            'status': 'current',
            'description': 'des'
        }, {
            'hash': getHash(),
            'name': 'to',
            'status': 'todo',
            'description': 'des'
        }]
    })
    data.projects.push({
        'hash': getHash(),
        'name': 'test',
        'missions': [{
            'hash': getHash(),
            'name': 'ed',
            'status': 'done',
            'description': 'des'
        }, {
            'hash': getHash(),
            'name': 'ing',
            'status': 'current',
            'description': 'des'
        }, {
            'hash': getHash(),
            'name': 'to',
            'status': 'todo',
            'description': 'des'
        }]
    })
    saveData()
}
// PTT.selectAll("tr").remove()
createItem()

function createItem() { // 表格全局刷新
    for (var i = 0; i < data.projects.length; i++) { // 每一个项目
        var tr = PTT.append("tr")
            .attr("id", "headingOne")
            .attr("role", "tab button")
            .attr("data-toggle", "collapse")
            .attr("href", "#" + data.projects[i].hash)
            .attr("aria-expanded", "true")
            .attr("aria-controls", "collapseOne")
        tr.append("th").attr("scope", "row").text(i + 1)
        tr.append("td").text(data.projects[i].name)
        tr.append("td").text()
        tr.append("td").text()
        var form = PTT.append("tr").append("td")
            .attr("colspan", "4")
            .attr("class", "p-0")
            .append("div")
            .attr("id", data.projects[i].hash)
            .attr("class", "collapse m-4")
            .attr("role", "tabpanel")
            .attr("aria-labelledby", "headingOne")
            .append("form")
        // 头条
        var headLine = form.append("div")
            .attr("class", "row mb-3")
        // Hash
        var hash = headLine.append("div")
            .attr("class", "input-group input-group-sm col-md-3")
        hash.append("div")
            .attr("class", "input-group-prepend")
            .append("span")
            .attr("class", "input-group-text")
            .text("@")
        hash.append("input")
            .attr("type", "text")
            .attr("class", "form-control")
            .attr("readonly", true)
            .node().value = data.projects[i].hash
        // 项目名称
        var name = headLine.append("div")
            .attr("class", "input-group input-group-sm col-md-7")
        name.append("div")
            .attr("class", "input-group-prepend")
            .append("span")
            .attr("class", "input-group-text")
            .text("项目名称")
        name.append("input")
            .attr("type", "text")
            .attr("class", "form-control")
            .node().value = data.projects[i].name
        // 优先指数
        var priorityIndex = headLine.append("div")
            .attr("class", "input-group input-group-sm col-md-2")
        priorityIndex.append("div")
            .attr("class", "input-group-prepend")
            .append("span")
            .attr("class", "input-group-text")
            .text("优先指数")
        priorityIndex.append("input")
            .attr("type", "text")
            .attr("class", "form-control")
            .attr("readonly", true)
        // 进度条
        form.append("div")
            .attr("class", "progress mb-3")
            .append("div")
            .attr("class", "progress-bar progress-bar-striped progress-bar-animated")
            .attr("role", "progressbar")
            .attr("style", "width: 50%")
            .attr("aria-valuenow", "50")
            .attr("aria-valuemin", "0")
            .attr("aria-valuemax", "100")
        // 进度条下
        var panel = form.append("div")
            .attr("class", "row mb-3")
        // 左侧已完成
        var previousMissionList = panel.append("ul")
            .attr("class", "list-group col-md-3 p-3")
        for (var j = data.projects[i].missions.length - 1; j >= 0; j--) {
            if (data.projects[i].missions[j].status == 'done') {
                previousMissionList.append("li")
                    .attr("class", "list-group-item")
                    .text(data.projects[i].missions[j].name)
            }
        }
        // 中间面板
        var currentMissionPanel = panel.append("div")
            .attr("class", "col-md-6 p-3")
        var currentMission = {} // 提出当前任务
        for (var j = 0; j < data.projects[i].missions.length; j++) {
            if (data.projects[i].missions[j].status == 'current') {
                currentMission = data.projects[i].missions[j]
            }
        }
        // 任务选择器
        var missionChooser = currentMissionPanel.append("div")
            .attr("class", "input-group input-group-sm mb-3")
        // 选择上一个任务
        missionChooser.append("button")
            .attr("class", "btn btn-sm")
            .attr("type", "button")
            .text("←")
        // 当前任务
        missionChooser.append("div")
            .attr("class", "input-group-prepend")
            .append("span")
            .attr("class", "input-group-text")
            .text("当前任务")
        missionChooser.append("input")
            .attr("class", "form-control")
            .attr("type", "text")
            .node().value = currentMission.name
        // 选择下一个任务
        missionChooser.append("button")
            .attr("class", "btn btn-sm")
            .attr("type", "button")
            .text("→")
        // 日期时间
        var dateTimeChooser = currentMissionPanel.append("div")
            .attr("class", "container")
            .append("div")
            .attr("class", "row")
            .append("div")
            .attr("class", "input-group input-group-sm mb-3")
        dateTimeChooser.append("div")
            .attr("class", "input-group-prepend")
            .append("span")
            .attr("class", "input-group-text")
            .text("日期时间")
        dateTimeChooser.append("input")
            .attr("class", "form-control")
            .attr("type", "text")
            .attr("id", "datetimepicker-" + data.projects[i].hash)
        $("#datetimepicker-" + data.projects[i].hash).datetimepicker({
            locale: 'zh-cn'
        })
        // 任务描述
        var description = currentMissionPanel.append("div")
            .attr("class", "form-group")
        description.append("label")
            .text("任务描述")
        description.append("textarea")
            .attr("class", "form-control")
            .attr("rows", "2")
            .node().value = currentMission.description
        // 完成按钮
        currentMissionPanel.append("button")
            .attr("class", "btn btn-primary btn-sm btn-block")
            .attr("type", "button")
            .text("已完成")
        // 右侧未完成
        var futureMissionList = panel.append("ul")
            .attr("class", "list-group col-md-3 p-3")
        for (var j = 0; j < data.projects[i].missions.length; j++) {
            if (data.projects[i].missions[j].status == 'todo') {
                futureMissionList.append("li")
                    .attr("class", "list-group-item")
                    .text(data.projects[i].missions[j].name)
            }
        }
        futureMissionList.append("li")
            .attr("class", "list-group-item d-flex justify-content-center")
            .append("button")
            .attr("class", "btn btn-sm")
            .attr("type", "button")
            .text("+")
    }
}