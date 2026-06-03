/* ============================================================
   Local Community Event Portal — main.js
   Covers all 14 exercises from the CTS JavaScript PDF
   ============================================================ */

/* ── Exercise 1: JavaScript Basics & Setup ─────────────────── */
console.log("Welcome to the Community Portal");

window.addEventListener("load", () => {
  alert("Community Event Portal is ready! Explore upcoming events below.");
  initPortal();
});

/* ── Exercise 2: Syntax, Data Types, Operators ─────────────── */
const PORTAL_NAME = "Salem Community Event Portal";
const LAUNCH_DATE = "2025-01-01";
let globalSeatCount = 0;

function buildEventSummary(name, date, seats) {
  return `${name} | Date: ${date} | Seats Available: ${seats}`;
}

/* ── Exercise 5: Objects and Prototypes ────────────────────── */
function Event(id, name, date, category, location, seats, description, price) {
  this.id = id;
  this.name = name;
  this.date = new Date(date);
  this.category = category;
  this.location = location;
  this.seats = seats;
  this.description = description;
  this.price = price || "Free";
  this.registeredUsers = [];
}

Event.prototype.checkAvailability = function () {
  return this.seats > 0;
};

Event.prototype.isUpcoming = function () {
  return this.date >= new Date();
};

Event.prototype.getInfo = function () {
  const entries = Object.entries(this);
  return entries.map(([k, v]) => `${k}: ${v}`).join(" | ");
};

Event.prototype.registerUser = function (userName) {
  if (!this.checkAvailability()) throw new Error(`"${this.name}" is fully booked.`);
  if (this.registeredUsers.includes(userName))
    throw new Error(`${userName} is already registered for "${this.name}".`);
  this.registeredUsers.push(userName);
  this.seats--;
  globalSeatCount--;
};

Event.prototype.cancelUser = function (userName) {
  const idx = this.registeredUsers.indexOf(userName);
  if (idx === -1) throw new Error(`${userName} is not registered for "${this.name}".`);
  this.registeredUsers.splice(idx, 1);
  this.seats++;
  globalSeatCount++;
};

/* ── Exercise 6: Arrays and Methods ────────────────────────── */
const events = [
  new Event(1, "Tamil Music Fusion Night", "2025-08-10", "music", "Salem", 80, "A vibrant fusion of Carnatic and contemporary music.", "₹200"),
  new Event(2, "Organic Baking Workshop", "2025-08-14", "workshop", "Salem", 20, "Learn sourdough, brioche, and more from expert bakers.", "₹500"),
  new Event(3, "5K Community Run", "2025-08-17", "sports", "Namakkal", 150, "A fun 5K run for all age groups along the river front.", "Free"),
  new Event(4, "Street Food Festival", "2025-08-22", "food", "Erode", 200, "Taste dishes from 40+ local vendors under one roof.", "₹50"),
  new Event(5, "Watercolour Art Camp", "2025-08-25", "art", "Salem", 30, "Beginners and advanced artists welcome.", "₹300"),
  new Event(6, "Web Dev Bootcamp", "2025-09-01", "tech", "Salem", 3, "Hands-on HTML, CSS, JS sessions with live projects.", "₹1000"),
  new Event(7, "Classical Violin Recital", "2025-09-05", "music", "Namakkal", 100, "Renditions of Thyagaraja kritis and Baroque classics.", "₹150"),
  new Event(8, "Pottery & Clay Workshop", "2025-09-10", "workshop", "Erode", 15, "Wheel-throwing and hand-building techniques.", "₹400"),
  new Event(9, "Football Tournament", "2025-09-12", "sports", "Salem", 0, "Inter-colony football matches. Spectators welcome.", "Free"),
  new Event(10, "Farm-to-Table Cooking", "2025-09-18", "food", "Salem", 25, "Seasonal recipes using local produce.", "₹350"),
];

globalSeatCount = events.reduce((sum, e) => sum + e.seats, 0);

function getMusicEvents(eventList) {
  return eventList.filter(e => e.category === "music");
}

function formatEventCards(eventList) {
  return eventList.map(e => `${e.category.charAt(0).toUpperCase() + e.category.slice(1)} — ${e.name}`);
}

/* ── Exercise 4: Functions, Scope, Closures, HOF ───────────── */
function addEvent(eventObj) {
  events.push(eventObj);
  globalSeatCount += eventObj.seats;
}

function filterEventsByCategory(eventList, category) {
  return eventList.filter(e => e.category === category);
}

