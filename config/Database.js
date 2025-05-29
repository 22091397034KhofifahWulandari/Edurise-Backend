import { Sequelize } from "sequelize";

const db = new Sequelize ('profile_db','root','', {
    host: 'localhost',
    dialect: 'mysql'
});

export default db;