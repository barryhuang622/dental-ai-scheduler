const dayLabels = {
  mon: "週一",
  tue: "週二",
  wed: "週三",
  thu: "週四",
  fri: "週五",
  sat: "週六",
};

const dayOffsets = {
  mon: 0,
  tue: 1,
  wed: 2,
  thu: 3,
  fri: 4,
  sat: 5,
};

const periodLabels = {
  am: "早診",
  pm: "午診",
  night: "晚診",
};

const orderedDays = ["mon", "tue", "wed", "thu", "fri", "sat"];
const orderedPeriods = ["am", "pm", "night"];

const demoPeople = [
  { id: "d1", name: "陳醫師", role: "doctor", maxShifts: 9, skills: ["植牙"], availability: ["mon-am", "mon-pm", "wed-am", "wed-pm", "fri-am", "sat-am"], avoid: [], preferWith: [], preferSlots: ["mon-am", "wed-am"], avoidSlots: ["sat-am"] },
  { id: "d2", name: "林醫師", role: "doctor", maxShifts: 8, skills: ["矯正"], availability: ["tue-pm", "tue-night", "thu-pm", "thu-night", "sat-am"], avoid: [], preferWith: [], preferSlots: ["tue-pm", "thu-pm"], avoidSlots: [] },
  { id: "d3", name: "王醫師", role: "doctor", maxShifts: 6, skills: ["兒牙"], availability: ["mon-night", "wed-night", "fri-pm", "fri-night"], avoid: [], preferWith: [], preferSlots: ["fri-pm"], avoidSlots: ["mon-night"] },
  { id: "a1", name: "雅婷", role: "assistant", maxShifts: 7, skills: ["植牙", "跟診"], availability: ["all"], avoid: ["美玲"], preferWith: ["佩君"], preferSlots: ["mon-am", "wed-pm"], avoidSlots: ["sat-am"] },
  { id: "a2", name: "美玲", role: "assistant", maxShifts: 6, skills: ["矯正", "跟診"], availability: ["mon-am", "mon-pm", "tue-pm", "tue-night", "wed-am", "thu-pm", "fri-am", "sat-am"], avoid: ["雅婷"], preferWith: ["怡安"], preferSlots: ["tue-pm", "thu-pm"], avoidSlots: ["tue-night"] },
  { id: "a3", name: "佳樺", role: "assistant", maxShifts: 6, skills: ["兒牙", "消毒"], availability: ["mon-night", "wed-pm", "wed-night", "thu-night", "fri-pm", "fri-night", "sat-am"], avoid: [], preferWith: [], preferSlots: ["fri-pm", "fri-night"], avoidSlots: [] },
  { id: "a4", name: "佩君", role: "assistant", maxShifts: 6, skills: ["植牙", "矯正"], availability: ["all"], avoid: [], preferWith: ["雅婷"], preferSlots: ["wed-pm", "thu-pm"], avoidSlots: [] },
  { id: "a5", name: "怡安", role: "assistant", maxShifts: 5, skills: ["跟診"], availability: ["mon-am", "tue-pm", "wed-am", "thu-pm", "fri-am", "sat-am"], avoid: [], preferWith: ["美玲"], preferSlots: ["mon-am", "fri-am"], avoidSlots: ["sat-am"] },
  { id: "f1", name: "欣怡", role: "frontdesk", maxShifts: 7, skills: ["收費"], availability: ["all"], avoid: [], preferWith: ["郁庭"], preferSlots: ["mon-am", "wed-am"], avoidSlots: [] },
  { id: "f2", name: "若涵", role: "frontdesk", maxShifts: 6, skills: ["掛號"], availability: ["mon-am", "mon-pm", "tue-pm", "wed-am", "wed-pm", "thu-pm", "fri-am", "sat-am"], avoid: [], preferWith: [], preferSlots: ["mon-pm", "wed-pm"], avoidSlots: ["sat-am"] },
  { id: "f3", name: "品萱", role: "frontdesk", maxShifts: 6, skills: ["客服"], availability: ["mon-night", "tue-night", "wed-night", "thu-night", "fri-pm", "fri-night", "sat-am"], avoid: ["若涵"], preferWith: [], preferSlots: ["fri-night"], avoidSlots: ["sat-am"] },
  { id: "f4", name: "郁庭", role: "frontdesk", maxShifts: 5, skills: ["收費", "客服"], availability: ["all"], avoid: [], preferWith: ["欣怡"], preferSlots: ["thu-night", "fri-pm"], avoidSlots: [] },
];

