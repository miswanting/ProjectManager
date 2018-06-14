Vue.config.devtools = true
var goals = document.getElementById('goals')
goals.style.height = window.innerHeight - document.getElementsByClassName('navbar')[0].clientHeight + 'px'
load()
if (data.goals) { // 存档转换器
  data.goals = getNewGoals()
  save()
} else {
  data.goals = getNewGoals()
  save()
}
var link = d3.linkHorizontal()
  .x(function (d) {
    return d.y;
  })
  .y(function (d) {
    return d.x;
  });

var goals = d3.select("#goals").append("canvas")
  .style("width", "100%")
  .style("height", "100%")
// d3.hierarchy()
function getNewGoals() {
  var newGoals = {
    id: getHash(),
    name: '何雨航',
    gender: '男',
    birthDate: '1994-06-12',
    nation: '中国',
    // Readonly
    age: 0,
    progress: '',
    bigBirthday: '',
    birthday: '',
    tinyBirthday: '',
  }
  return newGoals
}