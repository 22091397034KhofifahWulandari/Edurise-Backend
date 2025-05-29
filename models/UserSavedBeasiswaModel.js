import { Sequelize } from "sequelize";
import db from "../config/Database.js";

const { DataTypes } = Sequelize;

const UserSavedBeasiswa = db.define('user_saved_beasiswa', {
  userId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
  },
  beasiswaId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
  },
}, {
  freezeTableName: true
});

export default UserSavedBeasiswa;