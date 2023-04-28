const { DataTypes } = require('sequelize')
const sequelize = require('../config/db.config')

const Payment = sequelize.define('payment', {
    id: {
        type: DataTypes.BIGINT(20).UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
        unique: true
    },
    transaction_reference: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false
    },
    currency: {
        type: DataTypes.STRING(10),
        allowNull: false
    },
    amount: {
        type: DataTypes.DECIMAL(10, 2).UNSIGNED,
        allowNull: false
    },
    status: {
        type: DataTypes.STRING(20),
        allowNull: false
    },
    meta: {
        type: DataTypes.STRING(500)
    }
}, {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
})


module.exports = Payment