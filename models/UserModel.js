import { Sequelize } from "sequelize";
import db from "../config/Database.js";

const { DataTypes } = Sequelize;

const User = db.define('users', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nama: DataTypes.STRING,
    // Menambahkan kolom untuk foto profil
    foto_profile: {
        type: DataTypes.STRING,
        allowNull: true // Bisa dikosongkan jika user belum mengunggah
    },
    // Menambahkan kolom untuk foto sampul
    foto_sampul: {
        type: DataTypes.STRING,
        allowNull: true // Bisa dikosongkan jika user belum mengunggah
    },
    bio: DataTypes.STRING,
    ttl: DataTypes.DATEONLY,
    jenis_kelamin: DataTypes.ENUM('Laki-laki', 'Perempuan'),
    alamat: DataTypes.TEXT,
    no_telp: DataTypes.STRING,
    email: DataTypes.STRING,
    nama_institusi: DataTypes.STRING,
    prodi: DataTypes.STRING,
    fakultas: DataTypes.STRING,
    semester: DataTypes.INTEGER,
    ipk: DataTypes.DECIMAL(3, 2),
    minat_bidang: DataTypes.ENUM(
        'Teknologi Informasi & Digital',
        'Bisnis & Manajemen',
        'Kreatif & Media',
        'Kesehatan & Sosial',
        'Pendidikan & Penelitian',
        'Lingkungan & Sosial'
    ),
    rencana: DataTypes.TEXT,
    motivator_karir: DataTypes.TEXT
}, {
    freezeTableName: true
});

export default User;