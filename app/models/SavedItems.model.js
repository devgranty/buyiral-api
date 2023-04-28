const { DataTypes } = require('sequelize')
const sequelize = require('../config/db.config')
const { User } = require('../models/Users.model')
const { Item } = require('../models/Items.model')

const SavedItem = sequelize.define('saved_item', {
    id: {
        type: DataTypes.BIGINT(20).UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
        unique: true
    },
    user_id: {
        type: DataTypes.BIGINT(20).UNSIGNED,
        allowNull: false
    },
    item_id: {
        type: DataTypes.BIGINT(20).UNSIGNED,
        allowNull: false
    }
}, {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
})


/** 
 * -------------------------------------
 * SAVED ITEMS ASSOCIATIONS BEGINS HERE
 * -------------------------------------
 * Do not use many to many association
 * because it does not allow eager loading
 * of user & item.
*/
SavedItem.belongsTo(User, {
    foreignKey: 'user_id',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
})
User.hasOne(SavedItem, {
    foreignKey: 'user_id',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
})


SavedItem.belongsTo(Item, {
    foreignKey: 'item_id',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
})
Item.hasOne(SavedItem, {
    foreignKey: 'item_id',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
})


module.exports = SavedItem