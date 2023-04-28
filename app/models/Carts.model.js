const { DataTypes } = require('sequelize')
const sequelize = require('../config/db.config')
const { Item } = require('../models/Items.model')

const Cart = sequelize.define('cart', {
    id: {
        type: DataTypes.BIGINT(20).UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
        unique: true
    },
    user_id: {
        type: DataTypes.STRING,
        allowNull: false
    },
    item_id: {
        type: DataTypes.BIGINT(20).UNSIGNED,
        allowNull: false
    },
    attributes: {
        type: DataTypes.STRING(1000)
    },
    quantity: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false
    }
}, {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
})


/** 
 * -------------------------------------
 * CARTS ASSOCIATIONS BEGINS HERE
 * -------------------------------------
 * Do not use many to many association
 * because it does not allow eager loading
 * of item.
*/
Cart.belongsTo(Item, {
    foreignKey: 'item_id',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
})
Item.hasOne(Cart, {
    foreignKey: 'item_id',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
})


module.exports = Cart