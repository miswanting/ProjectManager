Vue.config.devtools = true
var gantt = document.getElementById('gantt')
gantt.style.height = window.innerHeight - document.getElementsByClassName('navbar')[0].clientHeight + 'px'
var months = []
moment.locale("zh");

function getScrollbarWidth() {
    var outer = document.createElement("div");
    outer.style.visibility = "hidden";
    outer.style.width = "100px";
    outer.style.msOverflowStyle = "scrollbar"; // needed for WinJS apps

    document.body.appendChild(outer);

    var widthNoScroll = outer.offsetWidth;
    // force scrollbars
    outer.style.overflow = "scroll";

    // add innerdiv
    var inner = document.createElement("div");
    inner.style.width = "100%";
    outer.appendChild(inner);

    var widthWithScroll = inner.offsetWidth;

    // remove divs
    outer.parentNode.removeChild(outer);

    return widthNoScroll - widthWithScroll;
}

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

function getNewTask() {
    var newTask = {
        name: '',
        type: '',
        start: '',
        end: '',
        progress: {
            success: 0,
            primary: 0,
            info: 0,
            warning: 0,
            danger: 0
        },
        left: 0,
        width: 0,
        hash: '',
        showTool: false
    }
    return newTask
}

function getNewProject() {
    var newProject = {
        start: '',
        ganttTimeTableHeight: '',
        months: [],
        nowLeft: 0,
        tasks: [],
        pause: false,
        newTask: getNewTask()
    }
    return newProject
}
if (data.projects) {
    // 存档转换器
    if (data.projects.pause) {
        data.projects.pause = false
    }
    data.projects.newTask = getNewTask()
    for (let i = 0; i < data.projects.tasks.length; i++) {
        if (!data.projects.tasks[i].wbs) {
            data.projects.tasks[i].wbs = '#'
        }
        if (data.projects.tasks[i].progress) {} else {
            data.projects.tasks[i].progress = {
                success: 0,
                primary: 0,
                info: 0,
                warning: 0,
                danger: 0
            }
        }
        if (data.projects.tasks[i].type == 'line') {
            data.projects.tasks[i].type = 'normal'
        }
    }
    save()
} else {
    data.projects = getNewProject()
    data.projects.months = months
}
data.projects.nowLeft = 0
data.projects.rightHeadWidth = 1000
data.projects.ganttTimeTableHeight = data.projects.tasks.length * 26 + document.getElementById('right-panel').scrollHeight
var gantt = new Vue({
    el: '#gantt',
    data: data.projects,
    // computed: {
    //     rightHeadWidth: function () {
    //         return document.getElementById('right-panel').clientWidth - document.getElementById('right-panel').scrollWidth
    //     }
    // },
    methods: {
        mouseOver: function (hash) {
            for (let i = 0; i < data.projects.tasks.length; i++) {
                if (data.projects.tasks[i].hash == hash) {
                    data.projects.tasks[i].showTool = true
                }
            }
        },
        mouseLeave: function (hash) {
            for (let i = 0; i < data.projects.tasks.length; i++) {
                if (data.projects.tasks[i].hash == hash) {
                    data.projects.tasks[i].showTool = false
                }
            }
        },
        click: function (hash) {
            for (let i = 0; i < data.projects.tasks.length; i++) {
                if (data.projects.tasks[i].hash == hash) {
                    // data.projects.tasks[i].showTool = false
                    data.projects.tasks.splice(i, 1)
                }
            }
            data.projects.ganttTimeTableHeight = data.projects.tasks.length * 26
            save()
        },
        admitProgress: function (hash) {
            for (let i = 0; i < data.projects.tasks.length; i++) {
                if (data.projects.tasks[i].hash == hash) {
                    // 现在减去开始 比上 结束减去开始
                    console.log(moment(data.projects.tasks[i].start._i));
                    var now = moment(moment().format('Y-MM-DD HH:mm:ss'), 'Y-MM-DD HH:mm:ss')
                    var nowDuration = moment.duration(now.diff(moment(data.projects.tasks[i].start._i)))
                    var totalDuration = moment.duration(moment(data.projects.tasks[i].end._i).diff(moment(data.projects.tasks[i].start._i)))
                    console.log();
                    var progress = (nowDuration.asDays()) / (totalDuration.asDays() + 1)
                    if (progress > 1) {
                        progress = 1
                    }
                    data.projects.tasks[i].progress.info = 0
                    data.projects.tasks[i].progress.warning = 0
                    data.projects.tasks[i].progress.primary = progress * 100
                }
            }
            save()
        },
        warnProgress: function (hash) {
            for (let i = 0; i < data.projects.tasks.length; i++) {
                if (data.projects.tasks[i].hash == hash) {
                    // 现在减去开始 比上 结束减去开始
                    console.log(moment(data.projects.tasks[i].start._i));
                    var now = moment(moment().format('Y-MM-DD HH:mm:ss'), 'Y-MM-DD HH:mm:ss')
                    var nowDuration = moment.duration(now.diff(moment(data.projects.tasks[i].start._i)))
                    var totalDuration = moment.duration(moment(data.projects.tasks[i].end._i).diff(moment(data.projects.tasks[i].start._i)))
                    console.log();
                    var progress = (nowDuration.asDays()) / (totalDuration.asDays() + 1)
                    if (progress > 1) {
                        progress = 1
                    }
                    data.projects.tasks[i].progress.info = 0
                    progress = progress - data.projects.tasks[i].progress.primary / 100
                    data.projects.tasks[i].progress.warning = progress * 100
                }
            }
            save()
        },
        stopTimer: function (event) {
            data.projects.pause = true
        },
        startTimer: function (event) {
            data.projects.pause = false
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
// var fp = flatpickr("#start-time", {
//     "locale": "zh",
//     "plugins": [new rangePlugin({
//         input: "#end-time"
//     })],
//     config: {
//         enableTime: true,
//         dateFormat: "Y-m-d H:i"
//     }
// });

function adjust() {
    document.getElementById('right-panel').style.height = document.getElementById('gantt').clientHeight - document.getElementById('right-panel').offsetTop + 'px'
    data.projects.rightHeadWidth = document.getElementById('right-panel').clientWidth - document.getElementById('right-panel').scrollWidth
}
document.getElementById('add-task').addEventListener('click', () => {
    // 新建Task
    console.log(gantt.newTask.start, document.getElementById('end-time').value);
    var newTask = JSON.parse(JSON.stringify(gantt.newTask))
    newTask.start = moment(document.getElementById('start-time').value) // BUG: 不能通过Vue获取参数
    newTask.end = moment(document.getElementById('end-time').value) // BUG
    var duration = moment.duration(newTask.end.diff(newTask.start))
    if (newTask.type == 'milestone') {
        newTask.width = 20
    } else if (newTask.type == 'normal') {
        newTask.width = (duration.asDays() + 1) * 20
    }
    var duration = moment.duration(newTask.start.diff(gantt.start))
    newTask.left = duration.asDays() * 20
    // console.log(gantt, newTask, duration, duration.asDays(), newTask.left);
    newTask.name = (newTask.name == '') ? 'None' : newTask.name
    newTask.hash = getHash()
    newTask.progress = {
        success: 0,
        primary: 0,
        info: 0,
        warning: 0,
        danger: 0
    }
    gantt.tasks.push(newTask)
    save()
    timer()
    // console.log(data.projects.tasks, document.getElementById('right-panel').scrollHeight);
    data.projects.ganttTimeTableHeight = data.projects.tasks.length * 26
})
// document.getElementById('projects').addEventListener('click', () => {

//     console.log(document.getElementById('right-panel').clientWidth, document.getElementById('right-panel').scrollWidth);
//     data.projects.rightHeadWidth = document.getElementById('right-panel').clientWidth
// })

function doScroll() {
    console.log(document.getElementById('right-head-scroll').scrollLeft);

    // data.projects.rightHeadWidth = document.getElementById('right-panel').clientWidth
    document.getElementById('right-head-scroll').scrollLeft = document.getElementById('right-panel').scrollLeft;
    document.getElementById('left-panel').scrollTop = document.getElementById('right-panel').scrollTop;
    data.projects.rightHeadWidth = document.getElementById('right-panel').clientWidth
}
document.getElementById('add-task-btn').addEventListener('click', () => {
    gantt.newTask = {
        wbs: '#',
        name: '',
        type: '',
        start: '',
        end: ''
    }
    // fp.clear()
})

setInterval(timer, 1000);

function timer() {
    if (!data.projects.pause) {
        // 移动时间线
        var now = moment(moment().format('Y-MM-DD HH:mm:ss'), 'Y-MM-DD HH:mm:ss')
        var duration = moment.duration(now.diff(gantt.start))
        gantt.nowLeft = duration.asDays() * 20
        // 更新进度条
        for (let i = 0; i < data.projects.tasks.length; i++) {
            // 现在减去开始 比上 结束减去开始
            var now = moment(moment().format('Y-MM-DD HH:mm:ss'), 'Y-MM-DD HH:mm:ss')
            var nowDuration = moment.duration(now.diff(moment(data.projects.tasks[i].start._i)))
            var totalDuration = moment.duration(moment(data.projects.tasks[i].end._i).diff(moment(data.projects.tasks[i].start._i)))
            var progress = (nowDuration.asDays()) / (totalDuration.asDays() + 1)
            if (progress > 1) {
                progress = 1
            }
            progress = progress - data.projects.tasks[i].progress.primary / 100
            progress = progress - data.projects.tasks[i].progress.warning / 100
            data.projects.tasks[i].progress.info = progress * 100
        }
    }
}
$("#start-time").datepicker({
    showWeek: true,
    firstDay: 1,
    dateFormat: 'yy-mm-dd'
});
$("#end-time").datepicker({
    showWeek: true,
    firstDay: 1,
    dateFormat: 'yy-mm-dd'
});
timer()