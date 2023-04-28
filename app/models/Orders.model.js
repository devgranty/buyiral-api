const { DataTypes } = require('sequelize')
const sequelize = require('../config/db.config')
const { User } = require('../models/Users.model')
const { Shop } = require('../models/Shops.model')
const { Item } = require('../models/Items.model')

const Order = sequelize.define('order', {
    id: {
        type: DataTypes.BIGINT(20).UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
        unique: true
    },
    order_id: {
        type: DataTypes.STRING,
        allowNull: false
    },
    user_id: {
        type: DataTypes.BIGINT(20).UNSIGNED,
        allowNull: false
    },
    shop_id: {
        type: DataTypes.BIGINT(20).UNSIGNED,
        allowNull: false
    },
    item_id: {
        type: DataTypes.BIGINT(20).UNSIGNED,
        allowNull: false
    },
    transaction_reference: {
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
    attributes: {
        type: DataTypes.STRING(1000)
    },
    quantity: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false
    },
    country: {
        type: DataTypes.STRING(30),
        allowNull: false
    },
    state: {
        type: DataTypes.STRING(30),
        allowNull: false
    },
    shipping_address: {
        type: DataTypes.STRING(2000),
        allowNull: false
    },
    shipping_method: {
        type: DataTypes.STRING,
        allowNull: false
    },
    shipping_fee: {
        type: DataTypes.DECIMAL(10, 2).UNSIGNED,
        allowNull: false
    },
    delivery_date: {
        type: DataTypes.DATE,
        allowNull: false
    },
    status: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    status_history: {
        type: DataTypes.STRING(1000),
        allowNull: false
    }
}, {
    paranoid: true,
    deletedAt: 'deleted_at',
    createdAt: 'created_at',
    updatedAt: 'updated_at'
})


/** 
 * -------------------------------------
 * ORDER ASSOCIATIONS BEGINS HERE
 * -------------------------------------
*/
Order.belongsTo(User, {
    foreignKey: 'user_id',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
})
User.hasMany(Order, {
    foreignKey: 'user_id',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
})


Order.belongsTo(Shop, {
    foreignKey: 'shop_id',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
})
Shop.hasOne(Order, {
    foreignKey: 'shop_id',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
})


Order.belongsTo(Item, {
    foreignKey: 'item_id',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
})
Item.hasMany(Order, {
    foreignKey: 'item_id',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
})


module.exports = Order