const functions = require("firebase-functions")
const express = require('express')
const cors = require('cors')
const engines = require('consolidate')
const { getTasks, createTask, returnTasks } = require('./src/tasks')

const app = express()
app.use(cors())
app.engine('hbs', engines.handlebars)
app.set('views', './views')
app.set('view engine', 'hbs')

app.get('/tasks', getTasks)
app.post('/tasks', createTask)
app.get('/', (req, res) => {
     returnTasks(ourTasks => {
        console.log(ourTasks)
        res.render('index', { ourTasks })
     })
})

exports.app = functions.https.onRequest(app)