const demoSessions = [
  { id: "s1", day: "mon", period: "am", doctorId: "d1", requiredSkill: "植牙" },
  { id: "s2", day: "mon", period: "pm", doctorId: "d1", requiredSkill: "" },
  { id: "s3", day: "mon", period: "night", doctorId: "d3", requiredSkill: "兒牙" },
  { id: "s4", day: "tue", period: "pm", doctorId: "d2", requiredSkill: "矯正" },
  { id: "s5", day: "tue", period: "night", doctorId: "d2", requiredSkill: "矯正" },
  { id: "s6", day: "wed", period: "am", doctorId: "d1", requiredSkill: "" },
  { id: "s7", day: "wed", period: "pm", doctorId: "d1", requiredSkill: "植牙" },
  { id: "s8", day: "wed", period: "night", doctorId: "d3", requiredSkill: "兒牙" },
  { id: "s9", day: "thu", period: "pm", doctorId: "d2", requiredSkill: "" },
  { id: "s10", day: "thu", period: "night", doctorId: "d2", requiredSkill: "矯正" },
  { id: "s11", day: "fri", period: "am", doctorId: "d1", requiredSkill: "植牙" },
  { id: "s12", day: "fri", period: "pm", doctorId: "d3", requiredSkill: "" },
  { id: "s13", day: "fri", period: "night", doctorId: "d3", requiredSkill: "兒牙" },
  { id: "s14", day: "sat", period: "am", doctorId: "d2", requiredSkill: "" },
];

let state = loadState();
let latestResult = null;

function loadState() {
  const saved = localStorage.getItem("dentalSchedulerState");
  if (saved) return normalizeState(JSON.parse(saved));
  return normalizeState({ people: structuredClone(demoPeople), sessions: structuredClone(demoSessions), weights: { total: 8, night: 7, weekend: 9, avoid: 6, preference: 5 }, manualAssignments: {}, weekStart: "2026-05-04" });
}

function normalizeState(rawState) {
  return {
    people: (rawState.people || []).map((person) => ({ ...person, skills: person.skills || [], availability: person.availability?.length ? person.availability : ["all"], avoid: person.avoid || [], preferWith: person.preferWith || [], preferSlots: person.preferSlots || [], avoidSlots: person.avoidSlots || [] })),
    sessions: rawState.sessions || [],
    weights: { total: rawState.weights?.total ?? 8, night: rawState.weights?.night ?? 7, weekend: rawState.weights?.weekend ?? 9, avoid: rawState.weights?.avoid ?? 6, preference: rawState.weights?.preference ?? 5 },
    manualAssignments: rawState.manualAssignments || {},
    weekStart: rawState.weekStart || "2026-05-04",
  };
}

function saveState() { localStorage.setItem("dentalSchedulerState", JSON.stringify(state)); }
function isAvailable(person, slot) { return person.availability.includes("all") || person.availability.includes(slot); }
function slotOf(session) { return `${session.day}-${session.period}`; }
function isWeekend(day) { return day === "sat"; }
function roleLabel(role) { return { doctor: "醫生", assistant: "牙助", frontdesk: "櫃檯" }[role]; }
function bySessionOrder(a, b) { return orderedDays.indexOf(a.day) - orderedDays.indexOf(b.day) || orderedPeriods.indexOf(a.period) - orderedPeriods.indexOf(b.period); }
function sessionDate(session) { const base = parseLocalDate(state.weekStart); base.setDate(base.getDate() + dayOffsets[session.day]); return base; }
function parseLocalDate(value) { const [year, month, day] = String(value || "2026-05-04").split("-").map(Number); return new Date(year, month - 1, day); }
function formatDisplayDate(session) { const date = sessionDate(session); const month = String(date.getMonth() + 1).padStart(2, "0"); const day = String(date.getDate()).padStart(2, "0"); return `${date.getFullYear()}/${month}/${day}`; }
function dateCell(session) { return `<div class="date-cell"><strong>${formatDisplayDate(session)}</strong><span>${dayLabels[session.day]}</span></div>`; }

