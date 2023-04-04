require('dotenv').config()
const express = require('express')
const cors = require('cors')
let Sequelize = require('sequelize')

const { CONNECTION_STRING, SERVER_PORT } = process.env

const sequelize = new Sequelize(CONNECTION_STRING, {
    dialect: 'postgres',
    dialectOptions: {
        ssl: {
            rejectUnauthorized: false
        }
    }
})

const app = express()

app.use(express.json())
app.use(cors())

app.use(express.static(`${__dirname}/../public`))

const {
    seed,
    allOrders,
    submitOrder,
    postOrder,
    deleteOrder
} = require('./controller/controller.js')

app.post('/seed', seed)
app.get('/allorders', allOrders)
app.post('/order', submitOrder)
app.get('/ordered?', postOrder)
app.delete('/order/:id', deleteOrder)

app.listen(SERVER_PORT, () => {
    console.log(`listening on ${SERVER_PORT}`)
})
