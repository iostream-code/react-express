const express = require('express')
const app = express()
const port = 3001

const cors = require('cors')
app.use(cors())

const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: false }))

app.use(bodyParser.json())

const postRouter = require('./routes/posts')
app.use('/api/posts', postRouter)

app.get('/', (req, res) => {
    res.send("Hello World!")
})

app.listen(port, () => {
    console.log(`App running at http://localhost:${port}`)
})
