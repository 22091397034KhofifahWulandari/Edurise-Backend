import { Sequelize } from "sequelize";
import db from "../config/Database.js";

const { DataTypes } = Sequelize;

const Portofolio = db.define('portofolio', {
    id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    
    portofolio_pdf: DataTypes.STRING,
    judul_porto: DataTypes.STRING,
    tools_porto: DataTypes.STRING,
    tahun_porto: DataTypes.INTEGER,
    deskripsi_porto: DataTypes.TEXT
}, {
    freezeTableName: true
});

export default Portofolio;

