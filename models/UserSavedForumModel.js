// models/UserSavedForumModel.js
import { Sequelize } from "sequelize";
import db from "../config/Database.js";

const { DataTypes } = Sequelize;

const UserSavedForum = db.define('user_saved_forum', {
    userId: {
        type: DataTypes.INTEGER,
        primaryKey: true, // Bagian dari composite primary key
        allowNull: false
    },
    forumId: {
        type: DataTypes.INTEGER,
        primaryKey: true, // Bagian dari composite primary key
        allowNull: false
    }
    // Sequelize akan otomatis menambahkan createdAt dan updatedAt jika tidak diatur false
}, {
    freezeTableName: true
});

export default UserSavedForum;