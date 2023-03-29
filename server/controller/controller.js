// const Sequelize = require('sequelize')
// const orders = require('../db.json')

// require('dotenv').config()

// const { CONNECTION_STRING } =  process.env

// const sequelize = new Sequelize(CONNECTION_STRING, {
//     dialect: 'postgres',
//     dialectOptions: {
//         ssl: {
//             rejectUnauthorized: false
//         }
//     }
// })

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
            drink_id INT NOT NULL REFERENCES drink(id),
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
}
