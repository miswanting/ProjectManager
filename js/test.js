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
var gantt = new Vue({
    el: '#gantt',
    data: {
        start: '',
        headHeight: 52,
        taskBoardHeight: 0,
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
})
gantt.start = moment().month(moment().month()).date(0);
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
    newTask.name = (newTask.name == '') ? 'None' : newTask.name
    gantt.tasks.push(newTask)
    gantt.taskBoardHeight = document.getElementById('bodys').clientHeight + 26
    adjust()
})

function doScroll() {
    console.log(123);

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