function createStats(people) { return Object.fromEntries(people.map((person) => [person.id, { total: 0, night: 0, weekend: 0, slots: new Set() }])); }
function average(values) { if (!values.length) return 0; return values.reduce((sum, value) => sum + value, 0) / values.length; }
function combinations(items, size) { if (size === 1) return items.map((item) => [item]); const result = []; items.forEach((item, index) => { combinations(items.slice(index + 1), size - 1).forEach((combo) => result.push([item, ...combo])); }); return result; }
function hasRequiredSkill(combo, requiredSkill) { if (!requiredSkill) return true; return combo.some((person) => person.skills.includes(requiredSkill)); }
function spread(values) { if (!values.length) return 0; return Math.max(...values) - Math.min(...values); }

function candidateScore(person, session, selected, stats, rolePool) {
  const personStats = stats[person.id];
  let score = 0;
  score += (personStats.total - average(rolePool.map((candidate) => stats[candidate.id].total)) + 1) * state.weights.total;
  if (session.period === "night") score += (personStats.night - average(rolePool.map((candidate) => stats[candidate.id].night)) + 1) * state.weights.night;
  if (isWeekend(session.day)) score += (personStats.weekend - average(rolePool.map((candidate) => stats[candidate.id].weekend)) + 1) * state.weights.weekend;
  selected.forEach((mate) => {
    if (person.avoid.includes(mate.name) || mate.avoid.includes(person.name)) score += state.weights.avoid * 7;
    if (person.preferWith.includes(mate.name) || mate.preferWith.includes(person.name)) score -= state.weights.preference * 3;
  });
  if (person.preferSlots.includes(slotOf(session))) score -= state.weights.preference * 2;
  if (person.avoidSlots.includes(slotOf(session))) score += state.weights.preference * 5;
  const previousDay = orderedDays[orderedDays.indexOf(session.day) - 1];
  if (previousDay && [...personStats.slots].some((slot) => slot.startsWith(previousDay))) score += 4;
  return score;
}

function pickTeam(role, session, needed, stats, selected = []) {
  if (needed <= 0) return { team: [], score: 0 };
  const pool = state.people.filter((person) => person.role === role);
  const available = pool.filter((person) => {
    const personStats = stats[person.id];
    return isAvailable(person, slotOf(session)) && !personStats.slots.has(slotOf(session)) && personStats.total < person.maxShifts && !selected.some((mate) => mate.id === person.id);
  });
  const validCombos = combinations(available, needed).filter((combo) => role !== "assistant" || hasRequiredSkill(combo, session.requiredSkill));
  if (!validCombos.length) return { team: [], score: Infinity };
  return validCombos.map((combo) => ({ team: combo, score: combo.reduce((sum, person) => sum + candidateScore(person, session, selected.concat(combo.filter((mate) => mate.id !== person.id)), stats, pool), 0) })).sort((a, b) => a.score - b.score)[0];
}

function applyAssignment(team, session, stats) { team.forEach((person) => { stats[person.id].total += 1; if (session.period === "night") stats[person.id].night += 1; if (isWeekend(session.day)) stats[person.id].weekend += 1; stats[person.id].slots.add(slotOf(session)); }); }
function normalizeManualIds(ids, size) { const normalized = Array.isArray(ids) ? ids.slice(0, size) : []; while (normalized.length < size) normalized.push(""); return normalized; }
function manualFor(sessionId) { const manual = state.manualAssignments[sessionId] || {}; return { doctorId: manual.doctorId || "", assistantIds: normalizeManualIds(manual.assistantIds, 2), frontdeskIds: normalizeManualIds(manual.frontdeskIds, 2) }; }
function hasManualAssignment(manual) { return Boolean(manual.doctorId || manual.assistantIds.some(Boolean) || manual.frontdeskIds.some(Boolean)); }
function canAssign(person, session, stats, selected = []) { const personStats = stats[person.id]; return personStats && isAvailable(person, slotOf(session)) && !personStats.slots.has(slotOf(session)) && personStats.total < person.maxShifts && !selected.some((mate) => mate.id === person.id); }

