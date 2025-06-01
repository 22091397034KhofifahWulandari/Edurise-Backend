// models/UserSavedArticleModel.js
import { Sequelize, DataTypes } from "sequelize";
import db from "../config/Database.js";

const UserSavedArticle = db.define('user_saved_articles', {
    // Menghilangkan kolom 'uuid' di sini
    savedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        allowNull: false
    }
}, {
    freezeTableName: true,
    timestamps: false, // Matikan timestamps default Sequelize (createdAt, updatedAt)
    indexes: [
        {
            unique: true,
            fields: ['userId', 'articleId'] // Pastikan kombinasi userId dan articleId unik
        }
    ]
});


export default UserSavedArticle;