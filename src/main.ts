// HTML elements ref
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

  if (weatherMain == "Clear") {
    logo.src = "/sun.svg"
    resultHead.innerHTML = "YOU CAN DRY YOUR CLOTHES !"
  } else if (weatherMain == "Clouds") {
    logo.src = "/cloudy.svg"
    resultHead.innerHTML = "CAN BE RISKY !"
  } else {
    logo.src = "/rain.svg"
    resultHead.innerHTML = "AVOID DRYING YOUR CLOTHES !"
  }
}