const { DataTypes } = require('sequelize')
const sequelize = require('../config/db.config')
const { Shop } = require('../models/Shops.model')

const Item = sequelize.define('item', {
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
    slug: {
        type: DataTypes.STRING(500),
        allowNull: false,
        unique: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.STRING(10000),
        allowNull: false
    },
    note: {
        type: DataTypes.STRING(2000),
    },
    brand: {
        type: DataTypes.STRING,
    },
    category: {
        type: DataTypes.STRING(10),
        allowNull: false
    },
    item_condition: {
        type: DataTypes.STRING(10),
        allowNull: false
    },
    currency: {
        type: DataTypes.STRING(10),
        allowNull: false
    },
    price: {
        type: DataTypes.DECIMAL(10, 2).UNSIGNED,
        allowNull: false
    },
    compare_at_price: {
        type: DataTypes.DECIMAL(10, 2).UNSIGNED,
        allowNull: false
    },
    discount_price: {
        type: DataTypes.DECIMAL(10, 2).UNSIGNED
    },
    discount_percent: {
        type: DataTypes.INTEGER.UNSIGNED
    },
    quantity: {
        type: DataTypes.STRING(10),
        allowNull: false
    },
    stock: {
        type: DataTypes.INTEGER.UNSIGNED
    },
    featured: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    }
}, {
    paranoid: true,
    deletedAt: 'deleted_at',
    createdAt: 'created_at',
    updatedAt: 'updated_at'
})

// item images table
const ItemImage = sequelize.define('item_image', {
    id: {
        type: DataTypes.BIGINT(20).UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
        unique: true
    },
    image: {
        type: DataTypes.STRING(100),
        allowNull: false
    }
}, {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
})

// item options table
const ItemOption = sequelize.define('item_option', {
    id: {
        type: DataTypes.BIGINT(20).UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
        unique: true
    },
    name: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    options: {
        type: DataTypes.STRING(500),
        allowNull: false
    }
}, {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
})


/** 
 * -------------------------------------
 * ITEM ASSOCIATIONS BEGINS HERE
 * -------------------------------------
*/
Item.belongsTo(Shop, {
    foreignKey: 'shop_id',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
})
Shop.hasMany(Item, {
    foreignKey: 'shop_id',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
})


Item.hasMany(ItemImage, {
    foreignKey: 'item_id',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
})
ItemImage.belongsTo(Item, {
    foreignKey: 'item_id',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
})


Item.hasMany(ItemOption, {
    foreignKey: 'item_id',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
})
ItemOption.belongsTo(Item, {
    foreignKey: 'item_id',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
})


module.exports = {
    Item,
    ItemImage,
    ItemOption
}