function validateManualTeam(ids, role, session, stats, row, label, selected = []) {
  const seen = new Set();
  const valid = [];
  ids.filter(Boolean).forEach((id) => {
    const person = state.people.find((candidate) => candidate.id === id && candidate.role === role);
    if (!person) { row.status = "gap"; row.notes.push(`${label}人工指定的人員不存在`); return; }
    if (seen.has(id)) { row.status = "gap"; row.notes.push(`${label}人工指定重複`); return; }
    seen.add(id);
    if (!canAssign(person, session, stats, selected.concat(valid))) { row.status = "gap"; row.notes.push(`${person.name} 不符合可上班、週上限或同時段限制`); return; }
    valid.push(person);
  });
  return valid;
}

function generateSchedule() {
  const stats = createStats(state.people);
  const rows = [];
  const insights = [];
  let gaps = 0;
  state.sessions.slice().sort(bySessionOrder).forEach((session) => {
    const manual = manualFor(session.id);
    const doctorId = manual.doctorId || session.doctorId;
    const doctor = state.people.find((person) => person.id === doctorId && person.role === "doctor");
    const row = { session, doctor, assistants: [], frontdesk: [], status: "ok", notes: [], manual };
    if (manual.doctorId) row.notes.push("醫生由人工指定");
    if (!doctor || !canAssign(doctor, session, stats)) { row.status = "gap"; row.notes.push("醫生可上班條件不符合"); gaps += 1; } else applyAssignment([doctor], session, stats);
    const manualAssistants = validateManualTeam(manual.assistantIds, "assistant", session, stats, row, "牙助", doctor ? [doctor] : []);
    if (manualAssistants.length) { row.notes.push("牙助含人工指定"); applyAssignment(manualAssistants, session, stats); }
    const assistantSession = { ...session, requiredSkill: hasRequiredSkill(manualAssistants, session.requiredSkill) ? "" : session.requiredSkill };
    const assistants = pickTeam("assistant", assistantSession, 2 - manualAssistants.length, stats, doctor ? [doctor].concat(manualAssistants) : manualAssistants);
    row.assistants = manualAssistants.concat(assistants.team);
    if (row.assistants.length < 2 || !hasRequiredSkill(row.assistants, session.requiredSkill)) { row.status = "gap"; row.notes.push("牙助不足或技能不符合"); gaps += 1; } else applyAssignment(assistants.team, session, stats);
    const manualFrontdesk = validateManualTeam(manual.frontdeskIds, "frontdesk", session, stats, row, "櫃檯", row.assistants);
    if (manualFrontdesk.length) { row.notes.push("櫃檯含人工指定"); applyAssignment(manualFrontdesk, session, stats); }
    const frontdesk = pickTeam("frontdesk", session, 2 - manualFrontdesk.length, stats, row.assistants.concat(manualFrontdesk));
    row.frontdesk = manualFrontdesk.concat(frontdesk.team);
    if (row.frontdesk.length < 2) { row.status = "gap"; row.notes.push("櫃檯不足"); gaps += 1; } else applyAssignment(frontdesk.team, session, stats);
    if (row.status === "ok") { const skillText = session.requiredSkill ? `，已安排 ${session.requiredSkill} 技能` : ""; const manualText = hasManualAssignment(manual) ? "，並保留人工選擇" : ""; row.notes.push(`依可上班與公平分數指派${skillText}${manualText}`); }
    rows.push(row);
  });
  const peopleStats = state.people.map((person) => ({ person, total: stats[person.id].total, night: stats[person.id].night, weekend: stats[person.id].weekend, max: person.maxShifts }));
  const roleFairness = ["assistant", "frontdesk"].map((role) => { const roleStats = peopleStats.filter((item) => item.person.role === role); return { role, totalSpread: spread(roleStats.map((item) => item.total)), nightSpread: spread(roleStats.map((item) => item.night)), weekendSpread: spread(roleStats.map((item) => item.weekend)) }; });
  const penalty = roleFairness.reduce((sum, item) => sum + item.totalSpread * 6 + item.nightSpread * 4 + item.weekendSpread * 5, 0) + gaps * 18;
  const fairness = Math.max(0, Math.round(100 - penalty));
  insights.push({ title: gaps ? "仍有班表缺口" : "硬性規則已滿足", body: gaps ? `共有 ${gaps} 個缺口，通常是可上班時段、技能或週上限造成。` : "所有診次都有醫生、兩位牙助與兩位櫃檯。" });
  roleFairness.forEach((item) => insights.push({ title: `${roleLabel(item.role)}公平差距`, body: `總班數差距 ${item.totalSpread}，晚班差距 ${item.nightSpread}，週末差距 ${item.weekendSpread}。` }));
  latestResult = { rows, peopleStats, insights, fairness, gaps };
  renderSchedule();
}

