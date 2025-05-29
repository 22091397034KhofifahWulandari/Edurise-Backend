// models/ArticleModel.js
import { Sequelize } from "sequelize";
import db from "../config/Database.js";

const { DataTypes } = Sequelize;

const Article = db.define('articles', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    judul: {
        type: DataTypes.STRING,
        allowNull: false
    },
    deskripsi: { // Kolom yang sudah ada
        type: DataTypes.TEXT,
        allowNull: true
    },
    gambar: { // Kolom yang sudah ada
        type: DataTypes.STRING,
        allowNull: true
    },
    link: { // Kolom yang sudah ada dan unique
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    penulis: { // Kolom BARU: Penulis Artikel
        type: DataTypes.STRING,
        allowNull: false // Penulis harus diisi
    },
    kategori: { // Kolom BARU: Kategori Artikel dengan ENUM
        type: DataTypes.ENUM(
            'Beasiswa & Pendidikan',
            'Pengembangan Diri & Karir',
            'Tips Belajar & Produktivitas'
        ),
        allowNull: false // Kategori harus diisi
    },
}, {
    freezeTableName: true
});

export default Article;