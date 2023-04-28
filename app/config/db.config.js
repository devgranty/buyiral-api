const { Sequelize } = require('sequelize')

const sequelize = new Sequelize(process.env.DB, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    dialect: 'mysql',
    // logging: function(text){
    //     console.log(text);
    // },
    logging: false,
    // operatorsAliases: false,
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
})

sequelize.authenticate()
.then(() => {
    console.log('Connected to database')
})
.catch((err) => {
    console.log('Error: ' + err)
})

// sequelize.sync()

module.exports = sequelize