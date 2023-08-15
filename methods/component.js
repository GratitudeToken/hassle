const fs = require('fs')
const sharp = require('sharp')
const { ApiClass } = require('@proton/api')
const protonApi = new ApiClass('proton')


module.exports = class Hassle {

  constructor(hassleData) {
    this.id = 0
    this.type = hassleData.type
    this.price = hassleData.price
    this.units = hassleData.units
    this.user = hassleData.user
    this.queryUser = hassleData.queryUser
    this.title = hassleData.title
    this.image = hassleData.image
    this.date = new Date()
  }


  save() {

    let newID = 0
    // read votes file first
    let userFile = this.queryUser || this.user
    fs.readFile(`./hassle-data/users/${userFile}.json`, (err, fileContent) => {

      let oldHassles
      if (!err) {
        oldHassles = JSON.parse(fileContent)
      }

      let maxId = 0;
      for (let i = 0; i < oldHassles.hassles[this.type].length; i++) {
        if (oldHassles.hassles[this.type][i].id > maxId) {
          maxId = oldHassles.hassles[this.type][i].id;
        }
      }

      newID = maxId + 1

      this.id = newID

      let newHassleData = {}

      newHassleData.id = newID
      newHassleData.user = this.user
      newHassleData.type = this.type
      newHassleData.price = this.price || 1.00
      newHassleData.units = this.units || 1
      newHassleData.title = this.title
      newHassleData.image = this.image
      newHassleData.date = this.date

      oldHassles.hassles[this.type].push(newHassleData)

      fs.writeFile(`./hassle-data/users/${userFile}.json`, JSON.stringify(oldHassles), err => {
        console.log('Error: ' + err)
        // read stats file
        const stats = JSON.parse(fs.readFileSync(`./hassle-data/stats.json`)) || {}
        stats[userFile][0] = oldHassles.hassles.weekly.length
        stats[userFile][1] = oldHassles.hassles.monthly.length
        stats[userFile][2] = oldHassles.hassles.wishlist.length
        stats[userFile][3] = oldHassles.hassles.crowdfunded.length
        fs.writeFileSync(`./hassle-data/stats.json`, JSON.stringify(stats))
      })
    })
  }
}


module.exports.members = async function (user, authenticating, queryu, type, tx, amount, currency) {
  //console.log(user, authenticating, queryu, tx, amount, currency)
  let validatedUser
  let validatedUserQuery

  if (user != undefined && user != queryu && user != 'undefined' && user != 'null' && user != 'false' && user != 'true') {
    validatedUser = user
  }

  if (queryu != undefined && queryu != user && queryu != 'undefined' && queryu != 'null' && queryu != 'false' && queryu != 'true') {
    validatedUserQuery = queryu
  }

  // read members file
  const members = JSON.parse(fs.readFileSync(`./hassle-data/members.json`)) || {}

  // let's check if the user is verified and has the minimum token balance required and send back the response
  const { rows } = await protonApi.rpc.get_table_rows({
    code: 'eosio.proton',
    table: 'usersinfo',
    scope: 'eosio.proton',
    lower_bound: user,
    upper_bound: user,
  })
  let kyc = rows[0].kyc[0]

  kyc ? kyc = kyc.kyc_level.includes('selfie' || 'frontofid') : kyc = false
  let accountTokens = await protonApi.getAccountTokens(user)
  accountTokens = accountTokens.filter(symbol => symbol.currency === 'XPR' || symbol.currency === 'GRAT' || symbol.currency === 'XUSDT')

  const tokenSymbolsArray = accountTokens.map(({ currency }) => currency)

  // Example:  ['GRAT','XPR','XUSDT']


  let tokenPrices = await protonApi.getTokenPrices()

  let tokenPrice = (currency) => {
    const prices = tokenPrices.filter(item => item.symbol === currency)
    const rates = prices.map(({ rates }) => rates)
    const usd = rates[0].filter(usd => usd.counterCurrency === 'USD')
    const sum = usd.reduce((sum, item) => sum + item.price, 0)
    const average = sum / usd.length
    return average
  }


  let averageRates = []

  tokenSymbolsArray.forEach((el) => {
    averageRates.push({ [el]: tokenPrice(el) })
  })


  if (!members || !members[user]) {

    if (validatedUser) {

      const newUserFile = { "privacy": [0, 0, 0, 0], "hassles": { "weekly": [], "monthly": [], "wishlist": [], "crowdfunded": [] } }
      fs.writeFileSync(`./hassle-data/users/${user}.json`, JSON.stringify(newUserFile))

      members[user] = {
        "kyc": kyc,
        "banned": false
      }
      fs.writeFileSync(`./hassle-data/members.json`, JSON.stringify(members))
    }
  } else {
    if (tx) {
      if (!members[validatedUserQuery].funding) {
        members[validatedUserQuery].funding = []
      }
      const newFunding = {
        "user": user,
        "type": type,
        "tx": tx,
        "amount": Number(amount).toFixed(8),
        "currency": currency

      }
      members[validatedUserQuery].funding.push(newFunding)
      members[user].kyc = kyc
      fs.writeFileSync(`./hassle-data/members.json`, JSON.stringify(members))
    }
  }



  let avatar
  if (authenticating == 'true') {
    avatar = rows[0].avatar || 'PHN2ZyBmaWxsPSIjMDAzZTkxIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbDpzcGFjZT0icHJlc2VydmUiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDI0IDI0IiB2aWV3Qm94PSIwIDAgMjQgMjQiPjxwYXRoIGZpbGw9IiMwMDNlOTEiIGQ9Ik0xMiAwQzUuNCAwIDAgNS40IDAgMTJzNS40IDEyIDEyIDEyIDEyLTUuNCAxMi0xMlMxOC42IDAgMTIgMHptMCA0YzIuMiAwIDQgMi4yIDQgNXMtMS44IDUtNCA1LTQtMi4yLTQtNSAxLjgtNSA0LTV6bTYuNiAxNS41QzE2LjkgMjEgMTQuNSAyMiAxMiAyMnMtNC45LTEtNi42LTIuNWMtLjQtLjQtLjUtMS0uMS0xLjQgMS4xLTEuMyAyLjYtMi4yIDQuMi0yLjcuOC40IDEuNi42IDIuNS42czEuNy0uMiAyLjUtLjZjMS43LjUgMy4xIDEuNCA0LjIgMi43LjQuNC40IDEtLjEgMS40eiIvPjwvc3ZnPg=='

    // create buffer for sharp
    const imgBuffer = Buffer.from(avatar, 'base64')

    try {
      const avatarPromise = new Promise((resolve, reject) => {
        sharp(imgBuffer)
          .resize(320)
          .toFile(`./public_html/avatars/${validatedUser}.webp`, (err, info) => {
            if (err) {
              reject(err)
              console.log('Error saving avatar: ' + err)
            } else {
              resolve()
            }
          })
      })
      await avatarPromise
    } catch (e) {
      console.error(e)
    }
  }

  return { members, accountTokens, averageRates }
}