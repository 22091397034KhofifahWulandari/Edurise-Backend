// models/KompetisiModel.js
import { Sequelize } from "sequelize";
import db from "../config/Database.js";

const { DataTypes } = Sequelize;

const Kompetisi = db.define('kompetisi', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  poster_gambar: {
    type: DataTypes.STRING, // URL atau path ke gambar
    allowNull: true
  },
  judul: {
    type: DataTypes.STRING,
    allowNull: false
  },
  tanggal: { // Tanggal pelaksanaan/pendaftaran. Bisa String (e.g., "1-30 Juni 2024")
    type: DataTypes.STRING,
    allowNull: true
  },
  biaya: { // Gratis atau berbayar
    type: DataTypes.STRING, // Contoh: "Gratis", "Rp 50.000", "Rp 100.000 / tim"
    allowNull: true
  },
  tingkat_kompetisi: { // Nasional, Internasional, Provinsi, Regional, Internal Kampus
    type: DataTypes.STRING,
    allowNull: true
  },
  tentang_kompetisi: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  syarat: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  ketentuan_kompetisi: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  benefit: {
    type: DataTypes.TEXT,
    allowNull: true
  },
}, {
  freezeTableName: true
});

export default Kompetisi;