const express = require('express')
const { default: mongoose } = require('mongoose')
const dotenv = require('dotenv')
const routes = require('./routes')
const cors = require('cors')
const bodyParser = require('body-parser')
dotenv.config()

const app = express()
const port = process.env.PORT || 3001
app.use(cors())
app.use(bodyParser.json())

routes(app)

mongoose.connect(`${process.env.MONGO_DB}`)
    .then(() => {
        console.log('connect db success');
    })
    .catch((err) => {
        console.log(err);
    })

app.listen(port, () => {
    console.log('Server is running in port', + port);
})