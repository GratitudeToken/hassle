import { $, $$ } from '/js/selectors.js'
import { hassleActions } from '/js/hassle-actions.js'
import { queryParams } from '/js/queries.js'
import { confetti } from '/js/confetti.js'
let link = undefined
let session = undefined


export const admins = ["lucianape3", "fatzuca", "barbuvlad21", "abubfc"]
export let user
export let members
export let accountTokens
export let averageRates
export let minBalance = 0 // 5 GRAT tokens
export let membership = true // default should be false
let query = queryParams()



export const url = 'http://' + location.hostname + ':9632/' //localhost
//export const url = 'https://' + location.hostname + ':65535/' //production

export let avatarbase64

const PROTON_MAINNET_EPS = [
    // "https://api.protonnz.com",
    // "https://proton.eosusa.news",
    // "https://sbp.proton.cryptolions.io",
    // "https://hyperion.quantumblok.com",
    "https://proton.protonuk.io",
    // "https://proton.eoscafeblock.com",
    // "https://bp1.protonmt.com",
    // "https://proton.eu.eosamsterdam.net",
    //"https://proton.greymass.com"
    // "https://proton.eosphere.io",
    // "https://proton.genereos.io",
    // "https://api.proton.alohaeos.com",
    // "https://protonapi.ledgerwise.io",
    // "https://proton-api.eosiomadrid.io",
    // "https://api.proton.eossweden.org",
    // "https://api.proton.bountyblok.io",
    // "https://proton.eosrio.io",
    // "https://api.proton.detroitledger.tech",
    // "https://hyperion.proton.detroitledger.tech",
    // "https://proton.eoscannon.io",
    // "https://proton.eosargentina.io",
    // "https://apiproton.blockside.io",
    // "https://api.protoneastern.cn",
    // "https://proton.eoseoul.io",
    // "https://api-proton.eosarabia.net",
    // "https://mainnet.brotonbp.com",
    // "https://bp1.protonind.com",
    // "http://bp1-mainnet.euproton.com",
    // "https://proton.edenia.cloud",
    // "https://api.protongroup.info",
    // "https://main.proton.kiwi",
    // "https://proton-api.alvosec.com",
    // "https://proton.eosvenezuela.io",
    // "https://api-proton.saltant.io",
    // "https://aa-proton.saltant.io",
    // "https://api.protonpoland.com",
    // "https://proton.eos.barcelona",
    // "https://api.protongb.com"
]

const PROTON_TESTNET_EP = [
    "https://testnet.brotonbp.com",
    "https://api-protontest.saltant.io",
    "https://api.testnet.protongb.com",
    "https://testnet-api.protongroup.info"
]

const MAINET_CHAINID = "384da888112027f0321850a169f737c33e53b388aad48b5adace4bab97f437e0"
const TESTNET_CHAINID = "71ee83bcf52142d61019d95f9cc5427ba6a0d7ff8accd9e2088ae2abeaf3d3dd"

const appIdentifier = "hassle"
const chainId = MAINET_CHAINID
const endpoints = PROTON_MAINNET_EPS

const headerLoginButton = $('#login')
const loginButtons = $$('.login')
const avatarName = $('#avatar-name')
const logoutButton = $('#logout')

const createBalanceRadios = (tokensArray, rates) => {
    $('#balance').innerHTML = ''

    rates.forEach((el, i) => {
        let checked = i === 0 ? 'checked' : ''
        const symbol = Object.keys(el)[0]
        const foundItem = tokensArray.find(item => item.currency === symbol);
        const balance = foundItem ? foundItem.amount : null;

        $('#balance').innerHTML += `<input id="${symbol}" type="radio" name="balance" value="${symbol}" ${checked}><label class="${symbol}" for="${symbol}"><img src="/svgs/${symbol}.svg"/> ${balance.toFixed(2)}</label></div>`
    })
}

const tokensSortFunction = (array, symbol) => {
    let sorted = array.slice()
    sorted.sort((a, b) => {
        if (a.currency === symbol) {
            return -1; // 'a' comes before 'b'
        } else if (b.currency === symbol) {
            return 1; // 'b' comes before 'a'
        } else {
            return 0; // No change in order
        }
    })
    return sorted
}

const averageRatesSortFunction = (array, symbol) => {
    let sorted = array.slice()
    sorted.sort((a, b) => {
        if (Object.keys(a)[0] === symbol) {
            return -1; // 'a' comes before 'b'
        } else if (Object.keys(b)[0] === symbol) {
            return 1; // 'b' comes before 'a'
        } else {
            return 0; // No change in order
        }
    })
    return sorted
}

const transferPayload = (type, contract, amount, decimals, symbol) => {

    transfer(contract, query.u, amount, decimals, symbol)
        .then(resp => {
            console.log(resp)

            fetch(url + `members?user=${user}&login=false&queryu=${query.u}&type=${type}&tx=${resp.processed.id}&amount=${$('#total input[type=number]').value}&currency=${symbol}`, {
                method: "GET"
            }).then(response => {
                return response.json()
            }).then(data => {
                confetti()
                setTimeout(() => {
                    $('#confetti').style.opacity = 0
                }, "35000", () => {
                    setTimeout(() => {
                        $('#confetti').remove()
                    }, "3000")
                })
            })
        })
}


