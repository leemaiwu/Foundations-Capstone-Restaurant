require('dotenv').config()
const express = require('express')
const cors = require('cors')
let Sequelize = require('sequelize')

const {seed, submitOrder} = require('./controller/controller.js')

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

app.post('/seed', seed)

app.post('/order', (req, res) => {
    let {name, meal, sides, drink, inOrGoRadio, pickingUp} = req.body

    const pickupTimeClause = pickingUp ? `, pickup_time` : '';

    const pickupTimeValue = pickingUp ? `, ${pickingUp}` : '';

    sequelize.query(`
        INSERT INTO orders (name, meal, sides, drink_name, is_to_go${pickupTimeClause})
        VALUES ('${name}', '${meal}', '${sides}', ${drink}, '${inOrGoRadio}'${pickupTimeValue})
        RETURNING *;
    `)
    .then((dbResult) => {
        res.status(200).send(dbResult[0])
    })
    .catch((error) => {
        console.error(error)
        res.status(500).send('Error submitting order')
    })
})

app.get('/order', (req, res) => {
    let {drink_name, pickup_time} = req.query

    sequelize.query(`

        SELECT orders.*, drink.name AS drink_name, pickup_time.time AS pickup_time
        FROM orders
        JOIN drink ON drink.id = orders.drink_name
        JOIN pickup_time ON pickup_time.id = orders.pickup_time
        WHERE drink.id = ${drink_name} AND pickup_time.id = ${pickup_time};

    `)
    .then((dbResult) => {
        res.status(200).send(dbResult[0])
    })
    .catch((error) => {
        console.error(error)
        res.status(500).send('Error retrieving order')
    })
})

app.listen(SERVER_PORT, () => {
    console.log(`listening on ${SERVER_PORT}`)
})
