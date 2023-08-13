import { $ } from '/js/selectors.js'
import { url, user } from '/js/proton.js'
import { queryParams } from '/js/queries.js'
import { hassleActions } from '/js/hassle-actions.js';
import { membership } from '/js/proton.js'



export const editHassles = (data) => {
    let query = queryParams()
    $('#hassle').addEventListener('click', (event) => {
        event.preventDefault()
        if (event.target.classList.contains('update-it')) {
            let postData = data
            postData.edit = query.u || user
            if (membership === true) {

                // Sends hassle request to /hassle with all input information
                fetch(url + 'hassle', {
                    method: "POST",
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(postData)
                }).then(response => {
                    return response.json()
                }).then(returnedData => {

                    if (returnedData.status === 200) {
                        event.target.className = 'update-it'
                        setTimeout(() => {
                            event.target.className = 'update-it updated'
                        }, "23");
                        hassleActions(true, true);
                    }
                })
            } else {
                alert('You are not authenticated.')
            }
        }
    })
}