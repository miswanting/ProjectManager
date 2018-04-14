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
        headHeight: 52,
        taskBoardHeight: 0,
        months: months,
        tasks: [],
        newTask: {
            name: '',
            type: '',
            start: '',
            end: ''
        }
    }
})
// const flatpickr = require("flatpickr");
// flatpickr("#myID", {});
flatpickr("#start-time", {
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
    gantt.tasks.push(JSON.parse(JSON.stringify(gantt.newTask)))
    gantt.taskBoardHeight = document.getElementById('bodys').clientHeight + 26
    adjust()
})
function doScroll() {
    console.log(123);
    
}