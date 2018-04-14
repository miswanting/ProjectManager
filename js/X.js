var tx = document.getElementById('X')
tx.innerHTML = ''
var x = document.createElement("div")
tx.appendChild(x)
// 清空
moment.locale('zh-cn');

gantt = {
    'nav': document.createElement("div"),
    'tools': document.createElement("div"),
    'body': document.createElement("div"),
    'leftPanel': document.createElement("div"),
    'rightPanel': document.createElement("div"),
    'leftHead': document.createElement("div"),
    'projInfo': document.createElement("div"),
    'leftVP': document.createElement("div"),
    'rightVP': document.createElement("div"),
    'rightVP': document.createElement("div"),
    'rightVP': document.createElement("div"),
    'taskBoard': document.createElement("div"),
    'ganttBoard': document.createElement("div"),
    'pureGantt': document.createElement("div"),
    'bVP': document.createElement("div"),
    'fVP': document.createElement("div"),
    'init': function () {
        x.classList.add('d-flex');
        x.classList.add('flex-column');
        x.style.height = window.innerHeight - document.getElementsByClassName('navbar')[0].clientHeight + 'px'
        // 1级
        x.appendChild(this.nav)
        x.appendChild(this.tools)
        x.appendChild(this.head)
        x.appendChild(this.body)
        // 2级
        this.head.appendChild(this.leftHead)
        this.head.appendChild(this.rightHead)
        this.body.appendChild(this.leftPanel)
        this.body.appendChild(this.rightPanel)
        // 3级
        this.leftHead.appendChild(this.leftTableHead)
        this.leftHead.appendChild(this.projInfo)
        this.rightHead.appendChild(this.rightTableHead)
        this.leftPanel.appendChild(this.leftVP)
        this.rightPanel.appendChild(this.rightVP)
        // 4级
        this.leftTableHead.appendChild(this.text_name)
        this.leftTableHead.appendChild(this.text_progress)
        this.projInfo.appendChild(this.text_projName)
        this.projInfo.appendChild(this.text_projTotalProgress)
        this.leftVP.appendChild(this.taskBoard)
        this.rightVP.appendChild(this.ganttBoard)
        // 5级
        // this.ganttBoard.appendChild(this.taskBoard)
        // this.ganttBoard.appendChild(this.ganttBoard)
        // Class
        this.body.classList.add('container-fluid')
        this.body.classList.add('row')
        this.body.classList.add('m-0')
        this.body.classList.add('p-0')
        this.leftPanel.classList.add('col-3')
        this.leftPanel.classList.add('p-0')
        this.rightPanel.classList.add('col-9')
        this.rightPanel.classList.add('p-0')
        this.ganttBoard.classList.add('d-flex')
        // Style
        // this.body.style.height = '100%'
        // this.leftVP.style.height = '100%'
        // this.rightVP.style.height = '100%'
        // this.ganttBoard.style.height = '100%'
        // this.ganttBoard.style.overflow = 'auto'
        // InnerHtml
        this.nav.innerHTML = '1'
        this.tools.innerHTML = '2'
        // 生成 ganttBoard
        for (let i = 0; i < 6; i++) {
            var newMonth = document.createElement("div")
            var newMonthName = document.createElement("div")
            var newDayList = document.createElement("div")
            newMonth.appendChild(newMonthName)
            newMonth.appendChild(newDayList)
            newMonth.classList.add('d-flex');
            newMonth.classList.add('flex-column');
            newMonth.style.height = '100%'
            newMonthName.innerHTML = moment().month(moment().month() + i).format('YYYY MMMM')
            newMonthName.classList.add('text-center');
            newMonthName.classList.add('border');
            newDayList.classList.add('d-flex');
            newDayList.classList.add('align-items-stretch');
            newDayList.style.height = '100%'
            var dayCount = moment().add(i, 'months').daysInMonth();
            for (let j = 0; j < dayCount; j++) {
                var newDay = document.createElement("div")
                newDayList.appendChild(newDay)
                newDay.innerHTML = j + 1
                newDay.style.width = '20px'
                newDay.classList.add('text-center');
                newDay.classList.add('border');
            }
            newMonth.appendChild(newDayList)
            // newWeek.classList.add('align-self-stretch');
            this.ganttBoard.appendChild(newMonth)
        }
        //////////////////////////////////////
        // x.classList.add('d-flex');
        // x.classList.add('flex-column');
        // x.style.height = window.innerHeight - document.getElementsByClassName('navbar')[0].clientHeight + 'px'
        // // 导航
        // this.nav.innerHTML = '视图导航'
        // this.nav.style.width = '100%'
        // x.appendChild(this.nav)
        // // 工具
        // this.tools.innerHTML = '工具'
        // this.tools.style.width = '100%'
        // x.appendChild(this.tools)
        // // 时间网格图层
        // this.timeTable.style.height = '100%'
        // this.timeTable.classList.add('d-flex');
        // this.timeTable.classList.add('align-items-stretch');
        // for (let i = 0; i < 6; i++) {
        //     var currentMonth = document.createElement("div")
        //     currentMonth.classList.add('d-flex');
        //     currentMonth.classList.add('flex-column');
        //     currentMonth.style.height = '100%'
        //     var monthName = document.createElement("div")
        //     monthName.innerHTML = moment().month(moment().month() + i).format('YYYY MMMM')
        //     monthName.classList.add('text-center');
        //     monthName.classList.add('border');
        //     currentMonth.appendChild(monthName)
        //     var dayList = document.createElement("div")
        //     dayList.classList.add('d-flex');
        //     dayList.style.height = '100%'
        //     dayList.classList.add('align-items-stretch');
        //     var days = moment().add(i, 'months').daysInMonth();
        //     for (let j = 0; j < days; j++) {
        //         var newDay = document.createElement("div")
        //         newDay.innerHTML = j + 1
        //         newDay.style.width = '20px'
        //         newDay.classList.add('text-center');
        //         newDay.classList.add('border');
        //         dayList.appendChild(newDay)
        //     }
        //     currentMonth.appendChild(dayList)
        //     // newWeek.classList.add('align-self-stretch');
        //     this.timeTable.appendChild(currentMonth)
        // }
        // // 进度条图层
        // // 甘特图层
        // this.pureGantt.style.height = '100%'
        // this.pureGantt.appendChild(this.timeTable)
        // this.pureGantt.appendChild(this.progressL)
        // this.pureGantt.style.overflow = 'auto'
        // // Back 视口
        // this.bVP.classList.add('col-9');
        // this.bVP.classList.add('p-0');
        // this.bVP.style.height = '100%'
        // this.bVP.appendChild(this.pureGantt)
        // // 项目图层
        // var tableHead = document.createElement("div")
        // tableHead.classList.add('d-flex')
        // var head_name = document.createElement("div")
        // head_name.innerHTML = 'Name'
        // head_name.classList.add('flex-grow-1')
        // head_name.classList.add('border')
        // var total_progress = document.createElement("div")
        // total_progress.innerHTML = 'Progress'
        // total_progress.classList.add('border')
        // tableHead.appendChild(head_name)
        // tableHead.appendChild(total_progress)
        // var projectInfo = document.createElement("div")
        // projectInfo.classList.add('d-flex')
        // projectInfo.classList.add('align-items-end')
        // projectInfo.style.height = '50px'
        // projectInfo.classList.add('border')
        // var project_name = document.createElement("div")
        // project_name.innerHTML = 'Test'
        // var total_complete = document.createElement("div")
        // total_complete.innerHTML = '0%'
        // projectInfo.appendChild(project_name)
        // projectInfo.appendChild(total_complete)
        // var taskList = document.createElement("div")
        // // Front 视口
        // this.fVP.classList.add('col-3');
        // this.fVP.classList.add('p-0');
        // this.fVP.appendChild(tableHead)
        // this.fVP.appendChild(projectInfo)
        // this.fVP.appendChild(taskList)
        // // Body 图层
        // this.body.classList.add('container-fluid');
        // this.body.classList.add('row');
        // this.body.classList.add('m-0');
        // this.body.classList.add('p-0');
        // this.body.style.height = '100%'
        // this.body.appendChild(this.fVP)
        // this.body.appendChild(this.bVP)
        // x.appendChild(this.body)

    }
}
gantt.init()
console.log(x)