// for checking and saving membership and balance and other info
export const userInfo = (user, authenticating) => {

    fetch(url + 'members?user=' + user + '&login=' + authenticating, {
        method: "GET"
    }).then(response => {
        return response.json()
    }).then(data => {

        members = data.members
        averageRates = data.averageRates
        accountTokens = data.accountTokens
        let selectedToken = JSON.parse(localStorage.getItem('selectedToken'))
        selectedToken = Object.keys(selectedToken)[0]
        localStorage.setItem('accountTokens', JSON.stringify(accountTokens))
        let tokenRate
        let symbol
        //let gratBalance = members[user].balance.filter(grat => grat.currency === 'GRAT')
        // gratBalance = gratBalance[0].amount.toFixed(2)
        // if (gratBalance >= minBalance && members[user].kyc === true) {
        //     membership = true
        // }

        if (query.u) {
            $('#balance').innerHTML = `<a href="/?user=${query.u}" class="noAuthQueryUser"><i><img src="/avatars/${query.u}.webp"/></i>${query.u}</a>`
        }


        if (user) {

            $('body').classList.add('authenticated')
            $('#user-menu .avatar').src = `/avatars/${user}.webp`


            $('#hassle').addEventListener("click", e => {

                selectedToken = Object.keys(selectedToken)[0]

                if (!localStorage.getItem('selectedToken')) {
                    localStorage.setItem('selectedToken', '{"XUSDT": 1}')
                    tokenRate = { "XUSDT": 1 }
                    symbol = 'XUSDT'
                } else {
                    tokenRate = JSON.parse(localStorage.getItem('selectedToken'))
                    symbol = Object.keys(tokenRate)[0]
                }

                let transferAccount
                let contract
                let decimals

                transferAccount = accountTokens.filter(item => item.currency === symbol)
                contract = transferAccount[0].contract
                decimals = transferAccount[0].decimals
                if ((!$('.update-it') && $('#total input').value)) {
                    e.srcElement.disabled = true
                    e.srcElement.className = 'updated'
                    setTimeout(() => {
                        e.srcElement.disabled = false
                        e.srcElement.className = ''
                    }, "3000")
                    transferPayload(localStorage.getItem('type'), contract, $('#total input[type=number]').value, decimals, symbol)
                }
                if (!$('.update-it') && (!query.u || user === query.u)) {
                    alert('Nothing to fund here.')
                }
            })



            accountTokens = tokensSortFunction(accountTokens, selectedToken)
            averageRates = averageRatesSortFunction(averageRates, selectedToken)

            createBalanceRadios(accountTokens, averageRates)

            $('#balance').addEventListener('change', (event) => {
                event.preventDefault()
                const filteredObject = averageRates.filter(obj => Object.keys(obj)[0] === event.target.value)
                localStorage.setItem('selectedToken', JSON.stringify(filteredObject[0]))
                createBalanceRadios(tokensSortFunction(accountTokens, event.target.value), averageRatesSortFunction(averageRates, event.target.value))
                hassleActions(true, true, '')
            })

            $('#login span').textContent = 'Switch wallet'
        } else {
            //hassleActions(true, true, '')
            $('#user-menu .avatar').src = `/svgs/user.svg`
        }
        return data
    })
}



// Login in function that is called when the login button is clicked
export const login = async (restoreSession) => {

    const { link: localLink, session: localSession } = await ProtonWebSDK({
        // linkOptions is a required part of logging in with the protonWebSDK(), within
        // the options, you must have the chain API endpoint array, a chainID that matches the chain your API
        // endpoint is on, and restoreSession option that is passed to determine if there is
        // an existing session that needs to be saved or if a new session needs to be created.
        linkOptions: {
            endpoints,
            chainId,
            restoreSession,
        },
        // The account that is requesting the transaction with the client
        transportOptions: {
            requestAccount: appIdentifier
        },
        // This is the wallet selector style options available
        selectorOptions: {
            appName: "hassle",
            appLogo: "/favicon/hassle-favicon.svg",
            customStyleOptions: {
                modalBackgroundColor: "#F4F7FA",
                logoBackgroundColor: "transparent",
                isLogoRound: false,
                optionBackgroundColor: "white",
                optionFontColor: "#0274f9",
                primaryFontColor: "#012453",
                secondaryFontColor: "#6B727F",
                linkColor: "#0274f9"
            }
        }
    })

    link = localLink
    session = localSession

    if (localSession) {
        user = localSession.auth.actor || ''
        avatarName.textContent = user
        $('#add').style.display = 'flex'
        $('#menu-options').classList.add('authenticated')

        if (restoreSession) {
            userInfo(user, false)
        } else {
            userInfo(user, true)
            location.reload()
        }
    } else { userInfo(user, false) }

}

// Logout function sets the link and session back to original state of undefined
const logout = async () => {
    if (link && session) {
        await link.removeSession(appIdentifier, session.auth, chainId)
    }
    session = undefined
    link = undefined
    avatarName.textContent = ''
    localStorage.removeItem('accountTokens')
    location.reload()
}

// Add button listeners
headerLoginButton.addEventListener("click", () => login(false))
loginButtons.forEach(el => {
    el.addEventListener("click", () => login(false))
})

logoutButton.addEventListener("click", () => logout())
// Restore
login(true)



export const transfer = async (account, to, amount, decimals, currency) => {

    if (!session) {
        throw new Error('No Session');
    }

    return await session.transact({
        actions: [{

            // Token contract
            account: account,

            // Action name
            name: "transfer",

            // Action parameters
            data: {
                // Sender
                from: session.auth.actor,

                // Receiver
                to: to,

                // toFixed is used for precision
                quantity: `${(+amount).toFixed(decimals)} ${currency}`,

                // Optional memo
                memo: `A lil' somethin' for yo' hassle! 💰✌️`
            },
            authorization: [session.auth]
        }]
    }, {
        broadcast: true
    })
}