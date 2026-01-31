// HTML elements ref
const form = document.getElementById("dry-form")
const input = document.getElementById("city-input") as HTMLInputElement
const submitBtn = document.getElementById("submit-btn")

form?.addEventListener("submit", (e) => {
  e.preventDefault()
  fetchWeather(input.value)
})

async function fetchWeather(city:string) {
  try {
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=ce86501f43804acd8bb5f670c9ff1800`)
    const data = response.json()
    
    console.log(data) 
  } catch (error) {
    
  }
}