function pill(text, type = "") { return `<span class="pill ${type}">${text}</span>`; }
function personSelect(role, sessionId, index, selectedId) { const emptyLabel = role === "doctor" ? "原診次醫生" : "AI 自動"; const options = state.people.filter((person) => person.role === role).map((person) => `<option value="${person.id}" ${person.id === selectedId ? "selected" : ""}>${person.name}</option>`).join(""); return `<select class="manual-select" data-session-id="${sessionId}" data-role="${role}" data-index="${index}" aria-label="手動選擇${roleLabel(role)}"><option value="">${emptyLabel}</option>${options}</select>`; }
function teamSelects(role, sessionId, manualIds, team, needed) { return Array.from({ length: needed }, (_, index) => personSelect(role, sessionId, index, manualIds[index] || team[index]?.id || "")).join(""); }

function renderSchedule() {
  const result = latestResult || { rows: [], peopleStats: [], insights: [], fairness: 0, gaps: 0 };
  document.querySelector("#scheduleBody").innerHTML = result.rows.map((row) => {
    const statusClass = row.status === "ok" ? "ok" : "danger";
    const statusText = row.status === "ok" ? "完成" : "缺口";
    return `<tr><td>${dateCell(row.session)}</td><td>${periodLabels[row.session.period]}</td><td>${personSelect("doctor", row.session.id, 0, row.manual.doctorId || row.doctor?.id || "")}</td><td>${teamSelects("assistant", row.session.id, row.manual.assistantIds, row.assistants, 2)}</td><td>${teamSelects("frontdesk", row.session.id, row.manual.frontdeskIds, row.frontdesk, 2)}</td><td>${pill(statusText, statusClass)}<br><span class="muted">${row.notes.join("、")}</span></td></tr>`;
  }).join("");
  const filledNeeds = result.rows.filter((row) => row.status === "ok").length;
  document.querySelector("#coverageMetric").textContent = state.sessions.length ? `${Math.round((filledNeeds / state.sessions.length) * 100)}%` : "-";
  document.querySelector("#fairnessMetric").textContent = result.rows.length ? `${result.fairness}` : "-";
  document.querySelector("#gapMetric").textContent = result.rows.length ? `${result.gaps}` : "-";
  document.querySelector("#reviewMetric").textContent = result.rows.length ? `${result.rows.filter((row) => row.status !== "ok").length}` : "-";
  document.querySelector("#insightList").innerHTML = result.insights.map((insight) => `<div class="insight"><strong>${insight.title}</strong><span>${insight.body}</span></div>`).join("");
  const maxLoad = Math.max(1, ...result.peopleStats.map((item) => item.max));
  document.querySelector("#loadList").innerHTML = result.peopleStats.filter((item) => item.person.role !== "doctor").map((item) => `<div class="load-row"><strong>${item.person.name} <span>${roleLabel(item.person.role)}</span></strong><span>總班 ${item.total}/${item.max}，晚班 ${item.night}，週末 ${item.weekend}</span><div class="load-meter"><div style="width:${Math.min(100, (item.total / maxLoad) * 100)}%"></div></div></div>`).join("");
  document.querySelector("#sidebarDemand").textContent = `${state.sessions.length} 診次`;
}

