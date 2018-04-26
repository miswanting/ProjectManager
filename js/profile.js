CHINA_AVERAGE_AGE = 74.83
Vue.config.devtools = true
var profile = document.getElementById('profile')
profile.style.height = window.innerHeight - document.getElementsByClassName('navbar')[0].clientHeight + 'px'
moment.locale("zh");
load()
if (data.profile) { // 存档转换器
    data.profile = getNewProfile()
    save()
} else {
    data.profile = getNewProfile()
    save()
}

var profile = new Vue({
    el: '#profile',
    data: data.profile,
    computed: {},
    methods: {}
})

function getNewProfile() {
    var newProfile = {
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
    return newProfile
}
setInterval(profileTimer, 1000)

function profileTimer() {
    var now = moment(moment().format('Y-MM-DD HH:mm:ss'), 'Y-MM-DD HH:mm:ss')
    var birthDate = moment(profile.birthDate, 'Y-MM-DD')
    var currentAge = moment.duration(now.diff(birthDate))
    var totalAge = moment.duration(CHINA_AVERAGE_AGE, 'years')
    profile.age = currentAge.asYears().toFixed(8)
    profile.progress = (currentAge / totalAge * 100).toFixed(8) + '%'
    //
    var nextBigBirthDate = birthDate.clone()
    var nextBirthDate = birthDate.clone()
    var nextTinyBirthDate = birthDate.clone()
    while (true) {
        nextBigBirthDate = nextBigBirthDate.add(1000, 'days')
        if (nextBigBirthDate.isAfter(now)) {
            break
        }
    }
    while (true) {
        nextBirthDate.year(nextBirthDate.year() + 1);
        if (nextBirthDate.isAfter(now)) {
            break
        }
    }
    while (true) {
        nextTinyBirthDate = nextTinyBirthDate.add(100, 'days')
        if (nextTinyBirthDate.isAfter(now)) {
            break
        }
    }
    profile.bigBirthday = moment.duration(nextBigBirthDate.diff(now)).asDays().toFixed(5)
    profile.birthday = moment.duration(nextBirthDate.diff(now)).asDays().toFixed(5)
    profile.tinyBirthday = moment.duration(nextTinyBirthDate.diff(now)).asDays().toFixed(5)
}
profileTimer()