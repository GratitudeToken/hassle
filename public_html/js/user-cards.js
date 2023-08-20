import { $ } from '/js/selectors.js'
export class userCards {
    usersHTML(data) {
        const nr = Object.keys(data.members).length
        if ($('body').offsetWidth > 959) {
            $('#user-cards ul').style = `width: ${nr * 210}px; animation: marquee ${nr * 10}s infinite linear`
        }

        let allData = data

        let theHTML = ''

        //Iterate through each property (user) in the object
        for (const user in allData.stats) {

            let userStats = ''

            allData.stats[user].forEach((number, i) => {
                userStats += `<img class="type-svg" src="/svgs/${allData.typesSVG[i]}.svg" alt="Number of hassles" /> ${number}`
            })

            theHTML += `<li><a href="/?user=${user}" class="user-card" title="@${user}">
                                <div class="avatar"><img alt="avatar ${user}" src="/avatars/${user}.webp"/></div>
                                <div class="statz">
                                    <h3>${user}</h3>
                                    <div>
                                        ${userStats} 
                                    </div>
                                </div>
                        </a></li>`

        }

        return theHTML
    }
}