// models/ForumModel.js
import { Sequelize } from "sequelize";
import db from "../config/Database.js";

const { DataTypes } = Sequelize;

const Forum = db.define('forum', {
    uuid:{
        type: DataTypes.STRING,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        unique: true,
        validate: {
            notEmpty: true
        }
    },
    userId: { // ID Pembuat Forum (foreign key ke User)
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    judul: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true,
            len: [5, 255]
        }
    },
    konten: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    // HAPUS kolom nama_pembuat_forum di sini
    kategori: {
        type: DataTypes.ENUM(
            'Computer',
            'Desain UI/UX',
            'Digital Marketing',
            'Sains',
            'Bisnis',
            'Lainnya'
        ),
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
}, {
    freezeTableName: true
});

export default Forum;