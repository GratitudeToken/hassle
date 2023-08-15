import { $ } from '/js/selectors.js'
import { url } from '/js/proton.js'
import { debounce } from '/js/debounce.js'
import { queryParams } from '/js/queries.js'
import { submitHassle } from '/js/submit-hassle.js'

export const renderImageResults = (data) => {

    const query = queryParams()

    const inputElement = $('#title')
    const debounceDelay = 1000 // Adjust the delay time as needed
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

    inputElement.addEventListener('keydown', () => {
        $('#image-results').innerHTML = `<div class="movingGradient"></div><div class="movingGradient"></div><div class="movingGradient"></div>`
    })
    inputElement.addEventListener('input', debouncedFetchImages)

    function fetchImages(event) {
        // let's check if user has inputed a URL first
        const userInput = inputElement.value
        if (userInput.indexOf("http://") === 0 || userInput.indexOf("https://") === 0) {
            $('#image-results').style.display = 'block'
            $('#image-results').innerHTML = `<img style="width: 100%; border-radius: 5px; cursor: pointer" src="${userInput}"/>`
            submitHassle(query.u, localStorage.getItem('type')) // listener for submit event
        } else {
            if (event.target.value.length > 2) {
                $('#image-results').style.display = ''
                fetch(url + `images?image=${event.target.value}`)
                    .then(response => response.json())
                    .then(data => {
                        let HTML = ''
                        if (data.results !== undefined) {

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

                        } else { $('#image-results').innerHTML = '❗ Your search returned no results. Try again.' }

                    }).catch(error => { console.log(error) })
            } else {
                $('#image-results').innerHTML = `<span><img class="small-icon invert2" title="Private"
                                    src="/svgs/photo.svg" style="margin-right: 5px; vertical-align: sub" />
                                Image results will be shown here. Chooose one.</span>`
            }
        }
    }
}