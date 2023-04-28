const { DataTypes } = require('sequelize')
const sequelize = require('../config/db.config')
const { User } = require('../models/Users.model')
const { Item } = require('../models/Items.model')
const Order = require('../models/Orders.model')

// item rating and review table
const ItemRatingsAndReview = sequelize.define('item_ratings_and_reviews', {
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
    },
    order_id: {
        type: DataTypes.BIGINT(20).UNSIGNED,
        allowNull: false,
        unique: true
    },
    star_rating: {
        type: DataTypes.INTEGER(2).UNSIGNED,
        allowNull: false
    },
    review_title: {
        type: DataTypes.STRING
    },
    review: {
        type: DataTypes.STRING(500)
    },
    review_name: {
        type: DataTypes.STRING
    }
}, {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
})


/** 
 * -------------------------------------
 * ITEM RATINGS AND REVIEWS ASSOCIATIONS BEGINS HERE
 * -------------------------------------
 * Do not use many to many association
 * because it does not allow direct eager 
 * loading of this table.
*/

ItemRatingsAndReview.belongsTo(User, {
    foreignKey: 'user_id',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
})
User.hasMany(ItemRatingsAndReview, {
    foreignKey: 'user_id',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
})


ItemRatingsAndReview.belongsTo(Item, {
    foreignKey: 'item_id',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
})
Item.hasOne(ItemRatingsAndReview, {
    foreignKey: 'item_id',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
})


ItemRatingsAndReview.belongsTo(Order, {
    foreignKey: 'order_id',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
})
Order.hasOne(ItemRatingsAndReview, {
    foreignKey: 'order_id',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
})

module.exports = ItemRatingsAndReview