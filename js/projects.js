var gantt = document.getElementById('gantt')
gantt.style.height = window.innerHeight - document.getElementsByClassName('navbar')[0].clientHeight + 'px'
var months = []

for (let i = 0; i < 6; i++) {
    var newMonth = {}
    newMonth.text = moment().month(moment().month() + i).format('YYYY MMMM')
    newMonth.days = []
    for (let j = 0; j < moment().add(i, 'months').daysInMonth(); j++) {
        var newDay = {}
        newDay.text = j + 1
        newMonth.days.push(newDay)
    }
    months.push(newMonth)
}
load()
if (data.projects) {} else {
    data.projects = {
        start: '',
        headHeight: 52,
        taskBoardHeight: 0,
        ganttTimeTableHeight: '',
        months: months,
        tasks: [],
        newTask: {
            name: '',
            type: '',
            start: '',
            end: '',
            progress: 0,
            //
            left: 0,
            width: 20,
        }
    }
}
data.projects.rightHeadWidth = 1000
data.projects.ganttTimeTableHeight = 1000
data.projects.ganttTimeTableHeight = data.projects.tasks.length * 26 + document.getElementById('right-panel').scrollHeight
var gantt = new Vue({
    el: '#gantt',
    data: data.projects,
    computed: {
        rightHeadWidth: function () {
            return document.getElementById('right-panel').clientWidth - document.getElementById('right-panel').scrollWidth
        }
    }

})
console.log(document.getElementById('right-head').getBoundingClientRect())

// data.projects.rightHeadWidth = 100

// gantt.start = moment().month(moment().month()).date(0);
// console.log(moment().format('Y-MM'));
gantt.start = moment(moment().format('Y-MM'), 'Y-MM')
// const flatpickr = require("flatpickr");
// flatpickr("#myID", {});
var fp = flatpickr("#start-time", {
    "locale": "zh",
    "plugins": [new rangePlugin({
        input: "#end-time"
    })],
    config: {
        enableTime: true,
        dateFormat: "Y-m-d H:i"
    }
});

function adjust() {
    document.getElementById('right-panel').style.height = document.getElementById('gantt').clientHeight - document.getElementById('right-panel').offsetTop + 'px'
    data.projects.rightHeadWidth = document.getElementById('right-panel').clientWidth - document.getElementById('right-panel').scrollWidth
}

function text2time(text) {

}

function time2text(time) {

}
document.getElementById('add-task').addEventListener('click', () => {
    var newTask = JSON.parse(JSON.stringify(gantt.newTask))
    newTask.start = moment(newTask.start)
    newTask.end = moment(document.getElementById('end-time').value)
    var duration = moment.duration(newTask.end.diff(newTask.start))
    if (newTask.type == 'point') {
        newTask.width = 20
    } else if (newTask.type == 'line') {
        newTask.width = (duration.asDays() + 1) * 20
    }
    var duration = moment.duration(newTask.start.diff(gantt.start))
    newTask.left = duration.asDays() * 20
    console.log(gantt, newTask, duration, duration.asDays(), newTask.left);
    newTask.name = (newTask.name == '') ? 'None' : newTask.name
    gantt.tasks.push(newTask)
    save()
    gantt.taskBoardHeight = document.getElementById('bodys').clientHeight + 26
    adjust()
})
document.getElementById('projects').addEventListener('click', () => {

    console.log(document.getElementById('right-panel').clientWidth, document.getElementById('right-panel').scrollWidth);
    data.projects.rightHeadWidth = document.getElementById('right-panel').clientWidth
})

function doScroll() {
    data.projects.rightHeadWidth = document.getElementById('right-panel').clientWidth
}
document.getElementById('add-task-btn').addEventListener('click', () => {
    gantt.newTask = {
        name: '',
        type: '',
        start: '',
        end: ''
    }
    fp.clear()
})