import { $ } from '/js/selectors.js'
import { renderImageResults } from '/js/render-image-results.js'
import { user } from '/js/proton.js'

// setup an array for more helpful tips to come

if (localStorage.getItem('tip-0') === null && user) { $('#tip-0').style.display = 'inline-block' }
if (localStorage.getItem('tip-1') === null && user) { $('#tip-1').style.display = 'inline-block' }


export const addBTN = () => {

    $('#add').addEventListener('click', (event) => {
        localStorage.setItem('tip-0', 'hidden')
        $('#tip-0').style.display = 'none'
        $('#hassle-form-container').classList.toggle('flex-it')
        $('#hassles').classList.toggle('blur-it')
    })
    renderImageResults()
}

export const closeBTN = () => {
    $('#close').addEventListener('click', (event) => {
        $('#hassle-form-container').classList.remove('flex-it')
        $('#hassles').classList.remove('blur-it')
    })
    document.addEventListener('keydown', evt => {
        if (evt.key === 'Escape') {
            $('#hassle-form-container').classList.remove('flex-it')
            $('#hassles').classList.remove('blur-it')
        }
    })
}