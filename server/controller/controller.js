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

module.exports = {
    seed: (req, res) => {
        sequelize.query(`
        CREATE TABLE drink (
            id SERIAL PRIMARY KEY,
            name VARCHAR NOT NULL
            );
        
        CREATE TABLE pickup_time (
            id SERIAL PRIMARY KEY,
            time VARCHAR NOT NULL
            );
        
        CREATE TABLE orders (
            id SERIAL PRIMARY KEY,
            name VARCHAR NOT NULL,
            meal VARCHAR NOT NULL,
            sides VARCHAR NOT NULL,
            drink_name INT NOT NULL REFERENCES drink(id),
            is_to_go VARCHAR NOT NULL,
            pickup_time INT REFERENCES pickup_time(id)
        );
        
        INSERT INTO drink (name)
            VALUES ('Lemonade'),
            ('Iced Tea'),
            ('Sparkling Water'),
            ('Soda'),
            ('Diet Soda');
        
        INSERT INTO pickup_time (time)
            VALUES ('Morning (9-11AM)'),
            ('Afternoon (12-4PM)'),
            ('Evening (5-8PM)');
        `)
        .then(() => {
            console.log('Database seeded')
            res.sendStatus(200)
        })
        .catch((err) => {
            console.log(`Error seeding database. ${err}`)
        })
    },

    allOrders: (req, res) => {
        sequelize.query(`
        SELECT orders.name, orders.meal, orders.sides, drink.name AS drink_name, orders.is_to_go, pickup_time.time AS pickup_time
        FROM orders
        JOIN drink ON drink.id = orders.drink_name
        LEFT JOIN pickup_time ON pickup_time.id = orders.pickup_time;
        `)
        .then((dbResult) => {
            res.status(200).send(dbResult[0])
        })
        .catch((error) => {
            console.error(error)
            res.status(500).send('Error getting order history')
        })
    },

    submitOrder: (req, res) => {
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
    },

    postOrder: (req, res) => {
    let { drink_name, pickup_time } = req.query

    const query = `
        SELECT orders.*, drink.name AS drink_name, pickup_time.time AS pickup_time
        FROM orders
        JOIN drink ON drink.id = orders.drink_name
        LEFT JOIN pickup_time ON pickup_time.id = orders.pickup_time
        WHERE drink.id = ${drink_name} AND (pickup_time.id = ${pickup_time} OR pickup_time.id IS NULL);
    `
    sequelize.query(query)
        .then((dbResult) => {
            res.status(200).send(dbResult[0])
        })
        .catch((error) => {
            console.error(error)
            res.status(500).send('Error retrieving order')
        })
    }
}
