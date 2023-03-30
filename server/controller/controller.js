
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

    getOrder: (req, res) => {
        const { drink_name, pickup_time, order_id } = req.query
        sequelize.query(`
            SELECT orders.*, 
            CASE 
            WHEN orders.is_to_go = 'to-go' 
            THEN drink.name
            ELSE 'N/A'
            END AS drink_name,
            CASE 
            WHEN orders.is_to_go = 'to-go'
            THEN pickup_time.time
            ELSE 'N/A'
            END AS pickup_time
            FROM orders
            LEFT JOIN drink ON drink.id = orders.drink_name
            LEFT JOIN pickup_time ON pickup_time.id = orders.pickup_time
            WHERE 
              (orders.is_to_go = 'to-go' AND drink.id = ${drink_name} AND pickup_time.id = ${pickup_time})
            OR 
              (orders.is_to_go = 'dine-in' AND orders.id = ${order_id})
            `)
          .then((dbResult) => {
            res.status(200).send(dbResult[0])
          })
          .catch((error) => {
            console.error(error)
            res.status(500).send("Error retrieving order")
          })
      }
}
