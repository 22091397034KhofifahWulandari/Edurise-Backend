// models/ForumModel.js
import { Sequelize } from "sequelize";
import db from "../config/Database.js";

const { DataTypes } = Sequelize;

const Forum = db.define('forum', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    userId: { // ID Pembuat Forum (foreign key ke User)
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    judul: { // Judul Forum
        type: DataTypes.STRING,
        allowNull: false
    },
    konten: { // ISI/DESKRIPSI FORUM (DIKEMBALIKAN DARI 'DESKRIPSI' MENJADI 'KONTEN')
        type: DataTypes.TEXT,
        allowNull: false
    },
    nama_pembuat_forum: { // Nama Pembuat Forum (denormalized untuk kemudahan data)
        type: DataTypes.STRING,
        allowNull: false
    },
    anggota_di_forum: { // Daftar Anggota (representasi sederhana, idealnya melalui tabel relasi Many-to-Many)
        type: DataTypes.TEXT, // Akan berisi daftar nama/ID anggota yang dipisahkan koma
        allowNull: true // Bisa kosong jika belum ada anggota
    },
    kategori: { // Kategori Forum dengan pilihan ENUM
        type: DataTypes.ENUM(
            'Computer',
            'Desain UI/UX',
            'Digital Marketing',
            'Sains',
            'Bisnis'
        ),
        allowNull: false
    },
    // Sequelize akan otomatis menambahkan createdAt dan updatedAt
}, {
    freezeTableName: true
});

export default Forum;