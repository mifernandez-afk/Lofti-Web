import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { requireAuth, requireOwner } from '../middleware/auth.js';

const router = Router();
const prisma = new PrismaClient();
const PAGE_SIZE = 12;

router.get('/', async (req, res) => {
  try {
    const { comuna, tipo, precioMax, piezas, page = '1' } = req.query;
    const where = { available: true };

    if (comuna) where.comuna = comuna;
    if (tipo) where.type = tipo;
    if (precioMax && Number(precioMax) > 0) where.price = { lte: Number(precioMax) };
    if (piezas && Number(piezas) > 0) where.rooms = { gte: Number(piezas) };

    const skip = (Math.max(1, Number(page)) - 1) * PAGE_SIZE;

    const [properties, total] = await Promise.all([
      prisma.property.findMany({
        where,
        include: { owner: { select: { name: true, verified: true } } },
        orderBy: { createdAt: 'desc' },
        skip,
        take: PAGE_SIZE
      }),
      prisma.property.count({ where })
    ]);

    const items = properties.map(p => ({
      ...p,
      photos: (() => { try { return JSON.parse(p.photos); } catch { return []; } })()
    }));

    res.json({
      items,
      total,
      page: Number(page),
      pages: Math.ceil(total / PAGE_SIZE)
    });
  } catch (err) {
    console.error('List properties error:', err);
    res.status(500).json({ error: 'Error interno' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const property = await prisma.property.findUnique({
      where: { id: Number(req.params.id) },
      include: { owner: { select: { name: true, verified: true, phone: true } } }
    });

    if (!property) {
      return res.status(404).json({ error: 'Propiedad no encontrada' });
    }

    res.json({ ...property, photos: JSON.parse(property.photos) });
  } catch (err) {
    console.error('Get property error:', err);
    res.status(500).json({ error: 'Error interno' });
  }
});

router.post('/', requireOwner, async (req, res) => {
  try {
    const { title, address, comuna, type, price, rooms, bathrooms, area, description, lat, lng } = req.body;

    if (!title || !address || !comuna || !type || !price || !rooms || bathrooms == null) {
      return res.status(400).json({ error: 'Faltan campos obligatorios' });
    }

    const property = await prisma.property.create({
      data: {
        title, address, comuna, type,
        price: Number(price),
        rooms: Number(rooms),
        bathrooms: Number(bathrooms),
        area: area ? Number(area) : null,
        description: description || null,
        lat: lat ? Number(lat) : null,
        lng: lng ? Number(lng) : null,
        ownerId: req.session.userId
      }
    });

    res.status(201).json({ ...property, photos: JSON.parse(property.photos) });
  } catch (err) {
    console.error('Create property error:', err);
    res.status(500).json({ error: 'Error interno' });
  }
});

router.put('/:id', requireOwner, async (req, res) => {
  try {
    const property = await prisma.property.findUnique({ where: { id: Number(req.params.id) } });
    if (!property) return res.status(404).json({ error: 'No encontrada' });
    if (property.ownerId !== req.session.userId) return res.status(403).json({ error: 'No autorizado' });

    const { title, address, comuna, type, price, rooms, bathrooms, area, description, available, lat, lng } = req.body;

    const updated = await prisma.property.update({
      where: { id: property.id },
      data: {
        ...(title && { title }),
        ...(address && { address }),
        ...(comuna && { comuna }),
        ...(type && { type }),
        ...(price && { price: Number(price) }),
        ...(rooms && { rooms: Number(rooms) }),
        ...(bathrooms != null && { bathrooms: Number(bathrooms) }),
        ...(area !== undefined && { area: area ? Number(area) : null }),
        ...(description !== undefined && { description }),
        ...(available !== undefined && { available }),
        ...(lat !== undefined && { lat: lat ? Number(lat) : null }),
        ...(lng !== undefined && { lng: lng ? Number(lng) : null })
      }
    });

    res.json({ ...updated, photos: JSON.parse(updated.photos) });
  } catch (err) {
    console.error('Update property error:', err);
    res.status(500).json({ error: 'Error interno' });
  }
});

router.delete('/:id', requireOwner, async (req, res) => {
  try {
    const property = await prisma.property.findUnique({ where: { id: Number(req.params.id) } });
    if (!property) return res.status(404).json({ error: 'No encontrada' });
    if (property.ownerId !== req.session.userId) return res.status(403).json({ error: 'No autorizado' });

    await prisma.property.delete({ where: { id: property.id } });
    res.json({ ok: true });
  } catch (err) {
    console.error('Delete property error:', err);
    res.status(500).json({ error: 'Error interno' });
  }
});

export default router;
