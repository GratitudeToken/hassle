import { $ } from '/js/selectors.js'
import { search } from '/js/search.js';
import { hassleActions, types } from '/js/hassle-actions.js';
import { addBTN, closeBTN } from '/js/event-listeners.js';
addBTN(); closeBTN();

search(); // search method

hassleActions(true, true);

const headings = ['Weekly shopping list', 'Monthly shopping list', 'Wishlist', 'Crowdfunded list']
$('#mainHeading').textContent = headings[types[localStorage.getItem('type') || 'weekly']]
localStorage.getItem('type') === 'crowdfunded' ? $('#hassle-form input[type=text]').setAttribute('placeholder', 'Image URL (Eg: "https://hassle.app/profile.png")') : null

$('#select-type').addEventListener('change', (e) => {
    const type = $('#select-type input[name="type"]:checked').value
    localStorage.setItem('type', type)
    $('#mainHeading').textContent = headings[types[type]]
    $('#mainHeading').innerHTML = headings[types[type]]
    $('#hassles').innerHTML = ''
    $('#navigation').className = ''
    $('#search input[type=text]').value = ''
    type === 'crowdfunded' ? $('#hassle-form input[type=text]').setAttribute('placeholder', 'Image URL (Eg: "https://hassle.app/profile.png")') : null
    hassleActions(true, true)
})

$('body').addEventListener("mouseup", e => {
    if (e.target !== $('#burger') && e.target !== $('#hassle') && e.target !== $('#controls') && e.target !== $('#add-remove') && e.target !== $('#add-remove input') && e.target !== $('#add-remove button') && e.target !== $('#hassle-user') && e.target !== $('#hassle-user svg') && e.target !== $('div#controls') && e.target !== $('#controls b') && e.target !== $('#total') && e.target !== $('#total input') && e.target !== $('#total img') && e.target !== $('#select-type label') && e.target != $('#select-type input') && e.target !== $('#privacy') && e.target !== $('#private') && e.target !== $('#public') && e.target !== $('#custom') && e.target !== $('#private img') && e.target !== $('#public img') && e.target !== $('#custom img')) {
        $('#burger').style.display = ''
        $('#controls').style = ''
    }
})


// Timeout for Loader

setTimeout(() => {
    $('#loader').style.setProperty('display', 'none')
}, "10000");


let script = document.createElement("script");
script.innerHTML = `
    window.CustomSubstackWidget = {
        substackUrl: "gratitudetoken.substack.com",
        placeholder: "example@gmail.com",
        buttonText: "Subscribe",
        theme: "custom",
        colors: {
          primary: "#FFFFFF",
          input: "#000000",
          email: "#FFFFFF",
          text: "#000000",
        }
      };
    `;
script.async = true;
document.body.append(script);