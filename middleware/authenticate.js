import jwt from 'jsonwebtoken';

const authenticate = (req, res, next) => {
  // Ambil token dari header Authorization
  const authHeader = req.headers['authorization'];
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Token missing or badly formatted' });
  }

  // Pisahkan token dari string 'Bearer <token>'
  const token = authHeader.split(' ')[1];

  // Verifikasi token menggunakan JWT_SECRET
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: 'Unauthorized: Invalid or expired token' });
    }

    // Jika token valid, tambahkan data user ke req.user
    req.user = decoded;

    // Lanjutkan ke middleware atau controller berikutnya
    next();
  });
};

export default authenticate;
