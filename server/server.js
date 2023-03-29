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

    if (pickingUp === null) {
        sequelize.query(`
        INSERT INTO orders (name, meal, sides, drink_id, is_to_go)
        VALUES ('${name}', '${meal}', '${sides}', ${drink}, '${inOrGoRadio}')
        RETURNING *;
    `)
    .then((dbResult) => {

        res.status(200).send(dbResult[0])
    })
    } else {
    sequelize.query(`
        INSERT INTO orders (name, meal, sides, drink_id, is_to_go, pickup_time)
        VALUES ('${name}', '${meal}', '${sides}', ${drink}, '${inOrGoRadio}', ${pickingUp})
        RETURNING *;
    `)
    .then((dbResult) => {
        res.status(200).send(dbResult[0])
    })}
})

app.get('/order', (req, res) => {
    let {drink_id, pickup_time} = req.query

    sequelize.query(`
        SELECT drink.name AS drink, pickup_time.time AS time
        FROM drink
        JOIN orders
        ON drink.id = orders.drink_id
        JOIN pickup_time
        ON pickup_time.id = orders.pickup_time
        WHERE drink.id = ${drink_id} AND pickup_time.id = ${pickup_time}
        ORDER BY orders.pickup_time;
    `)
    .then((dbResult) => {
        res.status(200).send(dbResult[0])
    })
})

app.listen(SERVER_PORT, () => {
    console.log(`listening on ${SERVER_PORT}`)
})
