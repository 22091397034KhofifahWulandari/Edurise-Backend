// controllers/KompetisiRegistrasiController.js
import KompetisiRegistrasi from "../models/KompetisiRegistrasiModel.js";
import Kompetisi from "../models/KompetisiModel.js";
import User from "../models/UserModel.js";

// Mendaftar untuk kompetisi
export const registerForKompetisi = async (req, res) => {
  try {
    const { 
      userId, 
      kompetisiId, 
      nama_lengkap, 
      jenjang_pendidikan, 
      instansi_pendidikan, 
      jurusan, 
      no_telp, 
      email, 
      alasan_mengikuti 
    } = req.body; 

    // Cek apakah user dan kompetisi ada
    const userExists = await User.findByPk(userId);
    const kompetisiExists = await Kompetisi.findByPk(kompetisiId);

    if (!userExists || !kompetisiExists) {
      return res.status(404).json({ msg: "User or Kompetisi not found" });
    }

    // Cek apakah sudah terdaftar
    const existingRegistration = await KompetisiRegistrasi.findOne({
      where: {
        userId: userId,
        kompetisiId: kompetisiId,
      },
    });

    if (existingRegistration) {
      return res.status(409).json({ msg: "User already registered for this kompetisi" });
    }

    // Buat entri pendaftaran baru dengan semua data formulir
    await KompetisiRegistrasi.create({
      userId: userId,
      kompetisiId: kompetisiId,
      nama_lengkap: nama_lengkap,
      jenjang_pendidikan: jenjang_pendidikan,
      instansi_pendidikan: instansi_pendidikan,
      jurusan: jurusan,
      no_telp: no_telp,
      email: email,
      alasan_mengikuti: alasan_mengikuti,
      status_pendaftaran: 'diproses' // Default status
    });
    res.status(201).json({ msg: "Successfully registered for kompetisi. Status: diproses" });
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ msg: error.message });
  }
};

// Mendapatkan status pendaftaran untuk kompetisi tertentu oleh user
export const getKompetisiRegistrationStatus = async (req, res) => {
  try {
    const { userId, kompetisiId } = req.params;

    const registration = await KompetisiRegistrasi.findOne({
      where: {
        userId: userId,
        kompetisiId: kompetisiId,
      },
      include: [{
        model: Kompetisi,
        as: 'registeredKompetisi',
        attributes: ['id', 'poster_gambar', 'judul', 'tanggal', 'biaya', 'tingkat_kompetisi', 'tentang_kompetisi', 'syarat', 'ketentuan_kompetisi', 'benefit']
      }, {
        model: User,
        as: 'registrantUser',
        attributes: ['id', 'nama', 'email'] // PERBAIKAN DI SINI: 'name' diganti jadi 'nama'
      }]
    });

    if (!registration) {
      return res.status(404).json({ msg: "Registration not found for this user and kompetisi" });
    }

    const kompetisiData = registration.registeredKompetisi ? {
      id: registration.registeredKompetisi.id,
      poster_gambar: registration.registeredKompetisi.poster_gambar,
      judul: registration.registeredKompetisi.judul,
      tanggal: registration.registeredKompetisi.tanggal,
      biaya: registration.registeredKompetisi.biaya,
      tingkat_kompetisi: registration.registeredKompetisi.tingkat_kompetisi,
      tentang_kompetisi: registration.registeredKompetisi.tentang_kompetisi,
      syarat: registration.registeredKompetisi.syarat,
      ketentuan_kompetisi: registration.registeredKompetisi.ketentuan_kompetisi,
      benefit: registration.registeredKompetisi.benefit
    } : null;

    const userData = registration.registrantUser ? {
      id: registration.registrantUser.id,
      nama: registration.registrantUser.nama, // PERBAIKAN DI SINI: 'name' diganti jadi 'nama'
      email: registration.registrantUser.email
    } : null;

    res.status(200).json({
      kompetisi: kompetisiData,
      user: userData,
      status_pendaftaran: registration.status_pendaftaran,
      tanggal_pendaftaran: registration.tanggal_pendaftaran,
      nama_lengkap: registration.nama_lengkap,
      jenjang_pendidikan: registration.jenjang_pendidikan,
      instansi_pendidikan: registration.instansi_pendidikan,
      jurusan: registration.jurusan,
      no_telp: registration.no_telp,
      email: registration.email,
      alasan_mengikuti: registration.alasan_mengikuti
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ msg: "Internal Server Error", detail: error.message });
  }
};

