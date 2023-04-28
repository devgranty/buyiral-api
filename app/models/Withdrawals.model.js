const { DataTypes } = require('sequelize')
const sequelize = require('../config/db.config')
const { Shop } = require('./Shops.model')

const Withdrawal = sequelize.define('withdrawal', {
    id: {
        type: DataTypes.BIGINT(20).UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
        unique: true
    },
    shop_id: {
        type: DataTypes.BIGINT(20).UNSIGNED,
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
    transaction_reference: {
        type: DataTypes.STRING,
        allowNull: false
    },
    status: {
        type: DataTypes.STRING(50),
        allowNull: false
    }
}, {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
})



/** 
 * -------------------------------------
 * WITHDRAWAL ASSOCIATIONS BEGINS HERE
 * -------------------------------------
*/
Withdrawal.belongsTo(Shop, {
    foreignKey: 'shop_id',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
})
Shop.hasOne(Withdrawal, {
    foreignKey: 'shop_id',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
})


module.exports = Withdrawal