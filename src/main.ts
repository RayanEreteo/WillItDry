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

async function fetchWeather(city:string) {
  try {
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=20370396598f014dfec9a4efab56a08f`)
    const data = response.json()

    updateResultUI(data)
    resultContainer.style.display = "block"
  } catch (error) {
    console.log(error)
  } finally {
    submitBtn.disabled = false
  }
}

function updateResultUI(data: Promise<any>){
  const logo = document.getElementById("result-logo") as HTMLImageElement
  logo.src = "/rain.svg"
}