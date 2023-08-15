import { $, $$ } from '/js/selectors.js'
import { url, user } from '/js/proton.js'
import { hassleActions } from '/js/hassle-actions.js';
import { membership, members, minBalance } from '/js/proton.js'



export const submitHassle = (userQuery, type) => {

    const submit = (src) => {
        if (membership === true) {

            let formData = {}

            formData.user = user
            userQuery ? formData.queryUser = userQuery : null

            formData.type = $('input[name="type"]:checked').value
            formData.title = $("#title").value
            formData.image = src


            // Sends hassle request to /hassle with all input information
            fetch(url + 'hassle', {
                method: "POST",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            }).then(response => {
                return response.json()
            }).then(returnedData => {

                if (returnedData.status === 200) {
                    hassleActions(true, true);
                    // ^ AICI E PROBLEMA CA NU TRIMIT OBJECTU ALA ... tre sa se ia mereu in post actions
                    $('#hassle-form-container').style.display = 'none';
                }
            })
        } else {
            let message = 'Only members can submit a hassle.\nAccount Membership Status:\n\n'
            //let gratBalance = members[user].balance.filter(grat => grat.currency === 'GRAT')
            //gratBalance = gratBalance[0].amount.toFixed(2)
            //console.log(members)
            // if (members[user].gratBalance >= minBalance) {
            //     message += `Hold ${minBalance} GRAT in the account: OK\n`
            // } else { message += `Hold ${minBalance} GRAT in the account: NO\n` }

            if (members[user].kyc === true) {
                message += 'Pass the KYC process: OK'
            } else { message += 'Pass the KYC process: NO' }

            if (type === 'private') {
                message = 'This list is private and only the account owner can add to it.'
            }

            if (type === 'crowdfunded') {
                message = 'This list is public and only the account owner can add to it.'
            }


            alert(message)
        }
    }

    $('#hassle-form').addEventListener('submit', (event) => {
        event.preventDefault()
        $('#hassles').style.filter = 'none'
        submit($('#result-0 img').src)
    })

    $$('#image-results img').forEach((el, i) => {
        el.addEventListener('click', (e) => {
            $('#hassles').style.filter = 'none'
            submit(el.src)
        })
    })
}