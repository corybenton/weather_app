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
    })
    
}

function displayWeather(weatherArray){
    const cityName = weatherArray.city.name + ", " + weatherArray.city.country + 
        " (" + dayjs().format("MM/DD/YYYY") + ")";
    const temps = [];
    const winds = [];
    const humids = [];
    let suffix = "";
    
    for (let i = 0; i < weatherArray.list.length; i = i + 8) {
        if (i == 8) {i = i - 1};

        temps.push(weatherArray.list[i].main.temp);
        winds.push(weatherArray.list[i].wind.speed);
        humids.push(weatherArray.list[i].main.humidity);
    }

    for (let i = 0; i < temps.length; i++) {
        if (i == 0) {
            const currentcity = document.getElementById("currentcity");
            currentcity.textContent = cityName // + icon;
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
        
        localStorage.setItem(cityName, [temps, winds, humids]);

        
    }
}

