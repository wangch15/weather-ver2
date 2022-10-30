const weatherCardArea = document.querySelector('.weather-card-area')
var twlocations

const north = ['臺北市', '新北市', '基隆市', '新竹市', '桃園市', '新竹縣', '宜蘭縣']
const center = ['臺中市', '苗栗縣', '彰化縣', '南投縣', '雲林縣']
const south = ['高雄市', '臺南市', '嘉義市', '嘉義縣', '屏東縣', '澎湖縣']
const east = ['花蓮縣', '臺東縣']
const island = ['金門縣', '連江縣']

function renderCards(cities) {
    let locationName = cities.locationName
    let minTemp = Number(cities.weatherElement[2].time[0].parameter.parameterName)
    let maxTemp = Number(cities.weatherElement[4].time[0].parameter.parameterName)
    let totalTemp = Math.round((minTemp + maxTemp) / 2)
    let rain = Number(cities.weatherElement[1].time[0].parameter.parameterName)
    let feel = cities.weatherElement[3].time[0].parameter.parameterName
    let date = cities.weatherElement[2].time[0].startTime

    let imgPath
    if (rain == 0) {
        imgPath = './img/sun.png'
    } else if (rain < 25) {
        imgPath = './img/sun-cloud.png'
    } else if (rain <= 50) {
        imgPath = './img/cloud.png'
    } else {
        imgPath = './img/rain.png'
    }

    weatherCardArea.innerHTML += `
    <div class="weather-card" data-city="${locationName}">
                <div class="card-top">
                    <div class="img-area">
                        <img src="${imgPath}" alt="">
                    </div>
                    <div class="info-area">
                        <h2 class="temp">${totalTemp}°</h2>
                        <span class="city"><i class="fi fi-bs-marker"></i>臺灣, ${locationName}</span>
                    </div>
                </div>
                <div class="card-bottom">
                    <span class="city"><i class="fi fi-bs-temperature-high"></i>${minTemp}°~${maxTemp}°</span>
                    <span class="city"><i class="fi fi-bs-umbrella"></i>${rain} %</span>
                    <span class="city"><i class="fi fi-bs-user"></i>${feel}</span>
                </div>
            </div>
    `
}

fetch('https://opendata.cwb.gov.tw/api/v1/rest/datastore/F-C0032-001?Authorization=CWB-AA300EC1-31BA-465E-B669-6CA2C320A195')
    .then(function (response) {
        return response.json();
    })
    .then(function (weather) {
        //把來自API上的資料，先保存下來
        twlocations = weather.records.location

        //利用保存好的資料製作卡片
        twlocations.forEach(location => {
            renderCards(location)
        });

    });


window.addEventListener('load', function () {
    // console.log(twlocations);
})

const path = document.querySelectorAll('path')
//依地區換色

path.forEach(pathEach => {
    pathEach.classList.add('pathisland')
    north.forEach(area =>{
        if(area == pathEach.dataset.name){
            pathEach.classList.remove('pathisland')
            pathEach.classList.add('pathnorth')
        }
    })
    center.forEach(area =>{
        if(area == pathEach.dataset.name){
            pathEach.classList.remove('pathisland')
            pathEach.classList.add('pathcenter')
        }
    })
    south.forEach(area =>{
        if(area == pathEach.dataset.name){
            pathEach.classList.remove('pathisland')
            pathEach.classList.add('pathsouth')
        }
    })
    east.forEach(area =>{
        if(area == pathEach.dataset.name){
            pathEach.classList.remove('pathisland')
            pathEach.classList.add('patheast')
        }
    })
    island.forEach(area =>{
        if(area == pathEach.dataset.name){
            pathEach.classList.add('pathisland')
        }
    })
})


//簡潔版地區點擊事件
function filter2(areas) {
    var Cards = document.querySelectorAll('.weather-card')
    
    Cards.forEach(card => {
        card.style.display = 'none'
        path.forEach(pathEach => {
            pathEach.classList.add('pathcolorclean')
            if (areas == 'all') {
                card.style.display = 'block'
                pathEach.classList.remove('pathcolorclean')
            } else {
                areas.forEach(area => {
                    if (area == card.dataset.city) {
                        card.style.display = 'block'
                    }
                    if(area == pathEach.dataset.name){
                        pathEach.classList.remove('pathcolorclean')
                    }
                })
            }
        })
    })
}




//針對台灣地圖個別的縣市路徑設立點擊事件


path.forEach(pathEach => {
    //對每個路徑設立點擊事件，以便得知目前點擊到的是哪個path
    pathEach.onclick = function () {

        //點擊特定路徑後，第一件要做的事情>把所有台灣的顏色消除
        path.forEach(pathClean => {
            pathClean.classList.add('pathcolorclean')
        })

        //如果想要知道點到的是那一個path可以把下面的console.log打開
        console.log(pathEach);

        //點擊特定路徑後，第二件要做的事情>把當前選到的區域顏色加上
        path.forEach(patharea=>{
            if(pathEach.dataset.name == patharea.dataset.name){
                patharea.classList.remove('pathcolorclean')
            }
        })

        //再來開始比對卡片資料，先抓卡片
        var Cards = document.querySelectorAll('.weather-card')

        //遍歷卡片，點擊事件觸發後，先讓全部卡片隱藏
        Cards.forEach(card => {

            card.style.display = 'none'

            //如果條件成立，卡片出現
            if (card.dataset.city == pathEach.dataset.name) {
                card.style.display = 'block'
            }
        })

    }
})

const webModeBtn = document.querySelector('.web-mode-btn')

webModeBtn.onclick = function () {
    document.body.classList.toggle('light-mode')
}
