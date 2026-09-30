const express = require('express');
const router = express.Router();

// In-memory user data storage with realistic initial seed users
let users = [
  {
    id: 1,
    name: 'Berat Çelik',
    email: 'berat@alumni.edu',
    role: 'Alumni',
    department: 'Bilgisayar Mühendisliği',
    createdAt: '2026-09-20T10:00:00.000Z'
  },
  {
    id: 2,
    name: 'Prof. Dr. Ayşe Yılmaz',
    email: 'ayse.yilmaz@faculty.edu',
    role: 'Faculty',
    department: 'Yazılım Mühendisliği',
    createdAt: '2026-09-21T11:30:00.000Z'
  },
  {
    id: 3,
    name: 'Emre Kaya',
    email: 'emre.kaya@alumni.edu',
    role: 'Alumni',
    department: 'Elektrik-Elektronik Mühendisliği',
    createdAt: '2026-09-22T14:15:00.000Z'
  }
];

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Tüm Kayıtlı Kullanıcıları Listele
 *     description: Sistemde kayıtlı tüm mezun, akademisyen ve öğrencilerin listesini JSON dizisi olarak döner.
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Kullanıcı listesi başarıyla getirildi.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 */
router.get('/', (req, res) => {
  res.status(200).json(users);
});

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: ID ile Tekil Kullanıcı Bilgisi Getir
 *     description: Belirtilen sayısal ID değerine sahip kullanıcının tüm profil detaylarını getirir.
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Getirilecek kullanıcının ID'si
 *         example: 2
 *     responses:
 *       200:
 *         description: Kullanıcı bulundu ve bilgileri döndürüldü.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Geçersiz ID formatı.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Kullanıcı bulunamadı.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/:id', (req, res) => {
  const userId = parseInt(req.params.id, 10);
  if (isNaN(userId)) {
    return res.status(400).json({
      success: false,
      error: 'Geçersiz kullanıcı ID formatı. ID bir sayı olmalıdır.'
    });
  }

  const user = users.find(u => u.id === userId);
  if (!user) {
    return res.status(404).json({
      success: false,
      error: `ID'si ${userId} olan kullanıcı bulunamadı.`
    });
  }

  res.status(200).json(user);
});

/**
 * @swagger
 * /api/users:
 *   post:
 *     summary: Yeni Kullanıcı Kaydet (POST)
 *     description: Sisteme yeni bir mezun veya fakülte üyesi kaydeder.
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserInput'
 *     responses:
 *       201:
 *         description: Kullanıcı başarıyla oluşturuldu.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Eksik veya hatalı bilgi gönderildi.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       409:
 *         description: E-posta adresi zaten kullanımda.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/', (req, res) => {
  const { name, email, role, department } = req.body || {};

  // Validation
  if (!name || typeof name !== 'string' || !name.trim()) {
    return res.status(400).json({
      success: false,
      error: 'Kullanıcı adı (name) zorunludur ve metin olmalıdır.'
    });
  }

  if (!email || typeof email !== 'string' || !email.trim()) {
    return res.status(400).json({
      success: false,
      error: 'E-posta (email) alanı zorunludur.'
    });
  }

  const cleanEmail = email.trim().toLowerCase();

  if (!emailRegex.test(cleanEmail)) {
    return res.status(400).json({
      success: false,
      error: 'Lütfen geçerli bir e-posta adresi girin (Örn: isim@domain.com).'
    });
  }

  // Duplicate email check
  const existingUser = users.find(u => u.email.toLowerCase() === cleanEmail);
  if (existingUser) {
    return res.status(409).json({
      success: false,
      error: `Bu e-posta adresi (${cleanEmail}) ile kayıtlı bir kullanıcı zaten mevcut.`
    });
  }

  // Create new user object
  const newId = users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1;
  const newUser = {
    id: newId,
    name: name.trim(),
    email: cleanEmail,
    role: (role && typeof role === 'string' && role.trim()) || 'Alumni',
    department: (department && typeof department === 'string' && department.trim()) || 'Genel',
    createdAt: new Date().toISOString()
  };

  users.push(newUser);

  res.status(201).json({
    success: true,
    message: 'Kullanıcı başarıyla kaydedildi.',
    user: newUser,
    ...newUser
  });
});

/**
 * @swagger
 * /api/users/{id}:
 *   put:
 *     summary: Kullanıcı Bilgilerini Tamamen Değiştir (PUT)
 *     description: Belirtilen kullanıcının tüm bilgilerini yeni verilerle tamamen yeniler.
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Güncellenecek kullanıcının ID'si
 *         example: 2
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserInput'
 *     responses:
 *       200:
 *         description: Kullanıcı başarıyla güncellendi.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Eksik alan veya geçersiz format.
 *       404:
 *         description: Kullanıcı bulunamadı.
 *       409:
 *         description: E-posta adresi başka bir kullanıcı tarafından kullanılıyor.
 */
