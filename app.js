/* Health & Fitness Organization: no build step. Data lives in data.js; your edits save in localStorage. */
(function () {
'use strict';
const D = window.DATA;
const KEY = 'hfo.v1';
const DAYS = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
const SLOTS = [['shake','Shake'],['breakfast','Breakfast'],['lunch','Lunch'],['dinner','Dinner'],['night','Night'],['snack','Snack']];
const TABS = [['overview','Today'],['diet','Diet week'],['meals','Meals'],['recipes','Recipes & prep'],['shopping','Shopping'],['workout','Workout'],['targets','Targets'],['supps','Supplements']];
const FOOD = {}; D.foods.forEach(f => FOOD[f.name] = f);
const NI = {}; D.NUT.forEach((n, i) => NI[n] = i);

/* ---------- state ---------- */
function mealByPrefix(p) { return D.meals.find(m => m.name.startsWith(p)).name; }
const M = {
  shake: mealByPrefix('Morning Fruit'), burrito: mealByPrefix('Beef, Egg'), bowl: mealByPrefix('Beef, Rice'),
  night: mealByPrefix('Night Glass'), pizza: mealByPrefix('Costco Pepperoni')
};
const PRESETS = {
  typical: { shake: [M.shake, 1], breakfast: [M.burrito, 1], lunch: [M.bowl, 1], dinner: [M.bowl, 1], night: [M.night, 1] },
  pizza: { shake: [M.shake, 1], breakfast: [M.burrito, 1], dinner: [M.pizza, 3], night: [M.night, 1] }
};
function freshWeek() {
  const w = {};
  DAYS.forEach(d => w[d] = JSON.parse(JSON.stringify(d === 'Saturday' ? PRESETS.pizza : PRESETS.typical)));
  return w;
}
function freshState() {
  return {
    tab: 'overview', view: 'avg', showAllMeals: false, showAllShop: false,
    targets: { bw: 200, goal: 240, rate: 0.5, maint: 16, prot: 1.0, fat: 0.55, fiber: 14 },
    week: freshWeek(), prep: {}, weeks: 2, mealIngs: {}, customMeals: [], pk: {}, bought: {},
    ex: D.exercises.map(e => Object.assign({ load: '' }, e))
  };
}
let S;
try { S = Object.assign(freshState(), JSON.parse(localStorage.getItem(KEY) || '{}')); } catch (e) { S = freshState(); }
if (location.hash === '#supplements') S.tab = 'supps';
function save() { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) {} }
function allMeals() { return D.meals.concat(S.customMeals); }
function ingsOf(m) { return S.mealIngs[m.name] || m.ings; }
function mealByName(n) { return allMeals().find(m => m.name === n); }

/* ---------- helpers ---------- */
const esc = s => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
function num(v) { const x = parseFloat(v); return isNaN(x) ? 0 : x; }
function fmt(v, i) {
  if (v === '' || v == null) return '';
  if (i === 0 || Math.abs(v) >= 100) return Math.round(v).toLocaleString();
  return (Math.round(v * 10) / 10).toString();
}
function badge(st) { return `<span class="badge ${st[1]}">${st[0]}</span>`; }

/* ---------- nutrition math ---------- */
function mealTotals(m) {
  const t = Array(D.NUT.length).fill(0);
  ingsOf(m).forEach(([f, g]) => { const fd = FOOD[f]; if (fd) fd.n.forEach((v, i) => t[i] += v * g / 100); });
  return t;
}
const mealCache = {};
function mt(name) { const m = mealByName(name); if (!m) return Array(D.NUT.length).fill(0); return mealTotals(m); }
function dayTotals(day) {
  const t = Array(D.NUT.length).fill(0);
  Object.values(S.week[day] || {}).forEach(([name, sv]) => { if (!name || !sv) return; const x = mt(name); x.forEach((v, i) => t[i] += v * sv); });
  return t;
}
function weekAvg() {
  const t = Array(D.NUT.length).fill(0);
  DAYS.forEach(d => dayTotals(d).forEach((v, i) => t[i] += v / 7));
  return t;
}
function hasPlan(day) { return Object.values(S.week[day] || {}).some(([n, s]) => n && s); }

/* ---------- targets ---------- */
function calcTargets() {
  const T = S.targets;
  const maint = Math.round(T.bw * T.maint), surplus = Math.round(T.rate * 500);
  const cal = Math.round(maint + surplus), prot = Math.round(T.bw * T.prot), fat = Math.round(T.bw * T.fat);
  const carbs = Math.round((cal - prot * 4 - fat * 9) / 4), fiber = Math.round(cal / 1000 * T.fiber);
  const tgt = D.NUT.map(() => null), type = D.NUT.map(() => 'Minimum');
  tgt[0] = cal; type[0] = 'Target'; tgt[1] = prot; type[1] = 'Minimum'; tgt[2] = carbs; type[2] = 'Target';
  tgt[3] = fat; type[3] = 'Target'; tgt[4] = fiber; type[4] = 'Minimum';
  Object.keys(D.micro).forEach(n => { if (n === 'Fiber') return; tgt[NI[n]] = D.micro[n][0]; type[NI[n]] = D.micro[n][1]; });
  return { maint, surplus, tgt, type, weeks: T.rate > 0 ? Math.round((T.goal - T.bw) / T.rate) : null };
}
function status(i, val, C) {
  const t = C.tgt[i], ty = C.type[i];
  if (!(val > 0)) return ['Nothing planned', 'b-na'];
  const p = val / t;
  if (ty === 'Target') return p < 0.9 ? ['Under', 'b-warn'] : p > 1.15 ? ['Over', 'b-bad'] : ['On target', 'b-ok'];
  if (ty === 'Limit') return val <= t ? ['Within limit', 'b-ok'] : ['High', 'b-bad'];
  return val >= t ? ['Met', 'b-ok'] : ['Low', 'b-warn'];
}

/* ---------- renderers ---------- */
function render() {
  document.getElementById('nav').innerHTML = TABS.map(([k, l]) => `<button class="${S.tab === k ? 'on' : ''}" onclick="HFO.tab('${k}')">${l}</button>`).join('');
  const fn = { overview, diet, meals, recipes, shopping, workout, targets, supps }[S.tab];
  document.getElementById('main').innerHTML = fn();
  if (S.tab === 'supps' && window.SUPP) SUPP.mount();
  save();
}

function kpis(t, C) {
  const items = [[0, 'Calories', 'kcal'], [1, 'Protein', 'g'], [2, 'Carbs', 'g'], [3, 'Fat', 'g'], [4, 'Fiber', 'g']];
  return '<div class="kpi">' + items.map(([i, n, u]) => `<div><span>${n}</span><b>${fmt(t[i], i)} ${u}</b><span>target ${C.tgt[i]} ${u}</span><br>${badge(status(i, t[i], C))}</div>`).join('') + '</div>';
}
function nutTable(t, C, label) {
  let h = `<div class="scroll"><table><tr><th>Nutrient</th><th class="n">${label}</th><th class="n">Target</th><th class="n">% of target</th><th>Status</th></tr>`;
  D.NUT.forEach((n, i) => {
    h += `<tr><td>${n} <span class="mute">(${D.UNIT[i]})</span></td><td class="n">${fmt(t[i], i)}</td><td class="n">${C.tgt[i]}${C.type[i] === 'Limit' ? ' max' : C.type[i] === 'Minimum' ? ' min' : ''}</td><td class="n">${t[i] > 0 ? Math.round(t[i] / C.tgt[i] * 100) + '%' : ''}</td><td>${badge(status(i, t[i], C))}</td></tr>`;
  });
  return h + '</table></div>';
}

function overview() {
  const C = calcTargets(), today = DAYS[new Date().getDay()];
  const dd = D.days.find(d => d.day === today);
  const exs = S.ex.filter(e => e.day === today);
  let h = `<h2>${today}</h2><div class="grid g2"><div class="card"><h3>Workout: ${esc(dd.focus)}</h3>`;
  if (exs.length) {
    h += '<table><tr><th>Exercise</th><th class="n">Sets</th><th>Reps</th></tr>' + exs.map(e => `<tr><td>${esc(e.name)}<div class="mute">${esc(e.muscle)}${e.notes ? ' · ' + esc(e.notes) : ''}</div></td><td class="n">${e.sets}</td><td>${esc(e.reps)}</td></tr>`).join('') + '</table>';
  } else h += '<p class="mute">Rest day: stretch / mobility and abs.</p>';
  h += '</div><div class="card"><h3>Meals today</h3>';
  const pl = S.week[today] || {};
  const rows = SLOTS.filter(([k]) => pl[k] && pl[k][0] && pl[k][1]).map(([k, l]) => { const x = mt(pl[k][0]).map(v => v * pl[k][1]); return `<tr><td>${l}</td><td>${esc(pl[k][0])}${pl[k][1] !== 1 ? ' x' + pl[k][1] : ''}</td><td class="n">${fmt(x[0], 0)}</td><td class="n">${fmt(x[1], 1)} g</td></tr>`; });
  h += rows.length ? '<table><tr><th></th><th>Meal</th><th class="n">kcal</th><th class="n">Protein</th></tr>' + rows.join('') + '</table>' : '<p class="mute">Nothing planned for today. Set it on the Diet week tab.</p>';
  h += '</div></div>';
  h += '<h2>Today vs. targets</h2><div class="card">' + kpis(dayTotals(today), C) + '</div>';
  h += '<h2>This week (daily average)</h2><div class="card">' + kpis(weekAvg(), C) + '</div>';
  return h;
}

function mealOptions(sel) {
  return '<option value="">(none)</option>' + allMeals().map((m, i) => `<option value="${i}" ${m.name === sel ? 'selected' : ''}>${esc(m.name)}</option>`).join('');
}
function diet() {
  const C = calcTargets();
  let h = '<h2>Diet week</h2><p class="mute">Pick a meal and servings for each slot. Use the Typical / Pizza buttons to fill a day in one tap. The totals below update automatically.</p>';
  h += '<div class="row" style="margin-bottom:10px"><button class="btn" onclick="HFO.fillAll(\'typical\')">Set every day to Typical</button><button class="btn alt" onclick="HFO.resetWeek()">Reset week to default</button></div>';
  h += '<div class="days">';
  DAYS.forEach(d => {
    const t = dayTotals(d);
    h += `<div class="day ${S.view === d ? 'sel' : ''}"><h4>${d}</h4><div class="mute">${fmt(t[0], 0)} kcal · ${fmt(t[1], 1)} g protein</div>`;
    h += `<div class="row" style="margin:6px 0"><button class="btn sm" onclick="HFO.fill('${d}','typical')">Typical</button><button class="btn sm alt" onclick="HFO.fill('${d}','pizza')">Pizza day</button><button class="btn sm alt" onclick="HFO.fill('${d}','')">Clear</button><button class="btn sm alt" onclick="HFO.view('${d}')">Details</button></div>`;
    SLOTS.forEach(([k, l]) => {
      const cur = (S.week[d] || {})[k] || ['', 0];
      h += `<div class="slot"><label>${l}</label><select onchange="HFO.setMeal('${d}','${k}',this.value)">${mealOptions(cur[0])}</select>`;
      h += `<div class="step"><button onclick="HFO.srv('${d}','${k}',-1)">−</button><span>${cur[0] ? cur[1] : ''}</span><button onclick="HFO.srv('${d}','${k}',1)">+</button></div></div>`;
    });
    h += '</div>';
  });
  h += '</div>';
  h += '<h2>Nutrition</h2><div class="card"><div class="tabs2"><button class="' + (S.view === 'avg' ? 'on' : '') + '" onclick="HFO.view(\'avg\')">Week (daily avg)</button>' + DAYS.map(d => `<button class="${S.view === d ? 'on' : ''}" onclick="HFO.view('${d}')">${d.slice(0, 3)}</button>`).join('') + '</div>';
  const t = S.view === 'avg' ? weekAvg() : dayTotals(S.view);
  h += kpis(t, C) + '<div style="height:10px"></div>' + nutTable(t, C, S.view === 'avg' ? 'Daily avg' : 'Day total') + '</div>';
  return h;
}

function meals() {
  const used = new Set();
  DAYS.forEach(d => Object.values(S.week[d] || {}).forEach(([n, s]) => { if (n && s) used.add(n); }));
  let h = '<h2>Meals</h2><p class="mute">Grams are per 1 serving. Edit a gram amount and every total and the shopping list update. By default only meals on this week\'s plan are shown.</p>';
  h += `<div class="row" style="margin-bottom:10px"><button class="btn alt" onclick="HFO.toggle('showAllMeals')">${S.showAllMeals ? 'Show only meals on this week\'s plan' : 'Show all meals'}</button><button class="btn" onclick="HFO.newMeal()">+ New meal</button></div>`;
  allMeals().forEach((m, mi) => {
    if (!S.showAllMeals && !used.has(m.name)) return;
    const t = mealTotals(m), ings = ingsOf(m), edited = !!S.mealIngs[m.name];
    h += `<div class="card"><div class="row"><h3 style="margin:0">${esc(m.name)}</h3>${edited ? `<button class="btn sm alt" onclick="HFO.resetMeal(${mi})">Reset to default</button>` : ''}</div>`;
    h += `<div class="mute" style="margin:4px 0">Per serving: ${fmt(t[0], 0)} kcal · ${fmt(t[1], 1)} g protein · ${fmt(t[2], 1)} g carbs · ${fmt(t[3], 1)} g fat · ${fmt(t[4], 1)} g fiber</div>`;
    h += '<div class="scroll"><table><tr><th>Ingredient</th><th class="n">Grams</th><th class="n">kcal</th><th class="n">Protein</th><th></th></tr>';
    ings.forEach(([f, g], k) => {
      const fd = FOOD[f]; const c = fd ? fd.n[0] * g / 100 : 0, p = fd ? fd.n[1] * g / 100 : 0;
      h += `<tr><td>${esc(f)}</td><td class="n edit"><input type="number" min="0" step="1" value="${g}" onchange="HFO.setG(${mi},${k},this.value)"></td><td class="n">${fmt(c, 0)}</td><td class="n">${fmt(p, 1)}</td><td><button class="btn sm alt" onclick="HFO.delIng(${mi},${k})">✕</button></td></tr>`;
    });
    h += `</table></div><div class="row" style="margin-top:6px"><select id="add${mi}">${D.foods.map((f, i) => `<option value="${i}">${esc(f.name)}</option>`).join('')}</select><button class="btn sm" onclick="HFO.addIng(${mi})">Add ingredient</button></div>`;
    h += `<details style="margin-top:8px"><summary>All nutrients per serving</summary><table>${D.NUT.map((n, i) => `<tr><td>${n}</td><td class="n">${fmt(t[i], i)} ${D.UNIT[i]}</td></tr>`).join('')}</table></details></div>`;
  });
  return h;
}



/* servings planned on the Diet week tab, and what actually gets prepped and bought */
function weekSv(name) {
  let t = 0;
  DAYS.forEach(d => Object.values(S.week[d] || {}).forEach(([n, sv]) => { if (n === name && sv) t += sv; }));
  return t;
}
function plannedSv(name) { return weekSv(name) * (S.weeks || 1); }
function prepSv(name) { const o = (S.prep || {})[name]; return o == null ? plannedSv(name) : o; }
function buySv(name) { return Math.max(plannedSv(name), (S.prep || {})[name] || 0); }

/* ---------- recipes & prep ---------- */
function buyCell(f, g) {
  const fd = FOOD[f]; if (!fd) return '';
  if (D.lbfoods.indexOf(f) >= 0) return (g / fd.yield / 453.592).toFixed(2) + ' lb';
  if (f === 'Egg, whole') return Math.ceil(g / 50) + ' eggs';
  return '';
}
function recTable(rows, cols) {
  let h = '<div class="scroll"><table><tr><th>Ingredient</th>' + cols.map(c => '<th class="n">' + c + '</th>').join('') + '<th class="n">Buy (raw)</th></tr>';
  rows.forEach(r => { h += '<tr><td>' + esc(r.f) + '</td>' + r.cells.map(c => '<td class="n">' + c + '</td>').join('') + '<td class="n">' + buyCell(r.f, r.total) + '</td></tr>'; });
  return h + '</table></div>';
}

const FRESH = {
  'Spinach (raw)': 'Fresh spinach lasts about 5 to 7 days. Freeze portions for the shake and burritos, or buy a second small tub for week 2.',
  'Banana': 'Ripens in about 5 to 7 days. Peel and freeze the week-2 bananas for the shake.',
  'Avocado': 'Ripens fast. Buy half now and half later.',
  'Bell pepper (red)': 'Whole peppers keep about 1 to 2 weeks. Dice and freeze the extras.',
  'Milk, whole': 'Buy for the block and freeze one gallon (pour a cup out first so it can expand). Thaw it in the fridge.',
  'Chocolate milk (Darigold reduced fat)': 'Check the date on the carton and buy to fit it.',
  'Egg whites (liquid)': 'Check the use-by date. Opened cartons keep about a week, so freeze the next one for later.',
  'Chicken breast (cooked)': 'Raw chicken keeps only 1 to 2 days in the fridge. Cook it in batches and freeze the rest.',
  'Ground beef 85/15 (cooked)': 'Raw ground beef keeps 1 to 2 days in the fridge. Cook it in batches and freeze half.',
  'Sirloin steak (cooked)': 'Raw steak keeps a few days in the fridge. Freeze what you will not cook soon.',
  'Shrimp (cooked)': 'Keep frozen until the day before you cook it. Cooked shrimp lasts about 3 days.',
  'White rice (cooked)': 'Dry rice keeps for ages. Cook it weekly and freeze portions.',
  'Flour tortilla (burrito size)': 'Keeps about 1 to 2 weeks. Freeze what you will not use that week.'
};
const NOT_TRACKED = 'Garlic, cumin, chili powder, taco or fajita seasoning, salt and pepper, limes, cilantro and jalapenos for flavor; cooking oil or spray; foil or parchment for wrapping burritos; freezer bags; and meal-prep containers. Costco pack sizes also differ from the ones assumed here, so adjust the package sizes under each item.';
function blockBar() {
  const w = S.weeks || 1;
  return '<div class="card"><div class="row"><b>Shop and prep for</b><select onchange="HFO.setWeeks(this.value)">' + [1, 2, 3, 4].map(x => '<option value="' + x + '"' + (x === w ? ' selected' : '') + '>' + x + ' week' + (x > 1 ? 's' : '') + '</option>').join('') + '</select></div><p class="mute" style="margin:6px 0 0">The Recipes &amp; prep and Shopping tabs both scale to this block of your Diet week plan.</p></div>';
}
function planNote(name) {
  const pl = plannedSv(name), pr = prepSv(name);
  let t = 'Your Diet week plan for ' + (S.weeks || 1) + ' week' + ((S.weeks || 1) > 1 ? 's' : '') + ' has ' + pl + ' serving' + (pl === 1 ? '' : 's') + '. ';
  if (pr > pl) t += 'You are prepping ' + (pr - pl) + ' extra, and the shopping list includes them. ';
  else if (pr < pl) t += 'The shopping list still buys for all ' + pl + ' on the plan. ';
  else t += 'The shopping list matches this number. ';
  if (S.prep && S.prep[name] != null) t += '<button class="btn sm alt" onclick="HFO.resetSv(\'' + name.replace(/'/g, "\\'") + '\')">Use the plan number</button>';
  return '<p class="mute" style="margin:0 0 8px">' + t + '</p>';
}
function recipes() {
  let h = '<h2>Recipes &amp; prep</h2>' + blockBar() + '<p class="mute">Quantities come from the gram amounts on your Meals tab, so if you change a meal there, this page updates too.</p>';

  /* breakfast burrito batch */
  const bm = mealByName(M.burrito), bi = ingsOf(bm), bt = mealTotals(bm), n = prepSv(bm.name);
  h += '<div class="card"><h3>' + esc(bm.name) + ': Saturday / Sunday batch</h3>';
  h += '<div class="row" style="margin-bottom:8px"><label>Burritos to make <input type="number" min="0" max="60" step="1" value="' + n + '" onchange="HFO.setSv(' + allMeals().indexOf(bm) + ',this.value)"></label><span class="mute">Each: ' + fmt(bt[0], 0) + ' kcal · ' + fmt(bt[1], 1) + ' g protein · ' + fmt(bt[4], 1) + ' g fiber</span></div>' + planNote(bm.name);
  h += recTable(bi.map(([f, g]) => ({ f, total: g * n, cells: [Math.round(g), Math.round(g * n).toLocaleString()] })), ['Per burrito (g)', 'Batch total (g)']);
  h += '<p class="mute">Beef and rice weights are cooked; "Buy (raw)" converts back to the weight you buy. Tortillas, tots, veggies and salsa are on the Shopping tab.</p>';
  h += '<ol>' +
    '<li>Cook the ground beef with garlic and cumin or taco seasoning, then drain and cool. Bake or air-fry the tater tots until crisp.</li>' +
    '<li>Saute the diced peppers and onion, then wilt in the spinach. Scramble the whole eggs and egg whites together in batches, a little underdone (they finish when you reheat).</li>' +
    '<li>Let everything cool before assembling so the tortillas do not steam and tear. Per burrito: tortilla, eggs, beef, tots, veggies, cheese, a spoon of green salsa. If you add pinto beans, add them here.</li>' +
    '<li>Roll tight and wrap each burrito in foil or parchment. Keep the next 3 to 4 days in the fridge and freeze the rest (best within about 2 to 3 months).</li>' +
    '<li>Reheat from the fridge for about 1.5 to 2 minutes in the microwave, or from frozen for about 3 to 4 minutes, flipping halfway. Heat until steaming hot (165 °F / 74 °C).</li></ol></div>';

  /* lunch and dinner batch from the week plan */
  const CARD = ['Beef, Egg', 'Chicken, Rice', 'Steak & Tots', 'Shrimp Tacos'];
  const sv = {};
  DAYS.forEach(d => ['lunch', 'dinner'].forEach(k => { const c = (S.week[d] || {})[k]; if (c && c[0] && c[1] && c[0].indexOf('Pizza') < 0 && !CARD.some(x => c[0].startsWith(x))) sv[c[0]] = (sv[c[0]] || 0) + c[1] * (S.weeks || 1); }));
  h += '<div class="card"><h3>Lunch &amp; dinner prep (Sunday)</h3>';
  const names = Object.keys(sv);
  if (!names.length) h += '<p class="mute">No other lunches or dinners are planned. The recipes below cover the rest, and you can plan meals on the Diet week tab.</p>';
  names.forEach(nm => {
    const m = mealByName(nm); if (!m) return;
    h += '<h4 style="margin:10px 0 4px">' + esc(nm) + ' <span class="mute">· ' + sv[nm] + ' servings in this block</span></h4>';
    h += recTable(ingsOf(m).map(([f, g]) => ({ f, total: g * sv[nm], cells: [Math.round(g), Math.round(g * sv[nm]).toLocaleString()] })), ['Per serving (g)', 'Block total (g)']);
  });
  h += '<ol>' +
    '<li>Cook a big pot of rice and portion it into containers. Brown the ground beef (or cook chicken on a sheet pan) and portion by weight using the gram amounts above.</li>' +
    '<li>Keep cheese, salsa and fresh veggies in a separate small container and add them when you reheat. Cooked rice and meat keep about 3 to 4 days in the fridge, so freeze the meals for days 5 to 7.</li>' +
    '<li>Rotate in the Chicken Burrito, Steak &amp; Tots Plate or Shrimp Tacos for variety without changing the formula of starch, protein and a little veggie.</li></ol></div>';


  /* all other recipes, each with a servings scaler */
  const RECIPES = [
    ['Chicken, Rice', [
      'Season the chicken breasts with salt, garlic, cumin and chili powder. Bake at 425 °F for about 20 to 25 minutes, or pan-sear or air-fry, until the thickest part reaches 165 °F (74 °C). Rest 5 minutes, then chop or shred.',
      'Cook the rice. Warm the pinto beans and corn. Saute the peppers and onion until soft.',
      'Warm the tortillas so they fold without tearing. Layer rice, beans, chicken, cheese, veggies and green salsa down the middle.',
      'Roll tight and wrap each burrito in foil. Fridge for 3 to 4 days or freeze. Reheat in the microwave until steaming hot (165 °F).'
    ]],
    ['Steak & Tots', [
      'Pat the sirloin dry and season with salt, pepper and garlic. Sear in a very hot pan or cast iron for about 3 to 5 minutes per side, until the center reaches at least 145 °F (63 °C) and then rest for 3 minutes, as USDA advises for whole cuts. Slice against the grain.',
      'Bake the tots at about 425 °F for 20 to 25 minutes, flipping halfway (follow the bag).',
      'Saute the peppers and onion in the olive oil. Warm the corn. Plate everything with green salsa on the side.',
      'For meal prep, cook the steak a touch under and reheat gently so it does not turn tough. Keep for 3 to 4 days in the fridge.'
    ]],
    ['Shrimp Tacos', [
      'Pat the shrimp dry and season with chili powder, garlic, cumin and a squeeze of lime. Saute in a hot pan for about 2 to 3 minutes per side, until pink and opaque all the way through.',
      'Cook the rice. Saute the peppers and onion. Warm the corn.',
      'Warm the corn tortillas in a dry pan for about 20 seconds per side.',
      'Fill with shrimp, rice, cheese, avocado and green salsa. Shrimp keeps best for up to 3 days in the fridge, so eat these early in the week and reheat gently.'
    ]]
  ];
  RECIPES.forEach(([pre, steps]) => {
    const m = allMeals().find(x => x.name.startsWith(pre)); if (!m) return;
    const mi = allMeals().indexOf(m), t = mealTotals(m), cur = prepSv(m.name);
    h += '<div class="card"><h3>' + esc(m.name) + '</h3>';
    h += '<div class="row" style="margin-bottom:8px"><label>Servings to make <input type="number" min="0" max="30" step="1" value="' + cur + '" onchange="HFO.setSv(' + mi + ',this.value)"></label><span class="mute">Each: ' + fmt(t[0], 0) + ' kcal · ' + fmt(t[1], 1) + ' g protein · ' + fmt(t[4], 1) + ' g fiber</span></div>' + planNote(m.name);
    h += recTable(ingsOf(m).map(([f, g]) => ({ f, total: g * cur, cells: [Math.round(g), Math.round(g * cur).toLocaleString()] })), ['Per serving (g)', 'Total (g)']);
    h += '<ol>' + steps.map(x => '<li>' + esc(x) + '</li>').join('') + '</ol></div>';
  });

  /* shake and night glass */
  const sm = mealByName(M.shake);
  h += '<div class="card"><h3>' + esc(sm.name) + '</h3><p class="mute" style="margin:0 0 6px">' + ingsOf(sm).map(([f, g]) => esc(f) + ' ' + Math.round(g) + ' g').join(' · ') + '</p>' +
    '<ol><li>Pre-portion the banana, mango, spinach and chia into freezer bags on Sunday, one bag per day.</li><li>In the morning, blend a bag with the milk and whey until smooth. Add a splash more milk if it is too thick.</li></ol>' +
    '<p class="mute" style="margin-bottom:0">Night: ' + esc(M.night) + '. Pour and drink; nothing to prep.</p></div>';
  h += '<div class="card"><h3>Other meals</h3><ul><li><b>Mass Gainer Shake (optional):</b> blend the whey, milk, banana and oats until smooth. Use it on days you are under on calories.</li><li><b>Costco pepperoni pizza:</b> nothing to prep. Eat it fresh at the food court, or reheat leftover slices in a skillet or oven so the crust stays crisp.</li></ul></div>';

  /* swaps */
  h += '<div class="card"><h3>Easy flavor swaps (almost no calories)</h3><ul>' +
    '<li>Garlic, onion, cilantro, lime, jalapeno, chipotle, taco or fajita seasoning and green salsa are all fair game. Change the sauce, not the macros.</li>' +
    '<li>Swap the beef in the burrito for chicken or seasoned beef, and tots for diced potatoes. Swap the flour tortilla for a low-carb wrap only if you need to trim calories.</li></ul></div>';
  return h;
}

function shopping() {
const need = {};
allMeals().forEach(m => {
const sv = buySv(m.name); if (!sv) return;
ingsOf(m).forEach(([f, g]) => need[f] = (need[f] || 0) + g * sv);
});
const B = S.bought || (S.bought = {});
const items = [];
D.lbfoods.forEach(f => {
const g = need[f] || 0; if (!g && !S.showAllShop) return;
const lb = g ? g / FOOD[f].yield / 453.592 : 0;
items.push({ key: f, name: f, sec: 'Meat, rice and cheese', qty: g ? Math.ceil(lb) + ' lb' : '-', sub: g ? lb.toFixed(1) + ' lb raw, ' + Math.round(g).toLocaleString() + ' g as eaten' : 'Not needed this block', note: FOOD[f].note, fresh: FRESH[f] });
});
D.pk.forEach((p, i) => {
const g = need[p.food] || 0; if (!g && !S.showAllShop) return;
const size = S.pk[p.food] || p.size;
items.push({ key: p.food, name: p.food, sec: 'Packaged items', qty: g ? Math.ceil(g / size) + ' x ' + p.unit : '-', sub: Math.round(g).toLocaleString() + ' g as eaten', note: p.note, pk: i, size: size, fresh: FRESH[p.food] });
});
const done = items.filter(x => B[x.key]).length;
let h = '<h2>Shopping list</h2>' + blockBar();
h += '<div class="card shopbar"><div class="row" style="justify-content:space-between"><b>' + done + ' of ' + items.length + ' picked up</b><button class="btn sm alt" onclick="HFO.clearBought()">Uncheck all</button></div><div class="bar" style="margin-top:6px"><i style="width:' + (items.length ? Math.round(done / items.length * 100) : 0) + '%"></i></div></div>';
h += '<p class="mute">Tap the circle on the right when you already have an item. Checked items drop to the bottom. Built from the Diet week plan, plus any extra servings you set on the Recipes &amp; prep tab, so the two tabs always match. Quantities cover the block length you pick above. Meat, rice and cheese are in raw pounds; everything else is in packages. Package sizes are assumptions, so change them to what you actually buy.</p>';
['Meat, rice and cheese', 'Packaged items'].forEach(sec => {
const list = items.filter(x => x.sec === sec);
if (!list.length) return;
list.sort((a, b) => (B[a.key] ? 1 : 0) - (B[b.key] ? 1 : 0));
h += '<h3>' + sec + '</h3><div class="shoplist">';
list.forEach(x => {
const on = !!B[x.key];
h += '<div class="shop' + (on ? ' got' : '') + '"><div class="si"><div class="sn">' + esc(x.name) + '</div><div class="mute">' + esc(x.sub) + (x.note ? ' | ' + esc(x.note) : '') + '</div>';
if (x.fresh && (S.weeks || 1) > 1) h += '<div class="mute"><b>Storage:</b> ' + esc(x.fresh) + '</div>';
if (x.pk != null) h += '<div class="mute">Package size (g): <input type="number" min="1" value="' + x.size + '" onchange="HFO.setPk(' + x.pk + ',this.value)"></div>';
h += '</div><div class="sq">' + esc(x.qty) + '</div><button class="bubble' + (on ? ' on' : '') + '" aria-pressed="' + on + '" aria-label="Already bought ' + esc(x.name) + '" data-k="' + esc(x.key) + '" onclick="HFO.bought(this.dataset.k)">' + (on ? '✓' : '') + '</button></div>';
});
h += '</div>';
});
h += '<div class="card"><h3>Not tracked on this list</h3><p class="mute" style="margin:0">' + esc(NOT_TRACKED) + '</p></div>';
h += '<div class="row" style="margin:6px 0 14px"><button class="btn alt" onclick="HFO.toggle(&quot;showAllShop&quot;)">' + (S.showAllShop ? 'Show only what this block needs' : 'Show every food') + '</button></div>';
return h;
}

/* ---------- workout ---------- */
function planned(day, muscle) { return S.ex.filter(e => (!day || e.day === day) && e.muscle === muscle).reduce((a, e) => a + num(e.sets), 0); }
function wstatus(plan, tgt) {
  if (tgt == null) return plan ? ['Planned', 'b-ok'] : ['No target', 'b-na'];
  if (!plan) return ['Not started', 'b-na'];
  return plan < tgt ? ['Under', 'b-warn'] : plan === tgt ? ['On target', 'b-ok'] : ['Over', 'b-bad'];
}
function workout() {
  let h = '<h2>Workout split</h2><p class="mute">Edit sets, reps, load and notes. Working-set totals compare to your weekly targets automatically.</p>';
  h += '<div class="card"><h3>Weekly volume (working sets)</h3><div class="scroll"><table><tr><th>Muscle</th>' + DAYS.map(d => `<th class="n">${d.slice(0, 3)}</th>`).join('') + '<th class="n">Planned</th><th class="n">Target</th><th class="n">Diff</th><th>Status</th></tr>';
  D.muscles.forEach(m => {
    const tg = D.days.reduce((a, d) => a + d.targets.filter(x => x.muscle === m).reduce((b, x) => b + (x.target || 0), 0), 0);
    const hasT = D.days.some(d => d.targets.some(x => x.muscle === m && x.target != null));
    const pl = planned(null, m);
    h += `<tr><td><b>${m}</b></td>` + DAYS.map(d => `<td class="n">${planned(d, m) || ''}</td>`).join('') + `<td class="n"><b>${pl}</b></td><td class="n">${hasT ? tg : ''}</td><td class="n">${hasT ? pl - tg : ''}</td><td>${badge(wstatus(pl, hasT ? tg : null))}</td></tr>`;
  });
  const total = S.ex.reduce((a, e) => a + num(e.sets), 0);
  h += `<tr><td><b>Total</b></td>${DAYS.map(d => `<td class="n">${S.ex.filter(e => e.day === d).reduce((a, e) => a + num(e.sets), 0) || ''}</td>`).join('')}<td class="n"><b>${total}</b></td><td></td><td></td><td></td></tr></table></div></div>`;
  D.days.forEach(dd => {
    const exs = S.ex.map((e, i) => [e, i]).filter(([e]) => e.day === dd.day);
    const chips = dd.targets.map(t => { const pl = planned(dd.day, t.muscle); return `<span class="badge ${wstatus(pl, t.target)[1]}">${t.muscle}: ${pl}${t.target != null ? '/' + t.target : ''}</span>`; }).join(' ');
    h += `<div class="card"><h3>${dd.day}: ${esc(dd.focus)}</h3><div class="row" style="margin-bottom:6px">${chips}</div>`;
    h += '<div class="scroll"><table><tr><th>Muscle</th><th>Exercise</th><th class="n">Sets</th><th>Reps</th><th>Load</th><th>Notes</th><th></th></tr>';
    exs.forEach(([e, i]) => {
      h += `<tr><td>${esc(e.muscle)}</td><td class="edit"><input style="width:100%;min-width:200px" value="${esc(e.name)}" onchange="HFO.exF(${i},'name',this.value)"></td><td class="n edit"><input type="number" min="0" style="width:56px" value="${e.sets}" onchange="HFO.exF(${i},'sets',this.value)"></td><td class="edit"><input style="width:72px" value="${esc(e.reps)}" onchange="HFO.exF(${i},'reps',this.value)"></td><td class="edit"><input style="width:80px" value="${esc(e.load)}" placeholder="lb" onchange="HFO.exF(${i},'load',this.value)"></td><td class="edit"><input style="width:100%;min-width:140px" value="${esc(e.notes)}" onchange="HFO.exF(${i},'notes',this.value)"></td><td><button class="btn sm alt" onclick="HFO.delEx(${i})">✕</button></td></tr>`;
    });
    h += `</table></div><div class="row" style="margin-top:6px"><select id="m_${dd.day}">${D.muscles.map(m => `<option ${dd.targets.length && m === dd.targets[0].muscle ? 'selected' : ''}>${m}</option>`).join('')}</select><button class="btn sm" onclick="HFO.addEx('${dd.day}')">Add exercise</button></div></div>`;
  });
  return h;
}

/* ---------- targets, supplements, data ---------- */
function targets() {
  const C = calcTargets(), T = S.targets;
  const inp = (k, label, step, note) => `<tr><td><b>${label}</b><div class="mute">${note}</div></td><td class="edit"><input type="number" step="${step}" value="${T[k]}" onchange="HFO.setT('${k}',this.value)"></td></tr>`;
  let h = '<h2>Targets</h2><div class="grid g2"><div class="card"><h3>Your inputs</h3><table>';
  h += inp('bw', 'Bodyweight (lb)', 1, 'Update as you gain and every target rescales');
  h += inp('goal', 'Goal weight (lb)', 1, 'Lean-bulk destination');
  h += inp('rate', 'Gain rate (lb/week)', 0.05, 'About 0.25-0.75 lb/week is a typical lean-bulk range');
  h += inp('maint', 'Maintenance kcal per lb', 0.5, 'A guess: calibrate with weekly weigh-ins');
  h += inp('prot', 'Protein (g per lb)', 0.05, 'A minimum: more is fine');
  h += inp('fat', 'Fat (g per lb)', 0.05, 'Carbs fill the remaining calories');
  h += inp('fiber', 'Fiber (g per 1,000 kcal)', 1, 'Standard adequate-intake guideline');
  h += `</table></div><div class="card"><h3>Calculated</h3><table><tr><td>Estimated maintenance</td><td class="n">${C.maint.toLocaleString()} kcal</td></tr><tr><td>Daily surplus</td><td class="n">${C.surplus} kcal</td></tr><tr><td>Weeks to goal at this rate</td><td class="n">${C.weeks == null ? '' : C.weeks}</td></tr></table><p class="mute">Micronutrient targets default to adult-male RDAs/AIs. Sodium is an upper limit.</p></div></div>`;
  h += '<div class="card"><h3>Daily targets</h3><div class="scroll"><table><tr><th>Nutrient</th><th class="n">Target</th><th>Type</th></tr>' + D.NUT.map((n, i) => `<tr><td>${n} <span class="mute">(${D.UNIT[i]})</span></td><td class="n">${C.tgt[i]}</td><td>${C.type[i]}</td></tr>`).join('') + '</table></div></div>';
  h += '<div class="card"><h3>Your data</h3><p class="mute">Everything you change is saved in this browser only. Export to move it to another device or keep a backup.</p><div class="row"><button class="btn" onclick="HFO.exp()">Export data</button><label class="btn alt" style="cursor:pointer">Import data<input type="file" accept=".json" style="display:none" onchange="HFO.imp(this)"></label><button class="btn alt" onclick="HFO.wipe()">Reset everything</button></div></div>';
  return h;
}
function supps() {
  const C = calcTargets(), t = weekAvg();
  const v = n => { const i = NI[n]; return fmt(t[i], i) + ' of ' + C.tgt[i] + ' ' + D.UNIT[i]; };
  const low = ['Vitamin D', 'Fiber'].filter(n => t[NI[n]] > 0 && t[NI[n]] < C.tgt[NI[n]]);
  const high = [['Sodium', C.tgt[NI.Sodium]], ['Zinc', 40], ['Iron', 45]].filter(([n, lim]) => t[NI[n]] > (n === 'Sodium' ? lim : lim * 0.6));
  const btn = (q, l) => '<button class="btn sm alt" onclick="SUPP.setQ(\'' + q + '\')">' + l + '</button> ';
  const plan = '<div class="card sp-plan"><b>Your diet plan right now</b> <span class="mute">(daily average from the Diet week tab)</span>' +
    '<p style="margin:4px 0">Vitamin D ' + v('Vitamin D') + ' · Fiber ' + v('Fiber') + ' · Sodium ' + v('Sodium') + ' (limit) · Zinc ' + v('Zinc') + ' (UL 40) · Iron ' + v('Iron') + ' (UL 45)</p>' +
    '<p class="mute" style="margin:4px 0">' + (low.length ? 'Below target: ' + low.join(', ') + '. ' : 'Vitamin D and fiber are at target. ') + 'Omega-3 is not tracked and the menu has no fatty fish. ' + (high.length ? 'Already high or near a limit: ' + high.map(x => x[0]).join(', ') + ', so skip extra supplements of those.' : '') + '</p>' +
    '<div>' + btn('vitamin d', 'Vitamin D') + btn('fiber', 'Fiber') + btn('omega-3', 'Omega-3') + btn('zinc', 'Zinc') + btn('iron', 'Iron') + btn('sodium', 'Sodium') + '</div></div>';
  return SUPP.shell(plan);
}

/* ---------- actions ---------- */
window.HFO = {
  tab(k) { S.tab = k; render(); window.scrollTo(0, 0); },
  view(v) { S.view = v; S.tab = 'diet'; render(); },
  toggle(k) { S[k] = !S[k]; render(); },
  setSv(mi, v) { const m = allMeals()[mi]; S.prep = S.prep || {}; S.prep[m.name] = Math.max(0, Math.min(60, Math.round(num(v)))); render(); },
  setWeeks(v) { S.weeks = Math.max(1, Math.min(4, Math.round(num(v)) || 1)); render(); },
  resetSv(name) { if (S.prep) delete S.prep[name]; render(); },
bought(k) { S.bought = S.bought || {}; if (S.bought[k]) delete S.bought[k]; else S.bought[k] = 1; render(); },
clearBought() { S.bought = {}; render(); },
  fill(d, p) { S.week[d] = p ? JSON.parse(JSON.stringify(PRESETS[p])) : {}; render(); },
  fillAll(p) { DAYS.forEach(d => S.week[d] = JSON.parse(JSON.stringify(PRESETS[p]))); render(); },
  resetWeek() { S.week = freshWeek(); render(); },
  setMeal(d, k, i) {
    S.week[d] = S.week[d] || {};
    if (i === '') delete S.week[d][k]; else S.week[d][k] = [allMeals()[+i].name, (S.week[d][k] && S.week[d][k][1]) || 1];
    render();
  },
  srv(d, k, delta) {
    const cur = (S.week[d] || {})[k]; if (!cur || !cur[0]) return;
    cur[1] = Math.max(1, Math.min(12, cur[1] + delta)); render();
  },
  setG(mi, k, v) { const m = allMeals()[mi]; const l = (S.mealIngs[m.name] || m.ings).map(x => x.slice()); l[k][1] = num(v); S.mealIngs[m.name] = l; render(); },
  delIng(mi, k) { const m = allMeals()[mi]; const l = (S.mealIngs[m.name] || m.ings).map(x => x.slice()); l.splice(k, 1); S.mealIngs[m.name] = l; render(); },
  addIng(mi) { const m = allMeals()[mi]; const l = (S.mealIngs[m.name] || m.ings).map(x => x.slice()); const f = D.foods[+document.getElementById('add' + mi).value]; l.push([f.name, 100]); S.mealIngs[m.name] = l; render(); },
  resetMeal(mi) { delete S.mealIngs[allMeals()[mi].name]; render(); },
  newMeal() {
    const n = (prompt('Name for the new meal:') || '').trim(); if (!n || mealByName(n)) return;
    S.customMeals.push({ name: n, cat: 'Custom', ings: [] }); S.showAllMeals = true; render();
  },
  setPk(i, v) { const x = num(v); if (x > 0) S.pk[D.pk[i].food] = x; render(); },
  exF(i, f, v) { S.ex[i][f] = v; render(); },
  delEx(i) { S.ex.splice(i, 1); render(); },
  addEx(day) { const m = document.getElementById('m_' + day).value; S.ex.push({ day, muscle: m, name: 'New exercise', sets: 3, reps: '10', notes: '', load: '' }); render(); },
  setT(k, v) { S.targets[k] = num(v); render(); },
  exp() {
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([JSON.stringify(S, null, 1)], { type: 'application/json' }));
    a.download = 'health-fitness-data.json'; a.click();
  },
  imp(el) {
    const f = el.files[0]; if (!f) return; const r = new FileReader();
    r.onload = () => { try { S = Object.assign(freshState(), JSON.parse(r.result)); render(); } catch (e) { alert('That file could not be read.'); } };
    r.readAsText(f);
  },
  wipe() { if (confirm('Erase all saved changes in this browser and start over?')) { S = freshState(); render(); } }
};
render();
})();