function makeCategoryTracker() {
  const counts = {};
  return {
    register(category) {
      counts[category] = (counts[category] || 0) + 1;
    },
    getCount(category) {
      return counts[category] || 0;
    },
    getAll() {
      return { ...counts };
    },
  };
}

const categoryTracker = makeCategoryTracker();

function searchEvents(eventList, predicate) {
  return eventList.filter(predicate);
}

/* ── Exercise 3: Conditionals, Loops, Error Handling ────────── */
function getVisibleEvents(eventList, category = "all", location = "all", query = "") {
  const results = [];
  eventList.forEach(e => {
    if (!e.isUpcoming()) return;
    if (category !== "all" && e.category !== category) return;
    if (location !== "all" && e.location !== location) return;
    if (query && !e.name.toLowerCase().includes(query.toLowerCase())) return;
    results.push(e);
  });
  return results;
}

/* ── Exercise 7 & 8: DOM Manipulation & Event Handling ──────── */
function renderEvents(filteredEvents) {
  const grid = document.querySelector("#eventGrid");
  const noMsg = document.querySelector("#noEvents");
  grid.innerHTML = "";

  if (filteredEvents.length === 0) {
    noMsg.style.display = "block";
    return;
  }
  noMsg.style.display = "none";

  filteredEvents.forEach((ev, idx) => {
    const card = createElement(ev, idx);
    grid.appendChild(card);
  });

  populateEventSelect(filteredEvents);
}

function createElement(ev, idx) {
  const card = document.createElement("div");
  card.classList.add("event-card", `cat-${ev.category}`);
  if (!ev.checkAvailability()) card.classList.add("full");
  card.style.animationDelay = `${idx * 0.06}s`;
  card.dataset.id = ev.id;

  const seatsLabel = ev.seats === 0
    ? `<span class="card-seats full-tag">Sold Out</span>`
    : ev.seats <= 5
      ? `<span class="card-seats low">${ev.seats} left</span>`
      : `<span class="card-seats">${ev.seats} seats</span>`;

  const isRegistered = ev.registeredUsers.length > 0 && currentUserName && ev.registeredUsers.includes(currentUserName);

  const footerHTML = isRegistered
    ? `<div class="registered-badge">✓ You're registered <button class="btn btn-cancel" data-id="${ev.id}">Cancel</button></div>`
    : ev.checkAvailability()
      ? `<button class="btn btn-primary" id="reg-${ev.id}" data-id="${ev.id}">Register <span class="btn-icon">→</span></button>`
      : `<button class="btn btn-primary" disabled>Sold Out</button>`;

  card.innerHTML = `
    <div class="card-color-bar"></div>
    <div class="card-body">
      <div class="card-meta">
        <span class="card-category">${ev.category}</span>
        ${seatsLabel}
      </div>
      <h3 class="card-title">${ev.name}</h3>
      <div class="card-info">
        <span>📅 ${ev.date.toLocaleDateString("en-IN", { day:"numeric", month:"short", year:"numeric" })}</span>
        <span>📍 ${ev.location}</span>
        <span>💰 ${ev.price}</span>
        <span>ℹ️ ${ev.description}</span>
      </div>
    </div>
    <div class="card-footer">${footerHTML}</div>
  `;

  card.querySelector(`[data-id="${ev.id}"]`)?.addEventListener("click", handleCardAction);
  return card;
}

function handleCardAction(e) {
  const btn = e.currentTarget;
  const isCancelBtn = btn.classList.contains("btn-cancel");
  const id = parseInt(btn.dataset.id);
  const ev = events.find(x => x.id === id);
  if (!ev) return;

  if (isCancelBtn) {
    handleCancellation(ev);
  } else {
    const name = prompt(`Enter your name to register for "${ev.name}":`);
    if (!name || !name.trim()) return;
    handleRegistration(ev, name.trim());
  }
}

/* ── Exercise 3 (try-catch) & Exercise 4 (closure tracker) ─── */
function handleRegistration(ev, userName) {
  try {
    ev.registerUser(userName);
    categoryTracker.register(ev.category);
    updateStats();
    refreshUI();
    showToast(`Registered for "${ev.name}"! 🎉`, "success");
    logRegistration(`${userName} → ${ev.name} (${ev.category})`);
  } catch (err) {
    showToast(err.message, "error");
  }
}

function handleCancellation(ev) {
  const name = prompt(`Enter your name to cancel registration for "${ev.name}":`);
  if (!name || !name.trim()) return;
  try {
    ev.cancelUser(name.trim());
    updateStats();
    refreshUI();
    showToast(`Cancellation confirmed for "${ev.name}".`, "success");
  } catch (err) {
    showToast(err.message, "error");
  }
}

