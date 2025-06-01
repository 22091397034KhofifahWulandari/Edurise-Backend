// middleware/AuthUser.js
import UserModel from "../models/UserModel.js";

export const verifyUser = async (req, res, next) => {
    // Log awal untuk debugging
    console.log("--- START verifyUser middleware ---");

    if (!req.session.userId) {
        console.log("verifyUser: Sesi tidak ditemukan (req.session.userId kosong). Mengembalikan 401.");
        return res.status(401).json({ msg: "Mohon login ke akun Anda!" });
    }

    try {
        const user = await UserModel.findOne({
            where: { uuid: req.session.userId },
            attributes: ['id', 'uuid', 'name', 'email', 'role']
        });

        if (!user) {
            console.log(`verifyUser: User tidak ditemukan untuk sesi UUID: ${req.session.userId}. Mengembalikan 404.`);
            return res.status(404).json({ msg: "User tidak ditemukan." });
        }

        req.userId = user.id;
        req.role = user.role; // Ini yang penting untuk adminOnly
        req.userUuid = user.uuid;

        console.log(`verifyUser: User berhasil diverifikasi. User ID: ${req.userId}, Role: ${req.role}, UUID: ${req.userUuid}`);
        console.log("--- END verifyUser middleware. Melanjutkan ke next() ---");
        next();

    } catch (error) {
        console.error("Error in verifyUser middleware:", error);
        res.status(500).json({ msg: "Terjadi kesalahan server saat verifikasi user." });
    }
};

export const adminOnly = async (req, res, next) => {
    // Log awal untuk debugging
    console.log("--- START adminOnly middleware ---");

    if (!req.role) {
        console.log("adminOnly: req.role tidak ditemukan. Ini menunjukkan verifyUser tidak dijalankan sebelumnya atau gagal.");
        return res.status(401).json({ msg: "Tidak terautentikasi untuk memeriksa peran." });
    }

    if (req.role !== "admin") {
        console.log(`adminOnly: Peran '${req.role}' bukan admin. Mengembalikan 403 (Akses terlarang).`); // <--- INI PENTING!
        return res.status(403).json({ msg: "Akses terlarang" });
    }

    console.log("adminOnly: User adalah admin. Melanjutkan ke next().");
    console.log("--- END adminOnly middleware ---");
    next();
};