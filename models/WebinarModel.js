// models/WebinarModel.js
import { Sequelize } from "sequelize";
import db from "../config/Database.js";

const { DataTypes } = Sequelize;

const Webinar = db.define('webinar', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    poster: { // URL atau path ke gambar poster webinar
        type: DataTypes.STRING,
        allowNull: true
    },
    judul: { // Judul webinar
        type: DataTypes.STRING,
        allowNull: false
    },
    deskripsi: { // Deskripsi lengkap webinar
        type: DataTypes.TEXT,
        allowNull: false
    },
    tanggal: { // Tanggal pelaksanaan (e.g., "20 Juni 2025")
        type: DataTypes.STRING,
        allowNull: false
    },
    jam_pelaksanaan: { // Jam pelaksanaan (e.g., "14.00 - 16.00 WIB")
        type: DataTypes.STRING,
        allowNull: false
    },
    narasumber: { // Nama narasumber, bisa lebih dari satu (e.g., "Dr. Budi Santoso, S.Kom., M.TI")
        type: DataTypes.TEXT,
        allowNull: false
    },
    link_zoom: { // URL link Zoom/Google Meet/lainnya
        type: DataTypes.STRING,
        allowNull: true
    },
    rekaman_url: { // URL rekaman webinar setelah selesai
        type: DataTypes.STRING,
        allowNull: true // Default null, akan diisi setelah webinar
    },
    sertifikat_url: { // URL untuk mengunduh sertifikat
        type: DataTypes.STRING,
        allowNull: true // Default null, akan diisi setelah webinar
    },
    penyedia_acara: { // Nama organisasi/perusahaan penyedia acara
        type: DataTypes.STRING,
        allowNull: false
    },
    status: { // Status webinar: upcoming, completed, cancelled
        type: DataTypes.ENUM('upcoming', 'completed', 'cancelled'),
        allowNull: false,
        defaultValue: 'upcoming' // Default status saat webinar dibuat
    }
}, {
    freezeTableName: true
});

export default Webinar;