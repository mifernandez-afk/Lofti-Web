import { quoteMonthly } from './pricing.js';
/* Pricing calculator UI */
(function() {
  var fmt = function(n) { return '$' + Math.round(n).toLocaleString('es-CL'); };
  var input = document.getElementById('renta');
  var outTenant = document.getElementById('o1');
  var outOwner = document.getElementById('o2');
  var outVenti = document.getElementById('o-venti');
  var errEl = document.getElementById('renta-err');

  if (!input || !outTenant) return;

  function readRent() {
    return Number(input.value.replace(/[^\d]/g, ''));
  }

  function update(commit) {
    var rent = readRent();
    var checked = document.querySelector('input[name="method"]:checked');
    var method = checked ? checked.value : 'debit';
    try {
      if (!Number.isSafeInteger(rent) || rent < 50000 || rent > 5000000) {
        throw new Error(!rent ? 'Ingresa la renta en pesos, por ejemplo 600.000.'
          : 'Usa una renta entre $50.000 y $5.000.000.');
      }
      var q = quoteMonthly({ rentClp: rent, method: method });
      outTenant.textContent = fmt(q.tenantTotalClp);
      if (outVenti) outVenti.textContent = fmt(q.ventiFeeClp);
      outOwner.textContent = fmt(q.ownerNetClp);
      errEl.textContent = '';
      input.removeAttribute('aria-invalid');
      return true;
    } catch (e) {
      [outTenant, outOwner, outVenti].forEach(function(o) { if (o) o.textContent = '—'; });
      if (commit) {
        errEl.textContent = e.message;
        input.setAttribute('aria-invalid', 'true');
      } else if (input.getAttribute('aria-invalid') === 'true') {
        errEl.textContent = e.message;
      }
      return false;
    }
  }

  var commitFn = function() {
    if (update(true)) input.value = readRent().toLocaleString('es-CL');
  };
  input.addEventListener('input', function() { update(false); });
  input.addEventListener('blur', commitFn);
  input.addEventListener('keydown', function(e) {
    if (e.key === 'Enter') { e.preventDefault(); commitFn(); }
  });
  document.querySelectorAll('input[name="method"]').forEach(function(r) {
    r.addEventListener('change', function() { update(true); });
  });
  update(true);
})();
