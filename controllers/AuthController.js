import User from "../models/UserModel.js";
import argon2 from "argon2";
import ForumModel from "../models/ForumModel.js"; // Import ForumModel

export const Login = async (req, res) => {
    const user = await User.findOne({
        where: {
            email: req.body.email
        }
    });
    if (!user) return res.status(404).json({ msg: "User tidak ditemukan" });
    const match = await argon2.verify(user.password, req.body.password);
    if (!match) return res.status(400).json({ msg: "Wrong Password" });
    req.session.userId = user.uuid;
    const uuid = user.uuid;
    const name = user.name;
    const email = user.email;
    const role = user.role;
    res.status(200).json({ msg: "login berhasil", uuid, name, email, role }); // Mengembalikan data user setelah login
}

export const Me = async (req, res) => {
    if (!req.session.userId) {
        return res.status(401).json({ msg: "Mohon login ke akun Anda!" });
    }
    try {
        const user = await User.findOne({
            attributes: ['uuid', 'name', 'email', 'role'],
            where: {
                uuid: req.session.userId
            },
            include: [{ // BARU: Menambahkan include untuk forum yang dibuat user
                model: ForumModel,
                as: 'createdForums', // Pastikan alias ini cocok dengan definisi relasi di index.js
                attributes: ['uuid', 'judul', 'kategori', 'createdAt'] // Atribut forum yang ingin ditampilkan
            }]
        });
        if (!user) return res.status(404).json({ msg: "User tidak ditemukan" });
        res.status(200).json(user);
    } catch (error) {
        console.error("Error fetching user profile:", error); // Tambahkan logging error
        res.status(500).json({ msg: "Internal Server Error", error: error.message });
    }
}

export const logOut = (req, res) => {
    req.session.destroy((err) => {
        if (err) return res.status(400).json({ msg: "Tidak dapat logout" });
        res.status(200).json({ msg: "Anda telah logout" });
    });
}