/**
 * Lofti pricing calculations — CLP $10.000 fixed fee per party.
 * Venti commission is separate (charged to landlord by Venti, not Lofti revenue).
 * IVA treatment of Lofti fees pending tax confirmation — exposed as warning.
 */
function quoteMonthly(opts) {
  var rentClp = opts.rentClp;
  var method = opts.method;
  var tenantFeeClp = opts.tenantFeeClp != null ? opts.tenantFeeClp : 10000;
  var landlordFeeClp = opts.landlordFeeClp != null ? opts.landlordFeeClp : 10000;
  var vat = opts.vat != null ? opts.vat : 0.19;
  var debitRate = opts.debitRate != null ? opts.debitRate : 0.013;
  var creditRate = opts.creditRate != null ? opts.creditRate : 0.016;

  if (!Number.isSafeInteger(rentClp) || rentClp <= 0)
    throw new Error('La renta debe ser un entero positivo en CLP');
  if (method !== 'debit' && method !== 'credit')
    throw new Error('Medio de pago inválido');
  var rate = method === 'debit' ? debitRate : creditRate;
  var ventiFeeClp = Math.round(rentClp * rate * (1 + vat));
  return {
    tenantTotalClp: rentClp + tenantFeeClp,
    ownerNetClp: rentClp - landlordFeeClp - ventiFeeClp,
    ventiFeeClp: ventiFeeClp,
    loftiFeeTotalClp: tenantFeeClp + landlordFeeClp,
    warnings: ['Ejemplo: comisión Venti calculada sobre renta; confirmar base y condiciones reales',
               'Revisar si los cargos de Lofti incluyen IVA antes de usar como ingresos contables']
  };
}
if (typeof window !== 'undefined') window.quoteMonthly = quoteMonthly;
export { quoteMonthly };