// Mendapatkan semua kompetisi yang didaftar oleh seorang pengguna
export const getRegisteredKompetisiByUserId = async (req, res) => {
  try {
    const { userId } = req.params;

    const registeredKompetisiEntries = await KompetisiRegistrasi.findAll({
      where: { userId: userId },
      include: [{
        model: Kompetisi,
        as: 'registeredKompetisi',
        attributes: ['id', 'poster_gambar', 'judul', 'tanggal', 'biaya', 'tingkat_kompetisi', 'tentang_kompetisi']
      },
      { // Tambahkan include untuk User agar bisa menampilkan detail User dari tabel users
          model: User,
          as: 'registrantUser',
          attributes: ['id', 'nama', 'email'] // PERBAIKAN DI SINI: 'name' diganti jadi 'nama'
      }],
      attributes: ['status_pendaftaran', 'tanggal_pendaftaran', 'nama_lengkap', 'jenjang_pendidikan', 'instansi_pendidikan', 'jurusan', 'no_telp', 'email', 'alasan_mengikuti']
    });

    if (registeredKompetisiEntries.length === 0) {
      return res.status(404).json({ msg: "No registered kompetisi found for this user." });
    }

    const responseData = registeredKompetisiEntries.map(entry => ({
      kompetisi_detail: entry.registeredKompetisi,
      pendaftaran_detail: {
        status_pendaftaran: entry.status_pendaftaran,
        tanggal_pendaftaran: entry.tanggal_pendaftaran,
        nama_lengkap: entry.nama_lengkap, // Ini dari KompetisiRegistrasiModel
        jenjang_pendidikan: entry.jenjang_pendidikan,
        instansi_pendidikan: entry.instansi_pendidikan,
        jurusan: entry.jurusan,
        no_telp: entry.no_telp,
        email: entry.email,
        alasan_mengikuti: entry.alasan_mengikuti
      },
      // Tambahkan detail user jika disertakan
      user_detail: entry.registrantUser ? {
          id: entry.registrantUser.id,
          nama: entry.registrantUser.nama, // Gunakan 'nama'
          email: entry.registrantUser.email
      } : null
    }));

    res.status(200).json(responseData);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ msg: "Internal Server Error" });
  }
};

// Mengupdate status pendaftaran kompetisi
export const updateKompetisiRegistrationStatus = async (req, res) => {
  try {
    const { userId, kompetisiId } = req.params;
    const { status_pendaftaran } = req.body;

    if (!['diproses', 'seleksi berkas', 'diterima', 'ditolak'].includes(status_pendaftaran)) {
      return res.status(400).json({ msg: "Invalid registration status" });
    }

    const registration = await KompetisiRegistrasi.findOne({
      where: {
        userId: userId,
        kompetisiId: kompetisiId,
      },
    });

    if (!registration) {
      return res.status(404).json({ msg: "Registration not found" });
    }

    registration.status_pendaftaran = status_pendaftaran;
    await registration.save();

    res.status(200).json({ msg: "Registration status updated successfully", new_status: status_pendaftaran });
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ msg: error.message });
  }
};

// Mendapatkan semua pendaftaran untuk suatu kompetisi (biasanya untuk admin)
export const getAllRegistrationsForKompetisi = async (req, res) => {
  try {
    const { kompetisiId } = req.params;

    const registrations = await KompetisiRegistrasi.findAll({
      where: { kompetisiId: kompetisiId },
      include: [{
        model: User,
        as: 'registrantUser',
        attributes: ['id', 'nama', 'email'] // PERBAIKAN DI SINI: 'name' diganti jadi 'nama'
      }]
    });

    res.status(200).json(registrations);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ msg: "Internal Server Error" });
  }
};

// Menghapus pendaftaran kompetisi
export const deleteKompetisiRegistration = async (req, res) => {
  try {
    const { userId, kompetisiId } = req.params;

    const result = await KompetisiRegistrasi.destroy({
      where: {
        userId: userId,
        kompetisiId: kompetisiId,
      },
    });

    if (result === 0) {
      return res.status(404).json({ msg: "Registration not found" });
    }

    res.status(200).json({ msg: "Registration deleted successfully" });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ msg: "Internal Server Error" });
  }
};