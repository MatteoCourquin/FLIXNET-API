// * Variables *

const btnGoSelectMovie = document.querySelector('.go-select-movie')
const btnGoMovieDetails = document.querySelector('.go-movie-details')
const btnReturnSelectMovie = document.querySelector('.return-select-movie')
const btnTypeFilm = document.querySelectorAll('.btn-type-film')

const screenHome = document.querySelector('.screen-home')
const screenSelectMovie = document.querySelector('.screen-select-movies')
const screenDetailsMovies = document.querySelector('.screen-details-movies')

const containerMessageHome = document.querySelector('.descriptionMeteo')
const containerInfoMeteo = document.querySelector('.meteo')
const containerInfoLoca = document.querySelector('.loca')

const containerCardsMovies = document.querySelector('.container-cards-movies')
const containerDetailsMovie = document.querySelector('.container-details-movies')

// * Functions *

function insertHtmlCardMeteo(data) {
    containerInfoMeteo.innerHTML += `
        <p>${Math.trunc(data.main.temp)} ° C</p>
        <p>${data.weather[0].description}</p>
        `
}
function insertHtmlCardLoca(data) {
    containerInfoLoca.innerHTML += `
        <p>📍 ${data.name}</p>
        `
}
function insertHtmlMessage(data, altitude) {

    if (getTime() > convertUnix(data.sys.sunrise) && getTime() > convertUnix(data.sys.sunset)) {
        btnGoSelectMovie.style.display = 'block'
        containerMessageHome.innerHTML += `
        <p>Jespere que vous avez passé une bonne journée 🚀! Ravi de vous retrouver 🍿!</p>
        `
    } else if (getTime() < convertUnix(data.sys.sunrise)){
        btnGoSelectMovie.style.display = 'none'
        containerMessageHome.innerHTML += `
        <p>Il se fait tard 😴. Allez vous coucher 🛏!</p>
        `
    } else if (data.rain) { 
        btnGoSelectMovie.style.display = 'block'
        containerMessageHome.innerHTML += `
        <p>Il pleut🌧... Ne tentez pas de jouer <em>"Chantons sous la pluie"</em> ☔. Venez plutot le regarder avec nous 🍿.</p>
        `
    } else if (data.snow && altitude >= 1800) {
        btnGoSelectMovie.style.display = 'none'
        containerMessageHome.innerHTML += `
        <p>Il semblerait que vous soyez au ski ❄. Allez donc en faire ⛷! On se voit ce soir 🍿.</p>
        `
    } else if (data.snow) {
        btnGoSelectMovie.style.display = 'block'
        containerMessageHome.innerHTML += `
        <p>Il neige ❄. À part si vous avez des skis aux pieds, ne tentez pas une glissade ⛷. Restez plutot dans le canapé avec nous 🍿.</p>
        `
    } else if (data.main.temp <= 10){
        btnGoSelectMovie.style.display = 'block'
        containerMessageHome.innerHTML += `
        <p>Il fait seulement ${Math.trunc(data.main.temp)} ° C 🥶. Venez vous réchauffer a la maison devant un bon film 🍿! N'allez pas tomber malade 🤒!</p>
        `
    } else if (data.main.temp > 10){
        btnGoSelectMovie.style.display = 'none'
        containerMessageHome.innerHTML += `
        <p>Il fait ${Math.trunc(data.main.temp)} ° C ☀️. Pour votre bien, nous vous conseillons de sortir prendre l'air ⛱.</p>
        `
    }
}
function convertUnix(time) {
    let date = new Date(time * 1000)
    let hours = date.getHours()
    let minutes = '0' + date.getMinutes()
    let formattedTime = `${hours}${minutes.substr(-2)}`;

    return parseInt(formattedTime)
}
function getTime(date) {
    date = new Date()
    let minutes = date.getMinutes()
    if (date.getMinutes() <= 9) {

        minutes = `0${date.getMinutes()}`
    }
    let time = `${date.getHours()}${minutes}`

    return parseInt(time)
    
}

function insertHtmlCardFilm(data) {
    containerCardsMovies.innerHTML += `
        <div class='card-movie' id='${data.id}'>
            <img src='${data.image.original}'>
            <div class='bottom-black'>
                <h1>${data.name}</h1>
            </div>
        </div>
        `
        document.querySelectorAll('.card-movie').forEach(element => {
            element.addEventListener('click', ()=> {

                fetch(`https://api.tvmaze.com/shows/${element.id}`)
                    .then(response => response.json())
                    .then(data => {
                        screenDetailsMovies.style.display = 'block'
                        containerDetailsMovie.style.display = 'flex'
                        screenSelectMovie.style.display = 'none'
                        containerDetailsMovie.innerHTML = `
                            <div class="card-movie-details">
                                <img src='${data.image.original}'>
                                <div class='titles-movie'>
                                    <h2>${data.name}</h2>
                                    <p>${data.summary}</p>
                                </div>
                            </div>
                        `
                })
                    .catch(error => console.log(`Erreur : ` + error))
            })
        })
}


// * Movie API *

btnTypeFilm.forEach(el => {
    el.addEventListener('click', () => {

        containerCardsMovies.innerHTML = ''

        fetch(`https://api.tvmaze.com/shows`)
            .then(response => response.json())
            .then(data => {  

                data.forEach(data => {

                    if (el.value === 'All') {

                        insertHtmlCardFilm(data)

                    } else for(var i = 0; i < data.genres.length; i++) {

                        if(el.value === data.genres[i]) {

                            insertHtmlCardFilm(data)
                        }
                    }
                });
            })
            .catch(error => {
                console.log(error);
            });
    })
})


// * Weather API *

if(navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {

        // console.log(position);

        let longitude = position.coords.longitude
        let latitude = position.coords.latitude
        let altitude = position.coords.altitude


        // TODO • Test (You can try all scenarios by finding cities where: it is snowing / it is raining / it is hot and sunny / the altitude is higher than 1800) :
        // TODO • to test, uncomment "API 1" and comment "API 2"

        // altitude = 1800 // TODO • High Altitude (for ski station)
        // let ville = 'stykkisholmur' // TODO • Snow
        // let ville = 'paris' // TODO • Cold
        // let ville = 'quito' // TODO • Rain
        // let ville = 'bamako' // TODO • Sun

        // fetch(`https://api.openweathermap.org/data/2.5/weather?q=${ville}&units=metric&lang=fr&appid=d855f06f0b57beb1dc2217c709e5bca0`) // TODO • API 1

        fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&lang=fr&appid=d855f06f0b57beb1dc2217c709e5bca0`) // TODO • API 2
            .then(response => response.json())
            .then(data => {

                insertHtmlCardMeteo(data)

                insertHtmlCardLoca(data)

                insertHtmlMessage(data, altitude)

            })
            .catch(error => console.log(`Erreur : ${error}`))

    }, () => {
        btnGoSelectMovie.style.display = 'block'
        containerMessageHome.innerHTML += `
        <p>Il semblerait qu'il y ai un probleme 🙁. Essayer d'activer votre localisation📍!..</p>
        `
    })
}


// * Move screen to screen *

btnGoSelectMovie.addEventListener('click', () => {
    screenHome.style.display = 'none'
    screenSelectMovie.style.display = 'block'
})
btnReturnSelectMovie.addEventListener('click', () => {
    screenDetailsMovies.style.display = 'none'
    screenSelectMovie.style.display = 'block'
})