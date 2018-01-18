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
            'status': 'done'
        }, {
            'hash': getHash(),
            'name': 'ing',
            'status': 'current'
        }, {
            'hash': getHash(),
            'name': 'to',
            'status': 'todo'
        }]
    })
    data.projects.push({
        'hash': getHash(),
        'name': 'test',
        'missions': [{
            'hash': getHash(),
            'name': 'ed',
            'status': 'done'
        }, {
            'hash': getHash(),
            'name': 'ing',
            'status': 'current'
        }, {
            'hash': getHash(),
            'name': 'to',
            'status': 'todo'
        }]
    })
}
// PTT.selectAll("tr").remove()
createItem()

function createItem() {
    for (var i = 0; i < data.projects.length; i++) {
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
        var headLine = form.append("div")
            .attr("class", "row mb-3")
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
        form.append("div")
            .attr("class", "progress mb-3")
            .append("div")
            .attr("class", "progress-bar progress-bar-striped progress-bar-animated")
            .attr("role", "progressbar")
            .attr("style", "width: 50%")
            .attr("aria-valuenow", "50")
            .attr("aria-valuemin", "0")
            .attr("aria-valuemax", "100")
        var panel = form.append("div")
            .attr("class", "row mb-3")
        var previousMissionList = panel.append("ul")
            .attr("class", "list-group col-md-3 p-3")
        for (var j = data.projects[i].missions.length - 1; j >= 0; j--) {
            if (data.projects[i].missions[j].status == 'done') {
                previousMissionList.append("li")
                    .attr("class", "list-group-item")
                    .text(data.projects[i].missions[j].name)
            }
        }
        var currentMissionPanel = panel.append("div")
            .attr("class", "col-md-6 p-3")
        var currentMission = {}
        for (var j = 0; j < data.projects[i].missions.length; j++) {
            if (data.projects[i].missions[j].status == 'current') {
                currentMission = data.projects[i].missions[j]
            }
        }
        var missionChooser = currentMissionPanel.append("div")
            .attr("class", "input-group input-group-sm mb-3")
        missionChooser.append("button")
            .attr("class", "btn btn-sm")
            .attr("type", "button")
            .text("←")
        missionChooser.append("div")
            .attr("class", "input-group-prepend")
            .append("span")
            .attr("class", "input-group-text")
            .text("当前任务")
        missionChooser.append("input")
            .attr("class", "form-control")
            .attr("type", "text")
            .node().value = currentMission.name
        missionChooser.append("button")
            .attr("class", "btn btn-sm")
            .attr("type", "button")
            .text("→")
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
        var description = currentMissionPanel.append("div")
            .attr("class", "form-group")
        description.append("label")
            .text("任务描述")
        description.append("textarea")
            .attr("class", "form-control")
            .attr("rows", "2")
        currentMissionPanel.append("button")
            .attr("class", "btn btn-primary btn-sm btn-block")
            .attr("type", "button")
            .text("已完成")
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