const { DataTypes } = require('sequelize');
const name = 'users';
const excludeField = ['password'];
const scopeAttributes = {};
module.exports = userModel;

function userModel(sequelize) {
    const attributes = {
        email: { type: DataTypes.STRING, allowNull: false },
        password: { type: DataTypes.STRING, allowNull: false }
    };

    const options = {
        defaultScope: { attributes: { exclude: excludeField }},
        scopes: { withHash: { attributes: scopeAttributes }}
    };

    return sequelize.define(name, attributes, options);
}
