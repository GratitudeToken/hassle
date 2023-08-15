export class userCards {
    usersHTML(data) {
        let allData = data

        let theHTML = '<h2><b>Latest</b><br>members</h2>'
        console.log(data)
        //Iterate through each property (user) in the object
        for (const user in allData.members) {

            let userStats = ''
            if (allData.members[user].banned === false) {
                if (allData.members.hasOwnProperty(user)) {
                    // Iterate through each number in the nested array for the current user
                    allData.stats[user].forEach((number, i) => {
                        userStats += `<img class="type-svg" src="/svgs/${allData.typesSVG[i]}.svg" alt="Number of hassles" /> ${number}`
                    })
                }

                theHTML += `
                            <a href="/?user=${user}" class="user-card" title="@${user}">
                                <div class="avatar"><img alt="avatar ${user}" src="/avatars/${user}.webp"/></div>
                                <div class="white-gradient"></div>
                                <div class="statz">
                                    <h3>${user}</h3>
                                    <div>
                                        ${userStats} 
                                    </div>
                                </div>
                            </a>
                            `
            }
        }

        return theHTML
    }
}