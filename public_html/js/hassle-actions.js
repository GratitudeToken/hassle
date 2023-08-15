import { $, $$ } from '/js/selectors.js'
import { queryParams } from '/js/queries.js'
import { url, user } from '/js/proton.js'
import { indexHTML } from '/js/index-template.js'
import { userCards } from '/js/user-cards.js'
import { deleteHassle } from '/js/delete-hassle.js'
import { editHassles } from '/js/edit-hassles.js'

export let userData = {}
export let type
export const types = { "weekly": 0, "monthly": 1, "wishlist": 2, "crowdfunded": 3 }
const typesKeys = Object.keys(types)
const typesSVG = ["lightning", "calendar-simpler", "magic-wand", "crowd-fund-simpler"]

let features = localStorage.getItem('features') || null

$('#close-features').addEventListener("click", e => {
    localStorage.setItem('features', 'hidden')
    $('.features').style.display = 'none'
})

export const hassleActions = (fetchy, looper, search) => {

    type = localStorage.getItem('type')
    userData.type = type

    let query = queryParams()
    search ? query.s = search : null

    if (type != null) {
        $('#' + type).checked = true
        $('#add img').src = '/svgs/' + typesSVG[types[type]] + '.svg'
    } else {
        type = 'weekly'
        $('#' + type).checked = true
    }

    $('body').classList.remove('canEdit')
    $('#loader').style.setProperty('display', 'flex')

    let newURL = url + 'gethassles?auth=' + user + '&type=' + type
    // if we have a USER query or a search do this, else it's just an empty string and do else

    $('#hassle-user b').textContent = query.u || user

    if (query.s || query.u) {
        query.s ? newURL += '&search=' + query.s : null
        query.u ? newURL += '&user=' + query.u : null

        $('.easyNav').classList.add('showEasyNav')
    } else {
        features === 'hidden' ? $('.features').style.display = 'none' : $('.features').style.display = 'block'
    }


    let priceResult
    const resizeActions = (entries) => {

        const id = entries[0].target.parentNode.id.replace(/^\D+/g, '')

        let w = entries[0].contentRect.width
        let h = entries[0].contentRect.height

        w -= 57
        h -= 33

        priceResult
        if (w > 1) { h > 1 ? priceResult = (w / 2.3) * (h * 0.0124119) : priceResult = (w / 21.801) } else { priceResult = 1 }
        priceResult = priceResult.toFixed(2)

        if ($('#hassle-' + id)) {
            userData.hassles[id - 1].price = Number(priceResult)
            $('#hassle-' + id + ' .price input').value = priceResult
            $('#hassle-' + id + ' .price b').innerHTML = priceResult
            $('#hassle-' + id + ' .price').classList.add('removeTokenLogo')
        }


        // image to change
        const img = $('#hassle-' + id + ' .The2WaySlider img')
        if (priceResult >= 2) { img.src = '/img/2dollars.jpg' }
        if (priceResult >= 5) { img.src = '/img/5dollars.jpg' }
        if (priceResult >= 10) { img.src = '/img/10dollars.jpg' }
        if (priceResult >= 20) { img.src = '/img/20dollars.jpg' }
        if (priceResult >= 50) { img.src = '/img/50dollars.jpg' }
        if (priceResult >= 100) { img.src = '/img/100dollars.jpg' }

    }

    let observer = new ResizeObserver(resizeActions)

    if (fetchy === true) {
        fetch(newURL)
            .then(response => {
                return response.json()
            })
            .then(data => {

                userData.privacy = data.privacy
                userData.hassles = data.hassles

                if (!query.u || (userData && typeof userData.privacy[types[type]] === 'object' && userData.privacy[types[type]].includes(user))) {
                    $('body').classList.add('canEdit')
                }


                let tokenRate
                let symbol


                if (!localStorage.getItem('selectedToken')) {
                    localStorage.setItem('selectedToken', '{"XUSDT": 1}')
                    tokenRate = { "XUSDT": 1 }
                    symbol = 'XUSDT'
                } else {
                    tokenRate = JSON.parse(localStorage.getItem('selectedToken'))
                    symbol = Object.keys(tokenRate)[0]
                }


                // update some things depending if we have userQuery or not
                if (query.u) {

                    // generate hassle page 
                    //console.log((typeof userData.privacy[types[type]] === 'object' && userData.privacy[types[type]].includes(user)))
                    if (query.u === user || (typeof userData.privacy[types[type]] === 'object' && userData.privacy[types[type]].includes(user))) {

                        $('#hassle').title = 'Update it'
                        $('#hassle').classList.add('update-it')
                        $('#total').classList.add('disable-all')
                        $('#total').title = `You can't back up a shared hassle list, my friend.`
                    } else {
                        $('#hassle').title = 'Fund it'
                        $('#total').classList.remove('disable-all')
                        $('#hassle').classList.remove('update-it')
                        $('body').classList.add('userQuery')
                    }

                } else {
                    // generate index page
                    $('#hassle').classList.add('update-it')
                    $('#hassle').title = 'Update it'
                }



                if (data.status === 200) {
                    // reset IDs
                    if (user) {
                        userData.hassles.forEach((el, i) => {
                            userData.hassles[i].id = i + 1
                        })
                    }


                    $('#hassles').innerHTML = ''
                    $('#navigation').style.setProperty('display', '')
                    $('#items').classList.remove('canEdit')

                    const hassleFunctions = (item) => {

                        // populate HTML function
                        let html
                        html = new indexHTML

                        $('#hassles').innerHTML += html.insertHTML({ ...item })

                        // if (userData.hassles.length === 0) {
                        //     console.log('gigi')
                        // }

                        //////////// NEW STUFF

                        // THIS CODE BELOW IS BOLLOCKS - IT LOOPS OVER AND OVER AGAIN whenever hassleFunctions() is called for each hassle .... far too many times... needs improvement

                        $$('.price-btn').forEach(el => {

                            el.addEventListener("click", e => {
                                const id = el.id.replace(/^\D+/g, '')
                                $('#hassle-' + id + ' .The2WaySlider').classList.add('show')
                            })

                        })



                        $$('.delete-btn').forEach(el => {
                            el.addEventListener("click", e => {
                                const id = el.id.replace(/^\D+/g, '')
                                $('#hassle-' + id).remove()
                                userData.hassles = userData.hassles.filter(hassle => hassle.id != id)
                                deleteHassle(user, query.u, type, id)
                            })
                        })

                        $$('.units-btn').forEach(el => {
                            el.addEventListener("click", e => {
                                const id = el.id.replace(/^\D+/g, '')
                                const backendUnits = $('#hassle-' + id + ' .title .units').textContent.replace(/^\D+/g, '')

                                if (el.classList.contains('minus-btn') && backendUnits > 1) {
                                    userData.hassles[id - 1].units--
                                    $('#hassle-' + id + ' .title .units').textContent = 'x' + (parseInt(backendUnits) - 1)
                                }

                                if (el.classList.contains('plus-btn') && backendUnits < 99999) {
                                    userData.hassles[id - 1].units++
                                    $('#hassle-' + id + ' .title .units').textContent = 'x' + (parseInt(backendUnits) + 1)
                                }
                            })
                        })

                        $$('.The2WaySlider').forEach(el => {
                            const id = el.id.replace(/^\D+/g, '')
                            let resizeBox = $('#' + el.id + ' i')

                            el.addEventListener("mousedown", e => {
                                observer.observe(resizeBox)
                                $('#hassle-' + id + ' .price b').innerHTML = $('#hassle-' + id + ' .price input').value

                            })
                            el.addEventListener("mouseup", e => {
                                el.classList.remove('show')
                            })
                        })

                        $('body').addEventListener("mouseup", e => {
                            observer.disconnect()
                        })

                        $$('.price input').forEach(item => {
                            item.addEventListener('input', e => {
                                userData.hassles[item.dataset.id - 1].price = Number(item.value)
                                $('#hassle-' + item.dataset.id + ' .price b').innerHTML = item.value
                                $('#hassle-' + item.dataset.id + ' .price').classList.add('removeTokenLogo')
                            })
                        })
                    }




                    $$('#privacy button').forEach((el, i) => {
                        el.addEventListener("click", e => {
                            const title = e.target.title.toLowerCase()
                            i === 2 ? userData.privacy[types[type]] = [] : userData.privacy[types[type]] = i
                            $('#privacy').className = 'flex-center ' + title
                        })
                    })




                    let totalAmount = 0
                    for (const item of userData.hassles) {
                        //console.log(parseInt(item.price))
                        const price = item.price
                        totalAmount += price
                    }

                    $('#hassle-stats #total').innerHTML = `<img class="small-icon" src="/svgs/${symbol}.svg" /> <input type="number" value="${Number(totalAmount / tokenRate[symbol]).toFixed(2)}" />`

                    $('#hassles').className = type
                    let users = ''
                    if (userData.privacy[types[type]].length) {
                        userData.privacy[types[type]].forEach(el => {
                            users += el + ', '
                        })
                    }
                    $('#add-remove i').innerHTML = users.replace(/,\s*$/, "");

                    $('#add-remove').addEventListener("submit", e => {
                        e.preventDefault()
                        let array = userData.privacy[types[type]]
                        const val = $('#add-remove input').value
                        console.log(val.length)
                        if (val.length > 3 && array.includes(val)) {
                            if (array.length > 1) {
                                array = array.filter(u => u != val)
                                alert(`User @${val} removed. Don't forget to update.`)
                            } else {
                                alert('You have to add at least one user to be able to set Custom visibility.')
                            }
                        } else {
                            if (val.length > 3) {
                                array.push(val)
                                alert(`User @${val} added. Don't forget to update.`)
                            }
                        }
                        userData.privacy[types[type]] = array
                        let users = ''
                        if (userData.privacy[types[type]].length) {
                            userData.privacy[types[type]].forEach(el => {
                                users += el + ', '
                            })
                        }
                        $('#add-remove i').innerHTML = users.replace(/,\s*$/, "");
                    })

                    //////////// END OF NEW STUFF


                    if (looper === true) {
                        userData.hassles.forEach((hassle, i) => {
                            hassleFunctions(hassle, i)
                        })
                    }

                    let queryText = $('.query-text')
                    let finalQuery
                    if (query.s) {
                        finalQuery = query.s
                        queryText.innerHTML = `<b>${finalQuery}</b> - returned ${userData.hassles.length} results.`
                    }

                    userData.hassles.length == 0 ? queryText.innerHTML = `🔍 No hits for <b>${finalQuery}</b> in <b style="text-transform: capitalize">${type}</b> 🤷‍♂️` : null

                } else {
                    if (query.u) {
                        $('#navigation').style.setProperty('display', 'flex')
                        data.status === 401 ? $('.query-text').innerHTML = `You are not authenticated.` : null;
                        data.status === 403 ? $('.query-text').innerHTML = `🙅‍♂️ Hold up! User <b>@${query.u}</b> is playing it exclusive and won't let you peep this list. 🚫🔒` : null;
                        if (data.status === 404) {
                            $('#hassles').innerHTML = ''
                            $('#hassles').style = ''
                            $('#rollin').innerHTML = `<img src="/img/rollin.jpg" />`
                            $('.query-text').innerHTML = `🔍 Nada, zilch, zero results for user <b>@${query.u}</b> 🤷‍♀️`
                        }
                        if (data.status.errno) {
                            $('.query-text').innerHTML = `😕 Whoopsie! The search for user <b>@${query.u}</b> hit a glitch.<br>🐒 Our brainy monkey squad is on the case, but no promises! 🕵️‍♂️`
                            $('#hassle').style.display = 'none'
                        }
                    }
                }


                // insert user cards HTML
                let html
                html = new userCards

                if (!user && (userData.hassles === undefined || !userData.hassles)) {
                    $('#rollin').innerHTML = `<img src="/img/rollin.jpg" />`
                    $('#hassles').style = 'display: none !important'
                }

                if (user && (typeof userData.hassles === 'object' && userData.hassles.length === 0)) {
                    $('#rollin').innerHTML = `<img src="/img/rollin.jpg" />`
                    $('#hassles').style = 'display: none !important'
                } else {
                    $('#hassles').style = 'display: grid'
                }


                $('#user-cards').innerHTML = html.usersHTML({ ...data, types, typesKeys, typesSVG })


                $$('.user-card').forEach(el => {
                    el.addEventListener("mouseup", e => {
                        el.style = 'transition: 0.11s all; transform: scale(2.3); opacity: 0; z-index: 23'
                        setTimeout(() => {
                            el.style = ''
                        }, "500");
                    })
                })


                if (userData.privacy) {
                    $$('#select-type .privacy').forEach((item, index) => {
                        if (typeof userData.privacy[index] === 'object') {
                            item.className = 'privacy custom-icon'
                            if (item.dataset.cat === type) {
                                $('#privacy').className = 'flex-center custom'
                            }
                        } else {
                            if (userData.privacy[index] === 0) {
                                item.className = 'privacy private-icon'
                                if (item.dataset.cat === type) {
                                    $('#privacy').className = 'flex-center private'
                                }
                            }
                            if (userData.privacy[index] === 1) {
                                item.className = 'privacy public-icon'
                                if (item.dataset.cat === type) {
                                    $('#privacy').className = 'flex-center public'
                                }
                            }

                        }
                    })
                }


                $('#burger').addEventListener("click", e => {
                    $('#controls').style = 'right: 5%; box-shadow: 0 0 10px #000000;'
                    $('#burger').style.display = 'none'
                    localStorage.setItem('tip-1', 'hidden')
                    $('#tip-1').style.display = 'none'
                })


                $('#hassle-user').addEventListener("click", e => {
                    if (query.u) {
                        navigator.clipboard.writeText('https://hassle.com?user=' + query.u)
                    } else {
                        navigator.clipboard.writeText('https://hassle.com?user=' + user)
                    }
                    const randomColor = '#' + Math.floor(Math.random() * 16777215).toString(16)
                    $('#hassle-user b').style.color = '#db463e'
                    $('#hassle-user svg').style.stroke = randomColor
                })

                $('#loader').style.setProperty('display', 'none')
            })

        editHassles(userData)
    }
}