import { Sequelize } from "sequelize";
import db from "../config/Database.js";

const { DataTypes } = Sequelize;

const OrangTua = db.define('orangtua', {
    id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
    },
    userId: {
    type: DataTypes.INTEGER,
    allowNull: false
    },

    tipe: DataTypes.ENUM('Ayah', 'Ibu'),
    nama: DataTypes.STRING,
    ttl: DataTypes.DATEONLY,
    alamat: DataTypes.TEXT,
    no_telp: DataTypes.STRING,
    pendidikan: DataTypes.STRING,
    pekerjaan: DataTypes.STRING,
    penghasilan: DataTypes.INTEGER
}, {
    freezeTableName: true
});

export default OrangTua;