function preferenceSummary(person) { const parts = []; if (person.preferWith.length) parts.push(`偏好同班 ${person.preferWith.join("、")}`); if (person.preferSlots.length) parts.push(`偏好時段 ${person.preferSlots.join("、")}`); if (person.avoidSlots.length) parts.push(`不想時段 ${person.avoidSlots.join("、")}`); if (person.avoid.length) parts.push(`避免同班 ${person.avoid.join("、")}`); return parts.join("｜") || "未設定"; }
function renderPeople() { document.querySelector("#personList").innerHTML = state.people.map((person) => `<article class="person-card"><button class="mini-button edit" type="button" data-edit-person="${person.id}" aria-label="編輯 ${person.name}">✎</button><button class="mini-button" type="button" data-delete-person="${person.id}" aria-label="刪除 ${person.name}">×</button><strong>${person.name} <span>${roleLabel(person.role)}</span></strong><span>最多 ${person.maxShifts} 班｜技能：${person.skills.join("、") || "無"}｜可上：${person.availability.join("、")}</span><span>偏好：${preferenceSummary(person)}</span></article>`).join(""); document.querySelector("#doctorSelect").innerHTML = state.people.filter((person) => person.role === "doctor").map((doctor) => `<option value="${doctor.id}">${doctor.name}</option>`).join(""); }
function renderAvailabilityGrid() { const grid = document.querySelector("#availabilityGrid"); grid.innerHTML = [`<div></div>`, ...orderedPeriods.map((period) => `<div class="availability-head">${periodLabels[period]}</div>`), ...orderedDays.flatMap((day) => [`<div class="availability-day">${dayLabels[day]}</div>`, ...orderedPeriods.map((period) => `<label class="slot-check" title="${dayLabels[day]} ${periodLabels[period]}"><input type="checkbox" name="availabilitySlots" value="${day}-${period}" /></label>`)])].join(""); }
function allAvailabilitySlots() { return orderedDays.flatMap((day) => orderedPeriods.map((period) => `${day}-${period}`)); }
function getSelectedAvailability() { const selected = [...document.querySelectorAll("input[name='availabilitySlots']:checked")].map((input) => input.value); return selected.length === allAvailabilitySlots().length ? ["all"] : selected; }
function setSelectedAvailability(availability) { const slots = availability.includes("all") ? allAvailabilitySlots() : availability; document.querySelectorAll("input[name='availabilitySlots']").forEach((input) => { input.checked = slots.includes(input.value); }); }
function renderSessions() { document.querySelector("#sessionList").innerHTML = state.sessions.slice().sort(bySessionOrder).map((session) => { const doctor = state.people.find((person) => person.id === session.doctorId); return `<article class="session-card"><button class="mini-button" type="button" data-delete-session="${session.id}" aria-label="刪除診次">×</button><strong>${formatDisplayDate(session)} ${dayLabels[session.day]} ${periodLabels[session.period]} <span>${doctor ? doctor.name : "未指定醫生"}</span></strong><span>需要技能：${session.requiredSkill || "一般跟診"}</span></article>`; }).join(""); document.querySelector("#sidebarDemand").textContent = `${state.sessions.length} 診次`; }

