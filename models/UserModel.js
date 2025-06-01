// models/UserModel.js
import { Sequelize, DataTypes } from "sequelize";
import db from "../config/Database.js";

const User = db.define('users', {
    uuid: {
        type: DataTypes.STRING,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true,
            len: [3, 100]
        }
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            notEmpty: true,
            isEmail: true
        }
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    role: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    // --- KOLOM PROFIL UTAMA (DIGABUNGKAN KEMBALI) ---
    foto_profile: {
        type: DataTypes.STRING, // Path atau URL ke file foto profil
        allowNull: true,
        defaultValue: null
    },
    url_foto_profile: {
        type: DataTypes.STRING, // URL publik untuk foto profil
        allowNull: true,
        defaultValue: null
    },
    foto_sampul: {
        type: DataTypes.STRING, // Path atau URL ke file foto sampul
        allowNull: true,
        defaultValue: null
    },
    url_foto_sampul: {
        type: DataTypes.STRING, // URL publik untuk foto sampul
        allowNull: true,
        defaultValue: null
    },
    bio: {
        type: DataTypes.TEXT,
        allowNull: true,
        defaultValue: null
    },
    ttl: {
        type: DataTypes.DATEONLY,
        allowNull: true,
        defaultValue: null
    },
    jenis_kelamin: {
        type: DataTypes.ENUM('Laki-laki', 'Perempuan'),
        allowNull: true,
        defaultValue: null
    },
    alamat: {
        type: DataTypes.TEXT,
        allowNull: true,
        defaultValue: null
    },
    no_telp: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: null,
        validate: {
            is: /^[0-9+]*$/
        }
    },
    nama_institusi: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: null
    },
    prodi: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: null
    },
    fakultas: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: null
    },
    semester: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: null,
        validate: {
            min: 1,
            max: 14
        }
    },
    ipk: {
        type: DataTypes.DECIMAL(3, 2),
        allowNull: true,
        defaultValue: null,
        validate: {
            min: 0.00,
            max: 4.00
        }
    },
    minat_bidang: {
        type: DataTypes.ENUM(
            'Teknologi Informasi & Digital',
            'Bisnis & Manajemen',
            'Kreatif & Media',
            'Kesehatan & Sosial',
            'Pendidikan & Penelitian',
            'Lingkungan & Sosial',
            'Sains & Matematika',
            'Hukum & Kebijakan Publik'
        ),
        allowNull: true,
        defaultValue: null
    },
    rencana: {
        type: DataTypes.TEXT,
        allowNull: true,
        defaultValue: null
    },
    motivator_karir: {
        type: DataTypes.TEXT,
        allowNull: true,
        defaultValue: null
    },
    // --- KOLOM UNTUK TRACKING/AUDIT ---
    last_login_at: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: null
    },
    is_active: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
    },
    verified_at: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: null
    }
}, {
    freezeTableName: true,
    timestamps: true,
});

export default User;