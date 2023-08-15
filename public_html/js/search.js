import { $ } from '/js/selectors.js'
import { hassleActions } from '/js/hassle-actions.js'

export const search = (string) => {
    $('#search').addEventListener('submit', (event) => {
        event.preventDefault();
        $('body').classList.remove('hasslePage')
        hassleActions(true, true, $('#search input[type=text]').value)
        $('.features').style.display = 'none'
        $('#navigation').classList.add('show', 'flex')
    });
}