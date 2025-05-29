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
    poster_gambar: { // Kolom baru untuk gambar poster
        type: DataTypes.STRING,
        allowNull: true // Boleh kosong jika tidak ada gambar
    },
    judul: {
        type: DataTypes.STRING,
        allowNull: false
    },
    deskripsi: { // Menggunakan 'deskripsi' sesuai model Anda
        type: DataTypes.TEXT,
        allowNull: true
    },
    persyaratan: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    manfaat: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    timeline: { // Sesuai model Anda
        type: DataTypes.STRING,
        allowNull: true
    },
    cara_daftar: {
        type: DataTypes.TEXT,
        allowNull: true
    },
}, {
    freezeTableName: true
});

export default Beasiswa;