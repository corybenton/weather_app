const searchList = document.getElementById("searchlist");
const searchButton = document.getElementById("submit");

searchButton.addEventListener("click", function(event) {
    event.preventDefault();

    const city = document.getElementById("searchbox").value;
    const element = event.target;
    if (element.matches("#submit")) {
        if (city) {
            getWeather(city);
        } else {
            alert("No city for which to search");
        }
        document.getElementById("searchbox").value = "";
    }
});

function getWeather(city) {
    const fetchUrl = "https://api.openweathermap.org/data/2.5/forecast?q="
        + city + "&units=imperial&appid=ff17ce5574bc5eb0d688956d5890de21"

    fetch(fetchUrl)
    .then (function(response) {
        if (response.ok) {
            return response.json();
        }})
    .then (function(data) {
        console.log (data);
        displayWeather(data);
        displayCityHistory(data);
    })
    
}

function displayWeather(weatherArray){
    const cityName = weatherArray.city.name + ", " + weatherArray.city.country + 
        " (" + dayjs().format("MM/DD/YYYY") + ")";
    const temps = [];
    const winds = [];
    const humids = [];
    const clouds = [];
    let suffix = "";
    
    for (let i = 0; i < weatherArray.list.length; i = i + 8) {
        if (i == 8) {i = i - 1};

        temps.push(weatherArray.list[i].main.temp);
        winds.push(weatherArray.list[i].wind.speed);
        humids.push(weatherArray.list[i].main.humidity);
        if (weatherArray.list[i].clouds.all >= 70) {
            clouds.push("\u{2601}");
        } else if (weatherArray.list[i].clouds.all <= 20) {
            clouds.push("\u{1F506}");
        } else {
            clouds.push("\u{26C5}");
        }
    }
    console.log (clouds);
    for (let i = 0; i < temps.length; i++) {
        if (i == 0) {
            const currentcity = document.getElementById("currentcity");
            currentcity.textContent = cityName + " " + clouds[i];
            suffix = "current";
        } else {
            suffix = "+" + i;
            const thisDate = document.getElementById("date" + suffix);
            thisDate.textContent = "Date: " + dayjs().add(i, 'day').format("MM/DD/YYYY");
        }

        const thisTemp = document.getElementById("temp" + suffix);
        thisTemp.textContent = "Temp: " + temps[i] + "\xB0F";
        const thisWind = document.getElementById("wind" + suffix);
        thisWind.textContent = "Wind: " + winds[i] + " MPH";
        const thisHumid = document.getElementById("humid" + suffix);
        thisHumid.textContent = "Humidity: " + humids[i] + "%"; 
        if (i > 0) {
            const thisCloud = document.getElementById("icon" + suffix);
            thisCloud.textContent = " " + clouds[i];
        }
        
        localStorage.setItem(weatherArray.city.name + ", " + weatherArray.city.country
            , JSON.stringify([temps, winds, humids, clouds]));        
    }
}

function displayCityHistory(weatherArray) {
    const cityName = weatherArray.city.name + ", " + weatherArray.city.country;
    const cityPlace = document.createElement("a");
    cityPlace.innerText = cityName;
    cityPlace.setAttribute("href", "#search");
    cityPlace.setAttribute("class", "recall");
    document.getElementById("searchlist").appendChild(cityPlace);
}

searchList.addEventListener("click", function(event) {
    let cityRecall = event.target;
    if (cityRecall.matches(".recall")) {
        const recallArray = JSON.parse(localStorage.getItem (cityRecall.textContent));
        const arrayOrder = ["temp", "wind", "humid", "icon", "date"];
        for (let i = 0; i < arrayOrder.length; i++) {
            let suffix = "current"
            const recallItem = arrayOrder[i];
            for (let j = 0; j < 6; j++) {
                const recallTarget = recallItem + suffix;
                const thisItem = document.getElementById(recallTarget);
                if (i == 0) {
                    thisItem.textContent = "Temp: " + recallArray[i][j] + "\xB0F";
                } else if (i == 1) {
                    thisItem.textContent = "Wind: " + recallArray[i][j] + " MPH";
                } else if (i == 2) {
                    thisItem.textContent = "Humidity: " + recallArray[i][j] + "%"; 
                } else if (i == 3) {
                    if (j == 0) {
                        cityRecall = cityRecall.textContent + " (" + dayjs().format("MM/DD/YYYY") + ") ";
                    } else {
                        thisItem.textContent = dayjs().add(j, "day").format("MM/DD/YYYY0");
                    }
                } else {
                    if (j == 0) {
                        cityRecall = cityRecall + recallArray[3][j]
                    } else {
                        thisItem.textContent = recallArray[3][j];
                    }
                }
                suffix = "+" + (j + 1)
            }
            //recallArray.splice(0, 6);
            //i = 0;
        }
        document.getElementById("currentcity").textContent = cityRecall; 
            
    }
})