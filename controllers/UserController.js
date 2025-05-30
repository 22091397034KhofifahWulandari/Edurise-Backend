import User from "../models/UserModel.js";

export const getUsers = async (req, res) => {
    try {
        const response = await User.findAll();
        res.status(200).json(response);
    } catch (error) {
        console.error("Error fetching all users:", error.message); // Perbaikan logging
        res.status(500).json({ msg: "Internal Server Error" });
    }
};

export const getUsersById = async (req, res) => {
    try {
        const response = await User.findOne({
            where: {
                id: req.params.id
            }
        });
        if (!response) { // Cek jika user tidak ditemukan
            return res.status(404).json({ msg: "User not found" });
        }
        res.status(200).json(response);
    } catch (error) {
        console.error("Error fetching user by ID:", error.message); // Perbaikan logging
        res.status(500).json({ msg: "Internal Server Error" });
    }
};

export const createUser = async (req, res) => {
    try {
        // Anda bisa menambahkan validasi input di sini, contoh:
        // const { nama, email } = req.body;
        // if (!nama || !email) {
        //     return res.status(400).json({ msg: "Name and email are required" });
        // }

        const newUser = await User.create(req.body);
        res.status(201).json({ msg: "User Created Successfully", data: newUser }); // Mengembalikan data user yang baru dibuat
    } catch (error) {
        console.error("Error creating user:", error.message); // Perbaikan logging
        // Menangani error validasi Sequelize secara spesifik jika ada
        if (error.name === 'SequelizeValidationError') {
            return res.status(400).json({ msg: error.errors.map(e => e.message).join(', ') });
        }
        // Menangani error duplikasi email atau constraint lainnya
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(409).json({ msg: "Email already exists or a unique constraint was violated." });
        }
        res.status(500).json({ msg: "Internal Server Error" });
    }
};

export const updateUser = async (req, res) => {
    try {
        const result = await User.update(req.body, {
            where: {
                id: req.params.id
            }
        });

        // result[0] adalah jumlah baris yang terpengaruh
        if (result[0] === 0) {
            return res.status(404).json({ msg: "User not found or no changes were made" });
        }
        res.status(200).json({ msg: "User Updated Successfully" });
    } catch (error) {
        console.error("Error updating user:", error.message); // Perbaikan logging
        if (error.name === 'SequelizeValidationError') {
            return res.status(400).json({ msg: error.errors.map(e => e.message).join(', ') });
        }
        res.status(500).json({ msg: "Internal Server Error" });
    }
};

export const deleteUser = async (req, res) => {
    try {
        const result = await User.destroy({
            where: {
                id: req.params.id
            }
        });

        if (result === 0) { // Jika 0 baris dihapus, berarti user tidak ditemukan
            return res.status(404).json({ msg: "User not found" });
        }
        res.status(200).json({ msg: "User Deleted Successfully" });
    } catch (error) {
        console.error("Error deleting user:", error.message); // Perbaikan logging
        res.status(500).json({ msg: "Internal Server Error" });
    }
};