import test from 'node:test';
import assert from 'node:assert/strict';
import { quoteMonthly } from './pricing.js';

test('débito $600.000', () => {
  const q = quoteMonthly({ rentClp: 600000, method: 'debit' });
  assert.equal(q.ventiFeeClp, 9282);
  assert.equal(q.ownerNetClp, 580718);
  assert.equal(q.tenantTotalClp, 610000);
  assert.equal(q.loftiFeeTotalClp, 20000);
});

test('crédito $600.000', () => {
  const q = quoteMonthly({ rentClp: 600000, method: 'credit' });
  assert.equal(q.ventiFeeClp, 11424);
  assert.equal(q.ownerNetClp, 578576);
  assert.equal(q.tenantTotalClp, 610000);
  assert.equal(q.loftiFeeTotalClp, 20000);
});

test('renta mínima $50.000 débito', () => {
  const q = quoteMonthly({ rentClp: 50000, method: 'debit' });
  assert.equal(q.tenantTotalClp, 60000);
  assert.equal(q.ventiFeeClp, Math.round(50000 * 0.013 * 1.19));
});

test('renta negativa lanza error', () => {
  assert.throws(() => quoteMonthly({ rentClp: -100, method: 'debit' }),
    { message: 'La renta debe ser un entero positivo en CLP' });
});

test('renta cero lanza error', () => {
  assert.throws(() => quoteMonthly({ rentClp: 0, method: 'debit' }),
    { message: 'La renta debe ser un entero positivo en CLP' });
});

test('método inválido lanza error', () => {
  assert.throws(() => quoteMonthly({ rentClp: 600000, method: 'cash' }),
    { message: 'Medio de pago inválido' });
});

test('renta decimal lanza error', () => {
  assert.throws(() => quoteMonthly({ rentClp: 600000.5, method: 'debit' }),
    { message: 'La renta debe ser un entero positivo en CLP' });
});

test('warnings present', () => {
  const q = quoteMonthly({ rentClp: 600000, method: 'debit' });
  assert.equal(q.warnings.length, 2);
});

test('débito $700.000', () => {
  const q = quoteMonthly({ rentClp: 700000, method: 'debit' });
  assert.equal(q.ventiFeeClp, Math.round(700000 * 0.013 * 1.19));
  assert.equal(q.tenantTotalClp, 710000);
  assert.equal(q.ownerNetClp, 700000 - 10000 - q.ventiFeeClp);
  assert.equal(q.loftiFeeTotalClp, 20000);
});

test('crédito $700.000', () => {
  const q = quoteMonthly({ rentClp: 700000, method: 'credit' });
  assert.equal(q.ventiFeeClp, Math.round(700000 * 0.016 * 1.19));
  assert.equal(q.tenantTotalClp, 710000);
  assert.equal(q.ownerNetClp, 700000 - 10000 - q.ventiFeeClp);
});

test('renta máxima razonable $5.000.000 débito', () => {
  const q = quoteMonthly({ rentClp: 5000000, method: 'debit' });
  assert.equal(q.tenantTotalClp, 5010000);
  assert.ok(q.ventiFeeClp > 0);
  assert.ok(q.ownerNetClp < 5000000);
});

test('custom fee overrides', () => {
  const q = quoteMonthly({ rentClp: 600000, method: 'debit', tenantFeeClp: 15000, landlordFeeClp: 12000 });
  assert.equal(q.tenantTotalClp, 615000);
  assert.equal(q.loftiFeeTotalClp, 27000);
});

test('Infinity lanza error', () => {
  assert.throws(() => quoteMonthly({ rentClp: Infinity, method: 'debit' }),
    { message: 'La renta debe ser un entero positivo en CLP' });
});

test('NaN lanza error', () => {
  assert.throws(() => quoteMonthly({ rentClp: NaN, method: 'debit' }),
    { message: 'La renta debe ser un entero positivo en CLP' });
});
