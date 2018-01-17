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
        'name': 'test'
    })
    data.projects.push({
        'hash': getHash(),
        'name': 'test'
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
        PTT.append("tr").append("td")
            .attr("colspan", "4")
            .attr("class", "p-0")
            .append("div")
            .attr("id", data.projects[i].hash)
            .attr("class", "collapse")
            .attr("role", "tabpanel")
            .attr("aria-labelledby", "headingOne")
            .text("###")
    }
}