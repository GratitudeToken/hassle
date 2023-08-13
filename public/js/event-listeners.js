import { $ } from '/js/selectors.js';
import { renderImageResults } from '/js/render-image-results.js'

export const addBTN = () => {
    $('#add').addEventListener('click', (event) => {
        $('#hassle-form-container').style.display = 'flex';
        $('#hassles').style.filter = 'blur(3px)'
        $('#close').style.display = 'block';
    });
    renderImageResults()
}

export const closeBTN = () => {
    $('#close').addEventListener('click', (event) => {
        $('#hassle-form-container').style.display = 'none';
        $('#hassles').style.filter = 'none'
    });
    document.addEventListener('keydown', evt => {
        if (evt.key === 'Escape') {
            $('#hassle-form-container').style.display = 'none';
            $('#hassles').style.filter = 'none'
        }
    });
}