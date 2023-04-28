const { DataTypes } = require('sequelize')
const sequelize = require('../config/db.config')
const { User } = require('../models/Users.model')

const Shop = sequelize.define('shop', {
    id: {
        type: DataTypes.BIGINT(20).UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
        unique: true
    },
    slug: {
        type: DataTypes.STRING(500),
        allowNull: false,
        unique: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    logo: {
        type: DataTypes.STRING(100)
    },
    tagline: {
        type: DataTypes.STRING(500)
    },
    description: {
        type: DataTypes.STRING(1000),
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    email_verified_at: {
        type: DataTypes.DATE
    },
    phone_number: {
        type: DataTypes.STRING(20),
        allowNull: false
    },
    whatsapp: {
        type: DataTypes.STRING(20)
    },
    twitter: {
        type: DataTypes.STRING(50)
    },
    country: {
        type: DataTypes.STRING(30),
        allowNull: false
    },
    state: {
        type: DataTypes.STRING(30),
        allowNull: false
    },
    address: {
        type: DataTypes.STRING(500),
        allowNull: false
    },
    currency: {
        type: DataTypes.STRING(10),
        allowNull: false
    },
    bank_name: {
        type: DataTypes.STRING(50)
    },
    account_number: {
        type: DataTypes.STRING(20)
    },
    account_name: {
        type: DataTypes.STRING(500)
    }
}, {
    paranoid: true,
    deletedAt: 'deleted_at',
    createdAt: 'created_at',
    updatedAt: 'updated_at'
})

// shop subscriptions table
const ShopSubscription = sequelize.define('shop_subscription', {
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
    name: {
        type: DataTypes.STRING(20),
        allowNull: false
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
    transaction_reference: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    expires_on: {
        type: DataTypes.DATE,
        allowNull: false
    }
}, {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
})

// shop employees table
// Automatically created and handled by Sequelize
// via the through key
const ShopEmployee = sequelize.define('shop_employees', {
    id: {
        type: DataTypes.BIGINT(20).UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
        unique: true
    },
    role: {
        type: DataTypes.STRING(10),
        allowNull: false
    }
}, {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
})


/** 
 * -------------------------------------
 * SHOPS ASSOCIATIONS BEGINS HERE
 * -------------------------------------
*/
Shop.hasOne(ShopSubscription, {
    foreignKey: 'shop_id',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
})
ShopSubscription.belongsTo(Shop, {
    foreignKey: 'shop_id',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
})


// we don't want shops to show employees
// we want user to show which shops they work for
Shop.belongsToMany(User, {
    through: 'shop_employees',
    foreignKey: 'shop_id',
    otherKey: 'user_id',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
})
User.belongsToMany(Shop, {
    through: 'shop_employees',
    foreignKey: 'user_id',
    otherKey: 'shop_id',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
})

module.exports = {
    Shop,
    ShopSubscription,
    ShopEmployee
}