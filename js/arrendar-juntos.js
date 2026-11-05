(function(){
  var esc = window._esc || function(s){ return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); };

  /* ─── Survey Definition (based on TIPI + methodology PDFs) ─── */
  var MODULES = [
    { id:'intro', title:'Introducción', short:'Intro' },
    { id:'personalidad', title:'Personalidad', short:'Personalidad' },
    { id:'habitos', title:'Hábitos', short:'Hábitos' },
    { id:'intereses', title:'Intereses y tiempo libre', short:'Intereses' },
    { id:'valores', title:'Valores de convivencia', short:'Valores' },
    { id:'sociabilidad', title:'Sociabilidad', short:'Sociabilidad' },
    { id:'conflictos', title:'Manejo de conflictos', short:'Conflictos' }
  ];

  var QUESTIONS = {
    intro: [
      { id:'consent', type:'info', text:'Esta encuesta explora tus hábitos y expectativas de convivencia. No hay respuestas correctas ni incorrectas. Tus respuestas son privadas: solo se comparten coincidencias y diferencias, nunca tus respuestas exactas. Puedes saltar preguntas sensibles.' },
      { id:'name_display', type:'text', label:'¿Con qué nombre te gustaría aparecer?', placeholder:'Nombre o apodo', required:true },
      { id:'age_range', type:'select', label:'Rango de edad', options:['18-24','25-30','31-35','36-40','41+'], required:false }
    ],
    personalidad: [
      { id:'tipi_1', type:'likert7', label:'Me veo como alguien extrovertido/a, entusiasta', reversed:false, dimension:'extraversion' },
      { id:'tipi_2', type:'likert7', label:'Me veo como alguien crítico/a, conflictivo/a', reversed:true, dimension:'agradabilidad' },
      { id:'tipi_3', type:'likert7', label:'Me veo como alguien confiable, disciplinado/a', reversed:false, dimension:'responsabilidad' },
      { id:'tipi_4', type:'likert7', label:'Me veo como alguien ansioso/a, que se altera fácilmente', reversed:true, dimension:'estabilidad' },
      { id:'tipi_5', type:'likert7', label:'Me veo como alguien abierto/a a nuevas experiencias, creativo/a', reversed:false, dimension:'apertura' },
      { id:'tipi_6', type:'likert7', label:'Me veo como alguien reservado/a, callado/a', reversed:true, dimension:'extraversion' },
      { id:'tipi_7', type:'likert7', label:'Me veo como alguien comprensivo/a, cálido/a', reversed:false, dimension:'agradabilidad' },
      { id:'tipi_8', type:'likert7', label:'Me veo como alguien desorganizado/a, descuidado/a', reversed:true, dimension:'responsabilidad' },
      { id:'tipi_9', type:'likert7', label:'Me veo como alguien calmado/a, emocionalmente estable', reversed:false, dimension:'estabilidad' },
      { id:'tipi_10', type:'likert7', label:'Me veo como alguien convencional, poco creativo/a', reversed:true, dimension:'apertura' }
    ],
    habitos: [
      { id:'hab_sleep', type:'select', label:'¿A qué hora sueles acostarte?', options:['Antes de las 22:00','Entre 22:00 y 00:00','Después de medianoche','Variable / sin horario fijo'] },
      { id:'hab_wake', type:'select', label:'¿A qué hora sueles levantarte?', options:['Antes de las 7:00','Entre 7:00 y 9:00','Después de las 9:00','Variable'] },
      { id:'hab_clean', type:'likert7', label:'¿Qué tan importante es para ti mantener los espacios comunes ordenados?' },
      { id:'hab_clean_freq', type:'select', label:'¿Con qué frecuencia limpias espacios comunes?', options:['Todos los días','Cada 2-3 días','Una vez a la semana','Menos de una vez a la semana'] },
      { id:'hab_noise', type:'likert7', label:'¿Qué tanto te molesta el ruido en tu hogar?' },
      { id:'hab_cooking', type:'select', label:'¿Cómo prefieres el uso de la cocina?', options:['Cocino seguido y me gusta compartir','Cocino seguido pero uso mis cosas','Cocino poco, más delivery o fuera','Indiferente'] },
      { id:'hab_smoking', type:'select', label:'¿Fumas?', options:['No fumo','Fumo fuera de la casa','Fumo dentro de la casa','Prefiero no responder'], sentinel:true }
    ],
    intereses: [
      { id:'int_social', type:'likert7', label:'¿Qué tan seguido invitas personas a tu hogar?' },
      { id:'int_pets', type:'select', label:'¿Tienes o planeas tener mascota?', options:['No tengo ni planeo','Tengo mascota(s)','Planeo tener pronto','Indiferente'] },
      { id:'int_pets_type', type:'text', label:'Si tienes mascota, ¿de qué tipo?', placeholder:'Ej: gato, perro pequeño', conditional:'int_pets:Tengo mascota(s)' },
      { id:'int_weekend', type:'multi', label:'¿Qué haces en tu tiempo libre? (puedes elegir varias)', options:['Estar en casa tranquilo/a','Salir con amigos','Deporte o ejercicio','Música o instrumentos','Trabajo o estudio en casa','Otro'] },
      { id:'int_music', type:'likert7', label:'¿Qué tan seguido escuchas música o ves series en volumen alto?' }
    ],
    valores: [
      { id:'val_space', type:'likert7', label:'¿Qué tan importante es para ti tener espacios propios (privacidad)?' },
      { id:'val_share', type:'likert7', label:'¿Qué tan dispuesto/a estás a compartir alimentos y productos de uso común?' },
      { id:'val_bills', type:'select', label:'¿Cómo prefieres dividir los gastos comunes?', options:['Partes iguales siempre','Proporcional al uso','Lo conversamos cada mes','Indiferente'] },
      { id:'val_visits', type:'select', label:'¿Cómo prefieres manejar las visitas o estadías de otras personas?', options:['Siempre avisar antes','Avisar solo si se quedan a dormir','Libertad total','Prefiero que no haya visitas frecuentes'] },
      { id:'val_overnight', type:'select', label:'¿Cómo te sientes respecto a que una pareja se quede a dormir frecuentemente?', options:['Sin problema','Avisar con anticipación','Preferiría que fuera ocasional','Me incomoda'] }
    ],
    sociabilidad: [
      { id:'soc_interact', type:'likert7', label:'¿Qué tan seguido te gustaría interactuar con tu compañero/a de depto?' },
      { id:'soc_meals', type:'select', label:'¿Te gustaría compartir comidas?', options:['Sí, seguido','A veces','Prefiero comer por mi cuenta','Indiferente'] },
      { id:'soc_common', type:'likert7', label:'¿Qué tan importante es para ti pasar tiempo en los espacios comunes del hogar?' },
      { id:'soc_alone', type:'likert7', label:'¿Qué tanto necesitas tiempo a solas en tu hogar?' }
    ],
    conflictos: [
      { id:'con_style', type:'select', label:'Cuando hay un desacuerdo en la convivencia, ¿cómo prefieres resolverlo?', options:['Conversarlo directamente al momento','Esperar un rato y luego conversar','Escribir un mensaje','Prefiero evitar el tema'] },
      { id:'con_tolerance', type:'likert7', label:'¿Qué tan tolerante eres con hábitos distintos a los tuyos?' },
      { id:'con_dealbreaker', type:'multi', label:'¿Hay algo que consideres condición indispensable? (puedes elegir varias)', options:['No fumar dentro de la casa','No tener mascotas','Respetar horarios de silencio','Limpieza regular de espacios comunes','Avisar antes de traer visitas','Ninguna condición indispensable'] },
      { id:'con_comment', type:'text', label:'¿Algo más que quieras mencionar sobre tu forma de convivir?', placeholder:'Opcional', required:false }
    ]
  };

  var LIKERT_LABELS = ['Muy en desacuerdo','En desacuerdo','Algo en desacuerdo','Ni de acuerdo ni en desacuerdo','Algo de acuerdo','De acuerdo','Muy de acuerdo'];

  /* ─── State ─── */
  var answers = {};
  var currentModule = 0;
  var heroEl = document.querySelector('.aj-hero');
  var surveySection = document.getElementById('survey-section');
  var resultsSection = document.getElementById('results-section');
  var inviteSection = document.getElementById('invite-section');
  var rentalSection = document.getElementById('rental-section');

  function hideAll(){
    heroEl.hidden = true;
    surveySection.hidden = true;
    resultsSection.hidden = true;
    inviteSection.hidden = true;
    rentalSection.hidden = true;
  }
  function showHero(){
    heroEl.hidden = false;
    surveySection.hidden = true;
    resultsSection.hidden = true;
    inviteSection.hidden = true;
    rentalSection.hidden = true;
    window.scrollTo(0,0);
  }

  /* ─── Path buttons ─── */
  var pathFind = document.getElementById('path-find');
  var pathInvite = document.getElementById('path-invite');

  if(pathFind) pathFind.addEventListener('click', function(){
    hideAll();
    surveySection.hidden = false;
    currentModule = 0;
    renderSurvey();
    window.scrollTo(0,0);
  });
  if(pathInvite) pathInvite.addEventListener('click', function(){
    hideAll();
    inviteSection.hidden = false;
    window.scrollTo(0,0);
  });

  /* ─── Survey rendering ─── */
  var stepsEl = document.getElementById('survey-steps');
  var panelEl = document.getElementById('survey-panel');
  var barEl = document.getElementById('survey-bar');
  var prevBtn = document.getElementById('survey-prev');
  var nextBtn = document.getElementById('survey-next');
  var saveBtn = document.getElementById('survey-save');
  var backBtn = document.getElementById('survey-back');

  if(backBtn) backBtn.addEventListener('click', showHero);
  if(prevBtn) prevBtn.addEventListener('click', function(){
    if(currentModule > 0){ currentModule--; renderSurvey(); }
  });
  if(nextBtn) nextBtn.addEventListener('click', function(){
    saveCurrentAnswers();
    if(currentModule < MODULES.length - 1){
      currentModule++;
      renderSurvey();
      window.scrollTo(0, surveySection.offsetTop - 20);
    } else {
      showResults();
    }
  });
  if(saveBtn) saveBtn.addEventListener('click', function(){
    saveCurrentAnswers();
    alert('Respuestas guardadas (demostración). En la versión real se guardarían en tu cuenta.');
  });

  function renderSurvey(){
    var pct = Math.round((currentModule / MODULES.length) * 100);
    barEl.style.width = pct + '%';

    stepsEl.innerHTML = MODULES.map(function(m, i){
      var cls = i < currentModule ? 'aj-step done' : (i === currentModule ? 'aj-step active' : 'aj-step');
      return '<div class="' + cls + '">' + m.short + '</div>';
    }).join('');

    var mod = MODULES[currentModule];
    var qs = QUESTIONS[mod.id] || [];
    var html = '<h3 class="aj-panel-title">' + esc(mod.title) + '</h3>';

    qs.forEach(function(q){
      if(q.conditional){
        var parts = q.conditional.split(':');
        if(answers[parts[0]] !== parts[1]) return;
      }
      html += renderQuestion(q);
    });

    panelEl.innerHTML = html;
    prevBtn.disabled = currentModule === 0;
    nextBtn.textContent = currentModule === MODULES.length - 1 ? 'Ver resultados' : 'Continuar';

    // Restore answers
    panelEl.querySelectorAll('[data-qid]').forEach(function(el){
      var qid = el.dataset.qid;
      if(answers[qid] !== undefined){
        if(el.tagName === 'INPUT' && el.type === 'text') el.value = answers[qid];
        else if(el.tagName === 'INPUT' && el.type === 'email') el.value = answers[qid];
        else if(el.tagName === 'SELECT') el.value = answers[qid];
      }
    });

    // Restore likert
    panelEl.querySelectorAll('.aj-likert').forEach(function(group){
      var qid = group.dataset.qid;
      if(answers[qid] !== undefined){
        var btns = group.querySelectorAll('button');
        btns.forEach(function(b){ b.classList.toggle('selected', Number(b.dataset.val) === answers[qid]); });
      }
    });

    // Restore multi
    panelEl.querySelectorAll('.aj-multi').forEach(function(group){
      var qid = group.dataset.qid;
      if(answers[qid] && Array.isArray(answers[qid])){
        group.querySelectorAll('label input').forEach(function(cb){
          cb.checked = answers[qid].indexOf(cb.value) !== -1;
        });
      }
    });

    // Likert click handlers
    panelEl.querySelectorAll('.aj-likert').forEach(function(group){
      group.addEventListener('click', function(e){
        var btn = e.target.closest('button');
        if(!btn) return;
        group.querySelectorAll('button').forEach(function(b){ b.classList.remove('selected'); });
        btn.classList.add('selected');
        answers[group.dataset.qid] = Number(btn.dataset.val);
      });
    });
  }

  function renderQuestion(q){
    var html = '';
    if(q.type === 'info'){
      return '<div class="aj-q-info"><p>' + esc(q.text) + '</p></div>';
    }
    if(q.type === 'text'){
      html += '<div class="aj-q"><label for="q-' + q.id + '">' + esc(q.label) + '</label>';
      html += '<input type="text" id="q-' + q.id + '" data-qid="' + q.id + '" placeholder="' + esc(q.placeholder || '') + '"' + (q.required ? ' required' : '') + '>';
      html += '</div>';
      return html;
    }
    if(q.type === 'select'){
      html += '<div class="aj-q"><label for="q-' + q.id + '">' + esc(q.label) + '</label>';
      html += '<select id="q-' + q.id + '" data-qid="' + q.id + '"><option value="">Seleccionar...</option>';
      q.options.forEach(function(o){ html += '<option value="' + esc(o) + '">' + esc(o) + '</option>'; });
      if(q.sentinel) html += '<option value="75">Indiferente</option><option value="99">Prefiero no responder</option>';
      html += '</select></div>';
      return html;
    }
    if(q.type === 'likert7'){
      html += '<div class="aj-q"><p class="aj-q-label">' + esc(q.label) + '</p>';
      html += '<div class="aj-likert" data-qid="' + q.id + '">';
      LIKERT_LABELS.forEach(function(l, i){
        html += '<button type="button" class="aj-likert-btn" data-val="' + (i+1) + '" title="' + esc(l) + '"><span class="aj-likert-num">' + (i+1) + '</span><span class="aj-likert-label">' + esc(l) + '</span></button>';
      });
      html += '</div></div>';
      return html;
    }
    if(q.type === 'multi'){
      html += '<div class="aj-q"><p class="aj-q-label">' + esc(q.label) + '</p>';
      html += '<div class="aj-multi" data-qid="' + q.id + '">';
      q.options.forEach(function(o){
        html += '<label class="aj-check"><input type="checkbox" value="' + esc(o) + '"> ' + esc(o) + '</label>';
      });
      html += '</div></div>';
      return html;
    }
    return '';
  }

  function saveCurrentAnswers(){
    panelEl.querySelectorAll('[data-qid]').forEach(function(el){
      var qid = el.dataset.qid;
      if(el.tagName === 'INPUT' && (el.type === 'text' || el.type === 'email')){
        if(el.value.trim()) answers[qid] = el.value.trim();
      } else if(el.tagName === 'SELECT'){
        if(el.value) answers[qid] = el.value;
      }
    });
    panelEl.querySelectorAll('.aj-multi').forEach(function(group){
      var qid = group.dataset.qid;
      var vals = [];
      group.querySelectorAll('input:checked').forEach(function(cb){ vals.push(cb.value); });
      if(vals.length) answers[qid] = vals;
    });
  }

  /* ─── Matching results (demo) ─── */
  var DEMO_RESULTS = [
    { dimension:'Hábitos de sueño', status:'coincidencia', icon:'match', explanation:'Ambos prefieren acostarse entre 22:00 y medianoche y levantarse temprano.' },
    { dimension:'Limpieza y orden', status:'diferencia_para_conversar', icon:'talk', explanation:'Tienen expectativas distintas sobre la frecuencia de limpieza. Conviene conversarlo antes.' },
    { dimension:'Ruido y espacios comunes', status:'coincidencia', icon:'match', explanation:'Ambos valoran un nivel moderado de silencio y respetan los horarios.' },
    { dimension:'Mascotas', status:'condicion_importante', icon:'alert', explanation:'Una persona tiene mascota y la otra indicó que prefiere vivir sin mascotas. Es importante conversar esto.' },
    { dimension:'Sociabilidad', status:'coincidencia', icon:'match', explanation:'Nivel similar de sociabilidad y frecuencia de visitas.' },
    { dimension:'Manejo de conflictos', status:'diferencia_para_conversar', icon:'talk', explanation:'Prefieren estilos distintos para resolver desacuerdos. Recomendamos conversar sobre cómo abordarían situaciones de tensión.' },
    { dimension:'Personalidad (Big Five)', status:'datos_insuficientes', icon:'pending', explanation:'No se completaron todas las preguntas de personalidad. No es posible evaluar esta dimensión.' }
  ];

  var STATUS_LABEL = {
    coincidencia: 'Coincidencia',
    diferencia_para_conversar: 'Para conversar',
    condicion_importante: 'Condición importante',
    datos_insuficientes: 'Datos insuficientes'
  };
  var STATUS_CLASS = {
    coincidencia: 'aj-match',
    diferencia_para_conversar: 'aj-talk',
    condicion_importante: 'aj-alert',
    datos_insuficientes: 'aj-pending'
  };

  function showResults(){
    hideAll();
    resultsSection.hidden = false;
    window.scrollTo(0,0);
    var cardsEl = document.getElementById('match-cards');
    cardsEl.innerHTML = DEMO_RESULTS.map(function(r){
      return '<div class="aj-result-card ' + STATUS_CLASS[r.status] + '">'
        + '<div class="aj-result-header">'
        + '<span class="aj-result-status">' + esc(STATUS_LABEL[r.status]) + '</span>'
        + '<h4>' + esc(r.dimension) + '</h4>'
        + '</div>'
        + '<p>' + esc(r.explanation) + '</p>'
        + '</div>';
    }).join('');
  }

  var resultsBack = document.getElementById('results-back');
  if(resultsBack) resultsBack.addEventListener('click', showHero);

  var resultsContact = document.getElementById('results-contact');
  if(resultsContact) resultsContact.addEventListener('click', function(){
    alert('Solicitud de contacto enviada (demostración). La otra persona debe aceptar para compartir datos.');
  });

  var resultsSearch = document.getElementById('results-search');
  if(resultsSearch) resultsSearch.addEventListener('click', function(){
    hideAll();
    rentalSection.hidden = false;
    renderRental();
    window.scrollTo(0,0);
  });

  /* ─── Invite flow ─── */
  var inviteBack = document.getElementById('invite-back');
  if(inviteBack) inviteBack.addEventListener('click', showHero);

  var inviteSend = document.getElementById('invite-send');
  if(inviteSend) inviteSend.addEventListener('click', function(){
    var name = document.getElementById('invite-name').value.trim();
    var email = document.getElementById('invite-email').value.trim();
    if(!name || !email){
      alert('Completa nombre y correo.');
      return;
    }
    document.querySelector('.aj-invite-form').hidden = true;
    var status = document.getElementById('invite-status');
    status.hidden = false;
    document.getElementById('invite-msg').textContent = 'Se envió una invitación a ' + name + ' (' + email + ').';
    document.getElementById('invite-members').innerHTML =
      '<div class="aj-member"><span class="aj-member-dot aj-member-you"></span> Tú <span class="aj-member-tag">Conectado</span></div>'
      + '<div class="aj-member"><span class="aj-member-dot aj-member-pending"></span> ' + esc(name) + ' <span class="aj-member-tag pending">Pendiente</span></div>';
  });

  var simAccept = document.getElementById('invite-sim-accept');
  if(simAccept) simAccept.addEventListener('click', function(){
    var dots = document.querySelectorAll('.aj-member-pending');
    dots.forEach(function(d){ d.classList.remove('aj-member-pending'); d.classList.add('aj-member-you'); });
    var tags = document.querySelectorAll('.aj-member-tag.pending');
    tags.forEach(function(t){ t.textContent = 'Conectado'; t.classList.remove('pending'); });
    simAccept.hidden = true;
    document.getElementById('joint-section').hidden = false;
  });

  var jointSearch = document.getElementById('joint-search');
  if(jointSearch) jointSearch.addEventListener('click', function(){
    hideAll();
    rentalSection.hidden = false;
    renderRental();
    window.scrollTo(0,0);
  });

  /* ─── Joint rental demo ─── */
  var rentalBack = document.getElementById('rental-back');
  if(rentalBack) rentalBack.addEventListener('click', showHero);

  function renderRental(){
    var groupEl = document.getElementById('rental-group');
    groupEl.innerHTML =
      '<h3>Grupo de búsqueda</h3>'
      + '<div class="aj-rental-members">'
      + '<div class="aj-rental-member"><b>Tú</b><span class="aj-member-tag">Presupuesto: $400.000</span><span class="aj-member-tag">Autorizado</span></div>'
      + '<div class="aj-rental-member"><b>Compañero/a</b><span class="aj-member-tag">Presupuesto: $350.000</span><span class="aj-member-tag">Autorizado</span></div>'
      + '</div>'
      + '<p class="aj-rental-total">Presupuesto conjunto: $750.000/mes</p>'
      + '<button type="button" class="btn btn-brand" id="rental-view-props">Ver propiedades disponibles</button>';

    document.getElementById('rental-view-props').addEventListener('click', function(){
      renderContracts();
    });

    var contractsEl = document.getElementById('rental-contracts');
    contractsEl.innerHTML = '';
    document.getElementById('cohabitation-section').hidden = true;
  }

  function renderContracts(){
    var contractsEl = document.getElementById('rental-contracts');
    contractsEl.innerHTML =
      '<h3>Contratos individuales</h3>'
      + '<p>Cada persona tiene su propio contrato con el propietario. Esta es una demostración.</p>'
      + '<span class="kyc-demo">Demostración</span>'
      + '<div class="aj-contracts-grid">'
      + '<div class="aj-contract-card">'
      + '<h4>Contrato — Persona 1 (tú)</h4>'
      + '<dl class="aj-contract-dl">'
      + '<dt>Propiedad</dt><dd>Depto. en Providencia</dd>'
      + '<dt>Renta individual</dt><dd>$400.000/mes</dd>'
      + '<dt>Plazo</dt><dd>12 meses</dd>'
      + '<dt>Fecha inicio</dt><dd>1 de enero 2027</dd>'
      + '</dl>'
      + '<button type="button" class="btn btn-outline-brand aj-contract-btn">Simular revisión de contrato</button>'
      + '</div>'
      + '<div class="aj-contract-card">'
      + '<h4>Contrato — Persona 2</h4>'
      + '<dl class="aj-contract-dl">'
      + '<dt>Propiedad</dt><dd>Depto. en Providencia</dd>'
      + '<dt>Renta individual</dt><dd>$350.000/mes</dd>'
      + '<dt>Plazo</dt><dd>12 meses</dd>'
      + '<dt>Fecha inicio</dt><dd>1 de enero 2027</dd>'
      + '</dl>'
      + '<button type="button" class="btn btn-outline-brand aj-contract-btn">Simular revisión de contrato</button>'
      + '</div>'
      + '</div>'
      + '<p class="aj-contract-note">La viabilidad de contratos individuales, la responsabilidad sobre la renta total y la salida anticipada de un coarrendatario requieren revisión legal y consentimiento del propietario. Lofti no custodia garantías.</p>'
      + '<button type="button" class="btn btn-brand" id="rental-to-cohab">Opcional: acuerdo de convivencia</button>';

    contractsEl.querySelectorAll('.aj-contract-btn').forEach(function(btn){
      btn.addEventListener('click', function(){
        btn.textContent = 'Confirmar en demostración';
        btn.classList.remove('btn-outline-brand');
        btn.classList.add('btn-brand');
        btn.addEventListener('click', function(){
          btn.disabled = true;
          btn.textContent = 'Revisado (demo)';
        }, {once:true});
      }, {once:true});
    });

    document.getElementById('rental-to-cohab').addEventListener('click', function(){
      document.getElementById('cohabitation-section').hidden = false;
      renderCohabitation();
      document.getElementById('cohabitation-section').scrollIntoView({behavior:'smooth'});
    });
  }

  /* ─── Cohabitation agreement ─── */
  var COHAB_TOPICS = [
    { id:'clean', title:'Limpieza', question:'¿Cómo van a organizar la limpieza de espacios comunes?' },
    { id:'visits', title:'Visitas', question:'¿Qué acuerdos tendrán sobre visitas y personas que se queden a dormir?' },
    { id:'spaces', title:'Espacios comunes', question:'¿Cómo van a usar la cocina, el baño y el living?' },
    { id:'bills', title:'Cuentas compartidas', question:'¿Cómo van a dividir las cuentas de servicios básicos?' },
    { id:'schedule', title:'Horarios', question:'¿Hay horarios de silencio o uso de espacios que quieran acordar?' },
    { id:'pets', title:'Mascotas', question:'¿Hay acuerdos sobre mascotas en el hogar?' },
    { id:'disagreements', title:'Desacuerdos', question:'¿Cómo van a resolver desacuerdos de convivencia?' }
  ];

  function renderCohabitation(){
    var topicsEl = document.getElementById('cohab-topics');
    topicsEl.innerHTML = COHAB_TOPICS.map(function(t){
      return '<div class="aj-cohab-topic">'
        + '<h4>' + esc(t.title) + '</h4>'
        + '<p>' + esc(t.question) + '</p>'
        + '<textarea data-topic="' + t.id + '" placeholder="Escriban su acuerdo aquí o dejen en blanco para retomarlo después" rows="2"></textarea>'
        + '</div>';
    }).join('');

    var confirmBtn = document.getElementById('cohab-confirm');
    confirmBtn.addEventListener('click', function(){
      var filled = 0;
      topicsEl.querySelectorAll('textarea').forEach(function(ta){
        if(ta.value.trim()) filled++;
      });
      confirmBtn.textContent = 'Acuerdos registrados (' + filled + '/' + COHAB_TOPICS.length + ' temas) — demo';
      confirmBtn.disabled = true;
    }, {once:true});
  }

  // Initialize: show hero
  if(heroEl) heroEl.hidden = false;
})();
