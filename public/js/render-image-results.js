import { $ } from '/js/selectors.js'
import { url } from '/js/proton.js'
import { debounce } from '/js/debounce.js'
import { queryParams } from '/js/queries.js'
import { submitHassle } from '/js/submit-hassle.js'

export const renderImageResults = (data) => {
    const query = queryParams()

    const inputElement = $('#title')
    const debounceDelay = 500 // Adjust the delay time as needed
    const sentences = [
        "Go for this vibe",
        "Choose this drip",
        "Pick this flex",
        "Grab this option",
        "Opt for this swag",
        "Roll with this choice",
        "Lock in on this one",
        "Slide for this flavor",
        "Tap into this wave",
        "Nail this pick"
    ]

    const debouncedFetchImages = debounce(fetchImages, debounceDelay)

    inputElement.addEventListener('input', debouncedFetchImages)

    function fetchImages(event) {
        if (event.target.value.length > 2) {
            fetch(url + `images?image=${event.target.value}`)
                .then(response => response.json())
                .then(data => {
                    let HTML = ''
                    const results = data.results.slice(0, 10)
                    results.forEach((el, i) => {

                        if (i === 0) {
                            HTML += `<div id='result-${i}' class='movingGradient'><div><img src='${el.url}' onerror='imgError("#result-${i}")' alt='${el.origin.title}' title='${sentences[i]}' /></div></div>`
                        } else {
                            HTML += `<div id='result-${i}'><div><img src='${el.url}' onerror='imgError("#result-${i}")' alt='${el.origin.title}' title='${sentences[i]}' /></div></div>`
                        }

                    })

                    $('#image-results').innerHTML = HTML
                    submitHassle(query.u, localStorage.getItem('type')) // listener for submit event
                })
        }
    }
}