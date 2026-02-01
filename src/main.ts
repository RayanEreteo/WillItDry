// HTML elements ref

//? Paramètre,Condition Idéale

//? Ciel,Dégagé ou peu nuageux
//? Humidité,Basse (< 60%)
//? Vent,Modéré (10-25 km/h)
//? Précipitations,0% (Évidemment !)

const form = document.getElementById("dry-form") as HTMLFormElement
const input = document.getElementById("city-input") as HTMLInputElement
const submitBtn = document.getElementById("submit-btn") as HTMLButtonElement

const resultContainer = document.getElementById("result-container") as HTMLElement

form.addEventListener("submit", (e) => {
  submitBtn.disabled = true
  e.preventDefault()
  fetchWeather(input.value)
})

async function fetchWeather(city: string) {
  try {
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=20370396598f014dfec9a4efab56a08f`)
    const data = await response.json()
    updateResultUI(data.weather[0].main)
    resultContainer.style.display = "block"
  } catch (error) {
    console.log(error)
  } finally {
    submitBtn.disabled = false
  }
}

function updateResultUI(weatherMain: string) {
  const logo = document.getElementById("result-logo") as HTMLImageElement
  const resultHead = document.getElementById("result-head") as HTMLHeadingElement
  const resultDescription = document.getElementById("result-desc") as HTMLElement

  if (weatherMain == "Clear") {
    logo.src = "/sun.svg"
    resultHead.innerHTML = "YOU CAN DRY YOUR CLOTHES !"
    resultDescription.innerHTML = "The sky is clear and the sun is shining."
  } else if (weatherMain == "Clouds") {
    logo.src = "/cloudy.svg"
    resultHead.innerHTML = "NOT OPTIMAL !"
    resultDescription.innerHTML = "Scattered cloud, not optimal."
  } else {
    logo.src = "/rain.svg"
    resultHead.innerHTML = "AVOID DRYING YOUR CLOTHES !"
    resultDescription.innerHTML = "High risk of rain !"
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