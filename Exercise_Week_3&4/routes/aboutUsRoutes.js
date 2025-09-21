const express = require('express');
const router = express.Router();

// Database sederhana (mock data)
const users = [
  { user: 'RIYO ', name: 'RIYO RIALDY URDA', nim: '24120500013' },
  { user: 'TAQI', name: 'MUHAMMAD TAQI DZAKWAN', nim: '24120400008' },
  { user: 'RAYEN', name: 'RAYEN AURILIANSYAH', nim: '24120400004' },
  // Anda bisa menambahkan data lain di sini
];

// Implementasi get about us menggunakan parameter URL
// Format: /aboutus/:user
router.get('/:user', (req, res) => {
  const { user } = req.params; // Ambil nilai parameter dari URL

  // Cari user di "database"
  const foundUser = users.find(u => u.user.toLowerCase() === user.toLowerCase());

  // Jika user ditemukan
  if (foundUser) {
    res.json(foundUser);
  } else {
    // Jika tidak ditemukan, kirim respons 404
    res.status(404).json({ error: 'User not found' });
  }
});

module.exports = router;