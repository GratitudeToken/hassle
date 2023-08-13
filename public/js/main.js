import { $ } from '/js/selectors.js'
import { search } from '/js/search.js';
import { hassleActions } from '/js/hassle-actions.js';
import { addBTN, closeBTN } from '/js/event-listeners.js';
addBTN(); closeBTN();

search(); // search method

hassleActions(true, true);

$('#select-type').addEventListener('change', (e) => {
    localStorage.setItem('type', $('#select-type input[name="type"]:checked').value)
    $('#navigation').className = ''
    $('#search input[type=text]').value = ''
    hassleActions(true, true)
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