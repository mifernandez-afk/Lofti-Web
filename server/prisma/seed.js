import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

const COMUNAS = ['Providencia', 'Ñuñoa', 'Santiago', 'Las Condes', 'Macul'];

const OWNERS = [
  { email: 'maria@demo.cl', name: 'María González', phone: '+56912345678' },
  { email: 'carlos@demo.cl', name: 'Carlos Fuentes', phone: '+56923456789' },
  { email: 'andrea@demo.cl', name: 'Andrea Muñoz', phone: '+56934567890' }
];

const PROPERTIES = [
  { title: 'Depto 2D+1B Pedro de Valdivia', address: 'Pedro de Valdivia 1234', comuna: 'Providencia', type: 'depto', price: 580000, rooms: 2, bathrooms: 1, area: 55, description: 'Departamento luminoso a pasos del metro. Cocina equipada, terraza con vista al cerro.', lat: -33.4250, lng: -70.6100, ownerIdx: 0 },
  { title: 'Pieza amoblada cerca de Irarrázaval', address: 'Irarrázaval 3456', comuna: 'Ñuñoa', type: 'pieza', price: 280000, rooms: 1, bathrooms: 1, area: 18, description: 'Pieza individual en depto compartido. Incluye gastos comunes, wifi y lavadora.', lat: -33.4540, lng: -70.5980, ownerIdx: 0 },
  { title: 'Casa 3D+2B con patio en Macul', address: 'Av. Macul 2345', comuna: 'Macul', type: 'casa', price: 650000, rooms: 3, bathrooms: 2, area: 90, description: 'Casa independiente con patio grande. Estacionamiento. Cerca de campus universitario.', lat: -33.4890, lng: -70.5970, ownerIdx: 1 },
  { title: 'Studio amoblado Las Condes', address: 'Av. Apoquindo 6789', comuna: 'Las Condes', type: 'depto', price: 520000, rooms: 1, bathrooms: 1, area: 32, description: 'Studio completamente amoblado. Gimnasio y piscina en el edificio. Metro cercano.', lat: -33.4180, lng: -70.5780, ownerIdx: 1 },
  { title: 'Depto 3D+2B Santiago Centro', address: 'Morandé 456', comuna: 'Santiago', type: 'depto', price: 450000, rooms: 3, bathrooms: 2, area: 72, description: 'Amplio departamento en pleno centro. Vista a la cordillera. Conserje 24/7.', lat: -33.4430, lng: -70.6540, ownerIdx: 2 },
  { title: 'Pieza para estudiante Ñuñoa', address: 'Suecia 789', comuna: 'Ñuñoa', type: 'pieza', price: 220000, rooms: 1, bathrooms: 1, area: 14, description: 'Pieza en casa compartida. Ambiente tranquilo, ideal para estudiantes. Metro Ñuñoa.', lat: -33.4570, lng: -70.5940, ownerIdx: 2 },
  { title: 'Depto nuevo 2D+1B metro Tobalaba', address: 'Av. Providencia 2345', comuna: 'Providencia', type: 'depto', price: 620000, rooms: 2, bathrooms: 1, area: 48, description: 'Edificio nuevo. Terraza, bodega. A una cuadra del metro Tobalaba.', lat: -33.4200, lng: -70.6010, ownerIdx: 0 },
  { title: 'Casa 4D+3B Las Condes', address: 'Los Militares 1234', comuna: 'Las Condes', type: 'casa', price: 1200000, rooms: 4, bathrooms: 3, area: 140, description: 'Casa familiar amplia. Jardín, estacionamiento doble. Barrio residencial tranquilo.', lat: -33.4100, lng: -70.5680, ownerIdx: 1 },
  { title: 'Depto amoblado Santiago barrio Lastarria', address: 'José Victorino Lastarria 123', comuna: 'Santiago', type: 'depto', price: 480000, rooms: 1, bathrooms: 1, area: 38, description: 'En barrio Lastarria. Amoblado completo. Ideal para profesional joven.', lat: -33.4395, lng: -70.6440, ownerIdx: 2 },
  { title: 'Pieza grande con baño privado Macul', address: 'Quilín 567', comuna: 'Macul', type: 'pieza', price: 300000, rooms: 1, bathrooms: 1, area: 22, description: 'Pieza amplia con baño privado. Casa tranquila. Cerca de Plaza Egaña.', lat: -33.4650, lng: -70.5830, ownerIdx: 0 },
  { title: 'Depto 2D+2B Providencia', address: 'Manuel Montt 890', comuna: 'Providencia', type: 'depto', price: 550000, rooms: 2, bathrooms: 2, area: 60, description: 'Dos dormitorios con baño en suite. Buena distribución. Metro Manuel Montt.', lat: -33.4280, lng: -70.6180, ownerIdx: 1 },
  { title: 'Casa 2D+1B Ñuñoa con jardín', address: 'Los Orientales 456', comuna: 'Ñuñoa', type: 'casa', price: 500000, rooms: 2, bathrooms: 1, area: 75, description: 'Casita con jardín interior. Barrio residencial. Mascotas bienvenidas.', lat: -33.4600, lng: -70.5900, ownerIdx: 2 }
];

async function seed() {
  console.log('Seeding database...');

  await prisma.property.deleteMany();
  await prisma.user.deleteMany();

  const passwordHash = await bcrypt.hash('demo1234', 10);

  const owners = [];
  for (const o of OWNERS) {
    const user = await prisma.user.create({
      data: { ...o, passwordHash, role: 'dueño', verified: true }
    });
    owners.push(user);
  }

  const tenant = await prisma.user.create({
    data: { email: 'demo@lofti.cl', passwordHash, name: 'Demo Inquilino', role: 'arrendatario', verified: true }
  });

  for (const p of PROPERTIES) {
    const { ownerIdx, ...data } = p;
    await prisma.property.create({
      data: { ...data, ownerId: owners[ownerIdx].id }
    });
  }

  console.log(`Created ${owners.length} owners + 1 tenant`);
  console.log(`Created ${PROPERTIES.length} properties`);
  console.log('\nTest accounts (password: demo1234):');
  console.log('  Inquilino: demo@lofti.cl');
  console.log('  Dueños: maria@demo.cl, carlos@demo.cl, andrea@demo.cl');
}

seed()
  .then(() => prisma.$disconnect())
  .catch(e => { console.error(e); prisma.$disconnect(); process.exit(1); });
