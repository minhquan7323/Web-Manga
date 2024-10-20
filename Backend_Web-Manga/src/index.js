const express = require('express')
const { default: mongoose } = require('mongoose')
const dotenv = require('dotenv')
const routes = require('./routes')
const cors = require('cors')
const cookieParser = require('cookie-parser')
dotenv.config()

const app = express()
const port = process.env.PORT || 3001

app.use(cors())
app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ limit: '50mb' }))
app.use(cookieParser())
routes(app)

mongoose.connect(`${process.env.MONGO_DB}`)
    .then(() => {
        console.log('connect db success');
    })
    .catch((err) => {
        console.log(err);
    })

app.listen(port, () => {
    console.log('Server is running on port', port);
})
