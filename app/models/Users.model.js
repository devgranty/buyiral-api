const bcrypt = require('bcrypt')
const { DataTypes } = require('sequelize')
const sequelize = require('../config/db.config')

const User = sequelize.define('user', {
    id: {
        type: DataTypes.BIGINT(20).UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
        unique: true
    },
    first_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    last_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
        set(value){
            this.setDataValue('password', bcrypt.hashSync(value, 10))
        }
    }
}, {
    paranoid: true,
    deletedAt: 'deleted_at',
    createdAt: 'created_at',
    updatedAt: 'updated_at'
})

// user addresses
const UserAddresses = sequelize.define('user_address', {
    id: {
        type: DataTypes.BIGINT(20).UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
        unique: true
    },
    first_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    last_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    address: {
        type: DataTypes.STRING(500),
        allowNull: false
    },
    city: {
        type: DataTypes.STRING,
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
    phone_number: {
        type: DataTypes.STRING(20),
        allowNull: false
    },
    additional_information: {
        type: DataTypes.STRING(500)
    },
    _default: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    }
}, {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
})



/** 
 * -------------------------------------
 * USER ASSOCIATIONS BEGINS HERE
 * -------------------------------------
*/
User.hasMany(UserAddresses, {
    foreignKey: 'user_id',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
})
UserAddresses.belongsTo(User, {
    foreignKey: 'user_id',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
})

module.exports = {
    User,
    UserAddresses
}