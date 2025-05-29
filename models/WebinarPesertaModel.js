// models/WebinarPesertaModel.js
import { Sequelize } from "sequelize";
import db from "../config/Database.js";

const { DataTypes } = Sequelize;

const WebinarPeserta = db.define('webinar_peserta', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    webinarId: { // Foreign Key ke Webinar
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    userId: { // Foreign Key ke User (opsional, jika user yang login mendaftar)
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    nama: {
        type: DataTypes.STRING,
        allowNull: false
    },
    jenjang_pendidikan: {
        type: DataTypes.ENUM('SMA/SMK', 'D3', 'S1', 'S2', 'S3'),
        allowNull: false
    },
    instansi_pendidikan: { // Ubah menjadi STRING agar lebih fleksibel
        type: DataTypes.STRING,
        allowNull: false
    },
    jurusan: { // Ubah menjadi STRING agar lebih fleksibel
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: false // Tidak perlu unique di sini, karena satu email bisa daftar banyak webinar. Unik per webinar bisa diatur di controller.
    },
    alasan_mengikuti_webinar: {
        type: DataTypes.TEXT,
        allowNull: true
    }
}, {
    freezeTableName: true,
    // Menambahkan unique constraint pada kombinasi webinarId dan email
    // Ini memastikan satu email hanya bisa mendaftar satu kali untuk webinar yang sama
    indexes: [
        {
            unique: true,
            fields: ['webinarId', 'email']
        }
    ]
});

export default WebinarPeserta;