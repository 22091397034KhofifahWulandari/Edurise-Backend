// models/KompetisiRegistrasiModel.js
import { Sequelize, DataTypes } from "sequelize"; // DataTypes sudah diimpor di sini
import db from "../config/Database.js";

const KompetisiRegistrasi = db.define('kompetisi_registrasi', {
    userId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
    },
    kompetisiId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
    },
    status_pendaftaran: {
        type: DataTypes.ENUM('diproses', 'seleksi berkas', 'diterima', 'ditolak'),
        allowNull: false,
        defaultValue: 'diproses'
    },
    tanggal_pendaftaran: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    },
    nama_lengkap: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    jenjang_pendidikan: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    instansi_pendidikan: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    jurusan: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    no_telp: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING, // <--- PERBAIKANNYA DI SINI
        allowNull: false,
        validate: {
            isEmail: true,
        }
    },
    alasan_mengikuti: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
}, {
    freezeTableName: true,
    timestamps: false
});

export default KompetisiRegistrasi;