let currentUserName = "";

function refreshUI() {
  const cat = document.querySelector("#categoryFilter").value;
  const loc = document.querySelector("#locationFilter").value;
  const q = document.querySelector("#searchInput").value;
  renderEvents(getVisibleEvents(events, cat, loc, q));
}

function updateStats() {
  document.querySelector("#stat-total").textContent = events.filter(e => e.isUpcoming()).length;
  document.querySelector("#stat-seats").textContent = events.reduce((s, e) => s + e.seats, 0);
  const cats = new Set(events.map(e => e.category));
  document.querySelector("#stat-cats").textContent = cats.size;
}

/* ── Exercise 8: onchange for filter, keydown for search ─────── */
function initFilters() {
  document.querySelector("#categoryFilter").addEventListener("change", refreshUI);
  document.querySelector("#locationFilter").addEventListener("change", refreshUI);

  document.querySelector("#searchInput").addEventListener("keydown", e => {
    if (e.key === "Enter" || e.key.length === 1 || e.key === "Backspace") {
      setTimeout(refreshUI, 0);
    }
  });

  document.querySelector("#searchInput").addEventListener("input", refreshUI);
}

/* ── Exercise 11: Working with Forms ───────────────────────── */
function populateEventSelect(visibleList) {
  const sel = document.querySelector("#eventSelect");
  const current = sel.value;
  sel.innerHTML = `<option value="">— Select an event —</option>`;
  visibleList
    .filter(e => e.checkAvailability())
    .forEach(e => {
      const opt = document.createElement("option");
      opt.value = e.id;
      opt.textContent = `${e.name} (${e.location})`;
      sel.appendChild(opt);
    });
  if (current) sel.value = current;
}

function validateForm(name, email, eventId) {
  let valid = true;

  document.querySelector("#nameError").textContent = "";
  document.querySelector("#emailError").textContent = "";
  document.querySelector("#eventError").textContent = "";
  ["userName", "userEmail", "eventSelect"].forEach(id => {
    document.getElementById(id).classList.remove("error");
  });

  if (!name || name.trim().length < 2) {
    document.querySelector("#nameError").textContent = "Please enter your full name (min 2 chars).";
    document.getElementById("userName").classList.add("error");
    valid = false;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) {
    document.querySelector("#emailError").textContent = "Enter a valid email address.";
    document.getElementById("userEmail").classList.add("error");
    valid = false;
  }

  if (!eventId) {
    document.querySelector("#eventError").textContent = "Please select an event.";
    document.getElementById("eventSelect").classList.add("error");
    valid = false;
  }

  return valid;
}

/* ── Exercise 9 & 12: Async/Await, Fetch API, AJAX ──────────── */
async function fetchMockEvents() {
  const mockApiUrl = "https://jsonplaceholder.typicode.com/posts?_limit=3";
  showLoader(true);

  try {
    const response = await fetch(mockApiUrl);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    console.log("Mock API response (simulating event fetch):", data);
    return data;
  } catch (err) {
    console.error("Fetch error:", err.message);
    return [];
  } finally {
    showLoader(false);
  }
}

async function postRegistration(payload) {
  const btn = document.querySelector("#registerBtn");
  const feedback = document.querySelector("#formFeedback");

  btn.disabled = true;
  btn.innerHTML = `<span class="spinner"></span> Submitting…`;
  feedback.style.display = "none";

  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) throw new Error(`Server returned ${response.status}`);

    const result = await response.json();
    console.log("Registration POST response:", result);

    await simulateDelay(600);

    const ev = events.find(e => e.id === payload.eventId);
    try {
      ev.registerUser(payload.name);
      categoryTracker.register(ev.category);
    } catch (regErr) {
      throw regErr;
    }

    updateStats();
    refreshUI();
    currentUserName = payload.name;

    feedback.textContent = `✓ Registration confirmed! See you at "${ev.name}", ${payload.name}!`;
    feedback.className = "form-feedback success";
    feedback.style.display = "block";
    document.querySelector("#registrationForm").reset();
    logRegistration(`${payload.name} (${payload.email}) → ${ev.name}`);
    showToast("Registration successful! 🎉", "success");

  } catch (err) {
    feedback.textContent = `✗ ${err.message}`;
    feedback.className = "form-feedback error";
    feedback.style.display = "block";
    showToast(err.message, "error");
  } finally {
    btn.disabled = false;
    btn.innerHTML = `<span class="btn-label">Register Now</span><span class="btn-icon">→</span>`;
  }
}

