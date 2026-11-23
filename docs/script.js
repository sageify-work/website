(function () {
  'use strict';

  const year = document.getElementById('year');
  if (year) year.textContent = String(new Date().getFullYear());

  const header = document.querySelector('.site-header');
  const toggle = document.querySelector('.menu-toggle');
  const menu = document.querySelector('.main-nav');

  function closeMenu() {
    if (!toggle || !menu) return;
    menu.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'פתיחת תפריט ניווט');
  }
  if (toggle && menu) {
    toggle.addEventListener('click', function () {
      const open = menu.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'סגירת תפריט ניווט' : 'פתיחת תפריט ניווט');
    });
    menu.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
    document.addEventListener('click', function (event) {
      if (!menu.contains(event.target) && !toggle.contains(event.target)) closeMenu();
    });
    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && menu.classList.contains('is-open')) { closeMenu(); toggle.focus(); }
    });
    window.addEventListener('resize', function () { if (window.innerWidth > 900) closeMenu(); });
  }
  if (header) {
    const update = () => header.classList.toggle('is-scrolled', window.scrollY > 10);
    update();
    window.addEventListener('scroll', update, { passive: true });
  }

  // The builder is a static illustration: no assessment is run and no answers are stored.
  const audiences = {
    young: { label: 'צעירים בתחילת הדרך', short: 'צעירים', description: 'מיפוי תחומי עניין, יכולות וכיווני לימודים והכשרה לשלב הכניסה לעולם התעסוקה.', stages: ['שאלון נטיות', 'משימות יכולת', 'שיחת AI', 'תובנות להמשך'] },
    haredi: { label: 'החברה החרדית', short: 'החברה החרדית', description: 'בחירת כלים ומסרים בשפה מותאמת ובהקשרים רלוונטיים למסלולי הלימוד והתעסוקה, תוך בחינת הוגנות מקצועית.', stages: ['התאמת שפה והקשר', 'נטיות וכישורים', 'שיחת AI', 'הכוונה למסלולים'] },
    arab: { label: 'החברה הערבית', short: 'החברה הערבית', description: 'התאמה לשפה ולהקשר התרבותי והחברתי, לצד בחינה מקצועית של יכולות והזדמנויות התפתחות.', stages: ['התאמת שפה', 'שאלוני נטיות', 'משימות יכולת', 'תובנות מותאמות'] },
    employees: { label: 'עובדים ומנהלים', short: 'עובדים ומנהלים', description: 'מיפוי כישורים, מיומנויות רכות ופוטנציאל התפתחות בהתאם לתפקידים ולמטרות הארגון.', stages: ['מיפוי כישורים', 'התנסויות', 'שיחת AI', 'דוח לצוות מורשה'] },
    senior: { label: 'הגיל השלישי ופורשים', short: 'פורשים', description: 'הערכת ניסיון מצטבר, תחומי עניין ומוטיבציות לקראת שינוי תעסוקתי או עיסוק משמעותי לאחר הפרישה.', stages: ['ניסיון מצטבר', 'נטיות ומוטיבציות', 'שיחת AI', 'כיווני המשך'] },
    candidates: { label: 'מועמדים לתפקידים ייחודיים', short: 'מועמדים', description: 'בחירת מדדים ומשימות לפי דרישות תפקיד מוגדרות, תוך שימוש בכלי אבחון הרלוונטיים להקשר.', stages: ['דרישות תפקיד', 'מדדי התאמה', 'התנסות רלוונטית', 'דוח הערכה'] }
  };
  const goals = {
    guidance: { label: 'הכוונה', suffix: 'הכוונה והתפתחות' },
    screening: { label: 'מיון', suffix: 'מיון והתאמה' },
    mapping: { label: 'מיפוי יכולות', suffix: 'הערכה ומיפוי יכולות' }
  };
  const audienceInput = document.getElementById('audience-select');
  const goalInput = document.getElementById('goal-select');
  const resultTitle = document.getElementById('result-title');
  const resultDescription = document.getElementById('result-description');
  const resultStages = document.getElementById('result-stages');
  function updateBuilder() {
    if (!audienceInput || !goalInput || !resultTitle || !resultStages || !resultDescription) return;
    const audience = audiences[audienceInput.value];
    const goal = goals[goalInput.value];
    if (!audience || !goal) return;
    resultTitle.textContent = goal.label + ' · ' + audience.short;
    const focus = goalInput.value === 'screening' ? ' מוקד התהליך: בחינת התאמה לדרישות שהארגון הגדיר.' :
      goalInput.value === 'mapping' ? ' מוקד התהליך: מיפוי יכולות לצורכי קבלת החלטות ופיתוח.' :
        ' מוקד התהליך: הפקת כיווני המשך רלוונטיים.';
    resultDescription.textContent = audience.description + focus;
    const stages = audience.stages.slice();
    if (goalInput.value === 'screening') stages[stages.length - 1] = 'דוח התאמה';
    if (goalInput.value === 'mapping') stages[stages.length - 1] = 'דוח מיפוי';
    resultStages.replaceChildren(...stages.map(stage => {
      const item = document.createElement('span');
      item.textContent = stage;
      return item;
    }));
  }
  if (audienceInput && goalInput) {
    audienceInput.addEventListener('change', updateBuilder);
    goalInput.addEventListener('change', updateBuilder);
    updateBuilder();
  }

  // Optional secure lead integration. Define SAGEIFY_LEAD_ENDPOINT as a same-origin
  // HTTPS POST handler in deployment configuration; do not submit to unknown third parties.
  // Example: window.SAGEIFY_LEAD_ENDPOINT = '/api/contact';
  // Expected successful HTTP 2xx. Backend must implement validation, rate limits,
  // appropriate retention, consent logging, and anti-spam measures.
  const form = document.getElementById('lead-form');
  const status = document.getElementById('form-status');
  function showStatus(message, kind) {
    if (!status) return;
    status.textContent = message;
    status.className = 'form-status ' + (kind || '');
  }
  if (form) {
    form.addEventListener('submit', async function (event) {
      event.preventDefault();
      if (!form.reportValidity()) return;
      const consent = document.getElementById('lead-consent');
      if (!consent || !consent.checked) {
        showStatus('יש לאשר שימוש בפרטי הקשר לצורך המענה לפנייה.', 'error');
        consent?.focus();
        return;
      }
      const endpoint = window.SAGEIFY_LEAD_ENDPOINT;
      if (typeof endpoint !== 'string' || !endpoint.startsWith('/') || endpoint.startsWith('//')) {
        showStatus('מערכת תיאום ההדגמה עדיין אינה מחוברת. הפנייה לא נשלחה. יש לחבר כתובת שרת מאובטחת לפני פרסום האתר.', 'error');
        return;
      }
      const button = form.querySelector('button[type="submit"]');
      const payload = Object.fromEntries(new FormData(form).entries());
      payload.consent = true;
      payload.source = 'sageify-website';
      const previousText = button.textContent;
      button.disabled = true;
      button.textContent = 'שולח פנייה…';
      showStatus('שולח את הפנייה…');
      try {
        const response = await fetch(endpoint, {
          method: 'POST',
          credentials: 'same-origin',
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body: JSON.stringify(payload)
        });
        if (!response.ok) throw new Error('Request not accepted');
        showStatus('הפנייה נשלחה בהצלחה. נחזור אליכם בהקדם.', 'success');
        form.reset();
      } catch (_error) {
        showStatus('לא ניתן היה לשלוח את הפנייה. בדקו את החיבור ונסו שוב.', 'error');
      } finally {
        button.disabled = false;
        button.textContent = previousText;
      }
    });
  }
})();
