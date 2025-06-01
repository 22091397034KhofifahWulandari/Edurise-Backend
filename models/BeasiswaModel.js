// models/BeasiswaModel.js
import { Sequelize } from "sequelize";
import db from "../config/Database.js";

const { DataTypes } = Sequelize;

const Beasiswa = db.define('beasiswa', {
    uuid:{
        type: DataTypes.STRING,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    img: {
        type: DataTypes.STRING,
        allowNull: true
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true,
            len: [3, 255]
        }
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    detail: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    kategori: {
        type: DataTypes.ENUM(
            'Dalam Negeri',
            'Luar Negeri'
            // Tambahkan kategori lain jika ada
        ),
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    jenjang: {
        type: DataTypes.ENUM(
            'SMA/SMK',
            'D3',
            'S1',
            'S2',
            'S3'
        ),
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    lokasi: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true,
            len: [3, 100]
        }
    },
    deadline: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        validate: {
            notEmpty: true,
            isDate: true
        }
    }
}, {
    freezeTableName: true
});

export default Beasiswa;