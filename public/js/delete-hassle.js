import { url } from '/js/proton.js'

export const deleteHassle = (user, queryUser, type, id) => {

    let deleteID = JSON.stringify({ "user": user, "queryUser": queryUser, "type": type, "id": id })

    fetch(url + 'delete', {
        method: 'PUT',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: deleteID
    })
        .then(response => {
            return response.json()
        })
        .then(data => {
            if (data.status === 200) {
                console.log('Deleted hassle: #' + id)
            }
        })
        .catch(err => {
            console.log(err)
        })
}