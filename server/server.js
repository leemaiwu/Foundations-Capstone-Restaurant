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

app.post('/seed', seed)

app.post('/order', (req, res) => {
    let {name, meal, sides, drink, inOrGoRadio, pickingUp} = req.body

    sequelize.query(`
        INSERT INTO orders (name, meal, sides, drink_id, is_to_go, pickup_time)
        VALUES ('${name}', '${meal}', '${sides}', ${drink}, '${inOrGoRadio}', ${pickingUp})
        RETURNING *;
    `)
    .then((dbResult) => {
        res.status(200).send(dbResult[0])
    })
})

app.listen(SERVER_PORT, () => {
    console.log(`listening on ${SERVER_PORT}`)
})
