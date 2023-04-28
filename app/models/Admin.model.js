const bcrypt = require('bcrypt')
const { DataTypes } = require('sequelize')
const sequelize = require('../config/db.config')

const Admin = sequelize.define('admin', {
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
    phone_number: {
        type: DataTypes.STRING(20),
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
    department: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
        set(value){
            this.setDataValue('password', bcrypt.hashSync(value, 10))
        }
    }
}, {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
})



const AdminLog = sequelize.define('admin_log', {
    id: {
        type: DataTypes.BIGINT(20).UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
        unique: true   
    },
    action: {
        type: DataTypes.STRING,
        allowNull: false
    },
    admin_id: {
        type: DataTypes.BIGINT(20).UNSIGNED,
        allowNull: false
    }
}, {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
})



/** 
 * -------------------------------------
 * ADMIN LOGS ASSOCIATIONS BEGINS HERE
 * -------------------------------------
*/
AdminLog.belongsTo(Admin, {
    foreignKey: 'admin_id',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
})
Admin.hasMany(AdminLog, {
    foreignKey: 'admin_id',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
})


module.exports = {
    Admin,
    AdminLog
}