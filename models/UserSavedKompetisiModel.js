// models/UserSavedKompetisiModel.js
import { Sequelize, DataTypes } from "sequelize";
import db from "../config/Database.js";
import UserModel from "./UserModel.js";
import KompetisiModel from "./KompetisiModel.js";

const UserSavedKompetisi = db.define('user_saved_kompetisi', {
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
    // Anda bisa menambahkan kolom lain jika diperlukan, misal: 'tanggal_disimpan'
    // tanggal_disimpan: {
    //     type: DataTypes.DATE,
    //     defaultValue: DataTypes.NOW,
    //     allowNull: false
    // }
}, {
    freezeTableName: true,
    timestamps: true // Biarkan timestamps untuk createdAt dan updatedAt otomatis
});

// Definisi relasi di sini memastikan bahwa ketika model ini disinkronkan,
// Sequelize tahu tentang foreign keys.
UserSavedKompetisi.belongsTo(UserModel, { foreignKey: 'userId' });
UserSavedKompetisi.belongsTo(KompetisiModel, { foreignKey: 'kompetisiId' });

export default UserSavedKompetisi;