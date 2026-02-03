// HTML elements ref
const form = document.getElementById("dry-form") as HTMLFormElement
const input = document.getElementById("city-input") as HTMLInputElement
const submitBtn = document.getElementById("submit-btn") as HTMLButtonElement
const resultContainer = document.getElementById("result-container") as HTMLElement

// Object containing my ideals conditions minimum and maximum value
const IDEAL_CONDITIONS = {
  maxHumidity: 60,
  minWind: 10,
  maxWind: 25,
  cloudsThreshold: 20
};

// Handle form submission to fetch weather data
form.addEventListener("submit", (e) => {
  submitBtn.disabled = true
  e.preventDefault()

  // Validate that city input is not empty
  if (input.value == "") {
    submitBtn.disabled = false
    return
  }

  fetchWeather(input.value)
})

// Fetch weather data from OpenWeatherMap API
async function fetchWeather(city: string) {
  try {
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=20370396598f014dfec9a4efab56a08f`)
    const data = await response.json()
    updateResultUI(data)
    resultContainer.style.display = "block"
  } catch (error) {
    console.log(error)
  } finally {
    // Re-enable submit button after request completes
    submitBtn.disabled = false
  }
}

// Update UI based on weather conditions
function updateResultUI(data: any) {
  const logo = document.getElementById("result-logo") as HTMLImageElement;
  const resultHead = document.getElementById("result-head") as HTMLHeadingElement;
  const resultDescription = document.getElementById("result-desc") as HTMLElement;

  // Extract weather data
  const weatherMain = data.weather[0].main;
  const humidity = data.main.humidity;
  const windSpeed = data.wind.speed * 3.6; // Convert m/s to km/h
  const clouds = data.clouds.all;

  // Check if conditions meet ideal thresholds
  const isSkyClear = weatherMain === "Clear" || clouds < IDEAL_CONDITIONS.cloudsThreshold;
  const isHumidityGood = humidity < IDEAL_CONDITIONS.maxHumidity;
  const isWindGood = windSpeed >= IDEAL_CONDITIONS.minWind && windSpeed <= IDEAL_CONDITIONS.maxWind;
  const isRainy = weatherMain === "Rain" || weatherMain === "Drizzle" || weatherMain === "Thunderstorm";

  // Display result based on condition combination
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

// Get user city with GeoLocation API on page load to autocomplete the input
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