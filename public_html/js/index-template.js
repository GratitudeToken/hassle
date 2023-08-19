import { $ } from '/js/selectors.js'
export class indexHTML {
    insertHTML(data) {
        $('#rollin').innerHTML = ''
        const tokenRate = JSON.parse(localStorage.getItem('tokenRate'))
        const symbol = Object.keys(tokenRate)[0]

        // check if we have an image
        let imageSRC
        if (data.image && data.image != '') {
            imageSRC = data.image
        } else { imageSRC = '/img/love-technology.jpg' }

        return `
            <article class="hassle" id="hassle-${data.id}">
                <div class="indexPost" title="${data.title}">
                    <div class="main-image" style='background: url(${imageSRC}) no-repeat 50% 50%; background-size: cover'></div>
                    <a href="/?user=${data.user}" class="avatar" title="@${data.user}"><img src="/avatars/${data.user}.webp" /></a>
                    
                    <div class="title ${data.type}"><h2>${data.title} <span class="units" title="Units">x${data.units}</span></h2></div>

                    <div class="actions flex">
                        <button id="delete-${data.id}" class="delete-btn" title="Delete"><img class="medium-icon" src="/svgs/trash.svg" /></button>
                        <button id="minus-units-${data.id}" class="units-btn minus-btn" title="Remove units"><b>-</b></button>
                        <button id="plus-units-${data.id}" class="units-btn plus-btn" title="Add units"><b>+</b></button>
                        <button id="price-${data.id}" class="price-btn" title="Price"><b>$</b><i></i></button>
                    </div>

                    <div id="price-adjust-${data.id}" class="The2WaySlider"><i><b>Resize<br>Me</b><img src="/img/dollar.jpg"/></i></div>

                    <span class="price flex" title="Currency"><img class="small-icon" src="/svgs/${symbol}.svg" /> <b>${Number(data.price / tokenRate[symbol]).toFixed(2)}</b><input data-id="${data.id}" title="Adjust Price" value="${Number(data.price)}" step="0.01" type="number" min="1" max="2300000"></span>
                </div>
            </article>
            `
    }
}