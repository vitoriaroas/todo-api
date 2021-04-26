const admin = require('firebase-admin')

const serviceAccount = require('../../credentials.json')

let db

function connectToFirestore() {
  if (!db) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    })
    db = admin.firestore()
  }
}

exports.returnTasks = (callback) => {
  connectToFirestore()
  db.collection('tasks')
    .get()
    .then((collection) => {
      let ourTasks = []
      collection.forEach((doc) => {
        let thisTask = doc.data()
        thisTask.id = doc.id
        ourTasks.push(thisTask)
      })
      callback(ourTasks) 
    })
    .catch((err) => {
      callback('Error getting tasks: ' + err.message)
    })
}

exports.getTasks = (req, res) => {
  this.returnTasks((ourTasks) => {
    const status = ourTasks.beginsWith('Error') ? 500 : 200
    res.set('Cache-Control', 'public, max-age=90, s-maxage=120')
    res.status(status).send(ourTasks)
  })
}

exports.createTask = (req, res) => {
  connectToFirestore()
  const newTask = req.body
  db.collection('tasks')
    .add(newTask)
    .then(() => {
      this.returnTasks((ourTasks) => {
        res.send(ourTasks)
      })
    })
    .catch((err) => res.status(500).send('Error creating task: ' + err.message))
}