function bindEvents() {
  document.querySelector("#mobileMenuToggle").addEventListener("click", () => { const sidebar = document.querySelector(".sidebar"); const isOpen = sidebar.classList.toggle("is-menu-open"); document.querySelector("#mobileMenuToggle").setAttribute("aria-expanded", String(isOpen)); });
  document.querySelectorAll(".nav-item").forEach((button) => { button.addEventListener("click", () => { document.querySelectorAll(".nav-item").forEach((item) => item.classList.remove("is-active")); document.querySelectorAll(".panel").forEach((panel) => panel.classList.remove("is-visible")); button.classList.add("is-active"); document.querySelector(`#${button.dataset.panel}`).classList.add("is-visible"); document.querySelector("#mobileMenuToggle span").textContent = button.textContent; document.querySelector(".sidebar").classList.remove("is-menu-open"); document.querySelector("#mobileMenuToggle").setAttribute("aria-expanded", "false"); }); });
  document.querySelector("#generateBtn").addEventListener("click", generateSchedule);
  document.querySelector("#weekStartInput").addEventListener("change", (event) => { state.weekStart = event.target.value || state.weekStart; saveState(); renderSessions(); if (latestResult) renderSchedule(); });
  document.querySelector("#scheduleBody").addEventListener("change", (event) => { if (!event.target.classList.contains("manual-select")) return; updateManualAssignment(event.target); });
  document.querySelector("#addPersonBtn").addEventListener("click", () => { document.querySelector("[data-panel='people']").click(); resetPersonForm(); document.querySelector("#personForm input[name='name']").focus(); });
  document.querySelector("#selectAllAvailabilityBtn").addEventListener("click", () => setSelectedAvailability(["all"]));
  document.querySelector("#clearAvailabilityBtn").addEventListener("click", () => setSelectedAvailability([]));
  document.querySelector("#addSessionBtn").addEventListener("click", () => { document.querySelector("[data-panel='sessions']").click(); document.querySelector("#sessionForm select[name='day']").focus(); });
  document.querySelector("#personList").addEventListener("click", (event) => { const editId = event.target.dataset.editPerson; if (editId) { startEditPerson(editId); return; } const deleteId = event.target.dataset.deletePerson; if (!deleteId) return; state.people = state.people.filter((person) => person.id !== deleteId); state.sessions = state.sessions.filter((session) => session.doctorId !== deleteId); removeManualPerson(deleteId); latestResult = null; saveState(); renderAll(); });
  document.querySelector("#cancelEditPersonBtn").addEventListener("click", resetPersonForm);
  document.querySelector("#sessionList").addEventListener("click", (event) => { const deleteId = event.target.dataset.deleteSession; if (!deleteId) return; state.sessions = state.sessions.filter((session) => session.id !== deleteId); delete state.manualAssignments[deleteId]; latestResult = null; saveState(); renderAll(); });
  document.querySelector("#resetDemoBtn").addEventListener("click", () => { state = { people: structuredClone(demoPeople), sessions: structuredClone(demoSessions), weights: { total: 8, night: 7, weekend: 9, avoid: 6, preference: 5 }, manualAssignments: {}, weekStart: "2026-05-04" }; saveState(); syncWeights(); renderAll(); generateSchedule(); });
  document.querySelector("#personForm").addEventListener("submit", (event) => { event.preventDefault(); const form = new FormData(event.currentTarget); const personId = form.get("personId"); const person = { id: personId || `${form.get("role")}-${Date.now()}`, name: form.get("name").trim(), role: form.get("role"), maxShifts: Number(form.get("maxShifts")), skills: splitList(form.get("skills")), availability: getSelectedAvailability(), avoid: splitList(form.get("avoid")), preferWith: splitList(form.get("preferWith")), preferSlots: splitList(form.get("preferSlots")), avoidSlots: splitList(form.get("avoidSlots")) }; if (personId) state.people = state.people.map((existing) => (existing.id === personId ? person : existing)); else state.people.push(person); latestResult = null; saveState(); resetPersonForm(); renderAll(); });
  document.querySelector("#sessionForm").addEventListener("submit", (event) => { event.preventDefault(); const form = new FormData(event.currentTarget); state.sessions.push({ id: `session-${Date.now()}`, day: form.get("day"), period: form.get("period"), doctorId: form.get("doctor"), requiredSkill: form.get("requiredSkill").trim() }); saveState(); event.currentTarget.reset(); renderAll(); });
  ["weightTotal", "weightNight", "weightWeekend", "weightAvoid", "weightPreference"].forEach((id) => { document.querySelector(`#${id}`).addEventListener("input", (event) => { const key = id.replace("weight", "").toLowerCase(); state.weights[key] = Number(event.target.value); saveState(); if (latestResult) generateSchedule(); }); });
  document.querySelector("#exportBtn").addEventListener("click", exportCsv);
}

