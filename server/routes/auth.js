import { Router } from 'express';
import bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();
const SALT_ROUNDS = 10;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

router.post('/register', async (req, res) => {
  try {
    const { email, password, name, role } = req.body;

    if (!email || !password || !name || !role) {
      return res.status(400).json({ error: 'Faltan campos obligatorios' });
    }
    if (!EMAIL_RE.test(email)) {
      return res.status(400).json({ error: 'Email inválido' });
    }
    if (!['arrendatario', 'dueño'].includes(role)) {
      return res.status(400).json({ error: 'Rol inválido' });
    }
    if (password.length < 8) {
      return res.status(400).json({ error: 'Contraseña debe tener al menos 8 caracteres' });
    }

    const exists = await prisma.user.findUnique({ where: { email } });
    if (exists) {
      return res.status(409).json({ error: 'Email ya registrado' });
    }

    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
    const user = await prisma.user.create({
      data: { email, passwordHash, name, role }
    });

    req.session.userId = user.id;
    req.session.role = user.role;

    res.status(201).json({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      verified: user.verified
    });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ error: 'Error interno' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email y contraseña requeridos' });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    req.session.regenerate((err) => {
      if (err) return res.status(500).json({ error: 'Error interno' });
      req.session.userId = user.id;
      req.session.role = user.role;
      res.json({
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        verified: user.verified
      });
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Error interno' });
  }
});

router.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ error: 'Error al cerrar sesión' });
    }
    res.clearCookie('connect.sid');
    res.json({ ok: true });
  });
});

router.get('/me', async (req, res) => {
  if (!req.session.userId) {
    return res.status(401).json({ error: 'No autenticado' });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: req.session.userId },
      select: { id: true, email: true, name: true, role: true, verified: true, createdAt: true }
    });

    if (!user) {
      req.session.destroy(() => {});
      return res.status(401).json({ error: 'Usuario no encontrado' });
    }

    res.json(user);
  } catch (err) {
    console.error('Me error:', err);
    res.status(500).json({ error: 'Error interno' });
  }
});

export default router;
