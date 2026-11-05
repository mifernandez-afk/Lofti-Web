import express from 'express';
import session from 'express-session';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import authRoutes from './routes/auth.js';
import propertyRoutes from './routes/properties.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3000;
const IS_PROD = process.env.NODE_ENV === 'production';

const SESSION_SECRET = process.env.SESSION_SECRET || (IS_PROD ? null : 'lofti-dev-secret');
if (!SESSION_SECRET) {
  console.error('SESSION_SECRET required in production. Set it in .env');
  process.exit(1);
}

const ALLOWED_ORIGINS = (process.env.CORS_ORIGINS || 'http://localhost:8081,http://localhost:3000,http://127.0.0.1:8081').split(',');

app.use(express.json({ limit: '1mb' }));
app.use(cors({
  origin: ALLOWED_ORIGINS,
  credentials: true
}));

app.use(session({
  secret: SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  name: 'lofti.sid',
  cookie: {
    httpOnly: true,
    secure: IS_PROD,
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000
  }
}));

const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 20, message: { error: 'Demasiados intentos. Espera 15 minutos.' } });
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', authLimiter);

const BLOCKED_PATHS = /^\/(\.env|\.git|server|prisma|node_modules|docs|.*\.db|.*\.sqlite|index_single_page_backup\.html)/i;
app.use((req, res, next) => {
  if (BLOCKED_PATHS.test(req.path)) return res.status(404).end();
  next();
});
app.use(express.static(join(__dirname, '..'), {
  index: 'index.html',
  dotfiles: 'deny'
}));

app.use('/api/auth', authRoutes);
app.use('/api/properties', propertyRoutes);

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`Lofti server running on http://localhost:${PORT}`);
});
