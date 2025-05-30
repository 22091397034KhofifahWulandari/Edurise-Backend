// models/BeasiswaModel.js
import { Sequelize } from "sequelize";
import db from "../config/Database.js";

const { DataTypes } = Sequelize;

const Beasiswa = db.define('beasiswa', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    img: { // Sesuai dengan 'img' di skema SQL
        type: DataTypes.STRING,
        allowNull: true
    },
    title: { // Sesuai dengan 'title' di skema SQL
        type: DataTypes.STRING,
        allowNull: true // Default NULL di SQL, jadi di model juga allowNull true
    },
    description: { // Sesuai dengan 'description' di skema SQL (sebelumnya 'deskripsi')
        type: DataTypes.TEXT,
        allowNull: true
    },
    detail: { // Kolom baru sesuai 'detail' di skema SQL
        type: DataTypes.TEXT,
        allowNull: true
    },
    kategori: { // Kolom baru sesuai 'kategori' di skema SQL
        type: DataTypes.STRING(50), // Batas panjang 50 karakter seperti di SQL
        allowNull: true
    },
    jenjang: { // Kolom baru sesuai 'jenjang' di skema SQL
        type: DataTypes.STRING(20), // Batas panjang 20 karakter seperti di SQL
        allowNull: true
    },
    lokasi: { // Kolom baru sesuai 'lokasi' di skema SQL
        type: DataTypes.STRING(100), // Batas panjang 100 karakter seperti di SQL
        allowNull: true
    },
    deadline: { // Sesuai dengan 'deadline' di skema SQL (sebelumnya 'timeline')
        type: DataTypes.STRING(50), // Batas panjang 50 karakter seperti di SQL
        allowNull: true
    },
}, {
    freezeTableName: true
});

export default Beasiswa;