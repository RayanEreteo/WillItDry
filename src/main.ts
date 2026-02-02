// HTML elements ref
const form = document.getElementById("dry-form") as HTMLFormElement
const input = document.getElementById("city-input") as HTMLInputElement
const submitBtn = document.getElementById("submit-btn") as HTMLButtonElement
const resultContainer = document.getElementById("result-container") as HTMLElement

const IDEAL_CONDITIONS = {
  maxHumidity: 60,
  minWind: 10,
  maxWind: 25,
  cloudsThreshold: 20
};

form.addEventListener("submit", (e) => {
  submitBtn.disabled = true
  e.preventDefault()

  if (input.value == "") {
    submitBtn.disabled = false
    return
  }

  fetchWeather(input.value)
})

async function fetchWeather(city: string) {
  try {
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=20370396598f014dfec9a4efab56a08f`)
    const data = await response.json()
    updateResultUI(data)
    resultContainer.style.display = "block"
  } catch (error) {
    console.log(error)
  } finally {
    submitBtn.disabled = false
  }
}

function updateResultUI(data: any) {
  const logo = document.getElementById("result-logo") as HTMLImageElement;
  const resultHead = document.getElementById("result-head") as HTMLHeadingElement;
  const resultDescription = document.getElementById("result-desc") as HTMLElement;

  const weatherMain = data.weather[0].main;
  const humidity = data.main.humidity;
  const windSpeed = data.wind.speed * 3.6;
  const clouds = data.clouds.all;

  const isSkyClear = weatherMain === "Clear" || clouds < IDEAL_CONDITIONS.cloudsThreshold;
  const isHumidityGood = humidity < IDEAL_CONDITIONS.maxHumidity;
  const isWindGood = windSpeed >= IDEAL_CONDITIONS.minWind && windSpeed <= IDEAL_CONDITIONS.maxWind;
  const isRainy = weatherMain === "Rain" || weatherMain === "Drizzle" || weatherMain === "Thunderstorm";

  if (!isRainy && isSkyClear && isHumidityGood && isWindGood) {
    logo.src = "/sun.svg";
    resultHead.innerHTML = "PERFECT FOR DRYING !";
    resultDescription.innerHTML = `Optimal conditions: Humidity at ${humidity}% and wind at ${windSpeed.toFixed(1)} km/h.`;
    
  } else if (!isRainy && (isSkyClear || isHumidityGood)) {
    logo.src = "/cloudy.svg";
    resultHead.innerHTML = "NOT OPTIMAL, BUT POSSIBLE";
    resultDescription.innerHTML = "The laundry will dry slowly. Be careful of humidity or lack of wind.";
    
  } else {
    logo.src = "/rain.svg";
    resultHead.innerHTML = "DON'T TAKE OUT THE LAUNDRY!";
    resultDescription.innerHTML = isRainy ? "Risk of precipitation imminent." : "Humidity too high or wind too strong.";
  }
}

function searchUserLoc() {
  navigator.geolocation.getCurrentPosition(async (position) => {
    const { latitude, longitude } = position.coords

    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
    )
    const data = await res.json()

    input.value = data.address.city
  })
}

searchUserLoc()