function simulateDelay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/* ── Exercise 10: Modern JS Features ──────────────────────────── */
function extractEventDetails({ name, date, category, location, seats } = {}) {
  return { name, date, category, location, seats };
}

function cloneAndFilter(eventList, predicate) {
  const cloned = [...eventList];
  return cloned.filter(predicate);
}

function formatDisplayCard(eventName, prefix = "Event") {
  return `${prefix}: ${eventName}`;
}

const musicEvents = getMusicEvents(events);
console.log("Music events:", formatEventCards(musicEvents));
console.log("Sample card:", formatDisplayCard("Organic Baking Workshop", "Workshop"));
console.log("Cloned music events:", cloneAndFilter(events, e => e.category === "music").map(e => e.name));

/* ── Exercise 13: Debugging helpers ──────────────────────────── */
function logFormStep(step, data) {
  console.group(`[Form Debug] ${step}`);
  console.log(data);
  console.groupEnd();
}

function logRegistration(msg) {
  const log = document.querySelector("#registrationLog");
  const entry = document.createElement("div");
  entry.classList.add("reg-log-entry");
  entry.textContent = `✓ ${msg}`;
  log.prepend(entry);
}

/* ── Utility: Toast & Loader ─────────────────────────────────── */
function showToast(msg, type = "") {
  const toast = document.querySelector("#toast");
  toast.textContent = msg;
  toast.className = `toast show ${type}`;
  clearTimeout(showToast._t);
  showToast._t = setTimeout(() => toast.classList.remove("show"), 3200);
}

function showLoader(visible) {
  const loader = document.querySelector("#loader");
  if (visible) {
    loader.classList.remove("hidden");
  } else {
    loader.classList.add("hidden");
  }
}

/* ── Exercise 14: jQuery Integration ─────────────────────────── */
function initJQuery() {
  $("#registerBtn").on("click", function () {
    $(this).addClass("btn-clicked");
    setTimeout(() => $(this).removeClass("btn-clicked"), 200);
  });

  $(document).on("mouseenter", ".event-card", function () {
    $(this).find(".card-color-bar").stop(true).animate({ height: "8px" }, 180);
  });

  $(document).on("mouseleave", ".event-card", function () {
    $(this).find(".card-color-bar").stop(true).animate({ height: "5px" }, 180);
  });
}

/* ── Form submit handler ─────────────────────────────────────── */
function initForm() {
  const form = document.querySelector("#registrationForm");

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const els = form.elements;
    const name = els.userName.value.trim();
    const email = els.userEmail.value.trim();
    const eventId = parseInt(els.eventSelect.value);

    logFormStep("Form Submitted", { name, email, eventId });

    if (!validateForm(name, email, els.eventSelect.value)) {
      logFormStep("Validation Failed", { name, email, eventId });
      return;
    }

    const payload = { name, email, eventId };
    logFormStep("Posting to API", payload);

    postRegistration(payload);
  });
}

/* ── Stats counter animation ─────────────────────────────────── */
function animateCounters() {
  const total = events.filter(e => e.isUpcoming()).length;
  const seats = events.reduce((s, e) => s + e.seats, 0);
  const cats = new Set(events.map(e => e.category)).size;

  animateNum("#stat-total", total);
  animateNum("#stat-seats", seats);
  animateNum("#stat-cats", cats);
}

function animateNum(selector, target) {
  const el = document.querySelector(selector);
  let current = 0;
  const step = Math.ceil(target / 30);
  const interval = setInterval(() => {
    current = Math.min(current + step, target);
    el.textContent = current;
    if (current >= target) clearInterval(interval);
  }, 40);
}

/* ── Main Initialiser ────────────────────────────────────────── */
function initPortal() {
  showLoader(false);

  fetchMockEvents().then(data => {
    console.log(`Fetched ${data.length} mock items from API.`);
  });

  renderEvents(getVisibleEvents(events));
  updateStats();
  animateCounters();
  initFilters();
  initForm();
  initJQuery();
  populateEventSelect(getVisibleEvents(events));

  const summary = buildEventSummary(PORTAL_NAME, LAUNCH_DATE, globalSeatCount);
  console.log(summary);

  const sample = extractEventDetails(events[0]);
  console.log("Destructured event:", sample);

  console.log("Category tracker snapshot:", categoryTracker.getAll());
  console.log("Portal initialised:", PORTAL_NAME);
}
