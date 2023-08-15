const path = require('path')
const express = require('express')
const https = require('https')
const cors = require('cors')
const Joi = require('joi')
const fs = require('fs')
const google = require('googlethis')
const Hassle = require('./methods/component')
const { members } = require('./methods/component')


const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
//app.use(express.static(path.join(__dirname, 'shield')))
app.use(cors());

https.createServer({
  key: fs.readFileSync("server.key"),
  cert: fs.readFileSync("server.crt"),
}, app)
  .listen(65535, () => {
    console.log("Server is running at port 65535");
  });

// google image search
app.get('/images', async (req, res) => {
  const results = await google.image(req.query.image, { safe: false }) || undefined
  res.send({ "status": 200, "results": results })
})


// GETs all data from hassles.json file 
app.get('/gethassles', (req, res) => {

  let response = {}

  const types = { "weekly": 0, "monthly": 1, "wishlist": 2, "crowdfunded": 3 }
  let privacy
  const auth = req.query.auth // this is the authenticated user
  const user = req.query.user // this is the user from url format, Example: domain?user=lucianape3
  let userToRead

  const stats = JSON.parse(fs.readFileSync(`./hassle-data/stats.json`))
  const members = JSON.parse(fs.readFileSync(`./hassle-data/members.json`))


  //search function
  const searchStringInJSON = (str, json) => {
    const string = str.toLowerCase()
    json.forEach(object => {

      for (var key in object) {
        if (key === 'title' && object[key].toLowerCase().includes(string)) {
          results.push(object)
          break
        }
      }

    })
    return results
  }

  if (auth && auth != undefined && auth != 'undefined' && auth != 'null' && auth != 'false' && auth != 'true') {
    userToRead = auth
    if (req.query.user != auth && req.query.user != undefined && req.query.user != 'undefined' && req.query.user != 'null' && req.query.user != 'false' && req.query.user != 'true') {
      userToRead = req.query.user
    }
  } else { userToRead = req.query.user }

  fs.readFile(`./hassle-data/users/${userToRead}.json`, (err, fileContent) => {
    if (!err) {
      // no error? proceed...
      let diskHassles = JSON.parse(fileContent)
      let hassles = diskHassles.hassles[req.query.type]
      privacy = diskHassles.privacy

      if (req.query.search) {
        // search in hassles
        results = []
        hassles = searchStringInJSON(req.query.search, hassles)
      }


      if (auth && auth != undefined && auth != 'undefined' && auth != 'null' && auth != 'false' && auth != 'true') {

        if (members[auth].banned === true) {
          response = { "status": 403, members, privacy, stats }
        } else {
          if (user && user != auth && user != undefined && user != 'undefined' && user != 'null' && user != 'false' && user != 'true') {
            if (members[user]) {
              if (members[user].banned === true) {
                // user from query is banned
                response = { "status": 403, members, privacy, stats }
              } else {
                // user from query not banned
                if (privacy[types[req.query.type]] === 1 || (typeof privacy[types[req.query.type]] === 'object' && privacy[types[req.query.type]].includes(auth))) {
                  // user from query passed all checks and can send content
                  response = { "status": 200, members, hassles, privacy, stats }
                } else {
                  response = { "status": 403, members, privacy, stats }
                }
              }

            } else {
              // not a member
              response = { "status": 404, members, privacy, stats }
            }
          } else {
            // No user query, normal response
            response = { "status": 200, members, hassles, privacy, stats }
          }
        }
      } else {
        // NO AUTH
        if (req.query.user && user != undefined && user != 'undefined' && user != 'null' && user != 'false' && user != 'true') {
          if (members[user]) {
            if (members[user].banned === false) {
              if (privacy[types[req.query.type]] === 1) {
                // user hassle is public
                response = { "status": 200, members, hassles, privacy, stats }
              } else {
                // access to this user's hassle is not public
                response = { "status": 403, members, privacy, stats }
              }
            } else {
              // user is banned
              response = { "status": 403, members, privacy, stats }
            }
          } else {
            // user from query is not a member
            response = { "status": 404, members, privacy, stats }
          }
        } else {
          // no user queried, sending public stats and members for homepageg
          response = { stats, members }
        }
      }

    }
    else {
      privacy = [0, 0, 0, 0]
      response = { "status": err, members, privacy, stats }
    }

    res.send(response)
  })
})


// POST
app.post('/hassle', (req, res) => {
  if (!req.body.edit) {
    // Joi Schema = how the incoming input data is validated
    const schema = {
      user: Joi.string().max(23).required(),
      queryUser: Joi.string().max(23),
      title: Joi.string().max(124).required(),
      image: Joi.string().max(999).required(),
      type: Joi.string().max(23).required()
    }

    let { error } = Joi.validate(req.body, schema)

    if (error) {
      res.status(401).send(error.details[0].message)
      return
    } else {
      const hassle = new Hassle(req.body)
      hassle.save()
      res.send({ "status": 200 })
    }
  } else {
    fs.readFile(`./hassle-data/users/${req.body.edit}.json`, (err, fileContent) => {
      let oldHassles
      if (!err) {
        oldHassles = JSON.parse(fileContent)
      }

      oldHassles.hassles[req.body.type] = req.body.hassles
      oldHassles.privacy = req.body.privacy

      fs.writeFile(`./hassle-data/users/${req.body.edit}.json`, JSON.stringify(oldHassles), err => {
        console.log('Error: ' + err)
      })
      res.send({ "status": 200 })
    })
  }

})


app.put('/delete', (req, res) => {
  let userFile = req.body.queryUser || req.body.user
  try {
    let oldHassles = JSON.parse(fs.readFileSync(`./hassle-data/users/${userFile}.json`))
    const filteredHassles = oldHassles.hassles[req.body.type].filter(hassle => hassle.id != Number(req.body.id))

    oldHassles.hassles[req.body.type] = filteredHassles

    fs.writeFileSync(`./hassle-data/users/${userFile}.json`, JSON.stringify(oldHassles))


    res.send({ "status": 200 })
  } catch (err) {
    console.error('Delete error: ' + err)
  }
})


app.patch('/members', async (req, res) => {

  const object = {}
  object.user = req.query.user
  object.queryUser = req.query.queryu
  object.type = req.query.type
  object.tx = req.query.tx
  object.amount = req.query.amount
  object.currency = req.query.currency

  const schema = {
    user: Joi.string().max(23).required(),
    queryUser: Joi.string().max(23),
    type: Joi.string().max(23),
    tx: Joi.string().max(69),
    amount: Joi.number().max(2300001),
    currency: Joi.string().max(5)
  }

  let { error } = Joi.validate(object, schema)

  if (error) {
    res.status(401).send(error.details[0].message)
    return
  } else {
    const returnedObject = await members(req.query.user, req.query.login, req.query.queryu, req.query.type, req.query.tx, req.query.amount, req.query.currency)
    res.send(returnedObject)
  }
})
