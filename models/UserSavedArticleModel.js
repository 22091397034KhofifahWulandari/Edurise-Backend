import { Sequelize } from "sequelize";
import db from "../config/Database.js";
import User from "./UserModel.js";
import Article from "./ArticleModel.js";

const { DataTypes } = Sequelize;

const UserSavedArticle = db.define('user_saved_articles', {
  userId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    references: {
      model: User,
      key: 'id'
    }
  },
  articleId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    references: {
      model: Article,
      key: 'id'
    }
  },
}, {
  freezeTableName: true
});

export default UserSavedArticle;