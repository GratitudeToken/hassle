import { formatDate } from '/js/date-formatting.js'
import { url, user } from '/js/proton.js'
import { countdown } from '/js/countdown.js'

// HTML post display template that is used when getPosts is called
export class indexHTML {
    insertHTML(data) {

        // title
        let linkTitle = ''
        if (data && data.title) {
            linkTitle = '?id=' + data.id + '&title=' + data.title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '')
        }
        let voted
        let closedStatus = ''
        const counter = new countdown
        const closed = counter.count(data.id, data.expires, false)
        data.voted === false ? voted = false : voted = data.voted.includes(user);

        if (closed === 'Closed') {
            closedStatus = 'post-closed'
        } else if (voted === true) {
            closedStatus = 'post-voted'
        } else { closedStatus = '' }

        // check if we have an image
        let imageSRC
        if (data.image && data.image != '') {
            imageSRC = data.image
        } else { imageSRC = '/img/love-technology.jpg' }



        closedStatus = '' /// remove this hardcoding
        return `
            <article class="post ${data.type} ${closedStatus}" id="post-${data.id}">
                <a href="${linkTitle}" class="flex indexPost" title="${data.title}">
                    <div class="main-image" style='background: url(${imageSRC}) no-repeat 50% 50%; background-size: cover'></div>
                    <span class="avatar" title="Avatar"><img src="/avatars/${data.user}.webp" /></span>
                    <span class="units flex">1</span>
                    <div class="title ${data.type}"><h2>${data.title}</h2></div>
                </a>
            </article>
            `
    }
}