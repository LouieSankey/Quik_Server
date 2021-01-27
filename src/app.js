require('dotenv').config()
const morgan = require('morgan')
const cors = require('cors')
const helmet = require('helmet')
const { NODE_ENV } = require('./config')
const userRouter = require('./user/user_router')
const pinsRouter = require('./pins/pins_router')
const chatRouter = require('./chat/chat_router')
const config = require('./config')
const express = require('express')

const app = express()

const morganOption = (NODE_ENV === 'production')
  ? 'tiny'
  : 'common'

app.use(morgan(morganOption))
app.use(helmet())
app.use(cors())

app.use('/user_route', userRouter)
app.use('/pins_route', pinsRouter)
app.use('/chat_route', chatRouter)

app.get('/', (req, res) => {
    res.send('Hello, world!')
 })


app.use(function errorHandler(error, req, res, next) {
    let response
        if (NODE_ENV === 'production') {
            response = { error: { message: error.message } }
        } else {
            console.error(error)
            response = { message: error.message, error }
        }
    res.status(500).json(response)
    })

module.exports = app