function removeManualPerson(personId) { Object.entries(state.manualAssignments).forEach(([sessionId]) => { const nextManual = manualFor(sessionId); if (nextManual.doctorId === personId) nextManual.doctorId = ""; nextManual.assistantIds = nextManual.assistantIds.map((id) => (id === personId ? "" : id)); nextManual.frontdeskIds = nextManual.frontdeskIds.map((id) => (id === personId ? "" : id)); if (hasManualAssignment(nextManual)) state.manualAssignments[sessionId] = nextManual; else delete state.manualAssignments[sessionId]; }); }
function updateManualAssignment(select) { const sessionId = select.dataset.sessionId; const role = select.dataset.role; const index = Number(select.dataset.index); const manual = manualFor(sessionId); if (role === "doctor") manual.doctorId = select.value; if (role === "assistant") manual.assistantIds[index] = select.value; if (role === "frontdesk") manual.frontdeskIds[index] = select.value; if (hasManualAssignment(manual)) state.manualAssignments[sessionId] = manual; else delete state.manualAssignments[sessionId]; saveState(); generateSchedule(); }
function startEditPerson(personId) { const person = state.people.find((item) => item.id === personId); if (!person) return; const form = document.querySelector("#personForm"); form.elements.personId.value = person.id; form.elements.name.value = person.name; form.elements.role.value = person.role; form.elements.maxShifts.value = person.maxShifts; form.elements.skills.value = person.skills.join(","); setSelectedAvailability(person.availability); form.elements.avoid.value = person.avoid.join(","); form.elements.preferWith.value = person.preferWith.join(","); form.elements.preferSlots.value = person.preferSlots.join(","); form.elements.avoidSlots.value = person.avoidSlots.join(","); document.querySelector("#personFormTitle").textContent = `編輯 ${person.name}`; document.querySelector("#cancelEditPersonBtn").classList.remove("is-hidden"); form.elements.name.focus(); }
function resetPersonForm() { const form = document.querySelector("#personForm"); form.reset(); form.elements.personId.value = ""; form.elements.maxShifts.value = 6; setSelectedAvailability(["all"]); document.querySelector("#personFormTitle").textContent = "快速設定"; document.querySelector("#cancelEditPersonBtn").classList.add("is-hidden"); }
function splitList(value) { return String(value || "").split(",").map((item) => item.trim()).filter(Boolean); }
function syncWeights() { document.querySelector("#weightTotal").value = state.weights.total; document.querySelector("#weightNight").value = state.weights.night; document.querySelector("#weightWeekend").value = state.weights.weekend; document.querySelector("#weightAvoid").value = state.weights.avoid; document.querySelector("#weightPreference").value = state.weights.preference; }
function syncWeekStart() { document.querySelector("#weekStartInput").value = state.weekStart; }
function exportCsv() { if (!latestResult) generateSchedule(); const header = ["日期", "星期", "時段", "醫生", "牙助1", "牙助2", "櫃檯1", "櫃檯2", "狀態", "備註"]; const lines = latestResult.rows.map((row) => [formatDisplayDate(row.session), dayLabels[row.session.day], periodLabels[row.session.period], row.doctor?.name || "", row.assistants[0]?.name || "", row.assistants[1]?.name || "", row.frontdesk[0]?.name || "", row.frontdesk[1]?.name || "", row.status === "ok" ? "完成" : "缺口", row.notes.join("、")]); const csv = [header, ...lines].map((line) => line.map((cell) => `"${String(cell).replaceAll('"', '""')}"`).join(",")).join("\n"); const blob = new Blob([`\uFEFF${csv}`], { type: "text/csv;charset=utf-8" }); const url = URL.createObjectURL(blob); const link = document.createElement("a"); link.href = url; link.download = "dental-schedule.csv"; link.click(); URL.revokeObjectURL(url); }
function renderAll() { renderPeople(); renderSessions(); renderSchedule(); }

bindEvents();
renderAvailabilityGrid();
setSelectedAvailability(["all"]);
syncWeights();
syncWeekStart();
renderAll();
generateSchedule();
