export function requireAuth(req, res, next) {
  if (!req.session.userId) {
    return res.status(401).json({ error: 'No autenticado' });
  }
  next();
}

export function requireOwner(req, res, next) {
  if (!req.session.userId) {
    return res.status(401).json({ error: 'No autenticado' });
  }
  if (req.session.role !== 'dueño') {
    return res.status(403).json({ error: 'Solo dueños pueden realizar esta acción' });
  }
  next();
}
