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

  // Static GitHub Pages integration with EmailJS REST API.
  // Only public EmailJS IDs are read from emailjs-config.js. Never store private
  // keys, SMTP credentials, or the recipient email address in browser code.
  const form = document.getElementById('lead-form');
  const status = document.getElementById('form-status');
  const emailJsUrl = 'https://api.emailjs.com/api/v1.0/email/send';
  let isSending = false;

  function showStatus(message, kind) {
    if (!status) return;
    status.textContent = message;
    status.className = 'form-status ' + (kind || '');
  }

  function clean(value, maxLength) {
    return String(value || '').trim().slice(0, maxLength);
  }

  function emailJsConfig() {
    const config = window.SAGEIFY_EMAILJS;
    if (!config || typeof config !== 'object') return null;
    const publicKey = clean(config.publicKey, 120);
    const serviceId = clean(config.serviceId, 120);
    const templateId = clean(config.templateId, 120);
    // Reject missing or placeholder values; never pretend a form was sent.
    if (![publicKey, serviceId, templateId].every(value =>
      value && /^[a-zA-Z0-9_-]+$/.test(value) && !/(replace|your_|placeholder)/i.test(value)
    )) return null;
    return { publicKey, serviceId, templateId };
  }

  if (form) {
    form.addEventListener('submit', async function (event) {
      event.preventDefault();
      if (isSending) return;
      showStatus('');
      if (!form.reportValidity()) return;
      const consent = document.getElementById('lead-consent');
      if (!consent || !consent.checked) {
        showStatus('יש לאשר שימוש בפרטי הקשר לצורך מענה לפנייה.', 'error');
        consent?.focus();
        return;
      }
      // A low-friction spam trap. The hidden field must remain empty.
      const honeypot = document.getElementById('lead-website');
      if (honeypot && honeypot.value) {
        showStatus('לא ניתן לשלוח את הטופס. אנא רעננו את העמוד ונסו שוב.', 'error');
        return;
      }
      const config = emailJsConfig();
      if (!config) {
        showStatus('שליחת הפניות אינה זמינה כרגע. נסו שוב מאוחר יותר או צרו קשר ישירות.', 'error');
        return;
      }

      const fields = new FormData(form);
      const name = clean(fields.get('name'), 120);
      const organization = clean(fields.get('organization'), 150);
      const role = clean(fields.get('role'), 120);
      const email = clean(fields.get('email'), 250);
      const phone = clean(fields.get('phone'), 35);
      const interestCode = clean(fields.get('interest'), 60);
      const interestSelect = document.getElementById('lead-interest');
      const interestLabel = interestSelect && interestSelect.selectedOptions.length
        ? clean(interestSelect.selectedOptions[0].textContent, 120)
        : interestCode;
      const dateTime = new Date().toLocaleString('he-IL', { dateStyle: 'short', timeStyle: 'short' });
      // Keep the email recipient fixed inside the EmailJS template's "To Email"
      // setting. Never accept or send recipient addresses from the public form.
      const params = {
        from_name: name,
        name,
        organization,
        role: role || 'לא צוין',
        from_email: email,
        reply_to: email,
        email,
        phone: phone || 'לא צוין',
        interest: interestLabel,
        interest_code: interestCode,
        submitted_at: dateTime,
        page_url: window.location.href.slice(0, 500),
        consent: 'אושר לצורך מענה לפנייה',
        message: [
          'פנייה חדשה לתיאום הדגמה באתר Sageify',
          'שם: ' + name,
          'ארגון: ' + organization,
          'תפקיד: ' + (role || 'לא צוין'),
          'מייל: ' + email,
          'טלפון: ' + (phone || 'לא צוין'),
          'תחום עניין: ' + interestLabel,
          'זמן הפנייה: ' + dateTime
        ].join('\n')
      };

      const button = form.querySelector('button[type="submit"]');
      if (!button) return;
      const originalHtml = button.innerHTML;
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 20000);
      isSending = true;
      button.disabled = true;
      form.setAttribute('aria-busy', 'true');
      button.textContent = 'שולח את הפנייה…';
      showStatus('שולח את הפנייה…');
      try {
        const response = await fetch(emailJsUrl, {
          method: 'POST',
          mode: 'cors',
          credentials: 'omit',
          cache: 'no-store',
          headers: { 'Content-Type': 'application/json' },
          signal: controller.signal,
          body: JSON.stringify({
            service_id: config.serviceId,
            template_id: config.templateId,
            user_id: config.publicKey,
            template_params: params
          })
        });
        if (!response.ok) throw new Error('EmailJS request failed: ' + response.status);
        showStatus('הפנייה נשלחה בהצלחה! ניצור איתכם קשר בהקדם.', 'success');
        form.reset();
      } catch (error) {
        if (error && error.name === 'AbortError') {
          showStatus('לא התקבל אישור משלוח. ייתכן שהפנייה נשלחה; מומלץ לבדוק לפני ניסיון נוסף.', 'error');
        } else {
          showStatus('לא הצלחנו לשלוח את הפנייה. הפרטים נשארו בטופס כדי שתוכלו לנסות שוב.', 'error');
        }
      } finally {
        clearTimeout(timeout);
        isSending = false;
        form.removeAttribute('aria-busy');
        button.disabled = false;
        button.innerHTML = originalHtml;
      }
    });
  }
})();
