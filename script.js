// * Variables *

const btnGoSelectMovie = document.querySelector('.go-select-movie')
const btnAccessAnyway = document.querySelector('.btn-access-anyway')
const btnGoMovieDetails = document.querySelector('.go-movie-details')
const btnReturnSelectMovie = document.querySelector('.return-select-movie')
const btnTypeFilm = document.querySelectorAll('.btn-type-film')

const screenHome = document.querySelector('.screen-home')
const screenSelectMovie = document.querySelector('.screen-select-movies')
const screenDetailsMovies = document.querySelector('.screen-details-movies')

const containerMessageHome = document.querySelector('.description-meteo')
const containerInfoMeteo = document.querySelector('.meteo')
const containerInfoLoca = document.querySelector('.loca')

const containerCardsMovies = document.querySelector('.container-cards-movies')
const containerDetailsMovie = document.querySelector('.container-details-movies')

// * Functions *

function insertHtmlCardMeteo(data) {
    containerInfoMeteo.innerHTML += `
        <p>${Math.trunc(data.main.temp)} ยฐ F</p>
        <p>${data.weather[0].description}</p>
        `
}
function insertHtmlCardLoca(data) {
    containerInfoLoca.innerHTML += `
        <p>๐ ${data.name}</p>
        `
}
function insertHtmlMessage(data, altitude) {

    if (getTime() > convertUnix(data.sys.sunrise) && getTime() > convertUnix(data.sys.sunset)) {
        btnGoSelectMovie.style.display = 'block'
        containerMessageHome.innerHTML += `
        <p>Hope you had a great day ๐! Nice to meet you ๐ฟ!</p>
        `
    } else if (getTime() <= 430){
        btnGoSelectMovie.style.display = 'none'
        btnAccessAnyway.style.display = 'block'
        containerMessageHome.innerHTML += `
        <p>It's getting late ๐ด. It's time to go to bed ๐!</p>
        `
    } else if (getTime() > 430 && getTime() <= convertUnix(data.sys.sunrise)){
        btnGoSelectMovie.style.display = 'block'
        containerMessageHome.innerHTML += `
        <p>Hope you slept well๐. Have a nice day ๐!</p>
        `
    } else if (data.rain) { 
        btnGoSelectMovie.style.display = 'block'
        containerMessageHome.innerHTML += `
        <p>It's raining๐ง... Don't try to play <em>"Let's sing in the rain"</em> โ. Come and watch it with us instead ๐ฟ.</p>
        `
    } else if (data.snow && altitude >= 1800) {
        btnGoSelectMovie.style.display = 'none'
        btnAccessAnyway.style.display = 'block'
        containerMessageHome.innerHTML += `
        <p>It looks like you're skiing โ. So go do some โท! See you tonight ๐ฟ.</p>
        `
    } else if (data.snow) {
        btnGoSelectMovie.style.display = 'block'
        containerMessageHome.innerHTML += `
        <p>It's snowing โ. Unless you have skis on your feet, do not attempt a slide โท. Stay on the couch with us instead ๐ฟ.</p>
        `
    } else if (data.main.temp <= 50){
        btnGoSelectMovie.style.display = 'block'
        containerMessageHome.innerHTML += `
        <p>It's only ${Math.trunc(data.main.temp)} ยฐ F ๐ฅถ. Come warm up at home in front of a good movie ๐ฟ! Don't get sick ๐ค!</p>
        `
    } else if (data.main.temp >= 50){
        btnGoSelectMovie.style.display = 'none'
        btnAccessAnyway.style.display = 'block'
        containerMessageHome.innerHTML += `
        <p>It's ${Math.trunc(data.main.temp)} ยฐ F โ๏ธ. For your good, we advise you to get some fresh air โฑ.</p>
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
                                    <h2>${data.name} <span>โ ${data.rating.average}</span></h2>
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


        // TODO โข Test (You can try all scenarios by finding cities where: it is snowing / it is raining / it is hot and sunny / the altitude is higher than 1800) :
        // TODO โข to test, uncomment "API 1" and comment "API 2"

        // altitude = 1800 // TODO โข High Altitude (for ski station)
        // let city = 'stykkisholmur' // TODO โข Snow
        // let city = 'paris' // TODO โข Cold
        // let city = 'quito' // TODO โข Rain
        // let city = 'bamako' // TODO โข Sun

        // fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&lang=en&appid=d855f06f0b57beb1dc2217c709e5bca0`) // TODO โข API 1

        fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=imperial&lang=en&appid=d855f06f0b57beb1dc2217c709e5bca0`) // TODO โข API 2
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
        <p>It seems that there is a problem ๐. Try to activate your location and refresh the page ๐!...</p>
        `
    })
}


// * Move screen to screen *

btnAccessAnyway.addEventListener('click', () => {
    screenHome.style.display = 'none'
    screenSelectMovie.style.display = 'block'
})
btnGoSelectMovie.addEventListener('click', () => {
    screenHome.style.display = 'none'
    screenSelectMovie.style.display = 'block'
})
btnReturnSelectMovie.addEventListener('click', () => {
    screenDetailsMovies.style.display = 'none'
    screenSelectMovie.style.display = 'block'
})