var LOFTI_DEMO = (function() {
  var STORAGE_KEY = 'lofti.demo.v1';

  var TRANSITIONS = {
    'draft':           ['published'],
    'published':       ['paused', 'closed'],
    'paused':          ['published', 'closed'],
    'closed':          [],
    'app_draft':       ['app_sent'],
    'app_sent':        ['app_reviewing'],
    'app_reviewing':   ['app_accepted', 'app_rejected', 'app_info_requested'],
    'app_info_requested': ['app_reviewing'],
    'app_accepted':    ['agreement_pending'],
    'app_rejected':    [],
    'agreement_pending': ['agreement_confirmed'],
    'agreement_confirmed': ['contract_draft'],
    'contract_draft':  ['contract_review'],
    'contract_review': ['contract_changes_requested', 'contract_tenant_accepted'],
    'contract_changes_requested': ['contract_draft'],
    'contract_tenant_accepted': ['contract_both_accepted'],
    'contract_both_accepted': ['payment_pending'],
    'payment_pending': ['payment_approved', 'payment_rejected'],
    'payment_approved': ['active'],
    'payment_rejected': ['payment_pending'],
    'active':          []
  };

  function defaultState() {
    return {
      version: 1,
      id: 'DEMO-' + String(Date.now()).slice(-6),
      role: 'arrendatario',
      property: {
        type: 'room',
        title: 'Pieza amoblada en Ñuñoa',
        commune: 'Ñuñoa',
        rent: 280000,
        rooms: 1,
        area: 14,
        description: 'Pieza amoblada con cama, escritorio y closet. Baño compartido con 1 residente. Cocina completa, WiFi incluido.',
        available: '2026-12-01',
        status: 'draft'
      },
      application: { status: 'app_draft' },
      agreement: {
        status: 'agreement_pending',
        rent: 280000,
        deposit: 280000,
        startDate: '2026-12-01',
        duration: 12,
        revision: 0,
        tenantAcceptedAt: null,
        landlordAcceptedAt: null
      },
      contract: {
        status: 'contract_draft',
        tenantAcceptedAt: null,
        landlordAcceptedAt: null
      },
      payment: {
        status: 'payment_pending',
        method: 'debit',
        simulatedReceiptId: null,
        paidAt: null
      }
    };
  }

  function load() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        var s = JSON.parse(raw);
        if (s && s.version === 1) return s;
      }
    } catch(e) {}
    return defaultState();
  }

  function save(state) {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch(e) {}
  }

  function reset() {
    try { localStorage.removeItem(STORAGE_KEY); } catch(e) {}
    return defaultState();
  }

  function canTransition(from, to) {
    var allowed = TRANSITIONS[from];
    return allowed && allowed.indexOf(to) !== -1;
  }

  function transition(state, field, newStatus) {
    var current = state[field] && state[field].status;
    if (!canTransition(current, newStatus)) {
      return { ok: false, error: 'Transición no permitida: ' + current + ' a ' + newStatus };
    }
    state[field].status = newStatus;
    save(state);
    return { ok: true, state: state };
  }

  function invalidateAcceptances(state) {
    state.contract.tenantAcceptedAt = null;
    state.contract.landlordAcceptedAt = null;
    state.contract.status = 'contract_draft';
    state.agreement.revision = (state.agreement.revision || 0) + 1;
    save(state);
  }

  return {
    load: load,
    save: save,
    reset: reset,
    defaultState: defaultState,
    canTransition: canTransition,
    transition: transition,
    invalidateAcceptances: invalidateAcceptances,
    TRANSITIONS: TRANSITIONS
  };
})();