router.put('/:id', (req, res) => {
  const userId = parseInt(req.params.id, 10);
  if (isNaN(userId)) {
    return res.status(400).json({
      success: false,
      error: 'Geçersiz kullanıcı ID formatı. ID bir sayı olmalıdır.'
    });
  }

  const userIndex = users.findIndex(u => u.id === userId);
  if (userIndex === -1) {
    return res.status(404).json({
      success: false,
      error: `ID'si ${userId} olan kullanıcı bulunamadı.`
    });
  }

  const { name, email, role, department } = req.body || {};

  if (!name || typeof name !== 'string' || !name.trim()) {
    return res.status(400).json({
      success: false,
      error: 'Tam güncelleme (PUT) için isim (name) alanı zorunludur.'
    });
  }

  if (!email || typeof email !== 'string' || !email.trim()) {
    return res.status(400).json({
      success: false,
      error: 'Tam güncelleme (PUT) için e-posta (email) alanı zorunludur.'
    });
  }

  const cleanEmail = email.trim().toLowerCase();

  if (!emailRegex.test(cleanEmail)) {
    return res.status(400).json({
      success: false,
      error: 'Lütfen geçerli bir e-posta adresi girin.'
    });
  }

  const duplicateUser = users.find(u => u.email.toLowerCase() === cleanEmail && u.id !== userId);
  if (duplicateUser) {
    return res.status(409).json({
      success: false,
      error: `Bu e-posta adresi (${cleanEmail}) başka bir kullanıcı tarafından kullanılıyor.`
    });
  }

  const updatedUser = {
    id: userId,
    name: name.trim(),
    email: cleanEmail,
    role: (role && typeof role === 'string' && role.trim()) || 'Alumni',
    department: (department && typeof department === 'string' && department.trim()) || 'Genel',
    createdAt: users[userIndex].createdAt,
    updatedAt: new Date().toISOString()
  };

  users[userIndex] = updatedUser;

  res.status(200).json({
    success: true,
    message: `ID'si ${userId} olan kullanıcı başarıyla güncellendi (PUT).`,
    user: updatedUser,
    ...updatedUser
  });
});

/**
 * @swagger
 * /api/users/{id}:
 *   patch:
 *     summary: Kullanıcı Bilgilerini Kısmen Güncelle (PATCH)
 *     description: Belirtilen kullanıcının yalnızca gönderilen alanlarını (örneğin sadece bölüm veya e-posta) günceller.
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Güncellenecek kullanıcının ID'si
 *         example: 2
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserPartialInput'
 *     responses:
 *       200:
 *         description: Kullanıcı kısmen güncellendi.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Hiçbir geçerli alan gönderilmedi veya geçersiz değer.
 *       404:
 *         description: Kullanıcı bulunamadı.
 *       409:
 *         description: E-posta adresi başka bir kullanıcı tarafından kullanılıyor.
 */
router.patch('/:id', (req, res) => {
  const userId = parseInt(req.params.id, 10);
  if (isNaN(userId)) {
    return res.status(400).json({
      success: false,
      error: 'Geçersiz kullanıcı ID formatı. ID bir sayı olmalıdır.'
    });
  }

  const userIndex = users.findIndex(u => u.id === userId);
  if (userIndex === -1) {
    return res.status(404).json({
      success: false,
      error: `ID'si ${userId} olan kullanıcı bulunamadı.`
    });
  }

  const { name, email, role, department } = req.body || {};

  if (name === undefined && email === undefined && role === undefined && department === undefined) {
    return res.status(400).json({
      success: false,
      error: 'Kısmi güncelleme (PATCH) için güncellenecek en az bir alan gönderilmelidir (name, email, role, department).'
    });
  }

  const currentUser = users[userIndex];
  let cleanEmail = currentUser.email;

  if (email !== undefined) {
    if (typeof email !== 'string' || !email.trim()) {
      return res.status(400).json({
        success: false,
        error: 'E-posta boş bırakılamaz.'
      });
    }
    cleanEmail = email.trim().toLowerCase();
    if (!emailRegex.test(cleanEmail)) {
      return res.status(400).json({
        success: false,
        error: 'Lütfen geçerli bir e-posta adresi girin.'
      });
    }
    const duplicateUser = users.find(u => u.email.toLowerCase() === cleanEmail && u.id !== userId);
    if (duplicateUser) {
      return res.status(409).json({
        success: false,
        error: `Bu e-posta adresi (${cleanEmail}) başka bir kullanıcı tarafından kullanılıyor.`
      });
    }
  }

  if (name !== undefined && (typeof name !== 'string' || !name.trim())) {
    return res.status(400).json({
      success: false,
      error: 'İsim alanı boş bırakılamaz.'
    });
  }

  const updatedUser = {
    ...currentUser,
    name: name !== undefined ? name.trim() : currentUser.name,
    email: cleanEmail,
    role: role !== undefined ? role.trim() : currentUser.role,
    department: department !== undefined ? department.trim() : currentUser.department,
    updatedAt: new Date().toISOString()
  };

  users[userIndex] = updatedUser;

  res.status(200).json({
    success: true,
    message: `ID'si ${userId} olan kullanıcı başarıyla kısmen güncellendi (PATCH).`,
    user: updatedUser,
    ...updatedUser
  });
});

/**
 * @swagger
 * /api/users/{id}:
 *   delete:
 *     summary: Kullanıcıyı Sil (DELETE)
 *     description: Belirtilen sayısal ID değerine sahip kullanıcıyı sistemden kalıcı olarak siler.
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Silinecek kullanıcının ID'si
 *         example: 3
 *     responses:
 *       200:
 *         description: Kullanıcı başarıyla silindi.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Geçersiz ID formatı.
 *       404:
 *         description: Kullanıcı bulunamadı.
 */
router.delete('/:id', (req, res) => {
  const userId = parseInt(req.params.id, 10);
  if (isNaN(userId)) {
    return res.status(400).json({
      success: false,
      error: 'Geçersiz kullanıcı ID formatı. ID bir sayı olmalıdır.'
    });
  }

  const userIndex = users.findIndex(u => u.id === userId);
  if (userIndex === -1) {
    return res.status(404).json({
      success: false,
      error: `ID'si ${userId} olan kullanıcı bulunamadı.`
    });
  }

  const deletedUser = users.splice(userIndex, 1)[0];

  res.status(200).json({
    success: true,
    message: `ID'si ${userId} olan kullanıcı (${deletedUser.name}) başarıyla silindi.`,
    user: deletedUser,
    ...deletedUser
  });
});

module.exports = router;
