const app = document.querySelector('#app');
let route = 'user';
let selectedProject = 'user';
let demoWelcomeOpen = false;
let tourActive = false;
let tourFinished = false;
let purchaseOpen = false;
let scrollPopupShown = false;
let scrollPopupDismissed = false;
let bottomPopupShown = false;
let popupPhase = 'initial';
let paymentSubmitted = false;

const iconSet = ['⌂', '⌁', '◈', '◎', '♧', '▣', '◌', '⚙'];

function go(nextRoute) {
  if (nextRoute === 'user') {
    selectedProject = 'user';
    tourActive = false;
  }
  if (nextRoute === 'payment') {
    selectedProject = 'user';
    tourActive = false;
    paymentSubmitted = false;
    purchaseOpen = false;
  }
  route = nextRoute;
  demoWelcomeOpen = selectedProject === 'demo' && nextRoute === 'summary' && !sessionStorage.getItem('demo-tour-intro-seen') && !sessionStorage.getItem('demo-onboarding-dismissed');
  render();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function selectProject(project) {
  selectedProject = project;
  route = project === 'demo' ? 'summary' : 'user';
  demoWelcomeOpen = project === 'demo' && !sessionStorage.getItem('demo-tour-intro-seen') && !sessionStorage.getItem('demo-onboarding-dismissed');
  if (project === 'user') tourActive = false;
  render();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function closeWelcome() {
  demoWelcomeOpen = false;
  sessionStorage.setItem('demo-tour-intro-seen', '1');
  sessionStorage.setItem('demo-onboarding-dismissed', '1');
  tourActive = false;
  render();
}

function startTour() {
  demoWelcomeOpen = false;
  tourActive = true;
  tourFinished = false;
  sessionStorage.setItem('demo-tour-intro-seen', '1');
  render();
}

function stopTour() {
  demoWelcomeOpen = false;
  tourActive = false;
  tourFinished = true;
  sessionStorage.setItem('demo-onboarding-dismissed', '1');
  render();
}

function finishTour() {
  demoWelcomeOpen = false;
  tourActive = false;
  tourFinished = true;
  purchaseOpen = true;
  sessionStorage.setItem('demo-onboarding-dismissed', '1');
  render();
}

function sidebar(active) {
  return `<aside class="sidebar">
    <div class="side-rule"></div>
    <button class="side-item ${active === 'summary' ? 'active' : ''}" aria-label="Сводка" data-route="summary">${iconSet[0]}<span>Сводка</span></button>
    <button class="side-item ${active === 'competitors' ? 'active' : ''}" aria-label="Конкуренты" data-route="competitors">${iconSet[1]}<span>Конкуренты</span></button>
    <button class="side-item ${active === 'recommendations' ? 'active' : ''}" aria-label="Рекомендации" data-route="recommendations">${iconSet[4]}<span>Рекомендации</span></button>
  </aside>`;
}

function topbar() {
  return `<header class="topbar"><span class="hamburger">☰</span><span class="brand"><span class="brand-mark">▰</span>Пиксель Тулс</span><span class="topbar-spacer"></span><span class="topbar-user"><span class="avatar">A</span> a.lexei.il@yande…⌄</span></header>`;
}

function demoBanners() {
  return `${demoAccessBanner()}
  <div class="banner"><span>Вы просматриваете демо-данные. Проверим, как нейросети видят ваш бренд?</span><button class="btn btn-primary" data-project="user">Запустить мой проект</button></div>`;
}

function demoAccessBanner() {
  return `<div class="banner"><span class="banner-text"><span class="banner-icon">ⓘ</span>Вы находитесь в ограниченном демо-режиме. Получите полный доступ!</span><button class="btn btn-primary" data-route="payment">Доступ за 99 рублей на 30 дней</button></div>`;
}

function demoHero() {
  return `<div class="reference-hero"><img src="assets/demo-hero.png" alt="Готовы перейти от демо к своим данным? Запустите проект и измерьте результат" /><button class="reference-hero-hitbox" aria-label="Запустить мой проект" data-project="user"></button></div>`;
}

function filters() {
  return `<div class="filters"><span class="filter-label">Нейросети</span><span class="check"><b class="check-box">✓</b>Все</span><span class="check"><b class="check-box">✓</b>Поиск с Алисой</span><span class="check"><b class="check-box">✓</b>Google AI Overview</span><span class="check"><b class="check-box">✓</b>ChatGPT</span><span class="check"><b class="check-box">✓</b>Perplexity</span><span class="check"><b class="check-box">✓</b>DeepSeek</span><span class="field">▣ &nbsp;04.09.2026 - 04.10.2026</span><span class="field">Выберите группу промптов⌄</span></div>`;
}

function chart(kind = 'summary') {
  const lines = kind === 'competitors'
    ? [['#9c83e9','M40 75 C140 35 195 72 260 40 S375 95 440 53 S570 78 640 42'],['#c2df82','M40 53 C125 68 190 47 260 61 S370 45 440 60 S570 50 640 70'],['#ee879a','M40 66 C150 92 210 47 260 70 S390 62 440 98 S560 78 640 55'],['#d98d65','M40 112 C130 107 195 102 260 100 S380 88 440 122 S565 100 640 115']]
    : [['#72baf1','M40 46 C130 65 195 70 260 50 S380 67 440 48 S560 48 640 85'],['#5d91ed','M40 80 C140 64 195 87 260 50 S370 125 440 92 S560 76 640 94'],['#f26769','M40 80 C130 112 195 116 260 75 S380 70 440 73 S560 76 640 94'],['#2f8e90','M40 80 C125 95 190 112 260 100 S380 75 440 75 S560 88 640 115']];
  return `<svg class="chart" viewBox="0 0 680 160" preserveAspectRatio="none" aria-label="График видимости бренда"><g>${[20,50,80,110,140].map(y=>`<line class="chart-grid" x1="40" x2="650" y1="${y}" y2="${y}"/>`).join('')}${[40,150,260,370,480,590,650].map(x=>`<line class="chart-grid" x1="${x}" x2="${x}" y1="18" y2="145"/>`).join('')}</g>${lines.map(line=>`<path class="chart-line" stroke="${line[0]}" d="${line[1]}"/>`).join('')}<g class="chart-axis"><text x="10" y="24">90%</text><text x="10" y="84">50%</text><text x="10" y="145">0%</text><text x="35" y="158">07.09</text><text x="240" y="158">17.09</text><text x="430" y="158">22.09</text><text x="612" y="158">28.09</text></g></svg>`;
}

function projectSwitcher() {
  const isDemo = selectedProject === 'demo';
  return `<div class="project-switcher"><span class="project-label">Проект</span><select class="project-select" aria-label="Выбор проекта" data-project-select><option value="demo" ${isDemo ? 'selected' : ''}>Т-Банк (демо-проект)</option><option value="user" ${!isDemo ? 'selected' : ''}>мой проект</option></select><span class="project-help">${isDemo ? 'Готовый пример отчёта' : 'Ваш настроенный проект'}</span></div>`;
}

function demoSummary() {
  return `${demoAccessBanner()}${demoHero()}<div class="title-row"><div><h1>Сводка проекта «Т-Банк (демо-проект)»</h1>${projectSwitcher()}</div></div>${filters()}<section class="dashboard-card chart-card"><div class="chart-head"><h2>Общая видимость бренда <span class="muted">ⓘ</span></h2><span class="field">Видимость бренда⌄</span></div>${chart()}<div class="legend"><span><i style="background:#b9b9b9"></i>Все</span><span><i style="background:#f26769"></i>Поиск с Алисой</span><span><i style="background:#5d91ed"></i>Google AI Overview</span><span><i style="background:#2f8e90"></i>Perplexity</span><span><i style="background:#72baf1"></i>DeepSeek</span></div></section>
  <section class="table-card"><div class="chart-head"><h2>Конкуренты <span class="muted">ⓘ</span></h2><span class="field">Все типы, кроме скрытых⌄</span></div><table><thead><tr><th>Бренд</th><th>Видимость</th><th>Тональность</th></tr></thead><tbody>${[['Т-Банк','56.67%','ваш бренд'],['Альфа-Банк','65.33%','Положительная'],['Сбер','60.67%','Положительная'],['ВТБ-Банк','58%','Положительная'],['Точка.com','25.33%','Положительная'],['ЮниКредит Банк','20.67%','Положительная']].map((r,i)=>`<tr><td><strong>${r[0]}</strong> ${i===0?'<span class="brand-pill">ваш бренд</span>':''}</td><td>${r[1]} <span class="${i===0?'trend-down':'trend-up'}">${i===0?'↓ -4.66':'↑ 2'}</span></td><td><span class="trend-up">●</span> ${r[2]}</td></tr>`).join('')}</tbody></table></section>
  <div class="summary-grid"><section class="dashboard-card"><h2>Упоминания бренда <span class="muted">ⓘ</span></h2><div class="bar-chart">${[['Все',85, '#bcbcbc'],['Поиск с Алисой',17,'#f26769'],['Google AI Overview',20,'#5d91ed'],['ChatGPT',13,'#596477'],['Perplexity',14,'#2f8e90'],['DeepSeek',21,'#72baf1']].map(x=>`<div class="bar-row"><span>${x[0]}</span><b class="bar" style="width:${x[1]}%;background:${x[2]}"></b></div>`).join('')}</div></section><section class="dashboard-card"><h2>Тональность упоминаний <span class="muted">ⓘ</span></h2><div class="donut"></div><div class="tone-list"><span><i style="background:#6ac050"></i>Положительная &nbsp; 77.65%</span><span><i style="background:#cfd0d1"></i>Нейтральная &nbsp; 21.18%</span><span><i style="background:#f2686a"></i>Негативная &nbsp; 1.18%</span></div></section></div>`;
}

function lockBanner(projectTitle) {
  return `<div class="banner"><span class="banner-text"><span class="banner-icon">ⓘ</span>Проект «${projectTitle}» уже настроен. Данные откроются после оплаты пробного периода.</span><button class="btn btn-primary" data-project="demo">Посмотреть демо-отчёт</button></div>`;
}

function lockedDemoPanel(title, content) {
  return `<section class="dashboard-card locked-panel"><div class="locked-content">${content}</div><div class="locked-note"><div><div class="lock-icon">◌</div><strong>Данные будут доступны после оплаты пробного периода</strong><button class="btn btn-primary" data-route="payment" style="margin-top:12px">Получить доступ за 99 ₽</button></div></div></section>`;
}

function userSummary() {
  return userPage();
}

function userCompetitors() {
  return `${lockBanner('мой проект')}<div class="title-row"><div><h1>Конкуренты проекта «мой проект»</h1>${projectSwitcher()}</div></div>${filters()}${lockedDemoPanel('Видимость', `<h2>Видимость</h2>${chart('competitors')}<div class="legend"><span><i style="background:#9c83e9"></i>мой проект</span><span><i style="background:#c2df82"></i>Конкуренты</span></div>`)}${lockedDemoPanel('Конкуренты', `<h2>Конкуренты</h2><table><thead><tr><th>Бренд</th><th>Видимость</th><th>Тип</th></tr></thead><tbody>${['мой проект','Альфа-Банк','Сбер','ВТБ-Банк','Точка.com'].map(name=>`<tr><td>${name}</td><td>56.67% ↑ 2</td><td><span class="tag">🚀 Ключевой</span></td></tr>`).join('')}</tbody></table>`)}`;
}

function userRecommendations() {
  return `${lockBanner('мой проект')}<div class="title-row"><div><h1>Рекомендации проекта «мой проект»</h1>${projectSwitcher()}</div></div>${lockedDemoPanel('Рекомендации', `<h2>Рекомендации</h2><div class="rec-grid">${recommendations.slice(0, 3).map(r=>`<article class="rec-card"><div class="rec-title">${r[0]}</div><span class="status">${r[1]}</span><div class="progress-line"><i style="width:28%"></i></div></article>`).join('')}</div>`)}`;
}

function competitors() {
  return `${demoBanners()}<div class="title-row"><h1>Конкуренты проекта «Т-Банк (демо-проект)»</h1><span class="field">⇩ Экспорт (Excel)⌄</span></div>${filters()}<section class="dashboard-card chart-card"><div class="chart-head"><h2>Видимость <span class="muted">ⓘ</span></h2><div class="field">Видимость⌄</div></div>${chart('competitors')}<div class="legend"><span><i style="background:#9c83e9"></i>Т-Банк (ваш бренд)</span><span><i style="background:#c2df82"></i>Альфа-Банк</span><span><i style="background:#ee879a"></i>Сбер</span><span><i style="background:#d98d65"></i>ЮниКредит Банк</span></div></section><section class="table-card"><div class="chart-head"><h2>Конкуренты</h2><span class="muted">Настроить таблицу ⚙</span></div><table><thead><tr><th>Бренд</th><th>Видимость ↑↓</th><th>Упоминание бренда ↑↓</th><th>Share of Voice</th><th>Тип</th></tr></thead><tbody>${['Т-Банк','Альфа-Банк','Сбер','ВТБ-Банк','Точка.com','ЮниКредит Банк','Совкомбанк','Райффайзенбанк','Промсвязьбанк','Банки.ру','Модульбанк'].map((name,i)=>`<tr><td><strong>${name}</strong> ${i===0?'<span class="brand-pill">ваш бренд</span>':''}</td><td>${[56.67,65.33,60.67,58,25.33,20.67,18,14,13.33,12,11.33][i]}% <span class="${i===0||i>8?'trend-down':'trend-up'}">${i===0?'↓ -4.66':'↑ '+(i+2)}</span></td><td>${85-i*7}</td><td>${(11.41-i*.72).toFixed(2)}%</td><td><span class="tag ${i===9?'direct':''}">${i===9?'▣ Прямой':'🚀 Ключевой'}</span></td></tr>`).join('')}</tbody></table></section>`;
}

const recommendations = [['Посмотрите видеообзор AI-Пиксель Тулс','Требует внимания',0],['Какой банк выбрать для открытия счета','Можно улучшить',50],['Отзывы о банках','Можно улучшить',50],['Какой банк посоветуешь для ипотеки','Требует внимания',0],['Какой банк лучше для хранения сбережений','Требует внимания',0],['Какой банк выбрать для переводов за границу','Требует внимания',0]];
function recommendationsPage() {
  return `${demoBanners()}<div class="title-row"><h1>Рекомендации проекта «Т-Банк (демо-проект)»</h1></div><section class="recommend-stats"><div><h3 class="muted">ⓘ Как повысить видимость?</h3><div class="mini-donut"></div></div><div class="stat"><span class="stat-label">Всего задач</span><strong>36</strong></div><div class="stat"><span class="stat-label">Требуют внимания</span><strong>28</strong></div><div class="stat"><span class="stat-label">Можно улучшить</span><strong>7</strong></div><div class="stat"><span class="stat-label">Выполнено</span><strong>1</strong></div></section><div class="rec-grid">${recommendations.map((r)=>`<article class="rec-card"><div class="rec-title"><span class="muted">▧ ${r[0].startsWith('Посмотрите')?'Задача':'Промпт'}:</span><br>${r[0]}</div><span class="status ${r[1]==='Можно улучшить'?'improve':''}">${r[1]}</span><div class="chart-head"><span>Выполнено: <strong>${r[2] ? '2/4':'0/4'}</strong></span><strong class="${r[2] ? 'trend-up':''}">${r[2]}%</strong></div><div class="progress-line"><i style="width:${r[2]}%"></i></div><span class="rec-foot">Перейти к задачам →</span></article>`).join('')}</div><section class="final-cta"><div><h2>Готовы проверить свой бренд?</h2><p>Ваш проект уже настроен. Запустите анализ и получите данные о видимости, конкурентах и персональные рекомендации.</p><span class="price-line">Пробный доступ на 30 дней: 99 ₽ вместо 3 790 ₽</span></div><button class="btn btn-primary" data-route="payment">Получить данные по моему проекту</button></section>`;
}

function paymentPage() {
  if (paymentSubmitted) return `<div class="payment-shell"><div class="payment-success"><div class="success-icon">✓</div><h1>Доступ почти готов</h1><p>Заявка на пробный доступ к проекту «мой проект» создана. В настоящем продукте здесь откроется платёжное подтверждение.</p><button class="btn btn-primary" data-route="user">Вернуться к моему проекту</button></div></div>`;
  return `<div class="payment-shell"><div class="payment-heading"><span class="muted">мой проект</span><h1>Получите данные по своему проекту</h1><p>Запустите анализ видимости, конкурентов и рекомендаций для вашего бренда.</p></div><div class="payment-layout"><section class="payment-card"><div class="payment-card-head"><div><span class="muted">Пробный доступ</span><h2>Данные по моему проекту</h2></div><strong class="payment-price">99 ₽</strong></div><div class="payment-period">30 дней доступа <span>вместо 3 790 ₽</span></div><ul class="payment-benefits"><li>Общая видимость бренда в нейросетях</li><li>Сравнение с конкурентами</li><li>Персональные рекомендации</li></ul></section><form class="payment-form" data-payment-form><h2>Оплата пробного доступа</h2><label>Номер карты<input required inputmode="numeric" placeholder="0000 0000 0000 0000" /></label><div class="payment-row"><label>Срок действия<input required placeholder="ММ / ГГ" /></label><label>CVV<input required inputmode="numeric" placeholder="•••" /></label></div><label>Имя держателя<input required placeholder="ИМЯ ФАМИЛИЯ" /></label><button class="btn btn-primary payment-submit" type="submit">Оплатить 99 ₽</button><small class="payment-note">В прототипе платёж не отправляется и банковские данные не сохраняются.</small></form></div><button class="btn btn-ghost payment-back" data-route="user">← Вернуться к проекту</button></div>`;
}

function tourHint() {
  if (!tourActive || selectedProject !== 'demo' || !['summary', 'competitors', 'recommendations'].includes(route)) return '';
  if (route === 'summary') return `<aside class="tour-callout"><span class="tour-progress">1 из 3</span><h3>Сводка</h3><p>Здесь видно общую видимость бренда в нейросетях, динамику показателей и основные результаты анализа.</p><div class="tour-actions"><button class="btn btn-primary" data-tour-route="competitors">Далее: Конкуренты</button><button class="btn btn-ghost" data-stop-tour>Пропустить обзор</button></div></aside>`;
  if (route === 'competitors') return `<aside class="tour-callout"><span class="tour-progress">2 из 3</span><h3>Конкуренты</h3><p>Здесь можно сравнить видимость своего бренда с конкурентами и понять, кто чаще появляется в ответах нейросетей.</p><div class="tour-actions"><button class="btn btn-ghost" data-tour-route="summary">Назад</button><button class="btn btn-primary" data-tour-route="recommendations">Далее: Рекомендации</button><button class="btn btn-ghost" data-stop-tour>Пропустить обзор</button></div></aside>`;
  return `<aside class="tour-callout"><span class="tour-progress">3 из 3</span><h3>Рекомендации</h3><p>Здесь результаты анализа превращаются в конкретные действия, которые помогут улучшить видимость бренда.</p><div class="tour-actions"><button class="btn btn-ghost" data-tour-route="competitors">Назад</button><button class="btn btn-primary" data-finish-tour>Завершить обзор</button></div></aside>`;
}

function userPage() {
  return `<div class="banner"><span class="banner-text"><span class="banner-icon">ⓘ</span>Вы находитесь в ограниченном демо-режиме. Получите полный доступ!</span><button class="btn btn-primary" data-project="demo">Посмотреть демо-отчёт</button></div><div class="title-row"><div>${projectSwitcher()}<small class="muted">Проектов: 1 · Последнее обновление: —</small></div><button class="btn btn-outline">Обновить проект⌄</button></div><section class="plan-card"><h2>Следуйте плану для поднятия видимости</h2><div class="steps">${['Получите полный доступ','Запустите проект','Оцените видимость','Оцените конкурентов','Оцените аудит','Выполните рекомендации'].map((x,i)=>`<div class="step ${i===0?'current':''}"><span class="step-dot">${i+1}</span>${x}</div>`).join('')}</div><div class="paywall"><h3>Шаг 1. Получите полный доступ за 99 рублей</h3><p>Пробный период на 30 дней — получите мгновенный анализ упоминаний, тональности и конкурентного окружения в ответах популярных нейросетей.</p><div class="paywall-actions"><button class="btn btn-primary" data-route="payment">Получить доступ за 99 ₽</button><button class="btn btn-outline" data-project="demo">Посмотреть демо-отчет</button></div><div class="demo-hint">Посмотрите пример готового отчета и оцените возможности сервиса перед оплатой.</div></div></section><div class="title-row"><h1>Сводка</h1><span class="muted">Экспорт (Excel)⌄ &nbsp; ⚙ Настроить сводку</span></div>${filters()}<div class="locked-grid"><div class="blur-card wide"><h3>Общая видимость</h3><div class="fake-lines"><div class="fake-line"></div><div class="fake-line short"></div><div class="fake-line"></div></div><div class="locked-note"><div><div class="lock-icon">◌</div><strong>Данные будут доступны после оплаты пробного периода</strong><button class="btn btn-primary" data-route="payment" style="margin-top:12px">Доступ за 99 рублей на 30 дней</button></div></div></div>${['Конкуренты','Упоминания бренда','Тональность упоминаний','Доля упоминаний (Share of Voice)','Видимость по группам промптов','События','Отзывы','Рекомендации по улучшению видимости'].map(x=>`<div class="blur-card"><h3>${x}</h3><div class="fake-lines"><div class="fake-line"></div><div class="fake-line short"></div><div class="fake-line"></div></div></div>`).join('')}</div>`;
}

function modal() {
  if (purchaseOpen) return `<div class="modal-backdrop"><div class="modal purchase-modal"><button class="close-modal" data-close-purchase>×</button><div class="purchase-badge">Демо завершено</div><h2>Теперь проверьте свой бренд</h2><p>Ваш проект уже настроен. Получите собственные данные о видимости, конкурентах и рекомендации.</p><div class="purchase-price"><strong>99 ₽</strong><span>Пробный доступ на 30 дней вместо 3 790 ₽</span></div><div class="modal-actions"><button class="btn btn-primary" data-route="payment">Получить доступ за 99 ₽</button><button class="btn btn-ghost" data-close-purchase>Продолжить в демо</button></div></div></div>`;
  if (demoWelcomeOpen) return `<div class="modal-backdrop"><div class="modal"><button class="close-modal" data-close-welcome>×</button><h2>Посмотрите, что вы получите после запуска проекта</h2><p>Это готовый GEO-отчёт на примере демо-проекта. За короткий обзор покажем три основных раздела, которые помогут понять ценность сервиса.</p><div class="welcome-list"><div class="welcome-item"><b class="welcome-icon">◒</b><div><strong>Сводка</strong><span>Общая видимость бренда и основные показатели.</span></div></div><div class="welcome-item"><b class="welcome-icon">↗</b><div><strong>Конкуренты</strong><span>Сравнение бренда с другими компаниями.</span></div></div><div class="welcome-item"><b class="welcome-icon">✦</b><div><strong>Рекомендации</strong><span>Конкретные действия для улучшения видимости.</span></div></div></div><div class="modal-actions"><button class="btn btn-primary" data-start-tour>Начать короткий обзор</button><button class="btn btn-ghost" data-close-welcome>Изучить самостоятельно</button></div></div></div>`;
  if (route === 'user' && scrollPopupShown) return `<div class="modal-backdrop"><div class="modal"><button class="close-modal" data-close-popup>×</button><h2>Хотите сначала посмотреть, что получите?</h2><p>Откройте готовый демо-проект и посмотрите, как выглядят данные о видимости бренда, конкурентах и рекомендациях.</p><div class="modal-actions"><button class="btn btn-primary" data-project="demo">Посмотреть демо</button><button class="btn btn-ghost" data-close-popup>Продолжить изучение</button></div></div></div>`;
  return '';
}

function render() {
  let page;
  if (route === 'user') page = userPage();
  else if (route === 'payment') page = paymentPage();
  else if (selectedProject === 'user') page = route === 'summary' ? userSummary() : route === 'competitors' ? userCompetitors() : userRecommendations();
  else page = route === 'summary' ? demoSummary() : route === 'competitors' ? competitors() : recommendationsPage();
  app.innerHTML = `${topbar()}${sidebar(route)}<main class="content ${selectedProject === 'user' ? 'user-project' : ''}">${page}</main>${tourHint()}${modal()}`;
  app.querySelectorAll('[data-route]').forEach(el => el.addEventListener('click', () => go(el.dataset.route)));
  app.querySelectorAll('[data-project-select]').forEach(el => el.addEventListener('change', () => selectProject(el.value)));
  app.querySelectorAll('[data-project]').forEach(el => el.addEventListener('click', () => selectProject(el.dataset.project)));
  app.querySelectorAll('[data-tour-route]').forEach(el => el.addEventListener('click', () => go(el.dataset.tourRoute)));
  app.querySelectorAll('[data-start-tour]').forEach(el => el.addEventListener('click', startTour));
  app.querySelectorAll('[data-stop-tour]').forEach(el => el.addEventListener('click', stopTour));
  app.querySelectorAll('[data-finish-tour]').forEach(el => el.addEventListener('click', finishTour));
  app.querySelectorAll('[data-close-purchase]').forEach(el => el.addEventListener('click', () => { purchaseOpen = false; render(); }));
  app.querySelectorAll('[data-payment-form]').forEach(form => form.addEventListener('submit', (event) => { event.preventDefault(); paymentSubmitted = true; render(); }));
  app.querySelectorAll('[data-close-welcome]').forEach(el => el.addEventListener('click', closeWelcome));
  app.querySelectorAll('[data-close-popup]').forEach(el => el.addEventListener('click', () => { scrollPopupShown = false; if (popupPhase === 'initial') scrollPopupDismissed = true; render(); }));
}

function handleScroll() {
  const scrollableHeight = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
  const scrollProgress = window.scrollY / scrollableHeight;
  const atBottom = window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 120;
  if (route === 'user' && !scrollPopupShown && !scrollPopupDismissed && scrollProgress >= .35) {
    popupPhase = 'initial';
    scrollPopupShown = true;
    render();
  } else if (route === 'user' && !scrollPopupShown && scrollPopupDismissed && atBottom && !bottomPopupShown) {
    popupPhase = 'bottom';
    bottomPopupShown = true;
    scrollPopupShown = true;
    render();
  }
}

window.addEventListener('scroll', handleScroll, { passive: true });
document.addEventListener('scroll', handleScroll, { passive: true });

render();
