const config = require('config.json');
const mysql = require('mysql2/promise');
const { Sequelize } = require('sequelize');
module.exports = apiDatabase = {Users:null};

connect().then(future => {});
async function connect() {
    const { host, port, user, password, database } = config.database;
    const connection = await mysql.createConnection({ host, port, user, password });
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${database}\`;`);

    const sequelize = new Sequelize(database, user, password, { dialect: 'mysql' });
    apiDatabase.Users = require('../models/user_model')(sequelize);
    await sequelize.sync();
}
