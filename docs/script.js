(function () {
  'use strict';

  const isEnglish = document.documentElement.lang === 'en';
  const tr = (he, en) => isEnglish ? en : he;

  // Preserve the current section when switching languages.
  document.querySelectorAll('[data-lang-link]').forEach(link => {
    link.addEventListener('click', event => {
      const target = link.getAttribute('href');
      if (!target || !window.location.hash) return;
      event.preventDefault();
      window.location.assign(target + window.location.hash);
    });
  });

  const year = document.getElementById('year');
  if (year) year.textContent = String(new Date().getFullYear());

  const header = document.querySelector('.site-header');
  const toggle = document.querySelector('.menu-toggle');
  const menu = document.querySelector('.main-nav');

  function closeMenu() {
    if (!toggle || !menu) return;
    menu.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', tr('פתיחת תפריט ניווט', 'Open navigation menu'));
  }
  if (toggle && menu) {
    toggle.addEventListener('click', function () {
      const open = menu.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? tr('סגירת תפריט ניווט', 'Close navigation menu') : tr('פתיחת תפריט ניווט', 'Open navigation menu'));
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
  const audiences = isEnglish ? {
    young: { label: 'Young adults starting out', short: 'young adults', description: 'Explore interests, capabilities and education or training options for those entering the workforce.', stages: ['Interests questionnaire', 'Ability tasks', 'AI conversation', 'Next-step insights'] },
    haredi: { label: 'Haredi communities', short: 'Haredi communities', description: 'Adapt tools and language to relevant educational and employment contexts while evaluating fairness and professional relevance.', stages: ['Language & context', 'Interests & skills', 'AI conversation', 'Career pathways'] },
    arab: { label: 'Arab communities', short: 'Arab communities', description: 'Consider language, cultural and social context while professionally evaluating capabilities and opportunities for development.', stages: ['Language adaptation', 'Interest measures', 'Ability tasks', 'Tailored insights'] },
    employees: { label: 'Employees and managers', short: 'employees and managers', description: 'Map competencies, soft skills and growth potential in relation to organizational goals and positions.', stages: ['Skills mapping', 'Interactive tasks', 'AI conversation', 'Authorized-team report'] },
    senior: { label: 'Older adults and retirees', short: 'older adults and retirees', description: 'Explore accumulated experience, interests and motivations for professional transitions or meaningful activity after retirement.', stages: ['Experience review', 'Interests & motivation', 'AI conversation', 'Possible next steps'] },
    candidates: { label: 'Candidates for specialized roles', short: 'specialized candidates', description: 'Select measures and tasks aligned with the requirements of a particular role and assessment context.', stages: ['Role requirements', 'Fit measures', 'Relevant tasks', 'Evaluation report'] }
  } : {
    young: { label: 'צעירים בתחילת הדרך', short: 'צעירים', description: 'מיפוי תחומי עניין, יכולות וכיווני לימודים והכשרה לשלב הכניסה לעולם התעסוקה.', stages: ['שאלון נטיות', 'משימות יכולת', 'שיחת AI', 'תובנות להמשך'] },
    haredi: { label: 'החברה החרדית', short: 'החברה החרדית', description: 'בחירת כלים ומסרים בשפה מותאמת ובהקשרים רלוונטיים למסלולי הלימוד והתעסוקה, תוך בחינת הוגנות מקצועית.', stages: ['התאמת שפה והקשר', 'נטיות וכישורים', 'שיחת AI', 'הכוונה למסלולים'] },
    arab: { label: 'החברה הערבית', short: 'החברה הערבית', description: 'התאמה לשפה ולהקשר התרבותי והחברתי, לצד בחינה מקצועית של יכולות והזדמנויות התפתחות.', stages: ['התאמת שפה', 'שאלוני נטיות', 'משימות יכולת', 'תובנות מותאמות'] },
    employees: { label: 'עובדים ומנהלים', short: 'עובדים ומנהלים', description: 'מיפוי כישורים, מיומנויות רכות ופוטנציאל התפתחות בהתאם לתפקידים ולמטרות הארגון.', stages: ['מיפוי כישורים', 'התנסויות', 'שיחת AI', 'דוח לצוות מורשה'] },
    senior: { label: 'הגיל השלישי ופורשים', short: 'פורשים', description: 'הערכת ניסיון מצטבר, תחומי עניין ומוטיבציות לקראת שינוי תעסוקתי או עיסוק משמעותי לאחר הפרישה.', stages: ['ניסיון מצטבר', 'נטיות ומוטיבציות', 'שיחת AI', 'כיווני המשך'] },
    candidates: { label: 'מועמדים לתפקידים ייחודיים', short: 'מועמדים', description: 'בחירת מדדים ומשימות לפי דרישות תפקיד מוגדרות, תוך שימוש בכלי אבחון הרלוונטיים להקשר.', stages: ['דרישות תפקיד', 'מדדי התאמה', 'התנסות רלוונטית', 'דוח הערכה'] }
  };
  const goals = isEnglish ? {
    guidance: { label: 'Guidance', suffix: 'Guidance and development' },
    screening: { label: 'Screening', suffix: 'Screening and fit' },
    mapping: { label: 'Skills mapping', suffix: 'Evaluation and skills mapping' }
  } : {
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
    const focus = goalInput.value === 'screening'
      ? tr(' מוקד התהליך: בחינת התאמה לדרישות שהארגון הגדיר.', ' Focus: evaluating fit against the requirements defined by your organization.')
      : goalInput.value === 'mapping'
        ? tr(' מוקד התהליך: מיפוי יכולות לצורכי קבלת החלטות ופיתוח.', ' Focus: mapping skills to support development and decisions.')
        : tr(' מוקד התהליך: הפקת כיווני המשך רלוונטיים.', ' Focus: identifying relevant options and next steps.');
    resultDescription.textContent = audience.description + focus;
    const stages = audience.stages.slice();
    if (goalInput.value === 'screening') stages[stages.length - 1] = tr('דוח התאמה', 'Fit report');
    if (goalInput.value === 'mapping') stages[stages.length - 1] = tr('דוח מיפוי', 'Skills report');
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
        showStatus(tr('יש לאשר שימוש בפרטי הקשר לצורך מענה לפנייה.', 'Please agree to the use of your contact information so we can respond to your inquiry.'), 'error');
        consent?.focus();
        return;
      }
      // A low-friction spam trap. The hidden field must remain empty.
      const honeypot = document.getElementById('lead-website');
      if (honeypot && honeypot.value) {
        showStatus(tr('לא ניתן לשלוח את הטופס. אנא רעננו את העמוד ונסו שוב.', 'This form could not be submitted. Refresh the page and try again.'), 'error');
        return;
      }
      const config = emailJsConfig();
      if (!config) {
        showStatus(tr('שליחת הפניות אינה זמינה כרגע. נסו שוב מאוחר יותר או צרו קשר ישירות.', 'The inquiry form is currently unavailable. Please try again later or contact us directly.'), 'error');
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
      const dateTime = new Date().toLocaleString(isEnglish ? 'en-GB' : 'he-IL', { dateStyle: 'short', timeStyle: 'short' });
      // Keep the email recipient fixed inside the EmailJS template's "To Email"
      // setting. Never accept or send recipient addresses from the public form.
      const params = {
        from_name: name,
        name,
        organization,
        role: role || tr('לא צוין', 'Not provided'),
        from_email: email,
        reply_to: email,
        email,
        phone: phone || tr('לא צוין', 'Not provided'),
        interest: interestLabel,
        interest_code: interestCode,
        submitted_at: dateTime,
        page_url: window.location.href.slice(0, 500),
        consent: tr('אושר לצורך מענה לפנייה', 'Agreed for inquiry response'),
        message: [
          tr('פנייה חדשה לתיאום הדגמה באתר Sageify', 'New Sageify demo request'),
          tr('שם: ', 'Name: ') + name,
          tr('ארגון: ', 'Organization: ') + organization,
          tr('תפקיד: ', 'Role: ') + (role || tr('לא צוין', 'Not provided')),
          tr('מייל: ', 'Email: ') + email,
          tr('טלפון: ', 'Phone: ') + (phone || tr('לא צוין', 'Not provided')),
          tr('תחום עניין: ', 'Area of interest: ') + interestLabel,
          tr('זמן הפנייה: ', 'Submitted at: ') + dateTime
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
      button.textContent = tr('שולח את הפנייה…', 'Sending your request…');
      showStatus(tr('שולח את הפנייה…', 'Sending your request…'));
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
        showStatus(tr('הפנייה נשלחה בהצלחה! ניצור איתכם קשר בהקדם.', 'Your request was sent successfully. We will be in touch soon.'), 'success');
        form.reset();
      } catch (error) {
        if (error && error.name === 'AbortError') {
          showStatus(tr('לא התקבל אישור משלוח. ייתכן שהפנייה נשלחה; מומלץ לבדוק לפני ניסיון נוסף.', 'We did not receive confirmation. Your request may have been sent; please check before trying again.'), 'error');
        } else {
          showStatus(tr('לא הצלחנו לשלוח את הפנייה. הפרטים נשארו בטופס כדי שתוכלו לנסות שוב.', 'We could not send your request. Your details remain in the form so you can try again.'), 'error');
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
