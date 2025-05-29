// models/KompetisiRegistrasiModel.js
import { Sequelize } from "sequelize";
import db from "../config/Database.js";

const { DataTypes } = Sequelize;

const KompetisiRegistrasi = db.define('kompetisi_registrasi', {
  userId: {
    type: DataTypes.INTEGER,
    primaryKey: true, // Bagian dari composite primary key
    allowNull: false,
  },
  kompetisiId: {
    type: DataTypes.INTEGER,
    primaryKey: true, // Bagian dari composite primary key
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
  // --- TAMBAHAN KOLOM UNTUK FORM PENDAFTARAN ---
  nama_lengkap: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  jenjang_pendidikan: {
    type: DataTypes.STRING, // Contoh: SMA, D3, S1, S2
    allowNull: true,
  },
  instansi_pendidikan: {
    type: DataTypes.STRING, // Nama sekolah/universitas
    allowNull: true,
  },
  jurusan: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  no_telp: {
    type: DataTypes.STRING, // Format nomor telepon
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isEmail: true, // Validasi format email
    }
  },
  alasan_mengikuti: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  // ---------------------------------------------
}, {
  freezeTableName: true
});

export default KompetisiRegistrasi;