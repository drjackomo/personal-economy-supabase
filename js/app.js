const SUPABASE_URL = "https://xtztpxvnuzdmdodfsais.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_zonUWg9hhGsoKNFV9b4pZA_bg5nXGAJ";
const ALLOWED_AUTH_EMAILS = new Set([
  "drjackomo@gmail.com",
  "giacomo.guglielmo@gmail.com",
]);

const statusElement = document.getElementById("connection-status");
const loadButton = document.getElementById("load-transactions");
const outputElement = document.getElementById("transactions-output");
const movimentiTableElement = document.getElementById("movimenti-table");
const movimentiMonthSelect = document.getElementById("movimenti-month");
const movimentiYearSelect = document.getElementById("movimenti-year");
const applyMovimentiFilterButton = document.getElementById("apply-movimenti-filter");
const yearlyTotalElement = document.getElementById("yearly-total");
const yearlyIncomeElement = document.getElementById("yearly-income");
const yearlyExpenseElement = document.getElementById("yearly-expense");
const monthlyTotalElement = document.getElementById("monthly-total");
const monthlyIncomeElement = document.getElementById("monthly-income");
const monthlyExpenseElement = document.getElementById("monthly-expense");
const movimentiPageMessage = document.getElementById("movimenti-page-message");
const movementModal = document.getElementById("movement-modal");
const movementModalTitle = document.getElementById("movement-modal-title");
const openMovementModalButton = document.getElementById("open-movement-modal");
const openUpdateMonthToolbarButton = document.getElementById("open-update-month-toolbar");
const openUpdateMonthModalButton = document.getElementById("open-update-month-modal");
const openRevolutModalButton = document.getElementById("open-revolut-modal");
const closeMovementModalButton = document.getElementById("close-movement-modal");
const cancelMovementModalButton = document.getElementById("cancel-movement-modal");
const saveMovementPlaceholderButton = document.getElementById("save-movement-placeholder");
const movementDateInput = document.getElementById("movement-date");
const movementDescriptionInput = document.getElementById("movement-description");
const movementAmountInput = document.getElementById("movement-amount");
const movementTypeSwitch = document.getElementById("tipoSwitch");
const movementInTotalsSwitch = document.getElementById("consuntivoSwitch");
const currentBalancePreview = document.getElementById("current-balance-preview");
const nextBalancePreview = document.getElementById("next-balance-preview");
const movementModalError = document.getElementById("movement-modal-error");
const updateMonthModal = document.getElementById("update-month-modal");
const closeUpdateMonthModalButton = document.getElementById("close-update-month-modal");
const cancelUpdateMonthModalButton = document.getElementById("cancel-update-month-modal");
const confirmUpdateMonthButton = document.getElementById("confirm-update-month");
const updateMonthInput = document.getElementById("update-month-input");
const updateMonthNoteInput = document.getElementById("update-month-note");
const updateMonthError = document.getElementById("update-month-error");
const revolutModal = document.getElementById("revolut-modal");
const closeRevolutModalButton = document.getElementById("close-revolut-modal");
const cancelRevolutModalButton = document.getElementById("cancel-revolut-modal");
const saveRevolutPlaceholderButton = document.getElementById("save-revolut-placeholder");
const revolutPersonalInput = document.getElementById("revolut-personal");
const revolutSharedInput = document.getElementById("revolut-shared");
const revolutNoteInput = document.getElementById("revolut-note");
const lastRevolutPersonalElement = document.getElementById("last-revolut-personal");
const lastRevolutSharedElement = document.getElementById("last-revolut-shared");
const lastRevolutUpdatedElement = document.getElementById("last-revolut-updated");
const deleteMovementModal = document.getElementById("delete-movement-modal");
const cancelDeleteMovementButton = document.getElementById("cancel-delete-movement");
const confirmDeleteMovementButton = document.getElementById("confirm-delete-movement");
const deleteMovementModalError = document.getElementById("delete-movement-modal-error");
const titoliInsertRoot = document.getElementById("titoli-insert-root");
const titoliSnapshotDateInput = document.getElementById("titoli-snapshot-date");
const titoliWeekPicker = document.getElementById("titoli-week-picker");
const titoliPageRoot = document.getElementById("titoli-page");
const titoliChartStateElement = document.getElementById("titoli-chart-state");
const titoliChartSubtitle = document.getElementById("titoli-chart-subtitle");
const titoliChartRangeElement = document.getElementById("titoli-chart-range");
const titoliChartCanvas = document.getElementById("titoli-chart-canvas");
const titoliChartPresetSelect = document.getElementById("titoli-chart-preset");
const titoliChartFromInput = document.getElementById("titoli-chart-from");
const titoliChartToInput = document.getElementById("titoli-chart-to");
const titoliChartApplyButton = document.getElementById("titoli-chart-apply");
const titoliChartCancelButton = document.getElementById("titoli-chart-cancel");
const titoliChartToggle = document.getElementById("titoli-chart-toggle");
const titoliSeriesToggleButton = document.getElementById("titoli-series-toggle");
const titoliSeriesPanel = document.getElementById("titoli-series-panel");
const titoliSeriesSearchInput = document.getElementById("titoli-series-search");
const titoliSeriesAllButton = document.getElementById("titoli-series-all");
const titoliSeriesNoneButton = document.getElementById("titoli-series-none");
const titoliSeriesCloseButton = document.getElementById("titoli-series-close");
const titoliSeriesList = document.getElementById("titoli-series-list");
const titoliHistoryStateElement = document.getElementById("titoli-history-state");
const dashboardCardsRoot = document.getElementById("dashboard-cards");
const dashboardErrorElement = document.getElementById("dashboard-error");
const wealthTrendCanvas = document.getElementById("wealth-trend-chart");
const wealthTrendLegend = document.getElementById("wealth-trend-legend");
const wealthTrendState = document.getElementById("wealth-trend-state");
const patrimonySubtitle = document.getElementById("patrimonySubtitle");
const patrimonyRangeSummary = document.getElementById("patrimonyRangeSummary");
const patrimonyPreset = document.getElementById("patrimonyPreset");
const patrimonyFrom = document.getElementById("patrimonyFrom");
const patrimonyTo = document.getElementById("patrimonyTo");
const patrimonyApply = document.getElementById("patrimonyApply");
const patrimonyReset = document.getElementById("patrimonyReset");
const patrimonyToggle = document.getElementById("patrimonyToggle");
const patrimonyTrendToggle = document.getElementById("patrimonyTrendToggle");
const investmentsCanvas = document.getElementById("investmentsChartCanvas");
const investmentsLegend = document.getElementById("investmentsLegend");
const investmentsStateElement = document.getElementById("investments-chart-state");
const investmentsSubtitle = document.getElementById("invSubtitle");
const investmentsRangeSummary = document.getElementById("invRangeSummary");
const investmentsPreset = document.getElementById("invPreset");
const investmentsFrom = document.getElementById("invFrom");
const investmentsTo = document.getElementById("invTo");
const investmentsApply = document.getElementById("invApply");
const investmentsReset = document.getElementById("invReset");
const investmentsToggle = document.getElementById("invToggle");
const dossierPageRoot = document.getElementById("dossier-page");
const dossierChartCanvas = document.getElementById("dossier-investments-chart");
const dossierChartLegend = document.getElementById("dossier-chart-legend");
const dossierChartStateElement = document.getElementById("dossier-chart-state");
const dossierChartSubtitle = document.getElementById("dossier-chart-subtitle");
const dossierChartRangeElement = document.getElementById("dossier-chart-range");
const dossierChartPreset = document.getElementById("dossier-chart-preset");
const dossierChartFromInput = document.getElementById("dossier-chart-from");
const dossierChartToInput = document.getElementById("dossier-chart-to");
const dossierChartApplyButton = document.getElementById("dossier-chart-apply");
const dossierChartCancelButton = document.getElementById("dossier-chart-cancel");
const dossierChartToggle = document.getElementById("dossier-chart-toggle");
const dossierSeriesToggleButton = document.getElementById("dossier-series-toggle");
const dossierSeriesPanel = document.getElementById("dossier-series-panel");
const dossierSeriesSearchInput = document.getElementById("dossier-series-search");
const dossierSeriesAllButton = document.getElementById("dossier-series-all");
const dossierSeriesNoneButton = document.getElementById("dossier-series-none");
const dossierSeriesList = document.getElementById("dossier-series-list");
const dossierDetailPeriodSelect = document.getElementById("dossier-detail-period");
const dossierDetailYearSelect = document.getElementById("dossier-detail-year");
const dossierDetailMonthSelect = document.getElementById("dossier-detail-month");
const dossierDetailDossierSelect = document.getElementById("dossier-detail-dossier");
const dossierDetailStateElement = document.getElementById("dossier-detail-state");
const dossierDetailTableBody = document.querySelector("#dossier-detail-table tbody");
const dossierTotalsPeriodSelect = document.getElementById("dossier-totals-period");
const dossierTotalsYearSelect = document.getElementById("dossier-totals-year");
const dossierTotalsMonthSelect = document.getElementById("dossier-totals-month");
const dossierTotalsStateElement = document.getElementById("dossier-totals-state");
const dossierTotalsTableBody = document.querySelector("#dossier-totals-table tbody");
const navbarRoot = document.getElementById("navbar-root");

const hasCredentials =
  SUPABASE_URL !== "INSERISCI_QUI_SUPABASE_URL" &&
  SUPABASE_ANON_KEY !== "INSERISCI_QUI_SUPABASE_ANON_KEY";

let movementCurrentBalance = 0;
let modalMode = "create";
let editingTxId = null;
let pendingDeleteTxId = null;
let titoliSelectedDate = new Date();
let titoliState = {
  mode: "month",
  range: {
    start: "",
    end: "",
    preset: "last3",
  },
  seriesSearch: "",
  seriesPanelOpen: false,
  seriesVisibility: {},
  raw: {
    dossiers: [],
    assets: [],
    snapshots: [],
    basisEvents: [],
  },
  normalized: {
    dossiers: [],
    seriesByDossier: new Map(),
    allSeries: [],
    minDate: "",
    maxDate: "",
    basisAvailable: false,
    columns: {},
  },
  chartMeta: {
    minDate: "",
    maxDate: "",
    pointCount: 0,
  },
  historySelections: {},
};
let titoliChart = null;
let wealthTrendSeries = [];
let wealthTrendChart = null;
let investmentsSeries = [];
let investmentsChart = null;
let patrimonyState = {
  mode: "month",
  trend: false,
  range: {
    start: "",
    end: "",
    preset: "all",
  },
};
let investmentsViewState = {
  mode: "month",
  baseMode: "month",
  trend: false,
  range: {
    start: "",
    end: "",
    preset: "all",
  },
};
let dossierPageState = {
  dossiers: [],
  snapshots: [],
  basisEvents: [],
};
let dossierChart = null;
let dossierChartState = {
  mode: "month",
  range: {
    start: "",
    end: "",
    preset: "last3",
  },
  seriesVisibility: {},
  seriesSearch: "",
  seriesPanelOpen: false,
};

const supabaseClient = hasCredentials && window.supabase
  ? window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  : null;
let authenticatedAppInitialized = false;

async function loadNavbar() {
  if (!navbarRoot) return;

  try {
    const response = await fetch("partials/navbar.html");
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    navbarRoot.innerHTML = await response.text();
    const normalizePage = (value) => {
      const raw = String(value || "").split("/").pop() || "index.html";
      return raw.replace(/\.html$/i, "") || "index";
    };
    const currentPage = normalizePage(window.location.pathname);

    const navLinks = document.querySelectorAll("#navbar-root a[href]");

    navLinks.forEach((link) => {
      link.classList.remove("active");

      const linkPage = normalizePage(link.getAttribute("href"));

      if (linkPage === currentPage) {
        link.classList.add("active");
      }
    });
  } catch (error) {
    console.error("Errore caricamento navbar:", error);
  }
}

function addAuthLogoutToNavbar(user) {
  const topbarStatus = document.querySelector("#navbar-root .topbar-status");
  if (!topbarStatus) return;

  topbarStatus.innerHTML = "";
  const userEmail = document.createElement("span");
  const logoutButton = document.createElement("button");

  userEmail.className = "auth-navbar-user";
  userEmail.textContent = user?.email || "Account";
  logoutButton.type = "button";
  logoutButton.className = "auth-logout";
  logoutButton.textContent = "Esci";
  logoutButton.addEventListener("click", signOut);

  topbarStatus.appendChild(userEmail);
  topbarStatus.appendChild(logoutButton);
}

async function getCurrentUser() {
  if (!supabaseClient?.auth) return null;

  const { data: sessionData, error: sessionError } = await supabaseClient.auth.getSession();
  if (sessionError) {
    console.warn("[Auth] Impossibile leggere sessione corrente:", sessionError);
    return null;
  }
  if (!sessionData?.session) return null;

  const { data, error } = await supabaseClient.auth.getUser();
  if (error) {
    console.warn("[Auth] Impossibile leggere utente corrente:", error);
    return null;
  }

  return data?.user || null;
}

function isAllowedUser(user) {
  const email = String(user?.email || "").trim().toLowerCase();
  return Boolean(email && ALLOWED_AUTH_EMAILS.has(email));
}

async function signInWithGoogle() {
  if (!supabaseClient?.auth) {
    renderAuthGate("Credenziali Supabase mancanti o client non disponibile.");
    return;
  }

  const { error } = await supabaseClient.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: window.location.origin + window.location.pathname,
    },
  });

  if (error) {
    renderAuthGate(`Errore login Google: ${error.message || error}`);
  }
}

async function signOut() {
  if (supabaseClient?.auth) {
    const { error } = await supabaseClient.auth.signOut();
    if (error) console.warn("[Auth] Errore logout:", error);
  }

  authenticatedAppInitialized = false;
  renderAuthGate();
}

function createAuthBrand() {
  const brand = document.createElement("div");
  const logo = document.createElement("img");

  brand.className = "auth-brand";
  logo.className = "auth-logo";
  logo.src = "assets/favicon.svg";
  logo.alt = "";

  brand.appendChild(logo);
  return brand;
}

function renderAuthLoadingGate() {
  document.body.classList.add("is-auth-loading");
  document.body.classList.remove("is-auth-ready", "is-auth-gated");
  document.getElementById("auth-gate")?.remove();

  const gate = document.createElement("main");
  const card = document.createElement("section");
  const title = document.createElement("h1");
  const subtitle = document.createElement("p");

  gate.id = "auth-gate";
  gate.className = "auth-gate auth-loading-gate";
  card.className = "auth-card auth-loading-card";
  title.className = "auth-title";
  subtitle.className = "auth-subtitle";
  title.textContent = "Personal Economy";
  subtitle.textContent = "Caricamento...";

  card.appendChild(createAuthBrand());
  card.appendChild(title);
  card.appendChild(subtitle);
  gate.appendChild(card);
  document.body.appendChild(gate);
}

function renderAuthGate(message, user = null) {
  document.body.classList.add("is-auth-gated");
  document.body.classList.remove("is-auth-loading", "is-auth-ready");
  document.getElementById("auth-gate")?.remove();

  const gate = document.createElement("main");
  const card = document.createElement("section");
  const title = document.createElement("h1");
  const subtitle = document.createElement("p");
  const eyebrow = document.createElement("p");
  const eyebrowIcon = document.createElement("span");
  const eyebrowText = document.createElement("span");

  gate.id = "auth-gate";
  gate.className = "auth-gate";
  card.className = "auth-card";
  title.className = "auth-title";
  subtitle.className = "auth-subtitle";
  eyebrow.className = "auth-eyebrow";
  eyebrowIcon.className = "auth-eyebrow-icon";
  eyebrowIcon.setAttribute("aria-hidden", "true");
  eyebrowIcon.innerHTML = `
    <svg viewBox="0 0 24 24" focusable="false">
      <path d="M7 10V8a5 5 0 0 1 10 0v2"></path>
      <rect x="5" y="10" width="14" height="10" rx="2"></rect>
      <path d="M12 14v2"></path>
    </svg>
  `;
  eyebrowText.textContent = user ? "Account non autorizzato" : "Accesso riservato agli account autorizzati";
  title.textContent = "Personal Economy";
  subtitle.textContent = user
    ? "L'account Google usato non e abilitato ad accedere a questa applicazione."
    : "La tua piattaforma personale per patrimonio, movimenti e investimenti.";
  eyebrow.appendChild(eyebrowIcon);
  eyebrow.appendChild(eyebrowText);

  card.appendChild(createAuthBrand());
  card.appendChild(title);
  card.appendChild(subtitle);
  card.appendChild(eyebrow);

  if (user?.email) {
    const userElement = document.createElement("div");
    userElement.className = "auth-user";
    userElement.textContent = user.email;
    card.appendChild(userElement);
  }

  if (message) {
    const errorElement = document.createElement("div");
    errorElement.className = "auth-error";
    errorElement.textContent = message;
    card.appendChild(errorElement);
  }

  const actionButton = document.createElement("button");
  actionButton.type = "button";
  actionButton.className = user ? "auth-logout" : "auth-button";
  if (user) {
    actionButton.textContent = "Esci e cambia account";
  } else {
    const googleIcon = document.createElement("span");
    const buttonText = document.createElement("span");
    googleIcon.className = "auth-google-icon";
    googleIcon.setAttribute("aria-hidden", "true");
    googleIcon.innerHTML = `
      <svg viewBox="0 0 24 24" focusable="false">
        <path fill="#4285f4" d="M22.6 12.2c0-.8-.1-1.5-.2-2.2H12v4.2h5.9c-.3 1.3-1 2.4-2.1 3.1v2.6h3.4c2-1.8 3.4-4.5 3.4-7.7z"></path>
        <path fill="#34a853" d="M12 23c3 0 5.5-1 7.3-2.7l-3.4-2.6c-.9.6-2.2 1-3.9 1-3 0-5.5-2-6.4-4.7H2.1v2.7C3.9 20.4 7.7 23 12 23z"></path>
        <path fill="#fbbc05" d="M5.6 14c-.2-.6-.4-1.3-.4-2s.1-1.4.4-2V7.3H2.1C1.4 8.7 1 10.3 1 12s.4 3.3 1.1 4.7L5.6 14z"></path>
        <path fill="#ea4335" d="M12 5.3c1.6 0 3.1.6 4.2 1.7l3.1-3.1C17.5 2.1 15 1 12 1 7.7 1 3.9 3.6 2.1 7.3L5.6 10c.9-2.7 3.4-4.7 6.4-4.7z"></path>
      </svg>
    `;
    buttonText.textContent = "Continua con Google";
    actionButton.appendChild(googleIcon);
    actionButton.appendChild(buttonText);
  }
  actionButton.addEventListener("click", user ? signOut : signInWithGoogle);
  card.appendChild(actionButton);

  if (!user) {
    const microcopy = document.createElement("p");
    microcopy.className = "auth-microcopy";
    microcopy.textContent = "Accesso sicuro tramite Google. I tuoi dati restano privati.";
    card.appendChild(microcopy);
  }

  gate.appendChild(card);
  document.body.appendChild(gate);
}

function removeAuthGate() {
  document.body.classList.remove("is-auth-gated", "is-auth-loading");
  document.body.classList.add("is-auth-ready");
  document.getElementById("auth-gate")?.remove();
}

async function initAuthenticatedApp(user) {
  if (authenticatedAppInitialized) return;
  authenticatedAppInitialized = true;

  await loadNavbar();
  addAuthLogoutToNavbar(user);

  if (loadButton && statusElement && outputElement) {
    if (hasCredentials) {
      setStatus("Pronto per leggere da Supabase", "ok");
    } else {
      setStatus("Credenziali da configurare", "warning");
    }

    loadButton.addEventListener("click", loadTransactions);
  }

  if (dashboardCardsRoot) {
    loadDashboard();
  }

  if (wealthTrendCanvas) {
    initPatrimonyControls();
    loadDashboardWealthTrend();
  }

  if (investmentsCanvas) {
    initInvestmentsControls();
    loadInvestmentsPerformanceChart();
  }

  if (titoliInsertRoot && titoliSnapshotDateInput && titoliWeekPicker) {
    initTitoliInsertPage();
  }

  if (titoliPageRoot) {
    initTitoliPage();
  }

  if (dossierPageRoot) {
    initDossierPage();
  }

  if (movimentiTableElement && movimentiMonthSelect && movimentiYearSelect && applyMovimentiFilterButton) {
    initMovimentiFilters();
    if (
      movementModal &&
      movementModalTitle &&
      openMovementModalButton &&
      closeMovementModalButton &&
      cancelMovementModalButton &&
      saveMovementPlaceholderButton &&
      movementDateInput &&
      movementDescriptionInput &&
      movementAmountInput &&
      movementTypeSwitch &&
      movementInTotalsSwitch &&
      currentBalancePreview &&
      nextBalancePreview &&
      movementModalError
    ) {
      initMovementModal();
    }
    if (
      updateMonthModal &&
      (openUpdateMonthToolbarButton || openUpdateMonthModalButton) &&
      closeUpdateMonthModalButton &&
      cancelUpdateMonthModalButton &&
      confirmUpdateMonthButton &&
      updateMonthInput &&
      updateMonthNoteInput &&
      updateMonthError
    ) {
      initUpdateMonthModal();
    }
    if (
      revolutModal &&
      openRevolutModalButton &&
      closeRevolutModalButton &&
      cancelRevolutModalButton &&
      saveRevolutPlaceholderButton &&
      revolutPersonalInput &&
      revolutSharedInput &&
      revolutNoteInput &&
      lastRevolutPersonalElement &&
      lastRevolutSharedElement &&
      lastRevolutUpdatedElement
    ) {
      initRevolutModal();
    }
    if (window.feather) {
      window.feather.replace();
    }
    if (
      deleteMovementModal &&
      cancelDeleteMovementButton &&
      confirmDeleteMovementButton &&
      deleteMovementModalError
    ) {
      initDeleteMovementModal();
    }
    applyMovimentiFilterButton.addEventListener("click", loadMovimenti);
    loadMovimenti();
  }
}

async function initAuthGate() {
  renderAuthLoadingGate();

  if (!supabaseClient?.auth) {
    renderAuthGate("Credenziali Supabase mancanti o client Supabase non disponibile.");
    return;
  }

  const user = await getCurrentUser();
  if (!user) {
    renderAuthGate();
    return;
  }

  if (!isAllowedUser(user)) {
    renderAuthGate("Account non autorizzato", user);
    return;
  }

  await initAuthenticatedApp(user);
  removeAuthGate();
}

function setStatus(message, type) {
  statusElement.textContent = message;
  statusElement.className = `status status-${type}`;
}

function showOutput(value) {
  outputElement.textContent =
    typeof value === "string" ? value : JSON.stringify(value, null, 2);
}

function formatCellValue(column, value) {
  if (value === null || value === undefined) {
    return "-";
  }

  if (column === "date" || column === "created_at") {
    return new Date(value).toLocaleDateString("it-IT");
  }

  if (typeof value === "number") {
    return formatEuro(value);
  }

  return String(value);
}

function formatDate(value) {
  if (value === null || value === undefined) {
    return "-";
  }

  return new Date(value).toLocaleDateString("it-IT");
}

function formatEuro(value) {
  const number = Number(value);
  if (!Number.isFinite(number)) return "-";

  const formatted = new Intl.NumberFormat("it-IT", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    useGrouping: true,
  }).format(number);

  return `€ ${formatted}`;
}

function formatDashboardDate(value) {
  if (!value) return "—";

  const [datePart] = String(value).split("T");
  const parts = datePart.split("-");

  if (parts.length !== 3) {
    return formatDate(value);
  }

  return `${parts[2]}/${parts[1]}/${parts[0]}`;
}

function setDashboardText(id, value) {
  const element = document.getElementById(id);
  if (element) {
    element.textContent = value;
  }
}

function getMostRecentDate(firstDate, secondDate) {
  if (!firstDate) return secondDate || null;
  if (!secondDate) return firstDate;

  return new Date(firstDate) >= new Date(secondDate) ? firstDate : secondDate;
}

function sumDashboardRecords(records, predicate) {
  return records.reduce((total, record) => {
    if (!predicate(record)) return total;

    const value = Number(record.snapshot?.value);
    return Number.isFinite(value) ? total + value : total;
  }, 0);
}

function setDashboardError(message) {
  if (!dashboardErrorElement) return;

  dashboardErrorElement.textContent = message || "";
  dashboardErrorElement.classList.toggle("is-visible", Boolean(message));
}

function setDashboardLoading() {
  [
    "dashboard-cc-value",
    "dashboard-portfolio-value",
    "dashboard-portfolio-jack",
    "dashboard-portfolio-figli",
    "dashboard-fineco-value",
    "dashboard-fineco-jack",
    "dashboard-fineco-figli",
    "dashboard-revolut-value",
    "dashboard-revolut-jack",
    "dashboard-revolut-join",
  ].forEach((id) => setDashboardText(id, "Carico..."));

  [
    "dashboard-cc-date",
    "dashboard-portfolio-date",
    "dashboard-fineco-date",
    "dashboard-revolut-date",
  ].forEach((id) => setDashboardText(id, "—"));
}

function renderDashboardValues({ cc, portfolio, revolut }) {
  const ccValue = Number(cc?.balance);
  const ccTotal = Number.isFinite(ccValue) ? ccValue : null;
  const hasPortfolio = Boolean(portfolio?.hasData);
  const portfolioTotal = portfolio.jack + portfolio.figli;
  const canCalculateFineco = ccTotal !== null && hasPortfolio;
  const finecoJack = canCalculateFineco ? ccTotal + portfolio.jack : null;
  const finecoFigli = portfolio.figli;
  const finecoTotal = canCalculateFineco ? ccTotal + portfolioTotal : null;
  const revolutJack = Number(revolut?.revolut_personal);
  const revolutJoin = Number(revolut?.revolut_join);
  const revolutTotal =
    (Number.isFinite(revolutJack) ? revolutJack : 0) +
    (Number.isFinite(revolutJoin) ? revolutJoin : 0);
  const finecoDate = getMostRecentDate(cc?.date, portfolio.date);

  setDashboardText("dashboard-cc-date", formatDashboardDate(cc?.date));
  setDashboardText("dashboard-cc-value", ccTotal === null ? "—" : formatEuro(ccTotal));

  setDashboardText("dashboard-portfolio-date", formatDashboardDate(portfolio.date));
  setDashboardText("dashboard-portfolio-value", hasPortfolio ? formatEuro(portfolioTotal) : "—");
  setDashboardText("dashboard-portfolio-jack", hasPortfolio ? formatEuro(portfolio.jack) : "—");
  setDashboardText("dashboard-portfolio-figli", hasPortfolio ? formatEuro(portfolio.figli) : "—");

  setDashboardText("dashboard-fineco-date", formatDashboardDate(finecoDate));
  setDashboardText("dashboard-fineco-value", finecoTotal === null ? "—" : formatEuro(finecoTotal));
  setDashboardText("dashboard-fineco-jack", finecoJack === null ? "—" : formatEuro(finecoJack));
  setDashboardText("dashboard-fineco-figli", hasPortfolio ? formatEuro(finecoFigli) : "—");

  setDashboardText("dashboard-revolut-date", formatDashboardDate(revolut?.date));
  setDashboardText("dashboard-revolut-value", revolut ? formatEuro(revolutTotal) : "—");
  setDashboardText("dashboard-revolut-jack", Number.isFinite(revolutJack) ? formatEuro(revolutJack) : "—");
  setDashboardText("dashboard-revolut-join", Number.isFinite(revolutJoin) ? formatEuro(revolutJoin) : "—");
}

async function fetchDashboardCurrentAccount() {
  const { data, error } = await supabaseClient
    .from("transactions")
    .select("date,created_at,balance")
    .order("date", { ascending: false })
    .order("created_at", { ascending: false })
    .limit(1);

  if (error) throw error;
  return data?.[0] ?? null;
}

async function fetchDashboardPortfolio() {
  const [dossiersResult, investmentsResult] = await Promise.all([
    supabaseClient
      .from("dossiers")
      .select("account_id,label,type")
      .eq("visible", true)
      .eq("is_closed", false),
    supabaseClient
      .from("investments_snapshots")
      .select("account_id,snapshot_date,created_at,value")
      .order("snapshot_date", { ascending: false })
      .order("created_at", { ascending: false }),
  ]);

  if (dossiersResult.error) throw dossiersResult.error;
  if (investmentsResult.error) throw investmentsResult.error;

  const latestSnapshots = new Map();

  (investmentsResult.data ?? []).forEach((snapshot) => {
    const accountId = String(snapshot.account_id || "");
    if (accountId && !latestSnapshots.has(accountId)) {
      latestSnapshots.set(accountId, snapshot);
    }
  });

  const records = (dossiersResult.data ?? []).map((dossier) => ({
    dossier,
    snapshot: latestSnapshots.get(String(dossier.account_id || "")) ?? null,
  }));
  const usedDates = records
    .map((record) => record.snapshot?.snapshot_date)
    .filter(Boolean)
    .sort();

  return {
    date: usedDates.at(-1) ?? null,
    hasData: records.some((record) => record.snapshot),
    jack: sumDashboardRecords(records, (record) => record.dossier.type === "ADULT"),
    figli: sumDashboardRecords(records, (record) => record.dossier.type === "CHILD"),
  };
}

async function fetchDashboardRevolut() {
  const { data, error } = await supabaseClient
    .from("revolut_snapshots")
    .select("date,created_at,revolut_personal,revolut_join")
    .order("date", { ascending: false })
    .order("created_at", { ascending: false })
    .limit(1);

  if (error) throw error;
  return data?.[0] ?? null;
}

async function loadDashboard() {
  if (!supabaseClient) {
    setDashboardLoading();
    setDashboardError("Credenziali Supabase mancanti.");
    return;
  }

  setDashboardLoading();
  setDashboardError("");

  try {
    const [cc, portfolio, revolut] = await Promise.all([
      fetchDashboardCurrentAccount(),
      fetchDashboardPortfolio(),
      fetchDashboardRevolut(),
    ]);

    renderDashboardValues({ cc, portfolio, revolut });
  } catch (error) {
    console.error("Errore caricamento Dashboard:", error);
    setDashboardLoading();
    setDashboardError(`Errore caricamento Dashboard: ${error.message || error}`);
  }
}

class DashboardMiniLookerChart {
  constructor({
    canvas,
    legendEl,
    labels,
    series,
    yFormat,
    yAxisFormat,
    yTickStep,
    yTickMax,
    yMaxStep,
    xLabelFormat,
    xTooltipFormat,
    tooltipExtra,
    tooltipMode,
    fill,
    pointRadius,
    pointHoverRadius,
    yRangePadding,
    yMinFloor,
    yMin,
    yMax,
    xLabelWidth,
    yZeroLine,
    legendFilter,
  }) {
    this.canvas = canvas;
    this.legendEl = legendEl;
    this.labels = labels || [];
    this.series = (series || []).map((item, index) => ({
      ...item,
      color: item.color || this.palette(index),
      fillColor: item.fillColor || "",
      lineWidth: item.lineWidth || 2,
      lineDash: Array.isArray(item.lineDash) ? item.lineDash : null,
      pointColors: Array.isArray(item.pointColors) ? item.pointColors : null,
      pointRadii: Array.isArray(item.pointRadii) ? item.pointRadii : null,
      on: true,
    }));
    this.yFormat = yFormat || ((value) => String(value));
    this.yAxisFormat = yAxisFormat || null;
    this.yTickStep = yTickStep || null;
    this.yTickMax = yTickMax || 10;
    this.yMaxStep = yMaxStep || null;
    this.yMin = typeof yMin === "number" ? yMin : null;
    this.yMax = typeof yMax === "number" ? yMax : null;
    this.xLabelFormat = xLabelFormat || ((label) => label);
    this.xTooltipFormat = xTooltipFormat || this.xLabelFormat;
    this.tooltipExtra = tooltipExtra || null;
    this.tooltipMode = tooltipMode || "all";
    this.fill = Boolean(fill);
    this.pointRadius = typeof pointRadius === "number" ? pointRadius : 2.5;
    this.pointHoverRadius = typeof pointHoverRadius === "number" ? pointHoverRadius : 0;
    this.yRangePadding = typeof yRangePadding === "number" ? yRangePadding : null;
    this.yMinFloor = typeof yMinFloor === "number" ? yMinFloor : null;
    this.xLabelWidth = xLabelWidth || 70;
    this.yZeroLine = yZeroLine || null;
    this.legendFilter = typeof legendFilter === "function" ? legendFilter : null;
    this.tooltip = this.ensureTooltip();
    this.ctx = canvas.getContext("2d");
    this.hoverIndex = null;
    this.onMove = (event) => this.handleMove(event);
    this.onLeave = () => this.handleLeave();
    this.onResize = () => {
      this.resize();
      this.draw();
    };

    this.resize();
    this.renderLegend();
    this.draw();
    canvas.addEventListener("mousemove", this.onMove);
    canvas.addEventListener("mouseleave", this.onLeave);
    window.addEventListener("resize", this.onResize);
  }

  destroy() {
    this.canvas.removeEventListener("mousemove", this.onMove);
    this.canvas.removeEventListener("mouseleave", this.onLeave);
    window.removeEventListener("resize", this.onResize);
    if (this.tooltip) {
      this.tooltip.style.display = "none";
    }
  }

  palette(index) {
    const palette = ["#1f2937", "#2563eb", "#16a34a", "#dc2626", "#7c3aed", "#ea580c"];
    return palette[index % palette.length];
  }

  ensureTooltip() {
    let tooltip = document.getElementById("pe_tooltip");
    if (!tooltip) {
      tooltip = document.createElement("div");
      tooltip.id = "pe_tooltip";
      tooltip.className = "tooltip";
      tooltip.style.display = "none";
      document.body.appendChild(tooltip);
    }
    return tooltip;
  }

  resize() {
    const dpr = window.devicePixelRatio || 1;
    const rect = this.canvas.getBoundingClientRect();
    this.canvas.width = Math.floor(rect.width * dpr);
    this.canvas.height = Math.floor(rect.height * dpr);
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    this.width = rect.width;
    this.height = rect.height;
    this.pad = { left: 56, right: 28, top: 14, bottom: 24 };
  }

  renderLegend() {
    if (!this.legendEl) return;

    this.legendEl.innerHTML = "";
    this.series
      .filter((item) => !this.legendFilter || this.legendFilter(item))
      .forEach((item) => {
      const legendItem = document.createElement("div");
      legendItem.className = "legend-item";
      legendItem.innerHTML = `<span class="legend-dot" style="background:${item.color}"></span><span>${item.name}</span>`;
      legendItem.addEventListener("click", () => {
        item.on = !item.on;
        legendItem.classList.toggle("off", !item.on);
        this.draw();
      });
      this.legendEl.appendChild(legendItem);
    });
  }

  getActiveSeries() {
    return this.series.filter((item) => item.on);
  }

  calcYRange() {
    const active = this.getActiveSeries();
    const values = [];
    active.forEach((item) => {
      item.values.forEach((value) => {
        if (value !== null && value !== undefined && Number.isFinite(value)) values.push(value);
      });
    });

    if (!values.length) return { min: -0.01, max: 0.01 };

    const minData = Math.min(...values);
    const snapToStep = (value, step, mode) => {
      if (!Number.isFinite(value) || !Number.isFinite(step) || step <= 0) return value;
      const scaled = value / step;
      const snapped = mode === "ceil" ? Math.ceil(scaled) : Math.floor(scaled);
      return snapped * step;
    };

    if (this.yMin !== null || this.yMax !== null) {
      let min = this.yMin !== null ? this.yMin : Math.min(...values);
      let max = this.yMax !== null ? this.yMax : Math.max(...values);
      if (minData > -5) min = Math.max(min, minData - 2);
      if (this.yTickStep) {
        min = snapToStep(min, this.yTickStep, "floor");
        max = snapToStep(max, this.yTickStep, "ceil");
      }
      if (max <= min) max = min + (this.yTickStep || 1);
      return { min, max };
    }

    let min = Math.min(...values);
    let max = Math.max(...values);
    if (min === max) {
      min -= 0.01;
      max += 0.01;
    }
    if (this.yMaxStep) {
      max = Math.ceil(max / this.yMaxStep) * this.yMaxStep;
    }
    const padRatio = this.yRangePadding !== null ? this.yRangePadding : 0.08;
    const pad = (max - min) * padRatio;
    let outMin = min - pad;
    if (this.yMinFloor !== null) outMin = Math.max(this.yMinFloor, outMin);
    return { min: outMin, max: max + pad };
  }

  plotBottom() {
    return this.height - this.pad.bottom;
  }

  xAt(index) {
    const innerWidth = this.width - this.pad.left - this.pad.right;
    if (this.labels.length <= 1) return this.pad.left + innerWidth / 2;
    return this.pad.left + (index * innerWidth) / (this.labels.length - 1);
  }

  yAt(value, min, max) {
    const innerHeight = this.height - this.pad.top - this.pad.bottom;
    return this.pad.top + ((max - value) * innerHeight) / (max - min);
  }

  calcYTicks(min, max) {
    const ticks = [];
    const range = max - min;
    let step = this.yTickStep || 0;

    if (!step) {
      step = 10 ** Math.floor(Math.log10(range || 1));
      if (range / step > this.yTickMax) step *= 2;
      if (range / step > this.yTickMax) step *= 2.5;
      if (range / step > this.yTickMax) step *= 2;
    }

    const roundTo = (value) => {
      const precision = Math.max(0, 6 - Math.floor(Math.log10(Math.max(1, Math.abs(step)))));
      return Number(value.toFixed(precision));
    };
    const start = roundTo(Math.floor(min / step) * step);
    const end = roundTo(Math.ceil(max / step) * step);

    for (let value = start; value <= end + step * 0.001; value += step) ticks.push(roundTo(value));

    const lastTick = ticks.length ? ticks[ticks.length - 1] : null;
    const minTick = roundTo(min);
    if (!ticks.includes(minTick)) {
      ticks.push(minTick);
      ticks.sort((a, b) => a - b);
    } else if (lastTick !== null && lastTick > minTick) {
      ticks.sort((a, b) => a - b);
    }

    return ticks;
  }

  drawAxes(min, max) {
    const ctx = this.ctx;
    const plotBottom = this.plotBottom();
    const chartRight = this.width - this.pad.right;
    const innerWidth = this.width - this.pad.left - this.pad.right;

    ctx.clearRect(0, 0, this.width, this.height);
    ctx.strokeStyle = "rgba(0,0,0,0.06)";
    ctx.fillStyle = "rgba(55,65,81,.8)";
    ctx.font = "12px system-ui, sans-serif";
    const maxLabels = Math.max(2, Math.floor(innerWidth / this.xLabelWidth));
    const step = Math.ceil(this.labels.length / maxLabels);
    ctx.textAlign = "right";
    ctx.textBaseline = "middle";

    const yLabelInset = 8;
    this.calcYTicks(min, max).forEach((tick) => {
      const y = this.yAt(tick, min, max);
      ctx.beginPath();
      ctx.moveTo(this.pad.left, y);
      ctx.lineTo(chartRight, y);
      ctx.stroke();
      if (y >= plotBottom - yLabelInset) return;
      const label = this.yAxisFormat ? this.yAxisFormat(tick) : this.yFormat(tick);
      const yText = Math.min(plotBottom - yLabelInset, Math.max(this.pad.top + yLabelInset, y));
      ctx.fillText(label, this.pad.left - 8, yText);
    });

    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    const xLabelOffset = 4;
    const xLabels = this.buildProgressiveXLabels(step);
    this.resolveXLabelOverlaps(xLabels).forEach(({ text, x }) => {
      ctx.fillText(text, x, plotBottom + xLabelOffset);
    });

    if (this.yZeroLine && Number.isFinite(this.yZeroLine.value)) {
      const y0 = this.yAt(this.yZeroLine.value, min, max);
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(this.pad.left, y0);
      ctx.lineTo(chartRight, y0);
      ctx.strokeStyle = this.yZeroLine.color || "rgba(55,65,81,0.35)";
      ctx.lineWidth = this.yZeroLine.width || 1;
      if (this.yZeroLine.dash) ctx.setLineDash(this.yZeroLine.dash);
      ctx.stroke();
      ctx.restore();
    }
  }

  formatXLabel(label, index) {
    const raw = this.xLabelFormat(label, index);
    if (raw === null || raw === undefined) return "";
    const text = String(raw).trim();
    if (!text) return "";
    if (text === "undefined" || text === "null" || text === "NaN") return "";
    return text;
  }

  buildProgressiveXLabels(step) {
    const monthlyLabels = this.buildMonthlyProgressiveXLabels();
    if (monthlyLabels) return monthlyLabels;

    return this.labels
      .map((label, index) => {
        if (index % step !== 0 && index !== this.labels.length - 1) return null;
        return this.makeXLabel(label, index);
      })
      .filter(Boolean);
  }

  buildMonthlyProgressiveXLabels() {
    const monthInfo = this.labels.map((label) => this.parseXLabelMonth(label));
    if (!monthInfo.length || monthInfo.some((item) => !item)) return null;

    const first = monthInfo[0];
    const last = monthInfo[monthInfo.length - 1];
    const rangeMonths = (last.year - first.year) * 12 + (last.month - first.month) + 1;
    const candidateIndexes = new Set([0, this.labels.length - 1]);
    const monthRepresentatives = new Map();

    monthInfo.forEach((item, index) => {
      const key = `${item.year}-${String(item.month).padStart(2, "0")}`;
      monthRepresentatives.set(key, { ...item, index });
    });

    monthRepresentatives.forEach((item) => {
      if (rangeMonths > 96) {
        if (item.month === 12) candidateIndexes.add(item.index);
      } else if (rangeMonths >= 24) {
        if (item.month === 4 || item.month === 8 || item.month === 12) candidateIndexes.add(item.index);
      } else {
        candidateIndexes.add(item.index);
      }
    });

    return [...candidateIndexes]
      .sort((firstIndex, secondIndex) => firstIndex - secondIndex)
      .map((index) => this.makeXLabel(this.labels[index], index))
      .filter(Boolean);
  }

  parseXLabelMonth(label) {
    const match = String(label || "").match(/^(\d{4})-(\d{2})(?:-\d{2})?$/);
    if (!match) return null;

    const year = Number(match[1]);
    const month = Number(match[2]);
    if (!Number.isFinite(year) || !Number.isFinite(month) || month < 1 || month > 12) return null;

    return { year, month };
  }

  makeXLabel(label, index) {
    const text = this.formatXLabel(label, index);
    if (typeof text !== "string" || !text.trim()) return null;

    const x = this.xAt(index);
    const width = this.ctx.measureText(text).width;

    return {
      index,
      text,
      x,
      left: x - width / 2,
      right: x + width / 2,
      isFirst: index === 0,
      isLast: index === this.labels.length - 1,
    };
  }

  resolveXLabelOverlaps(labels) {
    const minGap = 8;
    const visible = [];

    labels.forEach((label) => {
      if (label.isLast) return;

      const previous = visible.at(-1);
      if (previous && label.left < previous.right + minGap) return;

      visible.push(label);
    });

    const lastLabel = labels.find((label) => label.isLast);
    if (lastLabel) {
      while (visible.length > 0) {
        const previous = visible.at(-1);
        if (lastLabel.left >= previous.right + minGap) break;
        if (previous.isFirst) break;
        visible.pop();
      }

      visible.push(lastLabel);
    }

    return visible.sort((first, second) => first.index - second.index);
  }

  makeFillGradient(color) {
    const gradient = this.ctx.createLinearGradient(0, this.pad.top, 0, this.plotBottom());
    const base = this.parseColor(color) || { r: 37, g: 99, b: 235 };
    gradient.addColorStop(0, `rgba(${base.r},${base.g},${base.b},0.2)`);
    gradient.addColorStop(1, `rgba(${base.r},${base.g},${base.b},0)`);
    return gradient;
  }

  drawSeries(min, max) {
    const ctx = this.ctx;
    const baseline = this.plotBottom();

    this.getActiveSeries().forEach((item) => {
      if (item.spanGaps === false) {
        const segments = [];
        let segment = [];

        item.values.forEach((value, index) => {
          if (value === null || value === undefined || !Number.isFinite(value)) {
            if (segment.length > 1) segments.push(segment);
            segment = [];
            return;
          }

          segment.push({ x: this.xAt(index), y: this.yAt(value, min, max), value, index });
        });

        if (segment.length > 1) segments.push(segment);

        segments.forEach((points) => {
          ctx.beginPath();
          ctx.moveTo(points[0].x, points[0].y);
          for (let index = 1; index < points.length; index += 1) {
            ctx.lineTo(points[index].x, points[index].y);
          }
          ctx.strokeStyle = item.color;
          ctx.lineWidth = item.lineWidth;
          if (item.lineDash) ctx.setLineDash(item.lineDash);
          ctx.stroke();
          if (item.lineDash) ctx.setLineDash([]);

          if (this.fill && points.length > 1) {
            ctx.lineTo(points[points.length - 1].x, baseline);
            ctx.lineTo(points[0].x, baseline);
            ctx.closePath();
            ctx.fillStyle = this.makeFillGradient(item.fillColor || item.color);
            ctx.fill();
          }
        });

        return;
      }

      const points = item.values
        .map((value, index) => (Number.isFinite(value) ? { x: this.xAt(index), y: this.yAt(value, min, max), value, index } : null))
        .filter(Boolean);

      if (!points.length) return;

      ctx.beginPath();
      points.forEach((point, index) => {
        if (index === 0) ctx.moveTo(point.x, point.y);
        else ctx.lineTo(point.x, point.y);
      });
      ctx.strokeStyle = item.color;
      ctx.lineWidth = item.lineWidth;
      if (item.lineDash) ctx.setLineDash(item.lineDash);
      ctx.stroke();
      if (item.lineDash) ctx.setLineDash([]);

      if (this.fill && points.length > 1) {
        ctx.lineTo(this.width - this.pad.right, baseline);
        ctx.lineTo(this.pad.left, baseline);
        ctx.closePath();
        ctx.fillStyle = this.makeFillGradient(item.fillColor || item.color);
        ctx.fill();
      }
    });
  }

  drawPoints(min, max) {
    const ctx = this.ctx;

    this.getActiveSeries().forEach((item) => {
      item.values.forEach((value, index) => {
        if (!Number.isFinite(value)) return;

        const baseRadius = item.pointRadii && Number.isFinite(item.pointRadii[index])
          ? item.pointRadii[index]
          : this.pointRadius;
        const radius = this.hoverIndex === index && this.pointHoverRadius > 0
          ? this.pointHoverRadius
          : baseRadius;
        if (radius <= 0) return;

        ctx.beginPath();
        ctx.arc(this.xAt(index), this.yAt(value, min, max), radius, 0, Math.PI * 2);
        ctx.fillStyle = item.pointColors?.[index] || item.color;
        ctx.fill();
      });
    });
  }

  draw() {
    if (!this.labels.length || !this.series.length) return;

    const { min, max } = this.calcYRange();
    this.drawAxes(min, max);
    this.drawSeries(min, max);
    this.drawPoints(min, max);
  }

  handleMove(event) {
    const rect = this.canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const innerWidth = this.width - this.pad.left - this.pad.right;

    if (x < this.pad.left || x > this.pad.left + innerWidth || this.labels.length < 1) {
      this.handleLeave();
      return;
    }

    const index = this.labels.length === 1
      ? 0
      : Math.round(((x - this.pad.left) * (this.labels.length - 1)) / innerWidth);
    const activeSeries = this.getActiveSeries();
    let tooltipContext = null;
    let rows = activeSeries
      .map((item) => {
        const value = item.values[index];
        if (!Number.isFinite(value)) return null;
        return {
          name: item.name,
          value: this.yFormat(value),
          rawValue: value,
          color: item.color,
          series: item,
        };
      })
      .filter(Boolean);

    if (this.tooltipMode === "nearestSeries" && rows.length > 1) {
      const { min, max } = this.calcYRange();
      const nearest = rows
        .map((row) => ({
          row,
          distance: Math.abs(this.yAt(row.rawValue, min, max) - (event.clientY - rect.top)),
        }))
        .sort((first, second) => first.distance - second.distance)[0]?.row;

      rows = nearest ? [nearest] : [];
    }

    if (!rows.length) {
      this.handleLeave();
      return;
    }

    tooltipContext = { series: rows[0]?.series || null };
    this.hoverIndex = index;
    this.draw();
    this.renderTooltip(event, index, rows, tooltipContext);
  }

  renderTooltip(event, index, rows, tooltipContext = null) {
    const extra = typeof this.tooltipExtra === "function" ? this.tooltipExtra(index, tooltipContext) : "";
    let extraHtml = "";
    if (Array.isArray(extra)) {
      extraHtml = extra
        .filter(Boolean)
        .map((line) => `<div class="note">${this.escapeHtml(line)}</div>`)
        .join("");
    } else if (extra) {
      extraHtml = `<div class="note">${this.escapeHtml(extra)}</div>`;
    }

    this.tooltip.innerHTML =
      `<div class="t">${this.escapeHtml(this.xTooltipFormat(this.labels[index], index))}</div>` +
      rows.map((row) => `
        <div class="row">
          <span class="k"><span class="legend-dot" style="background:${row.color}"></span>${this.escapeHtml(row.name)}</span>
          <span>${this.escapeHtml(row.value)}</span>
        </div>
      `).join("") +
      extraHtml;

    this.tooltip.style.display = "block";

    const offset = 12;
    let left = event.clientX + offset;
    let top = event.clientY + offset;
    const width = this.tooltip.offsetWidth;
    const height = this.tooltip.offsetHeight;

    if (left + width > window.innerWidth - offset) {
      left = event.clientX - width - offset;
    }

    if (top + height > window.innerHeight - offset) {
      top = event.clientY - height - offset;
    }

    this.tooltip.style.left = `${left}px`;
    this.tooltip.style.top = `${top}px`;
  }

  handleLeave() {
    this.hoverIndex = null;
    this.tooltip.style.display = "none";
    this.draw();
  }

  parseColor(color) {
    const raw = String(color || "").trim();
    const hex = raw.match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i);
    if (hex) {
      const value = hex[1];
      if (value.length === 3) {
        return {
          r: parseInt(value[0] + value[0], 16),
          g: parseInt(value[1] + value[1], 16),
          b: parseInt(value[2] + value[2], 16),
        };
      }

      return {
        r: parseInt(value.slice(0, 2), 16),
        g: parseInt(value.slice(2, 4), 16),
        b: parseInt(value.slice(4, 6), 16),
      };
    }

    const rgba = raw.match(/^rgba?\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})/i);
    if (rgba) {
      return {
        r: Number(rgba[1]),
        g: Number(rgba[2]),
        b: Number(rgba[3]),
      };
    }

    return null;
  }

  escapeHtml(value) {
    return String(value || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }
}

function setWealthTrendState(message, type = "info") {
  if (!wealthTrendState) return;

  wealthTrendState.textContent = message || "";
  wealthTrendState.className = `dashboard-chart-state ${message ? "is-visible" : ""} ${type ? `is-${type}` : ""}`;
}

function hideWealthTrendTooltip() {
  const tooltip = document.getElementById("pe_tooltip");
  if (tooltip) {
    tooltip.style.display = "none";
  }
}

function formatDashboardChartMonth(value) {
  const date = parseDashboardPeriod(value);
  if (!date) return value;

  const months = ["Gen", "Feb", "Mar", "Apr", "Mag", "Giu", "Lug", "Ago", "Set", "Ott", "Nov", "Dic"];
  return `${months[date.getMonth()]}-${String(date.getFullYear()).slice(-2)}`;
}

function formatDashboardChartMonthYear(value) {
  const date = parseDashboardPeriod(value);
  if (!date) return String(value || "").trim();

  const months = ["Gen", "Feb", "Mar", "Apr", "Mag", "Giu", "Lug", "Ago", "Set", "Ott", "Nov", "Dic"];
  return `${months[date.getMonth()]} ${date.getFullYear()}`;
}

function formatDashboardChartPeriodTooltip(value) {
  const date = parseDashboardPeriod(value);
  if (!date) return String(value || "").trim();

  const months = [
    "Gennaio",
    "Febbraio",
    "Marzo",
    "Aprile",
    "Maggio",
    "Giugno",
    "Luglio",
    "Agosto",
    "Settembre",
    "Ottobre",
    "Novembre",
    "Dicembre",
  ];
  return `${months[date.getMonth()]} ${date.getFullYear()}`;
}

function parseDashboardPeriod(value) {
  const text = String(value || "").trim();
  const match = text.match(/^(\d{4})-(\d{2})$/);

  if (match) {
    return new Date(Number(match[1]), Number(match[2]) - 1, 1);
  }

  const date = new Date(`${text}T00:00:00`);
  return Number.isNaN(date.getTime()) ? null : date;
}

function formatDashboardAxisEuro(value) {
  const number = Number(value);
  if (!Number.isFinite(number)) return "—";

  return new Intl.NumberFormat("it-IT", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(number);
}

function niceDashboardStep(rawStep) {
  if (!Number.isFinite(rawStep) || rawStep <= 0) return 1;

  const exp = 10 ** Math.floor(Math.log10(rawStep));
  const factor = rawStep / exp;

  if (factor <= 1) return exp;
  if (factor <= 2) return 2 * exp;
  if (factor <= 2.5) return 2.5 * exp;
  if (factor <= 5) return 5 * exp;
  return 10 * exp;
}

function computeDashboardNiceRange(values, padRatio, tickCount) {
  const finiteValues = (values || []).filter((value) => Number.isFinite(value));
  if (!finiteValues.length) return { min: 0, max: 1, step: 1 };

  const minValue = Math.min(...finiteValues);
  const maxValue = Math.max(...finiteValues);
  const span = Math.max(1, maxValue - minValue);
  const padding = span * (padRatio ?? 0.2);
  const yMinRaw = Math.max(0, minValue - padding);
  const yMaxRaw = maxValue + padding;
  const ticks = tickCount || 6;
  const rawStep = (yMaxRaw - yMinRaw) / Math.max(1, ticks - 1);
  const step = niceDashboardStep(rawStep);

  return {
    min: Math.floor(yMinRaw / step) * step,
    max: Math.ceil(yMaxRaw / step) * step,
    step,
  };
}

function getPatrimonyBounds(points) {
  const periods = (points || []).map((point) => String(point.period || "")).filter(Boolean).sort();
  if (!periods.length) return null;
  return {
    min: periods[0],
    max: periods[periods.length - 1],
  };
}

function shiftDashboardPeriod(period, deltaMonths) {
  const match = String(period || "").match(/^(\d{4})-(\d{2})$/);
  if (!match) return period;

  let monthIndex = Number(match[1]) * 12 + (Number(match[2]) - 1) + deltaMonths;
  if (monthIndex < 0) monthIndex = 0;

  const year = Math.floor(monthIndex / 12);
  const month = (monthIndex % 12) + 1;
  return `${String(year).padStart(4, "0")}-${String(month).padStart(2, "0")}`;
}

function setPatrimonyRange(start, end, preset = "custom") {
  if (!start || !end) return;

  let normalizedStart = start;
  let normalizedEnd = end;

  if (normalizedStart > normalizedEnd) {
    [normalizedStart, normalizedEnd] = [normalizedEnd, normalizedStart];
  }

  patrimonyState.range = {
    start: normalizedStart,
    end: normalizedEnd,
    preset,
  };
  syncPatrimonyControls();
}

function applyPatrimonyPreset(preset) {
  const bounds = getPatrimonyBounds(wealthTrendSeries);
  if (!bounds) return;

  let start = bounds.min;
  const end = bounds.max;

  if (preset === "ytd") {
    start = `${end.slice(0, 4)}-01`;
  } else if (preset === "last12") {
    start = shiftDashboardPeriod(end, -11);
  } else if (preset === "last24") {
    start = shiftDashboardPeriod(end, -23);
  } else if (preset === "last36") {
    start = shiftDashboardPeriod(end, -35);
  } else if (preset === "last60") {
    start = shiftDashboardPeriod(end, -59);
  }

  setPatrimonyRange(start, end, preset);
}

function syncPatrimonyControls() {
  if (patrimonyPreset) patrimonyPreset.value = patrimonyState.range.preset || "all";
  if (patrimonyFrom) patrimonyFrom.value = patrimonyState.range.start || "";
  if (patrimonyTo) patrimonyTo.value = patrimonyState.range.end || "";

  if (patrimonyToggle) {
    patrimonyToggle.querySelectorAll("[data-mode]").forEach((button) => {
      button.classList.toggle("is-active", button.dataset.mode === patrimonyState.mode);
    });
  }

  if (patrimonyTrendToggle) {
    patrimonyTrendToggle.classList.toggle("is-active", Boolean(patrimonyState.trend));
  }
}

function initPatrimonyState(points) {
  const bounds = getPatrimonyBounds(points);
  if (!bounds) return;

  patrimonyState = {
    mode: "month",
    trend: false,
    range: {
      start: bounds.min,
      end: bounds.max,
      preset: "all",
    },
  };

  try {
    const mode = localStorage.getItem("supabase_patrimony_mode");
    if (mode === "month" || mode === "year") patrimonyState.mode = mode;

    const trend = localStorage.getItem("supabase_patrimony_trend_enabled");
    if (trend === "true" || trend === "false") patrimonyState.trend = trend === "true";

    const rangeRaw = localStorage.getItem("supabase_patrimony_range");
    if (rangeRaw) {
      const parsed = JSON.parse(rangeRaw);
      if (parsed?.from && parsed?.to) {
        patrimonyState.range = {
          start: parsed.from,
          end: parsed.to,
          preset: parsed.preset || "custom",
        };
      }
    }
  } catch (error) {
    console.warn("Impossibile leggere stato grafico patrimonio:", error);
  }

  patrimonyState.range.end = bounds.max;
  syncPatrimonyControls();
}

function persistPatrimonyState() {
  try {
    localStorage.setItem("supabase_patrimony_mode", patrimonyState.mode || "month");
    localStorage.setItem("supabase_patrimony_trend_enabled", patrimonyState.trend ? "true" : "false");
    localStorage.setItem("supabase_patrimony_range", JSON.stringify({
      from: patrimonyState.range?.start || "",
      to: patrimonyState.range?.end || "",
      preset: patrimonyState.range?.preset || "custom",
    }));
  } catch (error) {
    console.warn("Impossibile salvare stato grafico patrimonio:", error);
  }
}

function getFilteredPatrimonyPoints() {
  const { start, end } = patrimonyState.range;
  return wealthTrendSeries.filter((point) => {
    const period = String(point.period || "");
    return period && (!start || period >= start) && (!end || period <= end);
  });
}

function buildDashboardYearlyPoints(monthlyPoints) {
  const byYear = new Map();

  monthlyPoints.forEach((point) => {
    const year = Number.isFinite(point.year) ? point.year : Number(String(point.period || "").slice(0, 4));
    const month = Number.isFinite(point.month) ? point.month : Number(String(point.period || "").slice(5, 7));

    if (!Number.isFinite(year) || !Number.isFinite(month)) return;

    const existing = byYear.get(year);
    if (!existing || (month === 12 && existing.month !== 12) || (existing.month !== 12 && month > existing.month)) {
      byYear.set(year, { ...point, year, month });
    }
  });

  return Array.from(byYear.values()).sort((a, b) => a.year - b.year);
}

function buildDashboardMovingAverage(values, windowSize) {
  const result = new Array(values.length).fill(null);
  if (!windowSize || windowSize < 2) return result;

  let sum = 0;
  let count = 0;

  values.forEach((value, index) => {
    if (Number.isFinite(value)) {
      sum += value;
      count += 1;
    }

    if (index >= windowSize) {
      const previous = values[index - windowSize];
      if (Number.isFinite(previous)) {
        sum -= previous;
        count -= 1;
      }
    }

    if (index >= windowSize - 1 && count === windowSize) {
      result[index] = sum / windowSize;
    }
  });

  return result;
}

function updateDashboardPatrimonyInsights(points, mode) {
  const cagrElement = document.getElementById("patrimonyCagr");
  const bestElement = document.getElementById("patrimonyBest");
  const drawdownElement = document.getElementById("patrimonyDd");

  if (!points || points.length < 2) {
    if (cagrElement) cagrElement.textContent = "—";
    if (bestElement) bestElement.textContent = "—";
    if (drawdownElement) {
      drawdownElement.textContent = "—";
      drawdownElement.classList.remove("neg");
    }
    return;
  }

  const first = points[0].value;
  const last = points[points.length - 1].value;
  const years = Math.max(1, calcDashboardYearsBetween(points[0], points[points.length - 1], mode));

  if (cagrElement && Number.isFinite(first) && first > 0 && Number.isFinite(last)) {
    const cagr = (last / first) ** (1 / years) - 1;
    cagrElement.textContent = formatDashboardPercent(cagr);
  } else if (cagrElement) {
    cagrElement.textContent = "—";
  }

  const best = calcDashboardBestYear(points);
  if (bestElement) {
    bestElement.textContent = best ? `${best.year} (${formatDashboardPercent(best.pct)})` : "—";
  }

  const drawdown = calcDashboardMaxDrawdown(points);
  if (drawdownElement) {
    drawdownElement.textContent = drawdown !== null ? formatDashboardPercent(drawdown) : "—";
    drawdownElement.classList.toggle("neg", Number.isFinite(drawdown) && drawdown < 0);
  }
}

function calcDashboardYearsBetween(firstPoint, lastPoint, mode) {
  if (mode === "year") return Math.max(1, (lastPoint.year || 0) - (firstPoint.year || 0));

  const firstYear = Number(String(firstPoint.period || "").slice(0, 4));
  const firstMonth = Number(String(firstPoint.period || "").slice(5, 7));
  const lastYear = Number(String(lastPoint.period || "").slice(0, 4));
  const lastMonth = Number(String(lastPoint.period || "").slice(5, 7));
  if (!Number.isFinite(firstYear) || !Number.isFinite(lastYear)) return 1;

  const months = (lastYear * 12 + (lastMonth - 1)) - (firstYear * 12 + (firstMonth - 1));
  return Math.max(1, months / 12);
}

function calcDashboardBestYear(points) {
  const byYear = {};

  points.forEach((point) => {
    const year = Number(String(point.period || "").slice(0, 4));
    if (!Number.isFinite(year)) return;
    const rows = byYear[year] || (byYear[year] = []);
    rows.push(point);
  });

  let best = null;
  Object.keys(byYear).forEach((year) => {
    const rows = byYear[year].slice().sort((a, b) => String(a.period).localeCompare(String(b.period)));
    if (rows.length < 2) return;

    const first = rows[0].value;
    const last = rows[rows.length - 1].value;
    if (!Number.isFinite(first) || first === 0 || !Number.isFinite(last)) return;

    const pct = last / first - 1;
    if (!best || pct > best.pct) best = { year, pct };
  });

  return best;
}

function calcDashboardMaxDrawdown(points) {
  let peak = -Infinity;
  let maxDrawdown = 0;

  points.forEach((point) => {
    const value = point.value;
    if (!Number.isFinite(value)) return;
    if (value > peak) peak = value;
    const drawdown = (value - peak) / peak;
    if (drawdown < maxDrawdown) maxDrawdown = drawdown;
  });

  return Number.isFinite(maxDrawdown) ? maxDrawdown : null;
}

function formatDashboardPercent(value) {
  if (!Number.isFinite(value)) return "—";

  const percent = value * 100;
  const sign = percent > 0 ? "+" : "";
  const formatted = new Intl.NumberFormat("it-IT", {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(percent);

  return `${sign}${formatted}%`;
}

function buildPatrimonyRangeText(points, mode) {
  if (!points.length) return "—";

  if (mode === "year") {
    const start = points[0].year || String(points[0].period || "").slice(0, 4);
    const end = points[points.length - 1].year || String(points[points.length - 1].period || "").slice(0, 4);
    return `${start} → ${end} · ${points.length} punti`;
  }

  return `${formatDashboardChartMonth(points[0].period)} → ${formatDashboardChartMonth(points[points.length - 1].period)} · ${points.length} punti`;
}

function buildPatrimonySubtitle(points, mode) {
  if (!points.length) return "—";

  if (mode === "year") {
    const start = points[0].year || String(points[0].period || "").slice(0, 4);
    const end = points[points.length - 1].year || String(points[points.length - 1].period || "").slice(0, 4);
    return `${start} → ${end} · Anno`;
  }

  return `${formatDashboardChartMonthYear(points[0].period)} → ${formatDashboardChartMonthYear(points[points.length - 1].period)} · Mese`;
}

function buildDashboardWealthSeries(rows) {
  return (rows || []).reduce((series, row) => {
    const period = String(row.period || "").trim();
    const value = Number(row.patrimony_total);

    if (!period || !Number.isFinite(value)) {
      return series;
    }

    series.push({
      period,
      year: Number(row.year),
      month: Number(row.month),
      value,
      note: row.note || "",
    });

    return series;
  }, []);
}

async function fetchDashboardWealthSeries() {
  const { data, error } = await supabaseClient
    .from("patrimony_history")
    .select("period,year,month,patrimony_total,note")
    .order("period", { ascending: true });

  if (error) throw error;

  return buildDashboardWealthSeries(data ?? []);
}

function drawDashboardWealthChart(series) {
  if (!wealthTrendCanvas) return;

  if (wealthTrendChart) {
    wealthTrendChart.destroy();
  }

  const labels = series.map((point) => point.period);
  const values = series.map((point) => point.value);
  const notes = series.map((point) => point.note || "");
  const monthColor = "#4F7DF3";
  const yearColor = "#2FA36B";
  const isYearMode = patrimonyState.mode === "year";
  const lineColor = isYearMode ? yearColor : monthColor;
  const fillColor = isYearMode ? "rgba(47,163,107,0.12)" : "rgba(79,125,243,0.12)";
  const chartSeries = [
    {
      key: "patrimony",
      name: "Patrimonio",
      values,
      color: lineColor,
      fillColor,
      lineWidth: 2,
    },
  ];
  const yRange = computeDashboardNiceRange(values, 0.15, 6);

  if (patrimonyState.trend) {
    chartSeries.push({
      key: "trend",
      name: "Trend",
      values: buildDashboardMovingAverage(values, isYearMode ? 3 : 6),
      color: isYearMode ? "#1B7F54" : "#2D4FB3",
      fillColor: "",
      lineWidth: 1.5,
      lineDash: [6, 4],
    });
  }

  wealthTrendChart = new DashboardMiniLookerChart({
    canvas: wealthTrendCanvas,
    legendEl: wealthTrendLegend,
    labels,
    series: chartSeries,
    yFormat: formatEuro,
    yAxisFormat: formatDashboardAxisEuro,
    xLabelFormat: (label, index) => {
      if (isYearMode) return String(series[index]?.year || "").trim();
      return formatDashboardChartMonth(label);
    },
    xTooltipFormat: (label, index) => {
      if (isYearMode) {
        const year = series[index]?.year || "";
        return year ? `Anno ${year}` : "";
      }
      return formatDashboardChartPeriodTooltip(label);
    },
    tooltipExtra: (index) => notes[index] ? `Nota: ${notes[index]}` : "",
    fill: true,
    pointRadius: 0,
    pointHoverRadius: 4,
    yTickStep: yRange.step,
    yTickMax: 6,
    yMaxStep: null,
    yRangePadding: 0,
    yMinFloor: 0,
    yMin: yRange.min,
    yMax: yRange.max,
    xLabelWidth: 80,
  });

  wealthTrendCanvas.classList.remove("chart-fade");
  void wealthTrendCanvas.offsetWidth;
  wealthTrendCanvas.classList.add("chart-fade");
  updateDashboardPatrimonyInsights(series, patrimonyState.mode);
}

function refreshDashboardWealthTrend() {
  const filteredPoints = getFilteredPatrimonyPoints();
  const chartPoints = patrimonyState.mode === "year"
    ? buildDashboardYearlyPoints(filteredPoints)
    : filteredPoints;

  if (patrimonyRangeSummary) {
    patrimonyRangeSummary.textContent = buildPatrimonyRangeText(chartPoints, patrimonyState.mode);
  }

  if (patrimonySubtitle) {
    patrimonySubtitle.textContent = buildPatrimonySubtitle(chartPoints, patrimonyState.mode);
  }

  if (!chartPoints.length) {
    setWealthTrendState("Nessun dato disponibile per il periodo selezionato.", "empty");
    if (wealthTrendChart) {
      wealthTrendChart.destroy();
      wealthTrendChart = null;
    }
    if (wealthTrendLegend) wealthTrendLegend.innerHTML = "";
    updateDashboardPatrimonyInsights([], patrimonyState.mode);
    return;
  }

  setWealthTrendState("");
  drawDashboardWealthChart(chartPoints);
}

async function loadDashboardWealthTrend() {
  if (!wealthTrendCanvas) return;

  if (!supabaseClient) {
    setWealthTrendState("Credenziali Supabase mancanti.", "error");
    return;
  }

  setWealthTrendState("Carico grafico...", "info");
  hideWealthTrendTooltip();

  try {
    wealthTrendSeries = await fetchDashboardWealthSeries();

    if (!wealthTrendSeries.length) {
      setWealthTrendState("Nessun dato completo disponibile per il grafico.", "empty");
      return;
    }

    initPatrimonyState(wealthTrendSeries);
    refreshDashboardWealthTrend();
  } catch (error) {
    console.error("Errore caricamento andamento patrimonio:", error);
    setWealthTrendState(`Errore caricamento grafico: ${error.message || error}`, "error");
  }
}

function initPatrimonyControls() {
  if (patrimonyPreset) {
    patrimonyPreset.addEventListener("change", () => {
      applyPatrimonyPreset(patrimonyPreset.value);
      persistPatrimonyState();
      refreshDashboardWealthTrend();
    });
  }

  if (patrimonyApply) {
    patrimonyApply.addEventListener("click", () => {
      const start = String(patrimonyFrom?.value || "").trim();
      const end = String(patrimonyTo?.value || "").trim();

      if (!start || !end) return;

      setPatrimonyRange(start, end, "custom");
      persistPatrimonyState();
      refreshDashboardWealthTrend();
    });
  }

  if (patrimonyReset) {
    patrimonyReset.addEventListener("click", () => {
      applyPatrimonyPreset("all");
      persistPatrimonyState();
      refreshDashboardWealthTrend();
    });
  }

  if (patrimonyToggle) {
    patrimonyToggle.addEventListener("click", (event) => {
      const modeButton = event.target.closest("[data-mode]");
      if (!modeButton) return;

      patrimonyState.mode = modeButton.dataset.mode === "year" ? "year" : "month";
      syncPatrimonyControls();
      persistPatrimonyState();
      refreshDashboardWealthTrend();
    });
  }

  if (patrimonyTrendToggle) {
    patrimonyTrendToggle.addEventListener("click", () => {
      patrimonyState.trend = !patrimonyState.trend;
      syncPatrimonyControls();
      persistPatrimonyState();
      refreshDashboardWealthTrend();
    });
  }
}

function setInvestmentsState(message, type = "info") {
  if (!investmentsStateElement) return;

  investmentsStateElement.textContent = message || "";
  investmentsStateElement.className = `dashboard-chart-state ${message ? "is-visible" : ""} ${type ? `is-${type}` : ""}`;
}

function setInvestmentsMeta(text) {
  if (investmentsRangeSummary) investmentsRangeSummary.textContent = text || "—";
}

function setInvestmentsSubtitle(text) {
  if (investmentsSubtitle) investmentsSubtitle.textContent = text || "—";
}

function clearInvestmentsChart() {
  if (investmentsChart) {
    investmentsChart.destroy();
    investmentsChart = null;
  }

  if (investmentsLegend) investmentsLegend.innerHTML = "";

  if (investmentsCanvas) {
    const context = investmentsCanvas.getContext("2d");
    if (context) context.clearRect(0, 0, investmentsCanvas.width, investmentsCanvas.height);
  }
}

function normalizeDashboardISODate(value) {
  if (!value) return "";

  const text = String(value || "").trim();
  if (/^\d{4}-\d{2}-\d{2}$/.test(text)) return text;

  const italian = text.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (italian) {
    const day = String(Number(italian[1])).padStart(2, "0");
    const month = String(Number(italian[2])).padStart(2, "0");
    return `${italian[3]}-${month}-${day}`;
  }

  const parsed = new Date(text);
  if (Number.isNaN(parsed.getTime())) return "";

  const year = parsed.getFullYear();
  const month = String(parsed.getMonth() + 1).padStart(2, "0");
  const day = String(parsed.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function dashboardDateMs(isoDate) {
  const match = String(isoDate || "").match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) return NaN;

  return new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3])).getTime();
}

function parseDashboardISODate(isoDate) {
  const match = String(isoDate || "").match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) return null;

  const date = new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
  return Number.isNaN(date.getTime()) ? null : date;
}

function formatDashboardMonthYearFromISOShort(isoDate) {
  const date = parseDashboardISODate(isoDate);
  if (!date) return String(isoDate || "").trim();

  const months = ["Gen", "Feb", "Mar", "Apr", "Mag", "Giu", "Lug", "Ago", "Set", "Ott", "Nov", "Dic"];
  return `${months[date.getMonth()]}-${String(date.getFullYear()).slice(-2)}`;
}

function formatDashboardMonthYearFromISO(isoDate) {
  const date = parseDashboardISODate(isoDate);
  if (!date) return String(isoDate || "").trim();

  const months = ["Gen", "Feb", "Mar", "Apr", "Mag", "Giu", "Lug", "Ago", "Set", "Ott", "Nov", "Dic"];
  return `${months[date.getMonth()]} ${date.getFullYear()}`;
}

function formatDashboardDateLongFromISO(isoDate) {
  const date = parseDashboardISODate(isoDate);
  if (!date) return String(isoDate || "").trim();

  const months = [
    "gennaio",
    "febbraio",
    "marzo",
    "aprile",
    "maggio",
    "giugno",
    "luglio",
    "agosto",
    "settembre",
    "ottobre",
    "novembre",
    "dicembre",
  ];
  const day = String(date.getDate()).padStart(2, "0");
  return `${day} ${months[date.getMonth()]} ${date.getFullYear()}`;
}

function formatDashboardPctValue(value) {
  if (!Number.isFinite(value)) return "—";

  return new Intl.NumberFormat("it-IT", {
    style: "percent",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value / 100);
}

function formatDashboardPctAxis(value) {
  if (!Number.isFinite(value)) return "—";

  return new Intl.NumberFormat("it-IT", {
    style: "percent",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value / 100);
}

function calcDashboardPctStep(values) {
  const finiteValues = (values || []).filter((value) => Number.isFinite(value));
  if (!finiteValues.length) return 5;

  const range = Math.abs(Math.max(...finiteValues) - Math.min(...finiteValues));
  if (range <= 8) return 2;
  if (range <= 20) return 5;
  return 10;
}

function formatDashboardSignedEuro(value) {
  if (!Number.isFinite(value)) return "—";

  const sign = value >= 0 ? "+" : "-";
  return `${sign}${formatEuro(Math.abs(value))}`;
}

function getLatestInvestmentBasis(records, timestamp) {
  if (!records.length) return NaN;

  let low = 0;
  let high = records.length - 1;
  let best = NaN;

  while (low <= high) {
    const middle = Math.floor((low + high) / 2);
    if (records[middle].timestamp <= timestamp) {
      best = records[middle].cost;
      low = middle + 1;
    } else {
      high = middle - 1;
    }
  }

  return best;
}

function getPreviousInvestmentBasis(records, timestamp) {
  if (!records.length) return NaN;

  let low = 0;
  let high = records.length - 1;
  let best = NaN;

  while (low <= high) {
    const middle = Math.floor((low + high) / 2);
    if (records[middle].timestamp < timestamp) {
      best = records[middle].cost;
      low = middle + 1;
    } else {
      high = middle - 1;
    }
  }

  return best;
}

function computeInvestmentsPerformanceSeries(snapshots, basisEvents) {
  const snapshotsByDate = {};

  (snapshots || []).forEach((snapshot) => {
    const dateIso = normalizeDashboardISODate(snapshot.snapshot_date || snapshot.snapshotDate || snapshot.date);
    const accountId = String(snapshot.account_id || snapshot.accountId || "").trim().toUpperCase();
    const value = Number(snapshot.value);
    if (!dateIso || !accountId || !Number.isFinite(value)) return;

    if (!snapshotsByDate[dateIso]) snapshotsByDate[dateIso] = {};
    snapshotsByDate[dateIso][accountId] = (snapshotsByDate[dateIso][accountId] || 0) + value;
  });

  const basisByAccount = {};
  const capitalChangeDates = {};

  (basisEvents || []).forEach((event, index) => {
    const dateIso = normalizeDashboardISODate(event.effective_date || event.effectiveDate || event.date);
    const accountId = String(event.account_id || event.accountId || "").trim().toUpperCase();
    const cost = Number(event.cost_basis ?? event.costBasis);
    if (!dateIso || !accountId || !Number.isFinite(cost)) return;

    capitalChangeDates[dateIso] = true;
    if (!basisByAccount[accountId]) basisByAccount[accountId] = [];
    basisByAccount[accountId].push({
      timestamp: dashboardDateMs(dateIso),
      cost,
      sequence: index,
    });
  });

  Object.keys(basisByAccount).forEach((accountId) => {
    basisByAccount[accountId].sort((first, second) => (first.timestamp - second.timestamp) || (first.sequence - second.sequence));
  });

  const points = [];

  Object.keys(snapshotsByDate).sort().forEach((dateIso) => {
    const timestamp = dashboardDateMs(dateIso);
    if (!Number.isFinite(timestamp)) return;

    const accountValues = snapshotsByDate[dateIso] || {};
    const accountIds = Object.keys(accountValues);
    if (!accountIds.length) return;

    let totalValue = 0;
    let totalBasis = 0;
    let missingBasis = false;

    accountIds.forEach((accountId) => {
      totalValue += accountValues[accountId] || 0;
      const basis = getLatestInvestmentBasis(basisByAccount[accountId] || [], timestamp);

      if (!Number.isFinite(basis)) {
        missingBasis = true;
        return;
      }

      totalBasis += basis;
    });

    const value = !missingBasis && totalBasis > 0 ? (totalValue / totalBasis - 1) * 100 : null;
    const isCapitalChange = Object.prototype.hasOwnProperty.call(capitalChangeDates, dateIso);
    let previousBasis = null;
    let capitalDelta = 0;

    if (isCapitalChange) {
      previousBasis = accountIds.reduce((sum, accountId) => {
        const previous = getPreviousInvestmentBasis(basisByAccount[accountId] || [], timestamp);
        return sum + (Number.isFinite(previous) ? previous : 0);
      }, 0);
      capitalDelta = Number.isFinite(totalBasis) && Number.isFinite(previousBasis)
        ? totalBasis - previousBasis
        : 0;
    }

    points.push({
      date: dateIso,
      dateIso,
      period: dateIso.slice(0, 7),
      pct: value,
      value,
      basis: totalBasis,
      previousBasis,
      totalValue,
      totalCostBasis: totalBasis,
      isCapitalChange,
      capitalDelta,
    });
  });

  return points.sort((first, second) => String(first.dateIso).localeCompare(String(second.dateIso)));
}

async function fetchDashboardInvestmentsPerformanceSeries() {
  const [snapshotsResult, basisResult] = await Promise.all([
    supabaseClient
      .from("investments_snapshots")
      .select("snapshot_date,account_id,value")
      .order("snapshot_date", { ascending: true }),
    supabaseClient
      .from("investments_basis_events")
      .select("effective_date,account_id,cost_basis")
      .order("effective_date", { ascending: true }),
  ]);

  if (snapshotsResult.error) throw snapshotsResult.error;
  if (basisResult.error) throw basisResult.error;

  return computeInvestmentsPerformanceSeries(snapshotsResult.data ?? [], basisResult.data ?? []);
}

function getInvestmentsBounds(points) {
  return getPatrimonyBounds(points.map((point) => ({ period: point.period })));
}

function setInvestmentsRange(start, end, preset = "custom") {
  if (!start || !end) return;

  let normalizedStart = start;
  let normalizedEnd = end;

  if (normalizedStart > normalizedEnd) {
    [normalizedStart, normalizedEnd] = [normalizedEnd, normalizedStart];
  }

  investmentsViewState.range = {
    start: normalizedStart,
    end: normalizedEnd,
    preset,
  };
  syncInvestmentsControls();
}

function applyInvestmentsPreset(preset) {
  const bounds = getInvestmentsBounds(investmentsSeries);
  if (!bounds) return;

  let start = bounds.min;
  const end = bounds.max;

  if (preset === "ytd") {
    start = `${end.slice(0, 4)}-01`;
  } else if (preset === "last12") {
    start = shiftDashboardPeriod(end, -11);
  } else if (preset === "last24") {
    start = shiftDashboardPeriod(end, -23);
  } else if (preset === "last36") {
    start = shiftDashboardPeriod(end, -35);
  } else if (preset === "last60") {
    start = shiftDashboardPeriod(end, -59);
  }

  setInvestmentsRange(start, end, preset);
}

function syncInvestmentsControls() {
  if (investmentsPreset) investmentsPreset.value = investmentsViewState.range.preset || "all";
  if (investmentsFrom) investmentsFrom.value = investmentsViewState.range.start || "";
  if (investmentsTo) investmentsTo.value = investmentsViewState.range.end || "";

  if (investmentsToggle) {
    investmentsToggle.querySelectorAll("[data-mode]").forEach((button) => {
      button.classList.toggle("is-active", button.dataset.mode === investmentsViewState.mode);
    });
  }
}

function initInvestmentsState(points) {
  const bounds = getInvestmentsBounds(points);
  if (!bounds) return;

  investmentsViewState = {
    mode: "month",
    baseMode: "month",
    trend: false,
    range: {
      start: bounds.min,
      end: bounds.max,
      preset: "all",
    },
  };

  try {
    const mode = localStorage.getItem("supabase_investments_mode");
    if (mode === "month" || mode === "year" || mode === "trend") investmentsViewState.mode = mode;

    const baseMode = localStorage.getItem("supabase_investments_base_mode");
    if (baseMode === "month" || baseMode === "year") investmentsViewState.baseMode = baseMode;

    const rangeRaw = localStorage.getItem("supabase_investments_range");
    if (rangeRaw) {
      const parsed = JSON.parse(rangeRaw);
      if (parsed?.from && parsed?.to) {
        investmentsViewState.range = {
          start: parsed.from,
          end: parsed.to,
          preset: parsed.preset || "custom",
        };
      }
    }
  } catch (error) {
    console.warn("Impossibile leggere stato grafico investimenti:", error);
  }

  investmentsViewState.range.end = bounds.max;

  if (investmentsViewState.mode === "trend") {
    investmentsViewState.trend = true;
    if (!investmentsViewState.baseMode) investmentsViewState.baseMode = "month";
  } else {
    investmentsViewState.trend = false;
    investmentsViewState.baseMode = investmentsViewState.mode;
  }

  syncInvestmentsControls();
}

function persistInvestmentsState() {
  try {
    localStorage.setItem("supabase_investments_mode", investmentsViewState.mode || "month");
    localStorage.setItem("supabase_investments_base_mode", investmentsViewState.baseMode || "month");
    localStorage.setItem("supabase_investments_trend_enabled", investmentsViewState.mode === "trend" ? "true" : "false");
    localStorage.setItem("supabase_investments_range", JSON.stringify({
      from: investmentsViewState.range?.start || "",
      to: investmentsViewState.range?.end || "",
      preset: investmentsViewState.range?.preset || "custom",
    }));
  } catch (error) {
    console.warn("Impossibile salvare stato grafico investimenti:", error);
  }
}

function getFilteredInvestmentsPoints() {
  const { start, end } = investmentsViewState.range;
  return investmentsSeries.filter((point) => {
    const period = String(point.period || "");
    return period && (!start || period >= start) && (!end || period <= end);
  });
}

function buildYearlyInvestmentsPoints(monthlyPoints) {
  const byYear = new Map();

  (monthlyPoints || []).forEach((point) => {
    const period = String(point.period || "").trim();
    const year = Number(period.slice(0, 4));
    const month = Number(period.slice(5, 7));
    if (!Number.isFinite(year) || !Number.isFinite(month)) return;

    const existing = byYear.get(year);
    if (!existing || (month === 12 && existing.month !== 12) || (existing.month !== 12 && month > existing.month)) {
      byYear.set(year, { ...point, year, month });
    }
  });

  return Array.from(byYear.values()).sort((first, second) => first.year - second.year);
}

function buildInvestmentsRangeText(points, mode) {
  if (!points || !points.length) return "—";

  if (mode === "year") {
    const start = points[0]?.year || String(points[0]?.period || "").slice(0, 4);
    const end = points[points.length - 1]?.year || String(points[points.length - 1]?.period || "").slice(0, 4);
    return `${start} → ${end} · ${points.length} punti`;
  }

  return `${formatDashboardChartMonth(points[0]?.period)} → ${formatDashboardChartMonth(points[points.length - 1]?.period)} · ${points.length} punti`;
}

function buildInvestmentsSubtitle(points, mode) {
  if (!points || !points.length) return "—";

  if (mode === "year") {
    const start = points[0]?.year || String(points[0]?.period || "").slice(0, 4);
    const end = points[points.length - 1]?.year || String(points[points.length - 1]?.period || "").slice(0, 4);
    return `${start} → ${end} · Anno`;
  }

  return `${formatDashboardChartMonthYear(points[0]?.period)} → ${formatDashboardChartMonthYear(points[points.length - 1]?.period)} · Mese`;
}

function renderInvestmentsPerformanceChart(points, mode) {
  if (!investmentsCanvas) return;

  if (investmentsChart) {
    investmentsChart.destroy();
  }

  const effectiveMode = mode === "trend" ? investmentsViewState.baseMode || "month" : mode;
  const sortedMonthlyPoints = (points || []).slice().sort((first, second) => String(first.period || "").localeCompare(String(second.period || "")));
  const chartPoints = effectiveMode === "year" ? buildYearlyInvestmentsPoints(sortedMonthlyPoints) : sortedMonthlyPoints;

  if (!chartPoints.length) {
    setInvestmentsMeta("—");
    setInvestmentsSubtitle("—");
    clearInvestmentsChart();
    return;
  }

  const labels = chartPoints.map((point) => effectiveMode === "year" ? String(point.year) : point.dateIso);
  const values = chartPoints.map((point) => point.value);
  const totals = chartPoints.map((point) => point.totalValue);
  const bases = chartPoints.map((point) => point.totalCostBasis);
  const capitalChanges = chartPoints.map((point) => point?.isCapitalChange === true);
  const capitalDeltas = chartPoints.map((point) => Number(point?.capitalDelta));

  setInvestmentsMeta(buildInvestmentsRangeText(chartPoints, effectiveMode));
  setInvestmentsSubtitle(buildInvestmentsSubtitle(chartPoints, effectiveMode));

  const trendEnabled = mode === "trend";
  const trendWindow = effectiveMode === "year" ? 3 : 6;
  const chartSeries = [
    {
      key: "inv",
      name: "Performance",
      values,
      color: "#4F7DF3",
      fillColor: "rgba(79,125,243,0.12)",
      lineWidth: 2,
      spanGaps: false,
      pointColors: capitalChanges.map((isChange) => isChange ? "#E38B2C" : null),
      pointRadii: capitalChanges.map((isChange) => isChange ? 4 : 0),
    },
  ];

  if (trendEnabled) {
    chartSeries.push({
      key: "trend",
      name: "Trend",
      values: buildDashboardMovingAverage(values, trendWindow),
      color: "#2D4FB3",
      fillColor: "",
      lineWidth: 1.5,
      lineDash: [6, 4],
      spanGaps: false,
    });
  }

  investmentsChart = new DashboardMiniLookerChart({
    canvas: investmentsCanvas,
    legendEl: investmentsLegend,
    labels,
    series: chartSeries,
    yFormat: formatDashboardPctValue,
    yAxisFormat: formatDashboardPctAxis,
    yTickStep: calcDashboardPctStep(values),
    yTickMax: 8,
    xLabelFormat: (label, index) => {
      if (effectiveMode === "year") return String(chartPoints[index]?.year || "").trim();
      return formatDashboardMonthYearFromISOShort(label);
    },
    xTooltipFormat: (label, index) => {
      if (effectiveMode === "year") {
        const year = chartPoints[index]?.year || "";
        return year ? `Anno ${year}` : "";
      }
      return formatDashboardDateLongFromISO(label);
    },
    xLabelWidth: 80,
    tooltipExtra: (index) => {
      const value = Number.isFinite(totals[index]) ? formatEuro(totals[index]) : "—";
      const basis = Number.isFinite(bases[index]) ? formatEuro(bases[index]) : "—";
      const rows = [`Valore: ${value}`, `Carico: ${basis}`];

      if (capitalChanges[index] && Number.isFinite(capitalDeltas[index])) {
        rows.push(`Variazione capitale: ${formatDashboardSignedEuro(capitalDeltas[index])}`);
      }

      return rows;
    },
    fill: true,
    pointRadius: 0,
    pointHoverRadius: 4,
    yZeroLine: { value: 0, color: "rgba(55,65,81,0.35)", width: 1, dash: [4, 4] },
  });

  investmentsCanvas.classList.remove("chart-fade");
  void investmentsCanvas.offsetWidth;
  investmentsCanvas.classList.add("chart-fade");
}

function calcBestInvestmentsPeriod(points, mode) {
  if (!points || !points.length) return null;

  let best = null;
  points.forEach((point) => {
    if (!Number.isFinite(point.value)) return;

    const label = mode === "year"
      ? String(point.year || String(point.period || "").slice(0, 4))
      : formatDashboardMonthYearFromISO(point.dateIso);
    const pct = point.value / 100;

    if (!best || pct > best.pct) best = { label, pct };
  });

  return best;
}

function updateInvestmentsInsights(points, mode) {
  const cagrElement = document.getElementById("invCagr");
  const bestElement = document.getElementById("invBest");
  const drawdownElement = document.getElementById("invDd");

  if (!points || points.length < 2) {
    if (cagrElement) cagrElement.textContent = "—";
    if (bestElement) bestElement.textContent = "—";
    if (drawdownElement) {
      drawdownElement.textContent = "—";
      drawdownElement.classList.remove("neg");
    }
    return;
  }

  const first = points[0].value;
  const last = points[points.length - 1].value;
  const years = Math.max(1, calcDashboardYearsBetween(points[0], points[points.length - 1], mode));

  if (cagrElement && Number.isFinite(first) && Number.isFinite(last)) {
    const cagr = ((1 + last / 100) / (1 + first / 100)) ** (1 / years) - 1;
    cagrElement.textContent = formatDashboardPercent(cagr);
  } else if (cagrElement) {
    cagrElement.textContent = "—";
  }

  const best = calcBestInvestmentsPeriod(points, mode);
  if (bestElement) {
    bestElement.textContent = best ? `${best.label} (${formatDashboardPercent(best.pct)})` : "—";
  }

  const drawdown = calcDashboardMaxDrawdown(points);
  if (drawdownElement) {
    drawdownElement.textContent = drawdown !== null ? formatDashboardPercent(drawdown) : "—";
    drawdownElement.classList.toggle("neg", Number.isFinite(drawdown) && drawdown < 0);
  }
}

function refreshInvestmentsChart() {
  const filteredPoints = getFilteredInvestmentsPoints();

  if (!filteredPoints.length) {
    setInvestmentsMeta("—");
    setInvestmentsSubtitle("—");
    setInvestmentsState("Nessun dato disponibile per il periodo selezionato.", "empty");
    clearInvestmentsChart();
    updateInvestmentsInsights([], investmentsViewState.mode);
    return;
  }

  setInvestmentsState("");
  renderInvestmentsPerformanceChart(filteredPoints, investmentsViewState.mode);
  updateInvestmentsInsights(filteredPoints, investmentsViewState.mode);
}

async function loadInvestmentsPerformanceChart() {
  if (!investmentsCanvas) return;

  if (!supabaseClient) {
    setInvestmentsState("Credenziali Supabase mancanti.", "error");
    return;
  }

  setInvestmentsState("Carico investimenti...", "info");

  try {
    investmentsSeries = await fetchDashboardInvestmentsPerformanceSeries();

    if (!investmentsSeries.length) {
      setInvestmentsState("Nessun dato completo disponibile per il grafico investimenti.", "empty");
      updateInvestmentsInsights([], investmentsViewState.mode);
      return;
    }

    initInvestmentsState(investmentsSeries);
    refreshInvestmentsChart();
  } catch (error) {
    console.error("Errore caricamento andamento investimenti:", error);
    setInvestmentsState(`Errore caricamento investimenti: ${error.message || error}`, "error");
  }
}

function setInvestmentsMode(mode) {
  if (mode === "trend") {
    investmentsViewState.mode = "trend";
    investmentsViewState.trend = true;
  } else {
    investmentsViewState.mode = mode === "year" ? "year" : "month";
    investmentsViewState.baseMode = investmentsViewState.mode;
    investmentsViewState.trend = false;
  }

  syncInvestmentsControls();
  persistInvestmentsState();
  refreshInvestmentsChart();
}

function initInvestmentsControls() {
  if (investmentsPreset) {
    investmentsPreset.addEventListener("change", () => {
      applyInvestmentsPreset(investmentsPreset.value);
      persistInvestmentsState();
      refreshInvestmentsChart();
    });
  }

  if (investmentsApply) {
    investmentsApply.addEventListener("click", () => {
      const start = String(investmentsFrom?.value || "").trim();
      const end = String(investmentsTo?.value || "").trim();

      if (!start || !end) return;

      setInvestmentsRange(start, end, "custom");
      persistInvestmentsState();
      refreshInvestmentsChart();
    });
  }

  if (investmentsReset) {
    investmentsReset.addEventListener("click", () => {
      applyInvestmentsPreset("all");
      persistInvestmentsState();
      refreshInvestmentsChart();
    });
  }

  if (investmentsToggle) {
    investmentsToggle.addEventListener("click", (event) => {
      const modeButton = event.target.closest("[data-mode]");
      if (!modeButton) return;
      setInvestmentsMode(modeButton.dataset.mode);
    });
  }
}

function renderTransactionsTable(transactions) {
  outputElement.textContent = "";

  if (!transactions.length) {
    showOutput("Nessun dato");
    return;
  }

  const columns = Object.keys(transactions[0]);
  const table = document.createElement("table");
  const thead = document.createElement("thead");
  const tbody = document.createElement("tbody");
  const headerRow = document.createElement("tr");

  table.className = "transactions-table";

  columns.forEach((column) => {
    const th = document.createElement("th");
    th.textContent = column;
    headerRow.appendChild(th);
  });

  thead.appendChild(headerRow);

  transactions.forEach((transaction) => {
    const row = document.createElement("tr");

    columns.forEach((column) => {
      const td = document.createElement("td");
      td.textContent = formatCellValue(column, transaction[column]);
      row.appendChild(td);
    });

    tbody.appendChild(row);
  });

  table.appendChild(thead);
  table.appendChild(tbody);
  outputElement.appendChild(table);
}

async function loadTransactions() {
  if (!supabaseClient) {
    setStatus("Credenziali Supabase mancanti", "error");
    showOutput(
      "Sostituisci SUPABASE_URL e SUPABASE_ANON_KEY in js/app.js, poi ricarica la pagina."
    );
    return;
  }

  loadButton.disabled = true;
  setStatus("Caricamento transactions...", "warning");
  showOutput("Caricamento in corso...");

  const { data, error } = await supabaseClient
    .from("transactions")
    .select("*")
    .order("date", { ascending: false })
    .limit(10);

  loadButton.disabled = false;

  if (error) {
    setStatus("Errore lettura transactions", "error");
    showOutput(error);
    return;
  }

  setStatus(`Connessione OK - ${data.length} record caricati`, "ok");
  renderTransactionsTable(data);
}

function renderMovimentiTable(transactions) {
  movimentiTableElement.textContent = "";

  if (!transactions.length) {
    renderMovimentiState("empty-state", "Nessun movimento trovato per il periodo selezionato");
    return;
  }

  const columns = ["Data", "Descrizione", "Movimento", "CC Fineco", "In cons.", "Azioni"];
  const table = document.createElement("table");
  const thead = document.createElement("thead");
  const tbody = document.createElement("tbody");
  const headerRow = document.createElement("tr");

  table.className = "transactions-table movimenti-table";

  columns.forEach((column, index) => {
    const th = document.createElement("th");
    const columnClasses = [
      "date-column",
      "description-column",
      "amount-column",
      "balance-column",
      "in-totals-column",
      "actions-column",
    ];

    th.textContent = column;
    th.classList.add(columnClasses[index]);
    headerRow.appendChild(th);
  });

  thead.appendChild(headerRow);

  transactions.forEach((transaction) => {
    const row = document.createElement("tr");
    const amount = Number(transaction.amount);
    const cells = [
      formatDate(transaction.date),
      transaction.description ?? "-",
      formatEuro(transaction.amount),
      formatEuro(transaction.balance),
      transaction.in_totals,
      "—",
    ];

    cells.forEach((cell, index) => {
      const td = document.createElement("td");

      if (index === 1) {
        td.classList.add("description-cell", "description-column");
      }

      if (index === 2 && !Number.isNaN(amount)) {
        td.classList.add("amount-cell", "amount-column", amount >= 0 ? "amount-positive" : "amount-negative");
      }

      if (index === 3) {
        td.classList.add("amount-cell", "balance-column");
      }

      if (index === 4) {
        td.classList.add("center-cell", "in-totals-column");
        const statusDot = document.createElement("span");
        statusDot.className = `status-dot ${cell ? "success" : "error"}`;
        td.appendChild(statusDot);
        row.appendChild(td);
        return;
      }

      if (index === 5) {
        td.classList.add("center-cell", "actions-column");
        const actionsWrapper = document.createElement("div");
        const editButton = document.createElement("button");
        const deleteButton = document.createElement("button");

        actionsWrapper.className = "movement-actions";
        editButton.className = "action-btn edit";
        deleteButton.className = "action-btn delete";
        editButton.type = "button";
        deleteButton.type = "button";
        editButton.dataset.txId = transaction.tx_id;
        deleteButton.dataset.txId = transaction.tx_id;
        editButton.setAttribute("aria-label", "Modifica movimento");
        deleteButton.setAttribute("aria-label", "Elimina movimento");
        editButton.innerHTML = '<i data-feather="edit"></i>';
        deleteButton.innerHTML = '<i data-feather="trash-2"></i>';

        actionsWrapper.appendChild(editButton);
        actionsWrapper.appendChild(deleteButton);
        td.appendChild(actionsWrapper);
        row.appendChild(td);
        return;
      }

      td.textContent = cell;
      row.appendChild(td);
    });

    tbody.appendChild(row);
  });

  table.appendChild(thead);
  table.appendChild(tbody);
  movimentiTableElement.appendChild(table);

  if (window.feather) {
    window.feather.replace();
  }
}

function renderMovimentiState(className, message, withSpinner = false) {
  movimentiTableElement.textContent = "";

  const stateElement = document.createElement("div");
  stateElement.className = className;

  if (withSpinner) {
    const spinner = document.createElement("span");
    spinner.className = "spinner";
    stateElement.appendChild(spinner);
  }

  const messageElement = document.createElement("span");
  messageElement.textContent = message;
  stateElement.appendChild(messageElement);
  movimentiTableElement.appendChild(stateElement);
}

function getMovimentiDateRange() {
  const selectedMonth = Number(movimentiMonthSelect.value);
  const selectedYear = Number(movimentiYearSelect.value);
  const monthPadded = String(selectedMonth + 1).padStart(2, "0");
  const nextMonth = selectedMonth === 11 ? 1 : selectedMonth + 2;
  const nextYear = selectedMonth === 11 ? selectedYear + 1 : selectedYear;
  const nextMonthPadded = String(nextMonth).padStart(2, "0");

  return {
    startDate: `${selectedYear}-${monthPadded}-01`,
    endDateExclusive: `${nextYear}-${nextMonthPadded}-01`,
  };
}

function getMovimentiYearRange() {
  const selectedYear = Number(movimentiYearSelect.value);

  return {
    startDate: `${selectedYear}-01-01`,
    endDateExclusive: `${selectedYear + 1}-01-01`,
  };
}

function calculateSummary(transactions) {
  return transactions.reduce(
    (summary, transaction) => {
      const amount = Number(transaction.amount);

      if (!Number.isFinite(amount)) {
        return summary;
      }

      summary.total += amount;

      if (amount > 0) {
        summary.income += amount;
      }

      if (amount < 0) {
        summary.expense += amount;
      }

      return summary;
    },
    {
      total: 0,
      income: 0,
      expense: 0,
    }
  );
}

function getValueClass(value) {
  if (value > 0) return "value-positive";
  if (value < 0) return "value-negative";
  return "value-neutral";
}

function setSummaryAmount(element, value) {
  element.innerHTML = `<span class="${getValueClass(value)}">${formatEuro(value)}</span>`;
}

function setSummaryValues(values) {
  yearlyTotalElement.textContent = values.yearlyTotal;
  yearlyIncomeElement.textContent = values.yearlyIncome;
  yearlyExpenseElement.textContent = values.yearlyExpense;
  monthlyTotalElement.textContent = values.monthlyTotal;
  monthlyIncomeElement.textContent = values.monthlyIncome;
  monthlyExpenseElement.textContent = values.monthlyExpense;
}

function setSummaryLoading() {
  setSummaryValues({
    yearlyTotal: "Carico...",
    yearlyIncome: "Carico...",
    yearlyExpense: "Carico...",
    monthlyTotal: "Carico...",
    monthlyIncome: "Carico...",
    monthlyExpense: "Carico...",
  });
}

function setSummaryError() {
  setSummaryValues({
    yearlyTotal: "Errore",
    yearlyIncome: "Errore",
    yearlyExpense: "Errore",
    monthlyTotal: "Errore",
    monthlyIncome: "Errore",
    monthlyExpense: "Errore",
  });
}

async function loadMovimentiSummaries() {
  const yearRange = getMovimentiYearRange();
  const monthRange = getMovimentiDateRange();

  setSummaryLoading();

  try {
    const [yearResult, monthResult] = await Promise.all([
      supabaseClient
        .from("transactions")
        .select("amount")
        .eq("in_totals", true)
        .gte("date", yearRange.startDate)
        .lt("date", yearRange.endDateExclusive),
      supabaseClient
        .from("transactions")
        .select("amount")
        .eq("in_totals", true)
        .gte("date", monthRange.startDate)
        .lt("date", monthRange.endDateExclusive),
    ]);

    if (yearResult.error) {
      yearlyTotalElement.textContent = "Errore";
      yearlyIncomeElement.textContent = "Errore";
      yearlyExpenseElement.textContent = "Errore";
    } else {
      const yearlySummary = calculateSummary(yearResult.data ?? []);
      setSummaryAmount(yearlyTotalElement, yearlySummary.total);
      setSummaryAmount(yearlyIncomeElement, yearlySummary.income);
      setSummaryAmount(yearlyExpenseElement, yearlySummary.expense);
    }

    if (monthResult.error) {
      monthlyTotalElement.textContent = "Errore";
      monthlyIncomeElement.textContent = "Errore";
      monthlyExpenseElement.textContent = "Errore";
    } else {
      const monthlySummary = calculateSummary(monthResult.data ?? []);
      setSummaryAmount(monthlyTotalElement, monthlySummary.total);
      setSummaryAmount(monthlyIncomeElement, monthlySummary.income);
      setSummaryAmount(monthlyExpenseElement, monthlySummary.expense);
    }
  } catch (error) {
    setSummaryError();
  }
}

function initMovimentiFilters() {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const startYear = currentYear - 5;
  const endYear = currentYear + 1;

  movimentiMonthSelect.value = String(currentDate.getMonth());
  movimentiYearSelect.textContent = "";

  for (let year = endYear; year >= startYear; year -= 1) {
    const option = document.createElement("option");
    option.value = String(year);
    option.textContent = String(year);
    movimentiYearSelect.appendChild(option);
  }

  movimentiYearSelect.value = String(currentYear);
}

async function openMovementModal() {
  const today = new Date().toISOString().split("T")[0];
  modalMode = "create";
  editingTxId = null;
  movementModalTitle.textContent = "Nuovo movimento";
  saveMovementPlaceholderButton.textContent = "Salva movimento";
  movementDateInput.value = today;
  movementDescriptionInput.value = "";
  movementAmountInput.value = "";
  movementTypeSwitch.checked = false;
  movementInTotalsSwitch.checked = true;
  movementModalError.textContent = "";
  movementCurrentBalance = 0;
  currentBalancePreview.textContent = "Carico...";
  nextBalancePreview.textContent = "Carico...";
  movementModal.classList.add("is-open");
  movementModal.setAttribute("aria-hidden", "false");

  try {
    movementCurrentBalance = await getCurrentFinecoBalance();
    currentBalancePreview.textContent = formatEuro(movementCurrentBalance);
    updateSaldoPreview();
  } catch (error) {
    showMovementModalError(`Errore lettura saldo: ${error.message}`);
    currentBalancePreview.textContent = "Errore";
    nextBalancePreview.textContent = "Errore";
  }
}

function openRevolutModal() {
  resetRevolutForm();
  revolutModal.classList.add("is-open");
  revolutModal.setAttribute("aria-hidden", "false");
  fetchLatestRevolutSnapshot();
}

function closeRevolutModal() {
  revolutModal.classList.remove("is-open");
  revolutModal.setAttribute("aria-hidden", "true");
}

function resetRevolutSummary() {
  lastRevolutPersonalElement.textContent = "Non disponibile";
  lastRevolutSharedElement.textContent = "Non disponibile";
  lastRevolutUpdatedElement.textContent = "Non disponibile";
}

function resetRevolutForm() {
  revolutPersonalInput.value = "";
  revolutSharedInput.value = "";
  revolutNoteInput.value = "";
}

function formatItalianDateTime(value) {
  if (!value) return "Non disponibile";

  return new Date(value).toLocaleString("it-IT", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function renderRevolutSnapshot(snapshot) {
  if (!snapshot) {
    resetRevolutSummary();
    return;
  }

  lastRevolutPersonalElement.textContent = formatEuro(snapshot.revolut_personal);
  lastRevolutSharedElement.textContent = formatEuro(snapshot.revolut_join);
  lastRevolutUpdatedElement.textContent = formatItalianDateTime(snapshot.date ?? snapshot.created_at);
}

function getRevolutSupabaseClient() {
  if (!supabaseClient || typeof supabaseClient.from !== "function") {
    console.error("[Revolut] client not found", supabaseClient);
    return null;
  }

  return supabaseClient;
}

async function fetchLatestRevolutSnapshot() {
  const revolutClient = getRevolutSupabaseClient();

  if (!revolutClient) {
    console.error("Credenziali Supabase mancanti.");
    resetRevolutSummary();
    return null;
  }

  try {
    const { data, error } = await revolutClient
      .from("revolut_snapshots")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(1);

    if (error) {
      console.error("Errore lettura snapshot Revolut:", error);
      resetRevolutSummary();
      return null;
    }

    const snapshot = data?.[0] ?? null;
    renderRevolutSnapshot(snapshot);
    return snapshot;
  } catch (error) {
    console.error("Errore lettura snapshot Revolut:", error);
    resetRevolutSummary();
    return null;
  }
}

async function saveRevolutSnapshot() {
  const revolutClient = getRevolutSupabaseClient();

  if (!revolutClient) {
    console.error("Credenziali Supabase mancanti.");
    return;
  }

  const revolutPersonale = parseItalianAmount(revolutPersonalInput.value);
  const revolutCointestato = parseItalianAmount(revolutSharedInput.value);

  if (!Number.isFinite(revolutPersonale) || !Number.isFinite(revolutCointestato)) {
    console.error("Inserisci valori Revolut validi.");
    return;
  }

  const payload = {
    date: new Date().toISOString().split("T")[0],
    revolut_personal: revolutPersonale,
    revolut_join: revolutCointestato,
    note: revolutNoteInput.value.trim() || null,
  };

  saveRevolutPlaceholderButton.disabled = true;
  saveRevolutPlaceholderButton.textContent = "Salvo...";

  try {
    const { error } = await revolutClient.from("revolut_snapshots").insert(payload);

    if (error) {
      console.error("Errore salvataggio snapshot Revolut:", error);
      return;
    }

    closeRevolutModal();
    await fetchLatestRevolutSnapshot();
  } catch (error) {
    console.error("Errore salvataggio snapshot Revolut:", error);
  } finally {
    saveRevolutPlaceholderButton.disabled = false;
    saveRevolutPlaceholderButton.textContent = "Salva Revolut";
  }
}

function closeMovementModal() {
  movementModal.classList.remove("is-open");
  movementModal.setAttribute("aria-hidden", "true");
}

function formatAmountInput(value) {
  const amount = Math.abs(Number(value));

  if (!Number.isFinite(amount)) {
    return "";
  }

  return new Intl.NumberFormat("it-IT", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    useGrouping: true,
  }).format(amount);
}

function parseItalianAmount(value) {
  const normalizedValue = value.trim().replace(/\s/g, "").replace(/\./g, "").replace(",", ".");
  return Number(normalizedValue);
}

function getSignedMovementAmount() {
  const parsedAmount = parseItalianAmount(movementAmountInput.value);

  if (!Number.isFinite(parsedAmount)) {
    return 0;
  }

  return movementTypeSwitch.checked ? Math.abs(parsedAmount) : -Math.abs(parsedAmount);
}

function updateSaldoPreview() {
  const parsedAmount = parseItalianAmount(movementAmountInput.value);
  const amount = Number.isFinite(parsedAmount) && parsedAmount !== 0 ? getSignedMovementAmount() : 0;
  const nextBalance = movementCurrentBalance + amount;

  nextBalancePreview.textContent = formatEuro(nextBalance);
}

function showMovementModalError(message) {
  movementModalError.textContent = message;
}

function setMovimentiPageMessage(message, type = "success") {
  if (!movimentiPageMessage) return;

  movimentiPageMessage.textContent = message || "";
  movimentiPageMessage.className = `movimenti-page-message ${message ? "is-visible" : ""} ${type ? `is-${type}` : ""}`;
}

function normalizePeriodKey(periodKey) {
  const match = String(periodKey || "").trim().match(/^(\d{4})-(\d{2})$/);

  if (!match) {
    return null;
  }

  const year = Number(match[1]);
  const month = Number(match[2]);

  if (!Number.isFinite(year) || !Number.isFinite(month) || month < 1 || month > 12) {
    return null;
  }

  return {
    period: `${String(year).padStart(4, "0")}-${String(month).padStart(2, "0")}`,
    year,
    month,
  };
}

function getCurrentPeriodKey() {
  const today = new Date();
  return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}`;
}

function getMonthDateRange(year, month) {
  const startDate = `${String(year).padStart(4, "0")}-${String(month).padStart(2, "0")}-01`;
  const nextMonth = month === 12 ? 1 : month + 1;
  const nextYear = month === 12 ? year + 1 : year;
  const endDateExclusive = `${String(nextYear).padStart(4, "0")}-${String(nextMonth).padStart(2, "0")}-01`;

  return { startDate, endDateExclusive };
}

async function getFinecoBalanceByMonth(year, month, period) {
  const { startDate, endDateExclusive } = getMonthDateRange(year, month);
  console.log("[patrimony-month] query transactions", {
    table: "transactions",
    period,
    account_id: "FINECO_MAIN",
    startDate,
    endDateExclusive,
    order: ["date desc", "created_at desc"],
    limit: 1,
  });

  const { data, error } = await supabaseClient
    .from("transactions")
    .select("date,created_at,balance")
    .eq("account_id", "FINECO_MAIN")
    .gte("date", startDate)
    .lt("date", endDateExclusive)
    .order("date", { ascending: false })
    .order("created_at", { ascending: false })
    .limit(1);

  if (error) {
    console.error("[patrimony-month] errore Supabase transactions", error);
    throw error;
  }

  const balance = Number(data?.[0]?.balance);
  console.log("[patrimony-month] risultato ultimo balance conto corrente", {
    row: data?.[0] ?? null,
    balance,
  });

  if (!data?.length || !Number.isFinite(balance)) {
    throw new Error(`Nessuna riga transactions per ${period}.`);
  }

  return balance;
}

async function getInvestmentsTotalByMonth(year, month, period) {
  const { startDate, endDateExclusive } = getMonthDateRange(year, month);
  console.log("[patrimony-month] query investments_snapshots", {
    table: "investments_snapshots",
    period,
    startDate,
    endDateExclusive,
    order: ["snapshot_date desc"],
  });

  const { data, error } = await supabaseClient
    .from("investments_snapshots")
    .select("snapshot_date,value")
    .gte("snapshot_date", startDate)
    .lt("snapshot_date", endDateExclusive)
    .order("snapshot_date", { ascending: false });

  if (error) {
    console.error("[patrimony-month] errore Supabase investments_snapshots", error);
    throw error;
  }

  const snapshots = data ?? [];
  const latestDate = snapshots.reduce((latest, snapshot) => {
    const dateIso = normalizeDashboardISODate(snapshot.snapshot_date);
    return dateIso && (!latest || dateIso > latest) ? dateIso : latest;
  }, "");

  if (!latestDate) {
    throw new Error(`Nessuna riga investments_snapshots per ${period}.`);
  }

  let total = 0;
  let found = false;

  snapshots.forEach((snapshot) => {
    if (normalizeDashboardISODate(snapshot.snapshot_date) !== latestDate) return;

    const value = Number(snapshot.value);
    if (!Number.isFinite(value)) return;

    total += value;
    found = true;
  });

  if (!found) {
    throw new Error(`Nessun valore investments_snapshots valido per ${period}.`);
  }

  console.log("[patrimony-month] risultato totale investimenti", {
    latestDate,
    rowsOnLatestDate: snapshots.filter((snapshot) => normalizeDashboardISODate(snapshot.snapshot_date) === latestDate).length,
    total,
  });

  return total;
}

async function upsertPatrimonyHistoryMonth(periodKey, userNote) {
  console.log("[patrimony-month] conferma aggiornamento mese", { periodKey, userNote });
  const normalized = normalizePeriodKey(periodKey);

  if (!normalized) {
    throw new Error("periodKey non valido. Usa formato YYYY-MM.");
  }

  const { period, year, month } = normalized;
  const userNoteText = String(userNote || "").trim();
  console.log("[patrimony-month] period selezionato", period);
  console.log("[patrimony-month] year/month calcolati", { year, month });

  const [ccBalance, portfolioTotal] = await Promise.all([
    getFinecoBalanceByMonth(year, month, period),
    getInvestmentsTotalByMonth(year, month, period),
  ]);
  const patrimonyTotalRaw = ccBalance + portfolioTotal;
  const patrimonyTotal = Math.round((patrimonyTotalRaw + Number.EPSILON) * 100) / 100;
  console.log("[patrimony-month] patrimony_total finale", {
    ccBalance,
    portfolioTotal,
    patrimonyTotalRaw,
    patrimonyTotal,
  });

  if (!Number.isFinite(patrimonyTotal)) {
    throw new Error(`Impossibile calcolare il patrimonio per ${period}: dati insufficienti.`);
  }

  const payload = {
    period,
    year,
    month,
    patrimony_total: patrimonyTotal,
  };

  if (userNoteText) {
    payload.note = userNoteText;
  }

  console.log("[patrimony-month] verifica esistenza riga patrimony_history per period", {
    table: "patrimony_history",
    period,
  });

  const { data: existingRows, error: readError } = await supabaseClient
    .from("patrimony_history")
    .select("id,period,note")
    .eq("period", period)
    .order("id", { ascending: true })
    .limit(1);

  if (readError) {
    console.error("[patrimony-month] errore Supabase select patrimony_history", readError);
    throw readError;
  }

  const existingRow = existingRows?.[0] ?? null;
  console.log("[patrimony-month] risultato verifica patrimony_history", {
    existingRow,
    count: existingRows?.length ?? 0,
  });

  console.log("[patrimony-month] payload insert/update", {
    mode: existingRow ? "update" : "insert",
    id: existingRow?.id ?? null,
    payload,
  });

  const saveResult = existingRow
    ? await supabaseClient.from("patrimony_history").update(payload).eq("id", existingRow.id).select("id,period,year,month,patrimony_total,note")
    : await supabaseClient.from("patrimony_history").insert(payload).select("id,period,year,month,patrimony_total,note");

  console.log("[patrimony-month] risposta Supabase patrimony_history", saveResult);

  if (saveResult.error) {
    console.error("[patrimony-month] errore Supabase salvataggio patrimony_history", saveResult.error);
    throw saveResult.error;
  }

  const savedRow = saveResult.data?.[0] ?? null;
  if (!savedRow) {
    throw new Error(`Salvataggio patrimony_history senza riga restituita per ${period}.`);
  }

  console.log("[patrimony-month] risultato salvato", {
    period,
    updated: Boolean(existingRow),
    savedRow,
  });

  return {
    ok: true,
    period,
    value: patrimonyTotal,
    updated: Boolean(existingRow),
    note: savedRow?.note || existingRow?.note || userNoteText,
    row: savedRow,
  };
}

function setUpdateMonthError(message) {
  if (!updateMonthError) return;

  updateMonthError.textContent = message || "";
}

function setUpdateMonthSubmitting(isSubmitting) {
  if (confirmUpdateMonthButton) {
    confirmUpdateMonthButton.disabled = Boolean(isSubmitting);
    confirmUpdateMonthButton.textContent = isSubmitting ? "Aggiorno..." : "Aggiorna";
  }

  [
    cancelUpdateMonthModalButton,
    closeUpdateMonthModalButton,
    updateMonthInput,
    updateMonthNoteInput,
  ].forEach((element) => {
    if (element) element.disabled = Boolean(isSubmitting);
  });
}

function openUpdateMonthModal() {
  if (!updateMonthModal) return;

  console.log("[patrimony-month] apertura modale");
  setMovimentiPageMessage("");
  setUpdateMonthSubmitting(false);
  setUpdateMonthError("");
  updateMonthInput.value = getCurrentPeriodKey();
  updateMonthNoteInput.value = "";
  updateMonthModal.classList.add("is-open");
  updateMonthModal.setAttribute("aria-hidden", "false");
  updateMonthInput.focus();
}

function closeUpdateMonthModal() {
  if (!updateMonthModal) return;

  updateMonthModal.classList.remove("is-open");
  updateMonthModal.setAttribute("aria-hidden", "true");
  setUpdateMonthSubmitting(false);
  setUpdateMonthError("");
}

async function saveUpdateMonth() {
  if (!supabaseClient) {
    setUpdateMonthError("Credenziali Supabase mancanti.");
    return;
  }

  const normalized = normalizePeriodKey(updateMonthInput.value);

  if (!normalized) {
    setUpdateMonthError("Formato non valido. Usa YYYY-MM.");
    return;
  }

  setUpdateMonthSubmitting(true);
  setUpdateMonthError("");
  setMovimentiPageMessage("");

  try {
    const result = await upsertPatrimonyHistoryMonth(normalized.period, updateMonthNoteInput.value);
    closeUpdateMonthModal();
    setMovimentiPageMessage(`Mese ${result.period} aggiornato`, "success");
    console.log("[patrimony-month] salvataggio completato", result);
  } catch (error) {
    console.error("[patrimony-month] errore aggiornamento mese", error);
    setUpdateMonthError(error.message || "Errore aggiornamento mese");
  } finally {
    if (updateMonthModal.classList.contains("is-open")) {
      setUpdateMonthSubmitting(false);
    }
  }
}

function getMovementFormData() {
  const date = movementDateInput.value;
  const description = movementDescriptionInput.value.trim();
  const rawAmount = movementAmountInput.value;
  const parsedAmount = parseItalianAmount(rawAmount);
  const amount = getSignedMovementAmount();

  if (!date) {
    return { error: "La data è obbligatoria." };
  }

  if (!description) {
    return { error: "La descrizione è obbligatoria." };
  }

  if (!Number.isFinite(parsedAmount) || parsedAmount === 0) {
    return { error: "Inserisci un importo valido e diverso da zero." };
  }

  return {
    value: {
      date,
      description,
      amount,
      inTotals: movementInTotalsSwitch.checked,
    },
  };
}

async function getCurrentFinecoBalance() {
  const { data, error } = await supabaseClient
    .from("transactions")
    .select("balance")
    .eq("account_id", "FINECO_MAIN")
    .order("date", { ascending: false })
    .order("created_at", { ascending: false })
    .limit(1);

  if (error) {
    throw error;
  }

  const balance = Number(data?.[0]?.balance ?? 0);
  return Number.isFinite(balance) ? balance : 0;
}

function roundBalance(value) {
  return Math.round((Number(value) + Number.EPSILON) * 100) / 100;
}

function compareTransactionPosition(first, second) {
  const firstDate = String(first?.date || "");
  const secondDate = String(second?.date || "");

  if (firstDate !== secondDate) {
    return firstDate.localeCompare(secondDate);
  }

  const firstCreatedAt = String(first?.created_at || "");
  const secondCreatedAt = String(second?.created_at || "");

  if (firstCreatedAt !== secondCreatedAt) {
    return firstCreatedAt.localeCompare(secondCreatedAt);
  }

  const firstId = Number(first?.id);
  const secondId = Number(second?.id);

  if (Number.isFinite(firstId) && Number.isFinite(secondId)) {
    return firstId - secondId;
  }

  return String(first?.id || "").localeCompare(String(second?.id || ""));
}

function getEarliestTransactionPosition(first, second) {
  return compareTransactionPosition(first, second) <= 0 ? first : second;
}

async function recalculateBalancesFrom(accountId, startDate, startCreatedAt, startId, operation = "recalculate") {
  if (!accountId) {
    throw new Error("account_id mancante per il ricalcolo balance.");
  }

  const { data, error } = await supabaseClient
    .from("transactions")
    .select("id,tx_id,date,created_at,amount,balance,account_id")
    .eq("account_id", accountId)
    .order("date", { ascending: true })
    .order("created_at", { ascending: true })
    .order("id", { ascending: true });

  if (error) {
    throw error;
  }

  const transactions = data ?? [];
  const startPosition = {
    date: startDate,
    created_at: startCreatedAt,
    id: startId,
  };
  const startIndex = transactions.findIndex((transaction) => compareTransactionPosition(transaction, startPosition) >= 0);

  if (startIndex === -1) {
    const previousMovement = transactions.at(-1) ?? null;
    const baseBalance = roundBalance(Number(previousMovement?.balance) || 0);

    console.debug("[Movimenti] Ricalcolo parziale balance", {
      operation,
      account_id: accountId,
      startPoint: startPosition,
      baseBalance,
      recalculatedCount: 0,
      firstUpdatedMovement: null,
      lastUpdatedMovement: null,
      finalBalance: baseBalance,
    });

    return 0;
  }

  const previousMovement = startIndex > 0 ? transactions[startIndex - 1] : null;
  let runningBalance = roundBalance(Number(previousMovement?.balance) || 0);
  const rowsToUpdate = [];
  let firstRecalculatedMovement = null;
  let lastRecalculatedMovement = null;

  for (let index = startIndex; index < transactions.length; index += 1) {
    const transaction = transactions[index];
    const amount = Number(transaction.amount);

    runningBalance = roundBalance(runningBalance + (Number.isFinite(amount) ? amount : 0));
    const currentBalance = Number(transaction.balance);

    if (!firstRecalculatedMovement) firstRecalculatedMovement = transaction;
    lastRecalculatedMovement = transaction;

    if (!Number.isFinite(currentBalance) || roundBalance(currentBalance) !== runningBalance) {
      rowsToUpdate.push({
        tx_id: transaction.tx_id,
        balance: runningBalance,
      });
    }
  }

  const updateBatchSize = 25;
  for (let index = 0; index < rowsToUpdate.length; index += updateBatchSize) {
    const batch = rowsToUpdate.slice(index, index + updateBatchSize);
    const results = await Promise.all(
      batch.map((row) => supabaseClient
        .from("transactions")
        .update({ balance: row.balance })
        .eq("tx_id", row.tx_id)),
    );

    const failedResult = results.find((result) => result.error);
    if (failedResult?.error) {
      throw failedResult.error;
    }
  }

  console.debug("[Movimenti] Ricalcolo parziale balance", {
    operation,
    account_id: accountId,
    startPoint: startPosition,
    baseBalance: roundBalance(Number(previousMovement?.balance) || 0),
    recalculatedCount: transactions.length - startIndex,
    updatedCount: rowsToUpdate.length,
    firstUpdatedMovement: firstRecalculatedMovement,
    lastUpdatedMovement: lastRecalculatedMovement,
    finalBalance: runningBalance,
  });

  return rowsToUpdate.length;
}

async function saveMovement() {
  if (!supabaseClient) {
    showMovementModalError("Credenziali Supabase mancanti.");
    return;
  }

  const { value, error } = getMovementFormData();

  if (error) {
    showMovementModalError(error);
    return;
  }

  saveMovementPlaceholderButton.disabled = true;
  saveMovementPlaceholderButton.textContent = "Salvo...";
  showMovementModalError("");

  try {
    let saveError = null;

    if (modalMode === "edit") {
      const { data: previousMovement, error: previousMovementError } = await supabaseClient
        .from("transactions")
        .select("id,tx_id,date,created_at,amount,balance,account_id")
        .eq("tx_id", editingTxId)
        .single();

      if (previousMovementError) {
        showMovementModalError(`Errore lettura movimento: ${previousMovementError.message}`);
        return;
      }

      const { error: updateError } = await supabaseClient
        .from("transactions")
        .update({
          date: value.date,
          description: value.description,
          amount: value.amount,
          in_totals: value.inTotals,
        })
        .eq("tx_id", editingTxId);

      saveError = updateError;

      if (!saveError) {
        const { data: updatedMovement, error: updatedMovementError } = await supabaseClient
          .from("transactions")
          .select("id,tx_id,date,created_at,amount,balance,account_id")
          .eq("tx_id", editingTxId)
          .single();

        if (updatedMovementError) {
          showMovementModalError(`Errore lettura movimento aggiornato: ${updatedMovementError.message}`);
          return;
        }

        const previousAccountId = previousMovement.account_id || "FINECO_MAIN";
        const updatedAccountId = updatedMovement.account_id || previousAccountId;

        if (previousAccountId !== updatedAccountId) {
          await recalculateBalancesFrom(
            previousAccountId,
            previousMovement.date,
            previousMovement.created_at,
            previousMovement.id,
            "update-old-account",
          );
          await recalculateBalancesFrom(
            updatedAccountId,
            updatedMovement.date,
            updatedMovement.created_at,
            updatedMovement.id,
            "update-new-account",
          );
        } else {
          const startMovement = getEarliestTransactionPosition(previousMovement, updatedMovement);
          await recalculateBalancesFrom(
            updatedAccountId,
            startMovement.date,
            startMovement.created_at,
            startMovement.id,
            "update",
          );
        }
      }
    } else {
      const currentBalance = movementCurrentBalance;
      const nextBalance = currentBalance + value.amount;
      const txId = crypto.randomUUID();

      currentBalancePreview.textContent = formatEuro(currentBalance);
      updateSaldoPreview();

      const { data: insertedMovement, error: insertError } = await supabaseClient.from("transactions").insert({
        tx_id: txId,
        date: value.date,
        description: value.description,
        amount: value.amount,
        in_totals: value.inTotals,
        account_id: "FINECO_MAIN",
        balance: nextBalance,
      }).select("id,tx_id,date,created_at,account_id").single();

      saveError = insertError;

      if (!saveError) {
        await recalculateBalancesFrom(
          insertedMovement.account_id || "FINECO_MAIN",
          insertedMovement.date,
          insertedMovement.created_at,
          insertedMovement.id,
          "insert",
        );
      }
    }

    if (saveError) {
      showMovementModalError(`Errore salvataggio movimento: ${saveError.message}`);
      return;
    }

    closeMovementModal();
    await loadMovimenti();
  } catch (saveError) {
    showMovementModalError(`Errore salvataggio movimento: ${saveError.message}`);
  } finally {
    saveMovementPlaceholderButton.disabled = false;
    saveMovementPlaceholderButton.textContent = modalMode === "edit" ? "Salva modifiche" : "Salva movimento";
  }
}

async function editMovement(txId) {
  const { data, error } = await supabaseClient
    .from("transactions")
    .select("*")
    .eq("tx_id", txId)
    .single();

  if (error) {
    alert(`Errore lettura movimento: ${error.message}`);
    return;
  }

  const amount = Number(data.amount);

  modalMode = "edit";
  editingTxId = txId;
  movementModalTitle.textContent = "Modifica movimento";
  saveMovementPlaceholderButton.textContent = "Salva modifiche";
  movementModalError.textContent = "";
  movementDateInput.value = data.date ? String(data.date).slice(0, 10) : "";
  movementDescriptionInput.value = data.description ?? "";
  movementAmountInput.value = formatAmountInput(amount);
  movementTypeSwitch.checked = amount > 0;
  movementInTotalsSwitch.checked = Boolean(data.in_totals);
  movementCurrentBalance = Number.isFinite(Number(data.balance)) ? Number(data.balance) : 0;
  currentBalancePreview.textContent = formatEuro(movementCurrentBalance);
  updateSaldoPreview();
  movementModal.classList.add("is-open");
  movementModal.setAttribute("aria-hidden", "false");
}

function openDeleteMovementModal(txId) {
  pendingDeleteTxId = txId;
  deleteMovementModalError.textContent = "";
  confirmDeleteMovementButton.disabled = false;
  confirmDeleteMovementButton.textContent = "Elimina";
  deleteMovementModal.classList.add("is-open");
  deleteMovementModal.setAttribute("aria-hidden", "false");
}

function closeDeleteMovementModal() {
  pendingDeleteTxId = null;
  deleteMovementModalError.textContent = "";
  confirmDeleteMovementButton.disabled = false;
  confirmDeleteMovementButton.textContent = "Elimina";
  deleteMovementModal.classList.remove("is-open");
  deleteMovementModal.setAttribute("aria-hidden", "true");
}

async function deleteMovement() {
  if (!pendingDeleteTxId) {
    deleteMovementModalError.textContent = "Movimento non selezionato.";
    return;
  }

  confirmDeleteMovementButton.disabled = true;
  confirmDeleteMovementButton.textContent = "Elimino...";
  deleteMovementModalError.textContent = "";

  try {
    const { data: movementToDelete, error: readError } = await supabaseClient
      .from("transactions")
      .select("id,tx_id,date,created_at,account_id")
      .eq("tx_id", pendingDeleteTxId)
      .single();

    if (readError) {
      deleteMovementModalError.textContent = `Errore lettura movimento: ${readError.message}`;
      return;
    }

    const { error } = await supabaseClient
      .from("transactions")
      .delete()
      .eq("tx_id", pendingDeleteTxId);

    if (error) {
      deleteMovementModalError.textContent = `Errore eliminazione movimento: ${error.message}`;
      return;
    }

    await recalculateBalancesFrom(
      movementToDelete.account_id || "FINECO_MAIN",
      movementToDelete.date,
      movementToDelete.created_at,
      movementToDelete.id,
      "delete",
    );

    closeDeleteMovementModal();
    await loadMovimenti();
  } catch (error) {
    deleteMovementModalError.textContent = `Errore eliminazione movimento: ${error.message}`;
  } finally {
    if (deleteMovementModal.classList.contains("is-open")) {
      confirmDeleteMovementButton.disabled = false;
      confirmDeleteMovementButton.textContent = "Elimina";
    }
  }
}

function handleMovimentiTableAction(event) {
  const actionButton = event.target.closest(".action-btn");

  if (!actionButton) {
    return;
  }

  const txId = actionButton.dataset.txId;

  if (!txId) {
    alert("tx_id movimento non disponibile.");
    return;
  }

  if (actionButton.classList.contains("edit")) {
    editMovement(txId);
    return;
  }

  if (actionButton.classList.contains("delete")) {
    openDeleteMovementModal(txId);
  }
}

function initDeleteMovementModal() {
  cancelDeleteMovementButton.addEventListener("click", closeDeleteMovementModal);
  confirmDeleteMovementButton.addEventListener("click", deleteMovement);

  deleteMovementModal.addEventListener("click", (event) => {
    if (event.target === deleteMovementModal) {
      closeDeleteMovementModal();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && deleteMovementModal.classList.contains("is-open")) {
      closeDeleteMovementModal();
    }
  });
}

function initMovementModal() {
  openMovementModalButton.addEventListener("click", openMovementModal);
  closeMovementModalButton.addEventListener("click", closeMovementModal);
  cancelMovementModalButton.addEventListener("click", closeMovementModal);

  movementModal.addEventListener("click", (event) => {
    if (event.target === movementModal) {
      closeMovementModal();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && movementModal.classList.contains("is-open")) {
      closeMovementModal();
    }
  });

  saveMovementPlaceholderButton.addEventListener("click", saveMovement);
  movementAmountInput.addEventListener("input", updateSaldoPreview);
  movementTypeSwitch.addEventListener("change", updateSaldoPreview);
  movimentiTableElement.addEventListener("click", handleMovimentiTableAction);
}

function initUpdateMonthModal() {
  [openUpdateMonthToolbarButton, openUpdateMonthModalButton].forEach((button) => {
    if (button) button.addEventListener("click", openUpdateMonthModal);
  });
  closeUpdateMonthModalButton.addEventListener("click", closeUpdateMonthModal);
  cancelUpdateMonthModalButton.addEventListener("click", closeUpdateMonthModal);
  confirmUpdateMonthButton.addEventListener("click", saveUpdateMonth);

  updateMonthModal.addEventListener("click", (event) => {
    if (event.target === updateMonthModal) {
      closeUpdateMonthModal();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && updateMonthModal.classList.contains("is-open")) {
      closeUpdateMonthModal();
    }
  });
}

function initRevolutModal() {
  openRevolutModalButton.addEventListener("click", openRevolutModal);
  closeRevolutModalButton.addEventListener("click", closeRevolutModal);
  cancelRevolutModalButton.addEventListener("click", closeRevolutModal);
  saveRevolutPlaceholderButton.addEventListener("click", saveRevolutSnapshot);

  revolutModal.addEventListener("click", (event) => {
    if (event.target === revolutModal) {
      closeRevolutModal();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && revolutModal.classList.contains("is-open")) {
      closeRevolutModal();
    }
  });
}

function getFirstDefined(record, keys, fallback = null) {
  for (const key of keys) {
    if (Object.prototype.hasOwnProperty.call(record, key) && record[key] !== null && record[key] !== undefined) {
      return record[key];
    }
  }

  return fallback;
}

function getTitoliDossierId(dossier) {
  return String(getFirstDefined(dossier, ["account_id", "dossier_id", "id"], ""));
}

function getTitoliDossierLabel(dossier) {
  const fallback = getTitoliDossierId(dossier);
  return String(getFirstDefined(dossier, ["label", "name", "nome", "account_name"], fallback));
}

function getTitoliDossierOrder(dossier) {
  const order = Number(getFirstDefined(dossier, ["order", "ordine", "sort_order"], Number.MAX_SAFE_INTEGER));
  return Number.isFinite(order) ? order : Number.MAX_SAFE_INTEGER;
}

function getTitoliDossierImportEnabled(dossier) {
  const value = getFirstDefined(dossier, ["import", "can_import", "excel_import"], false);
  if (value === true || value === false) return value;
  if (value === 1) return true;
  if (value === 0) return false;

  const text = String(value ?? "").trim().toLowerCase();
  return ["true", "1", "yes", "y", "si", "s"].includes(text);
}

function isTitoliDossierActive(dossier) {
  const visible = getFirstDefined(dossier, ["visible"], true);
  const isClosed = getFirstDefined(dossier, ["is_closed"], false);
  return visible !== false && isClosed !== true;
}

function getTitoliAssetDossierId(asset) {
  return String(getFirstDefined(asset, ["dossier_id", "account_id"], ""));
}

function getTitoliAssetId(asset) {
  return String(getFirstDefined(asset, ["id"], ""));
}

function getTitoliAssetName(asset) {
  const fallback = getTitoliAssetId(asset);
  return String(getFirstDefined(asset, ["asset_name", "name", "nome", "titolo"], fallback));
}

function getTitoliAssetIsin(asset) {
  return String(getFirstDefined(asset, ["isin"], ""));
}

function getTitoliSnapshotDossierId(snapshot) {
  return String(getFirstDefined(snapshot, ["dossier_id", "account_id"], ""));
}

function getTitoliSnapshotAssetId(snapshot) {
  return String(getFirstDefined(snapshot, ["asset_id", "portfolio_asset_id", "id"], ""));
}

function getTitoliSnapshotIsin(snapshot) {
  return String(getFirstDefined(snapshot, ["isin"], ""));
}

function getTitoliSnapshotDate(snapshot) {
  return getFirstDefined(snapshot, ["snapshot_date", "date", "data"], null);
}

function getTitoliSnapshotValue(snapshot) {
  return getFirstDefined(snapshot, ["market_value", "value", "total_value", "total", "valore", "amount"], null);
}

function isTitoliAssetActive(asset) {
  const visible = getFirstDefined(asset, ["visible"], false);
  const isClosed = getFirstDefined(asset, ["is_closed"], false);
  return visible === true && isClosed !== true;
}

function sortTitoliDossiers(a, b) {
  const orderDiff = getTitoliDossierOrder(a) - getTitoliDossierOrder(b);
  if (orderDiff !== 0) return orderDiff;
  return getTitoliDossierLabel(a).localeCompare(getTitoliDossierLabel(b), "it");
}

function sortTitoliAssets(a, b) {
  return getTitoliAssetName(a).localeCompare(getTitoliAssetName(b), "it");
}

function renderTitoliInsertState(className, message, withSpinner = false) {
  titoliInsertRoot.textContent = "";

  const stateElement = document.createElement("div");
  stateElement.className = className;

  if (withSpinner) {
    const spinner = document.createElement("span");
    spinner.className = "spinner";
    stateElement.appendChild(spinner);
  }

  const messageElement = document.createElement("span");
  messageElement.textContent = message;
  stateElement.appendChild(messageElement);
  titoliInsertRoot.appendChild(stateElement);
}

function parseTitoliValue(value) {
  const rawValue = String(value ?? "").trim();

  if (!rawValue) {
    return null;
  }

  let compactValue = rawValue
    .replace(/\s/g, "")
    .replace(/[€$£]/g, "")
    .replace(/[^\d,.-]/g, "");

  if (!compactValue || compactValue === "-" || compactValue === "." || compactValue === ",") {
    return null;
  }

  const hasComma = compactValue.includes(",");
  const hasDot = compactValue.includes(".");

  if (hasComma && hasDot) {
    const decimalSeparator = compactValue.lastIndexOf(",") > compactValue.lastIndexOf(".") ? "," : ".";
    const thousandsSeparator = decimalSeparator === "," ? "." : ",";
    compactValue = compactValue.replaceAll(thousandsSeparator, "").replace(decimalSeparator, ".");
  } else if (hasComma) {
    compactValue = normalizeTitoliSingleSeparatorNumber(compactValue, ",");
  } else if (hasDot) {
    compactValue = normalizeTitoliSingleSeparatorNumber(compactValue, ".");
  }

  const parsedValue = Number(compactValue);
  return Number.isFinite(parsedValue) ? parsedValue : null;
}

function normalizeTitoliSingleSeparatorNumber(value, separator) {
  const parts = value.split(separator);

  if (parts.length > 2 && parts.slice(1).every((part) => part.length === 3)) {
    return parts.join("");
  }

  if (parts.length === 2) {
    return separator === "," ? value.replace(",", ".") : value;
  }

  return value;
}

function formatTitoliValue(value) {
  const number = Number(value);

  if (!Number.isFinite(number)) {
    return "";
  }

  return new Intl.NumberFormat("it-IT", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    useGrouping: true,
  }).format(number);
}

function formatTitoliMarketInput(input) {
  const amount = parseTitoliValue(input.value);

  if (!input.value.trim()) {
    input.value = "";
    return;
  }

  input.value = amount === null ? "" : formatTitoliValue(amount);
}

function formatTitoliDateValue(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function getStartOfTitoliWeek(date) {
  const weekStart = new Date(date);
  const day = weekStart.getDay();
  const mondayOffset = day === 0 ? -6 : 1 - day;
  weekStart.setDate(weekStart.getDate() + mondayOffset);
  weekStart.setHours(0, 0, 0, 0);
  return weekStart;
}

function renderTitoliWeekPicker() {
  if (!titoliWeekPicker || !titoliSnapshotDateInput) return;

  const weekStart = getStartOfTitoliWeek(titoliSelectedDate);
  const selectedValue = formatTitoliDateValue(titoliSelectedDate);

  titoliSnapshotDateInput.value = selectedValue;
  titoliWeekPicker.textContent = "";

  const previousButton = document.createElement("button");
  const nextButton = document.createElement("button");
  const daysWrapper = document.createElement("div");

  previousButton.className = "titoli-week-arrow";
  previousButton.type = "button";
  previousButton.textContent = "‹";
  previousButton.setAttribute("aria-label", "Settimana precedente");

  nextButton.className = "titoli-week-arrow";
  nextButton.type = "button";
  nextButton.textContent = "›";
  nextButton.setAttribute("aria-label", "Settimana successiva");

  daysWrapper.className = "titoli-week-days";

  for (let index = 0; index < 7; index += 1) {
    const dayDate = new Date(weekStart);
    dayDate.setDate(weekStart.getDate() + index);

    const dayButton = document.createElement("button");
    const dayName = document.createElement("span");
    const dayNumber = document.createElement("strong");
    const dayMonth = document.createElement("span");
    const value = formatTitoliDateValue(dayDate);

    dayButton.className = "titoli-week-day";
    dayButton.type = "button";
    dayButton.dataset.date = value;
    dayButton.setAttribute("aria-pressed", value === selectedValue ? "true" : "false");
    dayButton.classList.toggle("is-selected", value === selectedValue);
    dayName.textContent = dayDate.toLocaleDateString("it-IT", { weekday: "short" });
    dayNumber.textContent = dayDate.toLocaleDateString("it-IT", { day: "2-digit" });
    dayMonth.textContent = dayDate.toLocaleDateString("it-IT", { month: "short" });

    dayButton.appendChild(dayName);
    dayButton.appendChild(dayNumber);
    dayButton.appendChild(dayMonth);
    daysWrapper.appendChild(dayButton);
  }

  previousButton.addEventListener("click", () => {
    titoliSelectedDate.setDate(titoliSelectedDate.getDate() - 7);
    renderTitoliWeekPicker();
  });

  nextButton.addEventListener("click", () => {
    titoliSelectedDate.setDate(titoliSelectedDate.getDate() + 7);
    renderTitoliWeekPicker();
  });

  daysWrapper.addEventListener("click", (event) => {
    const button = event.target.closest(".titoli-week-day");
    if (!button) return;
    titoliSelectedDate = new Date(`${button.dataset.date}T00:00:00`);
    renderTitoliWeekPicker();
  });

  titoliWeekPicker.appendChild(previousButton);
  titoliWeekPicker.appendChild(daysWrapper);
  titoliWeekPicker.appendChild(nextButton);
}

function getTitoliSnapshotTime(snapshot) {
  const snapshotDate = getTitoliSnapshotDate(snapshot);
  const timestamp = snapshotDate ? new Date(snapshotDate).getTime() : 0;
  return Number.isFinite(timestamp) ? timestamp : 0;
}

function getTitoliLookupKey(dossierId, value) {
  return `${String(dossierId)}|${String(value).trim().toUpperCase()}`;
}

function setLatestTitoliSnapshot(map, key, snapshot) {
  if (!key.endsWith("|") && (!map.has(key) || getTitoliSnapshotTime(snapshot) >= getTitoliSnapshotTime(map.get(key)))) {
    map.set(key, snapshot);
  }
}

function buildLatestTitoliSnapshots(snapshots) {
  const byDossierIsin = new Map();
  const byDossierAsset = new Map();

  snapshots.forEach((snapshot) => {
    const dossierId = getTitoliSnapshotDossierId(snapshot);
    const isin = getTitoliSnapshotIsin(snapshot);
    const assetId = getTitoliSnapshotAssetId(snapshot);

    setLatestTitoliSnapshot(byDossierIsin, getTitoliLookupKey(dossierId, isin), snapshot);
    setLatestTitoliSnapshot(byDossierAsset, getTitoliLookupKey(dossierId, assetId), snapshot);
  });

  return { byDossierAsset, byDossierIsin };
}

function buildLatestTitoliSnapshotDates(snapshots) {
  const latestDates = new Map();

  snapshots.forEach((snapshot) => {
    const dossierId = getTitoliSnapshotDossierId(snapshot);
    const snapshotDate = getTitoliSnapshotDate(snapshot);
    const timestamp = snapshotDate ? new Date(snapshotDate).getTime() : NaN;
    if (!dossierId || !snapshotDate || !Number.isFinite(timestamp)) return;

    const current = latestDates.get(dossierId);
    if (!current || timestamp >= current.timestamp) {
      latestDates.set(dossierId, {
        formattedDate: new Date(snapshotDate).toLocaleDateString("it-IT"),
        timestamp,
      });
    }
  });

  return latestDates;
}

function findLatestTitoliSnapshot(asset, dossierId, latestSnapshots) {
  const assetIsin = getTitoliAssetIsin(asset);
  const assetId = getTitoliAssetId(asset);

  return (
    latestSnapshots.byDossierIsin.get(getTitoliLookupKey(dossierId, assetIsin)) ??
    latestSnapshots.byDossierAsset.get(getTitoliLookupKey(dossierId, assetId)) ??
    null
  );
}

function updateTotals(card) {
  const inputs = Array.from(card.querySelectorAll(".titoli-market-input"));
  const initialTotal = Number(card.dataset.initialTotal || 0);
  const currentTotal = inputs.reduce((total, input) => total + (parseTitoliValue(input.value) ?? 0), 0);
  const delta = currentTotal - initialTotal;
  const previousTotalElement = card.querySelector(".titoli-total-previous strong");
  const currentTotalElement = card.querySelector(".titoli-total-current strong");
  const deltaElement = card.querySelector(".titoli-total-delta");

  previousTotalElement.textContent = formatEuro(initialTotal);
  currentTotalElement.textContent = formatEuro(currentTotal);
  deltaElement.classList.remove("value-positive", "value-negative", "value-neutral");

  if (delta > 0) {
    deltaElement.textContent = `▲ (+${formatEuro(delta)})`;
    deltaElement.classList.add("value-positive");
  } else if (delta < 0) {
    deltaElement.textContent = `▼ (${formatEuro(delta)})`;
    deltaElement.classList.add("value-negative");
  } else {
    deltaElement.textContent = "";
    deltaElement.classList.add("value-neutral");
  }
}

function updateTitoliDossierTotals(card) {
  updateTotals(card);
}

function getTitoliSnapshotDateValue() {
  return String(titoliSnapshotDateInput?.value || "").trim();
}

function roundMoney(value) {
  return Math.round((Number(value) + Number.EPSILON) * 100) / 100;
}

function formatTitoliLastReadDate(snapshotDate) {
  const date = new Date(`${snapshotDate}T00:00:00`);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("it-IT");
}

function setTitoliCardLastReadDate(card, snapshotDate) {
  const title = card.querySelector(".titoli-dossier-header h2");
  if (!title) return;

  let dateElement = title.querySelector(".titoli-dossier-title-date");
  if (!dateElement) {
    dateElement = document.createElement("span");
    dateElement.className = "titoli-dossier-title-date";
    title.appendChild(dateElement);
  }

  const formattedDate = formatTitoliLastReadDate(snapshotDate);
  dateElement.textContent = formattedDate ? ` (${formattedDate})` : "";
}

function buildTitoliPortfolioRowsForCard(card, snapshotDate) {
  const dossierId = String(card?.dataset?.dossierId || "").trim().toUpperCase();
  const rows = [];
  let total = 0;

  if (!snapshotDate || !dossierId) {
    return { dossierId, rows, total };
  }

  card.querySelectorAll(".titoli-market-input").forEach((input) => {
    const isin = String(input.dataset.assetIsin || "").trim().toUpperCase();
    const assetName = String(input.dataset.assetName || "").trim();
    const marketValue = parseTitoliValue(input.value);

    if (!isin || marketValue === null) return;

    const roundedMarketValue = roundMoney(marketValue);

    rows.push({
      snapshot_date: snapshotDate,
      dossier_id: dossierId,
      isin,
      asset_name: assetName,
      market_value: roundedMarketValue,
      note: "",
    });
    total += roundedMarketValue;
  });

  return { dossierId, rows, total: roundMoney(total) };
}

function isMissingInvestmentConstraintError(error) {
  const message = String(error?.message || "").toLowerCase();
  return (
    error?.code === "42P10" ||
    message.includes("no unique") ||
    message.includes("no exclusion constraint") ||
    message.includes("on conflict")
  );
}

async function saveInvestmentSnapshot(snapshotDate, dossierId, total) {
  const roundedTotal = roundMoney(total);
  const configs = [
    { dossierColumn: "dossier_id", valueColumn: "value" },
    { dossierColumn: "account_id", valueColumn: "value" },
    { dossierColumn: "dossier_id", valueColumn: "total_value" },
    { dossierColumn: "account_id", valueColumn: "total_value" },
    { dossierColumn: "dossier_id", valueColumn: "market_value" },
    { dossierColumn: "account_id", valueColumn: "market_value" },
  ];
  let lastError = null;

  for (const config of configs) {
    const payload = {
      snapshot_date: snapshotDate,
      [config.dossierColumn]: dossierId,
      [config.valueColumn]: roundedTotal,
    };
    const conflictTarget = `snapshot_date,${config.dossierColumn}`;
    const upsertResult = await supabaseClient
      .from("investments_snapshots")
      .upsert(payload, { onConflict: conflictTarget });

    if (!upsertResult.error) {
      console.log("esito investments_snapshots", "upsert", config);
      return { method: "upsert", config };
    }

    lastError = upsertResult.error;

    if (!isMissingInvestmentConstraintError(upsertResult.error)) {
      continue;
    }

    const selectResult = await supabaseClient
      .from("investments_snapshots")
      .select("id")
      .eq("snapshot_date", snapshotDate)
      .eq(config.dossierColumn, dossierId)
      .limit(1);

    if (selectResult.error) {
      lastError = selectResult.error;
      continue;
    }

    const existingId = selectResult.data?.[0]?.id;
    const writeResult = existingId
      ? await supabaseClient.from("investments_snapshots").update(payload).eq("id", existingId)
      : await supabaseClient.from("investments_snapshots").insert(payload);

    if (!writeResult.error) {
      console.log("esito investments_snapshots", existingId ? "update" : "insert", config);
      return { method: existingId ? "update" : "insert", config };
    }

    lastError = writeResult.error;
  }

  throw lastError || new Error("Impossibile salvare investments_snapshots.");
}

async function saveTitoliDossier(card, button) {
  const snapshotDate = getTitoliSnapshotDateValue();
  const { dossierId, rows, total } = buildTitoliPortfolioRowsForCard(card, snapshotDate);

  if (!snapshotDate) {
    alert("Seleziona una data snapshot valida.");
    return;
  }

  if (!dossierId) {
    alert("Dossier non valido: dossier_id mancante.");
    return;
  }

  if (!rows.length) {
    alert("Nessun titolo valido da salvare per questo dossier.");
    return;
  }

  console.log("saving dossier", dossierId);
  console.log("numero righe portfolio inviate", rows.length);
  console.log("totale dossier inviato", total);
  console.log("totale dossier arrotondato inviato", roundMoney(total));

  const originalText = button.textContent;
  button.disabled = true;
  button.textContent = "Salvataggio...";

  try {
    const portfolioResult = await supabaseClient.from("portfolio_snapshots").upsert(rows, {
      onConflict: "snapshot_date,dossier_id,isin",
    });

    console.log("esito portfolio_snapshots", portfolioResult);

    if (portfolioResult.error) {
      throw portfolioResult.error;
    }

    const investmentResult = await saveInvestmentSnapshot(snapshotDate, dossierId, total);
    console.log("esito investments_snapshots", investmentResult);

    card.dataset.initialTotal = String(total);
    updateTotals(card);
    setTitoliCardLastReadDate(card, snapshotDate);

    button.textContent = "Salvato";
    window.setTimeout(() => {
      button.textContent = originalText;
      button.disabled = false;
    }, 1200);
  } catch (error) {
    console.error("Errore salvataggio dossier titoli:", {
      dossierId,
      snapshotDate,
      portfolioRows: rows,
      total,
      error,
    });
    button.textContent = originalText;
    button.disabled = false;
    alert(`Errore salvataggio dossier: ${error.message || error}`);
  }
}

async function saveAllTitoliDossiers(button) {
  const originalText = button.textContent;
  const cards = Array.from(titoliInsertRoot.querySelectorAll(".titoli-dossier-card"));

  button.disabled = true;
  button.textContent = "Salvataggio...";

  try {
    if (!cards.length) {
      alert("Nessun dossier disponibile da salvare.");
      return;
    }

    for (const card of cards) {
      const saveButton = card.querySelector("[data-titoli-save-placeholder]");
      await saveTitoliDossier(card, saveButton || button);
    }

    button.textContent = "Salvato";
  } finally {
    window.setTimeout(() => {
      button.textContent = originalText || "Salva tutto";
      button.disabled = false;
    }, 1200);
  }
}

function createTitoliTotalsBar() {
  const totalsBar = document.createElement("div");
  const previousTotal = document.createElement("div");
  const currentTotal = document.createElement("div");
  const previousValue = document.createElement("strong");
  const currentValue = document.createElement("strong");
  const deltaValue = document.createElement("span");

  totalsBar.className = "titoli-totals-bar";
  previousTotal.className = "titoli-total-previous";
  currentTotal.className = "titoli-total-current";
  deltaValue.className = "titoli-total-delta value-neutral";

  previousTotal.appendChild(previousValue);
  currentTotal.appendChild(currentValue);
  currentTotal.appendChild(deltaValue);
  totalsBar.appendChild(previousTotal);
  totalsBar.appendChild(currentTotal);

  return totalsBar;
}

function createTitoliAssetRow(asset, dossierId, latestSnapshot, card) {
  const assetRow = document.createElement("div");
  const assetInfo = document.createElement("div");
  const assetName = document.createElement("div");
  const marketInput = document.createElement("input");
  const assetId = getTitoliAssetId(asset);
  const assetLabel = getTitoliAssetName(asset);
  const assetIsin = getTitoliAssetIsin(asset);
  const latestValue = latestSnapshot ? parseTitoliValue(getTitoliSnapshotValue(latestSnapshot)) : 0;

  assetRow.className = "titoli-asset-row";
  assetInfo.className = "titoli-asset-info";
  assetName.className = "titoli-asset-name";
  marketInput.className = "titoli-market-input";
  marketInput.type = "text";
  marketInput.inputMode = "decimal";
  marketInput.placeholder = "0,00";
  marketInput.dataset.assetId = assetId;
  marketInput.dataset.assetName = assetLabel;
  marketInput.dataset.assetIsin = assetIsin.trim().toUpperCase();
  marketInput.dataset.dossierId = dossierId;
  marketInput.setAttribute("aria-label", `Valore di mercato ${assetLabel}`);

  if (latestSnapshot && latestValue !== null) {
    marketInput.value = formatTitoliValue(latestValue);
  }

  marketInput.addEventListener("input", () => updateTotals(card));
  marketInput.addEventListener("blur", () => {
    formatTitoliMarketInput(marketInput);
    updateTotals(card);
  });

  assetName.textContent = assetLabel || "Titolo senza nome";

  assetInfo.appendChild(assetName);
  assetRow.appendChild(assetInfo);
  assetRow.appendChild(marketInput);

  return { initialValue: latestSnapshot ? latestValue ?? 0 : 0, row: assetRow };
}

function normalizeImportHeader(value) {
  return String(value ?? "")
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");
}

function findHeaderRow(rows) {
  for (let index = 0; index < rows.length; index += 1) {
    const cells = (rows[index] ?? []).map(normalizeImportHeader);
    const isinIndex = cells.findIndex((cell) => cell === "isin" || cell.includes("isin"));
    const valueIndex = cells.findIndex((cell) => cell === "valore di mercato" || cell.includes("valore di mercato"));

    if (isinIndex >= 0 && valueIndex >= 0) {
      return { headerIndex: index, isinIndex, valueIndex };
    }
  }

  return null;
}

function handleImportFile(file, card) {
  if (!window.XLSX) {
    alert("Import Excel non disponibile: libreria XLSX non caricata.");
    return;
  }

  const reader = new FileReader();

  reader.addEventListener("load", (event) => {
    try {
      const data = new Uint8Array(event.target.result);
      const workbook = window.XLSX.read(data, { type: "array" });
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];
      const rows = window.XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: "" });
      const headerInfo = findHeaderRow(rows);

      if (!headerInfo) {
        throw new Error("Header non trovato: servono colonne ISIN e Valore di mercato.");
      }

      const { headerIndex, isinIndex, valueIndex } = headerInfo;
      const inputsByIsin = new Map();
      let updatedCount = 0;

      card.querySelectorAll(".titoli-market-input[data-asset-isin]").forEach((input) => {
        const isin = String(input.dataset.assetIsin || "").trim().toUpperCase();
        if (isin) inputsByIsin.set(isin, input);
      });

      for (let rowIndex = headerIndex + 1; rowIndex < rows.length; rowIndex += 1) {
        const row = rows[rowIndex] ?? [];
        const isin = String(row[isinIndex] ?? "").trim().toUpperCase();
        if (!isin) continue;

        const input = inputsByIsin.get(isin);
        if (!input) continue;

        const parsedValue = parseTitoliValue(row[valueIndex]);
        if (parsedValue === null) continue;

        input.value = formatTitoliValue(parsedValue);
        updatedCount += 1;
      }

      updateTotals(card);

      if (updatedCount === 0) {
        alert("Import completato, ma nessun ISIN del file corrisponde ai titoli del dossier.");
      }
    } catch (error) {
      alert(error.message || "Errore durante import Excel.");
    }
  });

  reader.readAsArrayBuffer(file);
}

function bindImportButtons(rootElement) {
  rootElement.querySelectorAll("[data-titoli-import-button]").forEach((button) => {
    if (button.dataset.importBound === "true") return;
    button.dataset.importBound = "true";

    const card = button.closest(".titoli-dossier-card");
    const fileInput = card?.querySelector("[data-titoli-import-input]");
    if (!card || !fileInput) return;

    button.addEventListener("click", () => fileInput.click());
    fileInput.addEventListener("change", () => {
      const file = fileInput.files?.[0];
      if (!file) return;
      handleImportFile(file, card);
      fileInput.value = "";
    });
  });
}

function bindTitoliSavePlaceholders(rootElement) {
  rootElement.querySelectorAll("[data-titoli-save-placeholder]").forEach((button) => {
    if (button.dataset.saveBound === "true") return;
    button.dataset.saveBound = "true";
    button.addEventListener("click", () => {
      if (button.dataset.titoliSavePlaceholder === "all") {
        saveAllTitoliDossiers(button);
        return;
      }

      if (button.dataset.titoliSavePlaceholder !== "all") {
        const card = button.closest(".titoli-dossier-card");
        if (card) {
          saveTitoliDossier(card, button);
          return;
        }
      }

      alert("Salvataggio non ancora implementato");
    });
  });
}

function createTitoliDossierHeader(dossier, dossierIndex, latestSnapshotDates) {
  const header = document.createElement("div");
  const title = document.createElement("h2");
  const actions = document.createElement("div");
  const dossierId = getTitoliDossierId(dossier);
  const latestDate = latestSnapshotDates.get(dossierId)?.formattedDate;

  header.className = "titoli-dossier-header";
  actions.className = "titoli-dossier-actions";
  title.textContent = getTitoliDossierLabel(dossier);

  if (latestDate) {
    const dateElement = document.createElement("span");
    dateElement.className = "titoli-dossier-title-date";
    dateElement.textContent = ` (${latestDate})`;
    title.appendChild(dateElement);
  }

  if (getTitoliDossierImportEnabled(dossier)) {
    const importInput = document.createElement("input");
    const importButton = document.createElement("button");

    importInput.className = "titoli-import-input";
    importInput.type = "file";
    importInput.accept = ".xls,.xlsx";
    importInput.dataset.titoliImportInput = String(dossierIndex);
    importButton.className = "titoli-action-button titoli-import-button";
    importButton.type = "button";
    importButton.textContent = "Import";
    importButton.dataset.titoliImportButton = String(dossierIndex);

    actions.appendChild(importInput);
    actions.appendChild(importButton);
  }

  header.appendChild(title);
  header.appendChild(actions);

  return header;
}

function renderTitoliInsertCards(dossiers, assets, snapshots) {
  const activeDossiers = dossiers.filter(isTitoliDossierActive).sort(sortTitoliDossiers);
  const activeAssets = assets.filter(isTitoliAssetActive).sort(sortTitoliAssets);
  const latestSnapshots = buildLatestTitoliSnapshots(snapshots);
  const latestSnapshotDates = buildLatestTitoliSnapshotDates(snapshots);
  const assetsByDossier = new Map();

  activeAssets.forEach((asset) => {
    const dossierId = getTitoliAssetDossierId(asset);
    if (!assetsByDossier.has(dossierId)) {
      assetsByDossier.set(dossierId, []);
    }
    assetsByDossier.get(dossierId).push(asset);
  });

  titoliInsertRoot.textContent = "";

  if (!activeDossiers.length) {
    renderTitoliInsertState("empty-state", "Nessun dossier attivo trovato.");
    return;
  }

  const mainLayout = document.createElement("div");
  const leftColumn = document.createElement("div");
  const rightColumn = document.createElement("div");
  const bottomLayout = document.createElement("div");
  const saveAllContainer = document.createElement("div");
  const saveAllButton = document.createElement("button");

  mainLayout.className = "titoli-main-layout";
  leftColumn.className = "titoli-col-left";
  rightColumn.className = "titoli-col-right";
  bottomLayout.className = "titoli-bottom-layout";
  saveAllContainer.className = "titoli-save-all-container";
  saveAllButton.className = "titoli-action-button";
  saveAllButton.type = "button";
  saveAllButton.textContent = "Salva tutto";
  saveAllButton.dataset.titoliSavePlaceholder = "all";

  activeDossiers.forEach((dossier, dossierIndex) => {
    const dossierId = getTitoliDossierId(dossier);
    const dossierAssets = assetsByDossier.get(dossierId) ?? [];
    const card = document.createElement("article");
    const body = document.createElement("div");
    const list = document.createElement("div");
    const totalsBar = createTitoliTotalsBar();
    const saveRow = document.createElement("div");
    const saveButton = document.createElement("button");
    let initialTotal = 0;

    card.className = "titoli-dossier-card";
    card.dataset.dossierIndex = String(dossierIndex);
    card.dataset.dossierId = dossierId;
    body.className = "titoli-dossier-body";
    body.classList.toggle("two-columns", dossierIndex === 0 || dossierIndex === 1);
    list.className = "titoli-assets-list";
    saveRow.className = "titoli-save-row";
    saveButton.className = "titoli-action-button";
    saveButton.type = "button";
    saveButton.textContent = "Salva";
    saveButton.dataset.titoliSavePlaceholder = dossierId;

    card.appendChild(createTitoliDossierHeader(dossier, dossierIndex, latestSnapshotDates));

    if (dossierAssets.length) {
      dossierAssets.forEach((asset) => {
        const latestSnapshot = findLatestTitoliSnapshot(asset, dossierId, latestSnapshots);
        const { initialValue, row } = createTitoliAssetRow(asset, dossierId, latestSnapshot, card);
        initialTotal += initialValue;
        list.appendChild(row);
      });
    } else {
      const emptyRow = document.createElement("div");
      emptyRow.className = "titoli-empty-row";
      emptyRow.textContent = "Nessun titolo attivo per questo dossier.";
      list.appendChild(emptyRow);
    }

    card.dataset.initialTotal = String(initialTotal);
    body.appendChild(list);
    body.appendChild(totalsBar);
    saveRow.appendChild(saveButton);
    body.appendChild(saveRow);
    card.appendChild(body);

    if (dossierIndex === 0) {
      leftColumn.appendChild(card);
    } else if (dossierIndex === 1) {
      rightColumn.appendChild(card);
    } else {
      bottomLayout.appendChild(card);
    }

    updateTotals(card);
  });

  rightColumn.appendChild(bottomLayout);
  mainLayout.appendChild(leftColumn);
  mainLayout.appendChild(rightColumn);
  titoliInsertRoot.appendChild(mainLayout);
  saveAllContainer.appendChild(saveAllButton);
  titoliInsertRoot.appendChild(saveAllContainer);
  bindImportButtons(titoliInsertRoot);
  bindTitoliSavePlaceholders(titoliInsertRoot);
}

async function loadTitoliInsertReadOnly() {
  if (!supabaseClient) {
    renderTitoliInsertState("error-state", "Credenziali Supabase mancanti.");
    return;
  }

  renderTitoliInsertState("loading-state", "Caricamento titoli...", true);

  try {
    const [dossiersResult, assetsResult, snapshotsResult] = await Promise.all([
      supabaseClient.from("dossiers").select("*"),
      supabaseClient.from("portfolio_assets").select("*"),
      supabaseClient.from("portfolio_snapshots").select("*"),
    ]);

    if (dossiersResult.error) {
      renderTitoliInsertState("error-state", `Errore lettura dossier: ${dossiersResult.error.message}`);
      return;
    }

    if (assetsResult.error) {
      renderTitoliInsertState("error-state", `Errore lettura titoli: ${assetsResult.error.message}`);
      return;
    }

    if (snapshotsResult.error) {
      renderTitoliInsertState("error-state", `Errore lettura snapshot titoli: ${snapshotsResult.error.message}`);
      return;
    }

    renderTitoliInsertCards(dossiersResult.data ?? [], assetsResult.data ?? [], snapshotsResult.data ?? []);
  } catch (error) {
    renderTitoliInsertState("error-state", `Errore lettura titoli: ${error.message}`);
  }
}

function initTitoliInsertPage() {
  titoliSelectedDate = new Date();
  renderTitoliWeekPicker();
  loadTitoliInsertReadOnly();
}

function setTitoliChartState(message, type = "info") {
  if (!titoliChartStateElement) return;

  titoliChartStateElement.textContent = message || "";
  titoliChartStateElement.className = `dashboard-chart-state ${message ? "is-visible" : ""} ${type ? `is-${type}` : ""}`;
}

function syncTitoliModeButtons() {
  if (!titoliChartToggle) return;

  titoliChartToggle.querySelectorAll("[data-titoli-mode]").forEach((button) => {
    button.classList.toggle("is-active", button.dataset.titoliMode === titoliState.mode);
  });
}

function syncTitoliSeriesPanel() {
  if (titoliSeriesPanel) {
    titoliSeriesPanel.classList.toggle("is-hidden", !titoliState.seriesPanelOpen);
    titoliSeriesPanel.setAttribute("aria-hidden", titoliState.seriesPanelOpen ? "false" : "true");
  }

  if (titoliSeriesToggleButton) {
    titoliSeriesToggleButton.classList.toggle("is-active", titoliState.seriesPanelOpen);
    titoliSeriesToggleButton.setAttribute("aria-expanded", titoliState.seriesPanelOpen ? "true" : "false");
  }
}

function syncTitoliPageControls() {
  syncTitoliModeButtons();
  syncTitoliSeriesPanel();

  const availableSeries = getVisibleTitoliSeries().length;
  const minDate = titoliState.chartMeta?.minDate || titoliState.normalized?.minDate || "";
  const maxDate = titoliState.chartMeta?.maxDate || titoliState.normalized?.maxDate || "";
  const rangeLabel = minDate && maxDate ? `${formatTitoliDisplayDate(minDate)} - ${formatTitoliDisplayDate(maxDate)}` : "—";

  if (titoliChartSubtitle) titoliChartSubtitle.textContent = `${availableSeries || 0} serie selezionate · ${rangeLabel}`;
  if (titoliChartRangeElement) {
    const pointCount = titoliState.chartMeta?.pointCount || 0;
    titoliChartRangeElement.textContent = availableSeries ? `${availableSeries} linee · ${pointCount} punti` : "— linee · — punti";
  }
  if (titoliChartPresetSelect) {
    const wantedPreset = titoliState.range.preset || "last3";
    const hasPreset = Array.from(titoliChartPresetSelect.options || []).some((option) => option.value === wantedPreset);
    titoliChartPresetSelect.value = hasPreset ? wantedPreset : "all";
  }
  if (titoliChartFromInput) titoliChartFromInput.value = titoliState.range.start ? titoliState.range.start.slice(0, 7) : "";
  if (titoliChartToInput) titoliChartToInput.value = titoliState.range.end ? titoliState.range.end.slice(0, 7) : "";
  if (titoliSeriesSearchInput) titoliSeriesSearchInput.value = titoliState.seriesSearch || "";
  if (titoliSeriesList && !titoliSeriesList.children.length) {
    titoliSeriesList.innerHTML = '<div class="dossier-series-empty">Nessuna serie caricata.</div>';
  }
}

function normalizeTitoliId(value) {
  return String(value || "").trim().toUpperCase();
}

function getTitoliBasisDate(event) {
  return normalizeDashboardISODate(getFirstDefined(event, ["effective_date", "date", "data"], ""));
}

function getTitoliBasisDossierId(event) {
  return normalizeTitoliId(getFirstDefined(event, ["dossier_id", "account_id", "dossier", "account"], ""));
}

function getTitoliBasisIsin(event) {
  return normalizeTitoliId(getFirstDefined(event, ["isin"], ""));
}

function getTitoliBasisAmount(event) {
  return parseTitoliValue(getFirstDefined(event, ["cost_basis", "amount", "value", "importo", "market_value"], null));
}

function getTitoliSeriesKey(dossierId, isin) {
  return `${normalizeTitoliId(dossierId)}|${normalizeTitoliId(isin)}`;
}

function formatTitoliDisplayDate(value) {
  const normalized = normalizeDashboardISODate(value);
  return normalized ? formatDashboardDate(normalized) : "—";
}

function formatTitoliEuroDisplay(value, signed = false) {
  const number = Number(value);
  if (!Number.isFinite(number)) return "—";

  const formatted = new Intl.NumberFormat("it-IT", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    useGrouping: true,
  }).format(Math.abs(number));

  if (!signed) return `${formatted} €`;
  if (number === 0) return `0,00 €`;
  return `${number > 0 ? "+" : "-"}${formatted} €`;
}

function formatTitoliPercentDisplay(value) {
  const number = Number(value);
  if (!Number.isFinite(number)) return "—";

  const formatted = new Intl.NumberFormat("it-IT", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Math.abs(number));

  if (number === 0) return "0,00%";
  return `${number > 0 ? "+" : "-"}${formatted}%`;
}

function getTitoliValueClass(value) {
  const number = Number(value);
  if (!Number.isFinite(number) || number === 0) return "value-neutral";
  return number > 0 ? "value-positive" : "value-negative";
}

function formatTitoliPercentAxis(value) {
  return formatDashboardPctAxis(value);
}

function formatTitoliPercentTooltip(value) {
  return formatDashboardPctValue(value);
}

function escapeTitoliHtml(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function getTitoliMonthName(dateIso) {
  const date = parseDashboardISODate(dateIso);
  if (!date) return "";
  const label = date.toLocaleDateString("it-IT", { month: "long", year: "numeric" });
  return label.charAt(0).toUpperCase() + label.slice(1);
}

function buildTitoliBasisMap(basisEvents) {
  const basisMap = new Map();

  (basisEvents || []).forEach((event) => {
    const dateIso = getTitoliBasisDate(event);
    const dossierId = getTitoliBasisDossierId(event);
    const isin = getTitoliBasisIsin(event);
    const amount = getTitoliBasisAmount(event);
    if (!dateIso || !dossierId || !isin || amount === null) return;

    const key = getTitoliSeriesKey(dossierId, isin);
    if (!basisMap.has(key)) basisMap.set(key, []);
    basisMap.get(key).push({ dateIso, amount });
  });

  basisMap.forEach((events) => {
    events.sort((first, second) => first.dateIso.localeCompare(second.dateIso));
  });

  return basisMap;
}

function computeTitoliBasisAtDate(basisMap, seriesKey, snapshotDate) {
  const events = basisMap.get(seriesKey) || [];
  let basis = null;

  events.forEach((event) => {
    if (event.dateIso <= snapshotDate) basis = event.amount;
  });

  return basis;
}

function normalizeTitoliData({ dossiers, assets, snapshots, basisEvents, basisAvailable }) {
  const activeDossiers = (dossiers || [])
    .filter(isTitoliDossierActive)
    .sort(sortTitoliDossiers)
    .map((dossier) => ({
      id: normalizeTitoliId(getTitoliDossierId(dossier)),
      label: getTitoliDossierLabel(dossier),
      order: getTitoliDossierOrder(dossier),
      raw: dossier,
    }))
    .filter((dossier) => dossier.id);

  const dossierById = new Map(activeDossiers.map((dossier) => [dossier.id, dossier]));
  const assetMetaByKey = new Map();

  (assets || []).forEach((asset) => {
    const dossierId = normalizeTitoliId(getTitoliAssetDossierId(asset));
    const isin = normalizeTitoliId(getTitoliAssetIsin(asset));
    if (!dossierId || !isin) return;

    assetMetaByKey.set(getTitoliSeriesKey(dossierId, isin), {
      name: getTitoliAssetName(asset),
      isClosed: getFirstDefined(asset, ["is_closed"], false) === true,
      visible: getFirstDefined(asset, ["visible"], true) !== false,
    });
  });

  const basisMap = buildTitoliBasisMap(basisEvents);
  const seriesByKey = new Map();
  let minDate = "";
  let maxDate = "";

  (snapshots || []).forEach((snapshot) => {
    const dateIso = normalizeDashboardISODate(getTitoliSnapshotDate(snapshot));
    const dossierId = normalizeTitoliId(getTitoliSnapshotDossierId(snapshot));
    const isin = normalizeTitoliId(getTitoliSnapshotIsin(snapshot));
    const value = parseTitoliValue(getTitoliSnapshotValue(snapshot));
    if (!dateIso || !dossierId || !isin || value === null) return;
    if (dossierById.size && !dossierById.has(dossierId)) return;

    const key = getTitoliSeriesKey(dossierId, isin);
    const assetMeta = assetMetaByKey.get(key);
    const snapshotName = String(getFirstDefined(snapshot, ["asset_name", "name", "titolo"], "") || "").trim();
    const name = snapshotName || assetMeta?.name || isin;

    if (!seriesByKey.has(key)) {
      seriesByKey.set(key, {
        key,
        dossierId,
        dossierLabel: dossierById.get(dossierId)?.label || dossierId,
        isin,
        name,
        rows: [],
        visible: assetMeta ? assetMeta.visible : true,
        isClosed: assetMeta?.isClosed === true,
      });
    }

    const series = seriesByKey.get(key);
    if (snapshotName) series.name = snapshotName;
    series.rows.push({ dateIso, value });

    minDate = !minDate || dateIso < minDate ? dateIso : minDate;
    maxDate = !maxDate || dateIso > maxDate ? dateIso : maxDate;
  });

  const allSeries = Array.from(seriesByKey.values())
    .map((series) => {
      series.rows.sort((first, second) => first.dateIso.localeCompare(second.dateIso));
      let previousValue = null;
      let previousBasis = null;

      series.rows = series.rows.map((row) => {
        const basis = computeTitoliBasisAtDate(basisMap, series.key, row.dateIso);
        const deltaBasis = Number.isFinite(basis) ? row.value - basis : NaN;
        const pctBasis = Number.isFinite(basis) && basis > 0 ? (deltaBasis / basis) * 100 : NaN;
        const deltaPrev = Number.isFinite(previousValue) ? row.value - previousValue : NaN;
        const basisChanged = Number.isFinite(previousBasis) && Number.isFinite(basis) && basis !== previousBasis;
        previousValue = row.value;
        previousBasis = basis;

        return {
          ...row,
          costBasis: Number.isFinite(basis) ? basis : NaN,
          deltaBasis,
          pctBasis,
          pct: pctBasis,
          deltaPrev,
          basisChanged,
        };
      });

      return series;
    })
    .sort((first, second) => {
      const dossierDiff = (dossierById.get(first.dossierId)?.order ?? Number.MAX_SAFE_INTEGER) - (dossierById.get(second.dossierId)?.order ?? Number.MAX_SAFE_INTEGER);
      if (dossierDiff !== 0) return dossierDiff;
      return first.name.localeCompare(second.name, "it");
    });

  const seriesByDossier = new Map();
  allSeries.forEach((series) => {
    if (!seriesByDossier.has(series.dossierId)) seriesByDossier.set(series.dossierId, []);
    seriesByDossier.get(series.dossierId).push(series);
  });

  return {
    dossiers: activeDossiers.filter((dossier) => seriesByDossier.has(dossier.id)),
    seriesByDossier,
    allSeries,
    minDate,
    maxDate,
    basisAvailable,
    columns: {
      snapshots: ["snapshot_date/date/data", "dossier_id/account_id", "isin", "asset_name", "market_value/value/total_value"],
      assets: ["dossier_id/account_id", "isin", "asset_name/name", "visible", "is_closed"],
      dossiers: ["account_id/dossier_id/id", "label/name", "order/ordine/sort_order"],
      basis: ["effective_date/date/data", "dossier_id/account_id", "isin", "cost_basis/amount/value/importo"],
    },
  };
}

function getTitoliLatestYearMonth(series) {
  const latest = (series?.rows || []).at(-1);
  const dateIso = latest?.dateIso || titoliState.normalized?.maxDate || "";
  return {
    year: dateIso ? Number(dateIso.slice(0, 4)) : new Date().getFullYear(),
    month: dateIso ? Number(dateIso.slice(5, 7)) : new Date().getMonth() + 1,
  };
}

function filterTitoliHistoryRows(series, selection) {
  const rowsAsc = series?.rows || [];
  const period = selection.period || "month";
  const year = Number(selection.year);
  const month = Number(selection.month);

  return rowsAsc
    .filter((row) => {
      const rowYear = Number(row.dateIso.slice(0, 4));
      const rowMonth = Number(row.dateIso.slice(5, 7));
      const rowMonthIndex = rowYear * 12 + rowMonth;
      const endMonthIndex = year * 12 + month;

      if (period === "year") return rowYear === year;
      if (period === "last3") return rowMonthIndex <= endMonthIndex && rowMonthIndex > endMonthIndex - 3;
      if (period === "last6") return rowMonthIndex <= endMonthIndex && rowMonthIndex > endMonthIndex - 6;
      if (period === "last12") return rowMonthIndex <= endMonthIndex && rowMonthIndex > endMonthIndex - 12;
      return rowYear === year && rowMonth === month;
    })
    .slice()
    .reverse();
}

function getTitoliChartBounds() {
  const dates = [];
  (titoliState.normalized?.allSeries || []).forEach((series) => {
    (series.rows || []).forEach((row) => {
      if (Number.isFinite(row.pct)) dates.push(row.dateIso);
    });
  });

  dates.sort();
  return dates.length ? { min: dates[0], max: dates.at(-1) } : null;
}

function getTitoliMonthStart(monthValue) {
  return monthValue ? `${monthValue}-01` : "";
}

function getTitoliMonthEnd(monthValue) {
  if (!monthValue) return "";
  const date = parseDashboardISODate(`${monthValue}-01`);
  if (!date) return "";
  return formatTitoliDateValue(new Date(date.getFullYear(), date.getMonth() + 1, 0));
}

function shiftTitoliMonth(dateIso, offset) {
  const date = parseDashboardISODate(dateIso);
  if (!date) return "";
  return formatTitoliDateValue(new Date(date.getFullYear(), date.getMonth() + offset, 1));
}

function setTitoliChartRange(start, end, preset = "custom") {
  titoliState.range = { start: start || "", end: end || "", preset };
  syncTitoliPageControls();
}

function applyTitoliChartPreset(preset = "last3") {
  const bounds = getTitoliChartBounds();
  if (!bounds) {
    titoliState.range.preset = preset;
    syncTitoliPageControls();
    refreshTitoliChart();
    return;
  }

  let start = bounds.min;
  const end = bounds.max;

  if (preset === "last3") start = shiftTitoliMonth(end, -2);
  else if (preset === "last6") start = shiftTitoliMonth(end, -5);
  else if (preset === "last12") start = shiftTitoliMonth(end, -11);
  else if (preset === "all") start = bounds.min;

  setTitoliChartRange(start, end, preset);
  refreshTitoliChart();
}

function getTitoliChartRange() {
  const bounds = getTitoliChartBounds();
  if (!bounds) return { start: "", end: "" };

  return {
    start: titoliState.range.start || bounds.min,
    end: titoliState.range.end || bounds.max,
  };
}

function getVisibleTitoliSeries() {
  const allSeries = titoliState.normalized?.allSeries || [];
  return allSeries.filter((series) => titoliState.seriesVisibility[series.key] !== false);
}

function syncTitoliSeriesVisibility() {
  const next = {};
  (titoliState.normalized?.allSeries || []).forEach((series) => {
    next[series.key] = titoliState.seriesVisibility[series.key] !== false;
  });
  titoliState.seriesVisibility = next;
}

function buildTitoliChartPoints(series) {
  const { start, end } = getTitoliChartRange();
  const filteredRows = (series.rows || [])
    .filter((row) => Number.isFinite(row.pct))
    .filter((row) => (!start || row.dateIso >= start) && (!end || row.dateIso <= end));

  if (titoliState.mode === "year") {
    const byYear = new Map();
    filteredRows.forEach((row) => {
      const year = row.dateIso.slice(0, 4);
      const current = byYear.get(year);
      if (!current || row.dateIso > current.dateIso) byYear.set(year, row);
    });
    return Array.from(byYear.entries())
      .sort((first, second) => first[0].localeCompare(second[0]))
      .map(([year, row]) => ({ ...row, labelKey: year }));
  }

  return filteredRows.map((row) => ({ ...row, labelKey: row.dateIso }));
}

function buildTitoliChartModel() {
  const labelsSet = new Set();
  const seriesModels = [];
  const visibleSeries = getVisibleTitoliSeries();
  let minDate = "";
  let maxDate = "";
  let pointCount = 0;

  visibleSeries.forEach((series) => {
    const points = buildTitoliChartPoints(series);
    if (!points.length) return;

    const pointByLabel = new Map();
    points.forEach((point) => {
      labelsSet.add(point.labelKey);
      pointByLabel.set(point.labelKey, point);
      pointCount += 1;
      minDate = !minDate || point.dateIso < minDate ? point.dateIso : minDate;
      maxDate = !maxDate || point.dateIso > maxDate ? point.dateIso : maxDate;
    });

    seriesModels.push({
      key: series.key,
      name: series.name || series.isin,
      dossierLabel: series.dossierLabel,
      pointByLabel,
    });
  });

  const labels = Array.from(labelsSet).sort((first, second) => first.localeCompare(second));
  const chartSeries = seriesModels.map((series) => ({
    key: series.key,
    name: series.name,
    dossierLabel: series.dossierLabel,
    values: labels.map((label) => {
      const point = series.pointByLabel.get(label);
      return point ? point.pct : null;
    }),
    meta: labels.map((label) => series.pointByLabel.get(label) || null),
    lineWidth: 2,
    spanGaps: false,
  }));

  return { labels, series: chartSeries, minDate, maxDate, pointCount };
}

function clearTitoliChart() {
  if (titoliChart) {
    titoliChart.destroy();
    titoliChart = null;
  }

  if (titoliChartCanvas) {
    const context = titoliChartCanvas.getContext("2d");
    if (context) context.clearRect(0, 0, titoliChartCanvas.width, titoliChartCanvas.height);
  }
}

function refreshTitoliChart() {
  if (!titoliChartCanvas) return;

  const model = buildTitoliChartModel();
  titoliState.chartMeta = {
    minDate: model.minDate,
    maxDate: model.maxDate,
    pointCount: model.pointCount,
  };

  syncTitoliPageControls();

  if (!model.labels.length || !model.series.length || !model.series.some((series) => series.values.some((value) => Number.isFinite(value)))) {
    clearTitoliChart();
    setTitoliChartState("Nessuna serie graficabile per il periodo selezionato.", "empty");
    return;
  }

  const allValues = model.series.flatMap((series) => series.values).filter((value) => Number.isFinite(value));
  const yRange = computeDossierChartRange(allValues);
  const singleSeries = model.series.length === 1;
  clearTitoliChart();
  setTitoliChartState("");

  titoliChart = new DashboardMiniLookerChart({
    canvas: titoliChartCanvas,
    legendEl: null,
    labels: model.labels,
    series: model.series.map((series) => ({
      ...series,
      fillColor: singleSeries ? "rgba(79,125,243,0.18)" : "transparent",
    })),
    yFormat: formatTitoliPercentTooltip,
    yAxisFormat: formatTitoliPercentAxis,
    yTickStep: yRange?.step || calcDashboardPctStep(allValues),
    yTickMax: 6,
    yMin: yRange?.min ?? null,
    yMax: yRange?.max ?? null,
    xLabelFormat: (label) => titoliState.mode === "year" ? String(label) : formatDashboardMonthYearFromISOShort(label),
    xTooltipFormat: (label) => titoliState.mode === "year" ? `Anno ${label}` : formatDashboardDateLongFromISO(label),
    tooltipExtra: (index, context) => {
      const meta = context?.series?.meta?.[index] || null;
      if (!meta) return [];
      return [
        `Dossier: ${context.series.dossierLabel || "—"}`,
        `Totale: ${formatTitoliEuroDisplay(meta.value)}`,
        `Carico: ${formatTitoliEuroDisplay(meta.costBasis)}`,
      ];
    },
    tooltipMode: "nearestSeries",
    fill: singleSeries,
    pointRadius: 0,
    pointHoverRadius: 4,
    yZeroLine: { value: 0, color: "rgba(55,65,81,0.35)", width: 1, dash: [4, 4] },
    xLabelWidth: 80,
  });

  titoliChartCanvas.classList.remove("chart-fade");
  void titoliChartCanvas.offsetWidth;
  titoliChartCanvas.classList.add("chart-fade");
}

function renderTitoliHistoryTable(tbody, rows) {
  if (!tbody) return;
  tbody.textContent = "";

  if (!rows.length) {
    const row = document.createElement("tr");
    const cell = document.createElement("td");
    cell.colSpan = 6;
    cell.className = "titoli-history-empty";
    cell.textContent = "Nessun dato disponibile.";
    row.appendChild(cell);
    tbody.appendChild(row);
    return;
  }

  let lastMonth = "";
  rows.forEach((item) => {
    const monthKey = item.dateIso.slice(0, 7);
    if (monthKey !== lastMonth) {
      const dividerRow = document.createElement("tr");
      const dividerCell = document.createElement("td");
      dividerRow.className = "dossier-month-divider-row";
      dividerCell.colSpan = 6;
      dividerCell.textContent = getTitoliMonthName(item.dateIso);
      dividerRow.appendChild(dividerCell);
      tbody.appendChild(dividerRow);
      lastMonth = monthKey;
    }

    const row = document.createElement("tr");
    row.classList.toggle("dossier-basis-change-row", item.basisChanged);
    const cells = [
      { value: formatTitoliDisplayDate(item.dateIso) },
      { value: formatTitoliEuroDisplay(item.costBasis), numeric: true },
      { value: formatTitoliEuroDisplay(item.value), numeric: true },
      { value: formatTitoliEuroDisplay(item.deltaBasis, true), numeric: true, className: getTitoliValueClass(item.deltaBasis) },
      { value: formatTitoliPercentDisplay(item.pctBasis), numeric: true, className: getTitoliValueClass(item.pctBasis) },
      { value: formatTitoliEuroDisplay(item.deltaPrev, true), numeric: true, className: getTitoliValueClass(item.deltaPrev) },
    ];

    cells.forEach((cellInfo) => {
      const cell = document.createElement("td");
      if (cellInfo.numeric) cell.classList.add("num");
      if (cellInfo.className) cell.classList.add(cellInfo.className);
      cell.textContent = cellInfo.value;
      row.appendChild(cell);
    });

    tbody.appendChild(row);
  });
}

function renderTitoliHistoryCard(card, dossier, seriesList) {
  if (!card) return;

  const safeSeriesList = seriesList || [];
  const defaultSeries = safeSeriesList[0] || null;
  const currentSelection = titoliState.historySelections[dossier.id] || {};
  const selectedSeries = safeSeriesList.find((series) => series.key === currentSelection.seriesKey) || defaultSeries;
  const latest = getTitoliLatestYearMonth(selectedSeries);
  const selection = {
    seriesKey: selectedSeries?.key || "",
    period: currentSelection.period || "month",
    year: Number(currentSelection.year) || latest.year,
    month: Number(currentSelection.month) || latest.month,
  };
  titoliState.historySelections[dossier.id] = selection;

  card.dataset.dossierId = dossier.id;
  const safeDossierLabel = escapeTitoliHtml(dossier.label);
  card.innerHTML = `
    <div class="titoli-history-title"></div>
    <div class="titoli-history-toolbar">
      <div class="titoli-history-filters">
        <select class="chart-input" data-titoli-history-period aria-label="Periodo ${safeDossierLabel}">
          <option value="month">Mese</option>
          <option value="last3">Ultimi 3 mesi</option>
          <option value="last6">Ultimi 6 mesi</option>
          <option value="last12">Ultimi 12 mesi</option>
          <option value="year">Anno intero</option>
        </select>
        <select class="chart-input" data-titoli-history-year aria-label="Anno ${safeDossierLabel}"></select>
        <select class="chart-input" data-titoli-history-month aria-label="Mese ${safeDossierLabel}"></select>
      </div>
      <select class="chart-input titoli-history-title-select" data-titoli-history-series aria-label="Titolo ${safeDossierLabel}"></select>
    </div>
    <div class="dossier-table-wrap titoli-history-table-wrap">
      <table class="transactions-table dossier-table titoli-history-table">
        <thead>
          <tr>
            <th>Data</th>
            <th class="num">Carico</th>
            <th class="num">Totale</th>
            <th class="num">Δ vs Carico</th>
            <th class="num">% vs Carico</th>
            <th class="num">Δ vs Prec</th>
          </tr>
        </thead>
        <tbody></tbody>
      </table>
    </div>
  `;

  const titleElement = card.querySelector(".titoli-history-title");
  const periodSelect = card.querySelector("[data-titoli-history-period]");
  const yearSelect = card.querySelector("[data-titoli-history-year]");
  const monthSelect = card.querySelector("[data-titoli-history-month]");
  const seriesSelect = card.querySelector("[data-titoli-history-series]");
  const tbody = card.querySelector("tbody");

  if (titleElement) titleElement.textContent = dossier.label;

  if (seriesSelect) {
    seriesSelect.innerHTML = safeSeriesList.length
      ? safeSeriesList.map((series) => `<option value="${escapeTitoliHtml(series.key)}">${escapeTitoliHtml(series.name || series.isin)}</option>`).join("")
      : '<option value="">Titolo</option>';
    seriesSelect.value = selection.seriesKey;
  }

  const years = Array.from(new Set((selectedSeries?.rows || []).map((row) => Number(row.dateIso.slice(0, 4)))))
    .filter((year) => Number.isFinite(year))
    .sort((first, second) => second - first);
  if (yearSelect) {
    const finalYears = years.length ? years : [selection.year];
    yearSelect.innerHTML = finalYears.map((year) => `<option value="${year}">${year}</option>`).join("");
    yearSelect.value = String(selection.year);
  }

  const monthNames = ["Gennaio", "Febbraio", "Marzo", "Aprile", "Maggio", "Giugno", "Luglio", "Agosto", "Settembre", "Ottobre", "Novembre", "Dicembre"];
  if (monthSelect) {
    monthSelect.innerHTML = monthNames.map((name, index) => `<option value="${index + 1}">${name}</option>`).join("");
    monthSelect.value = String(selection.month);
    monthSelect.disabled = selection.period === "year";
  }

  if (periodSelect) periodSelect.value = selection.period;
  renderTitoliHistoryTable(tbody, selectedSeries ? filterTitoliHistoryRows(selectedSeries, selection) : []);

  const rerender = () => renderTitoliHistoryCards();
  if (seriesSelect) {
    seriesSelect.addEventListener("change", () => {
      const nextSeries = safeSeriesList.find((series) => series.key === seriesSelect.value) || defaultSeries;
      const latestNext = getTitoliLatestYearMonth(nextSeries);
      titoliState.historySelections[dossier.id] = {
        ...selection,
        seriesKey: seriesSelect.value,
        year: latestNext.year,
        month: latestNext.month,
      };
      rerender();
    });
  }
  if (periodSelect) {
    periodSelect.addEventListener("change", () => {
      titoliState.historySelections[dossier.id] = { ...selection, period: periodSelect.value || "month" };
      rerender();
    });
  }
  if (yearSelect) {
    yearSelect.addEventListener("change", () => {
      titoliState.historySelections[dossier.id] = { ...selection, year: Number(yearSelect.value) || selection.year };
      rerender();
    });
  }
  if (monthSelect) {
    monthSelect.addEventListener("change", () => {
      titoliState.historySelections[dossier.id] = { ...selection, month: Number(monthSelect.value) || selection.month };
      rerender();
    });
  }
}

function renderTitoliEmptyHistoryCard(card, label = "Titoli") {
  if (!card) return;
  const title = card.querySelector(".titoli-history-title");
  const tbody = card.querySelector("tbody");
  if (title) title.textContent = label;
  renderTitoliHistoryTable(tbody, []);
}

function renderTitoliHistoryCards() {
  const cards = Array.from(titoliPageRoot?.querySelectorAll(".titoli-history-card") || []);
  const dossiers = titoliState.normalized?.dossiers || [];

  cards.forEach((card, index) => {
    const dossier = dossiers[index];
    if (!dossier) {
      renderTitoliEmptyHistoryCard(card, card.querySelector(".titoli-history-title")?.textContent || "Titoli");
      return;
    }

    renderTitoliHistoryCard(card, dossier, titoliState.normalized.seriesByDossier.get(dossier.id) || []);
  });
}

function renderTitoliSeriesPanelList() {
  if (!titoliSeriesList) return;
  const query = String(titoliState.seriesSearch || "").trim().toLowerCase();
  const series = (titoliState.normalized?.allSeries || []).filter((item) => {
    if (!query) return true;
    return `${item.name} ${item.isin} ${item.dossierLabel}`.toLowerCase().includes(query);
  });

  if (!series.length) {
    titoliSeriesList.innerHTML = '<div class="dossier-series-empty">Nessuna serie trovata.</div>';
    return;
  }

  titoliSeriesList.innerHTML = series.map((item) => `
    <div class="dossier-series-row">
      <label class="dossier-series-option">
        <input type="checkbox" data-titoli-series-check="${escapeTitoliHtml(item.key)}" ${titoliState.seriesVisibility[item.key] !== false ? "checked" : ""}>
        <span class="dossier-series-name">${escapeTitoliHtml(item.name || item.isin)}</span>
      </label>
      <span class="titoli-series-dossier">${escapeTitoliHtml(item.dossierLabel)}</span>
      <button type="button" class="dossier-series-solo" data-titoli-series-solo="${escapeTitoliHtml(item.key)}">SOLO</button>
    </div>
  `).join("");
}

function renderTitoliData() {
  syncTitoliSeriesVisibility();
  applyTitoliChartPreset(titoliState.range.preset || "last3");
  syncTitoliPageControls();
  renderTitoliSeriesPanelList();
  renderTitoliHistoryCards();
  const seriesCount = getVisibleTitoliSeries().length;
  if (titoliSeriesToggleButton) titoliSeriesToggleButton.textContent = `Serie (${seriesCount || 0})`;
}

async function loadTitoliData() {
  if (!supabaseClient) {
    setTitoliChartState("Credenziali Supabase mancanti.", "error");
    return;
  }

  setTitoliChartState("Caricamento titoli...");

  try {
    const [dossiersResult, assetsResult, snapshotsResult] = await Promise.all([
      supabaseClient.from("dossiers").select("*"),
      supabaseClient.from("portfolio_assets").select("*"),
      supabaseClient.from("portfolio_snapshots").select("*"),
    ]);

    if (dossiersResult.error) throw dossiersResult.error;
    if (assetsResult.error) throw assetsResult.error;
    if (snapshotsResult.error) throw snapshotsResult.error;

    let basisEvents = [];
    let basisAvailable = false;
    const basisResult = await supabaseClient.from("portfolio_basis_events").select("*");
    if (basisResult.error) {
      console.warn("[Titoli] portfolio_basis_events non disponibile, continuo senza carichi:", basisResult.error);
    } else {
      basisEvents = basisResult.data ?? [];
      basisAvailable = true;
    }

    titoliState.raw = {
      dossiers: dossiersResult.data ?? [],
      assets: assetsResult.data ?? [],
      snapshots: snapshotsResult.data ?? [],
      basisEvents,
    };
    titoliState.normalized = normalizeTitoliData({
      ...titoliState.raw,
      basisAvailable,
    });

    console.log("[Titoli] colonne usate:", titoliState.normalized.columns);
    console.log("[Titoli] dati letti:", {
      dossiers: titoliState.raw.dossiers.length,
      assets: titoliState.raw.assets.length,
      snapshots: titoliState.raw.snapshots.length,
      basisEvents: titoliState.raw.basisEvents.length,
      basisAvailable,
    });

    renderTitoliData();
  } catch (error) {
    console.error("[Titoli] errore fetch dati:", error);
    setTitoliChartState(`Errore caricamento titoli: ${error.message || error}`, "error");
    if (titoliHistoryStateElement) titoliHistoryStateElement.textContent = "Errore caricamento titoli.";
  }
}

function initTitoliPage() {
  console.log("[Titoli] UI pronta");
  setTitoliChartState("Dati non ancora caricati.", "empty");
  if (titoliHistoryStateElement) titoliHistoryStateElement.textContent = "Dati non ancora caricati.";
  syncTitoliPageControls();

  if (titoliChartPresetSelect) {
    titoliChartPresetSelect.addEventListener("change", () => {
      applyTitoliChartPreset(titoliChartPresetSelect.value || "last3");
      console.log("[Titoli] preset selezionato:", titoliState.range.preset);
    });
  }

  if (titoliChartToggle) {
    titoliChartToggle.addEventListener("click", (event) => {
      const button = event.target.closest("[data-titoli-mode]");
      if (!button) return;
      titoliState.mode = button.dataset.titoliMode === "year" ? "year" : "month";
      console.log("[Titoli] granularita selezionata:", titoliState.mode);
      syncTitoliModeButtons();
      refreshTitoliChart();
    });
  }

  if (titoliChartApplyButton) {
    titoliChartApplyButton.addEventListener("click", () => {
      const start = getTitoliMonthStart(String(titoliChartFromInput?.value || "").trim());
      const end = getTitoliMonthEnd(String(titoliChartToInput?.value || "").trim());
      if (start && end && start > end) {
        console.warn("[Titoli] range custom non valido:", { start, end });
        return;
      }
      setTitoliChartRange(start, end, "custom");
      console.log("[Titoli] range custom:", titoliState.range);
      refreshTitoliChart();
    });
  }

  if (titoliChartCancelButton) {
    titoliChartCancelButton.addEventListener("click", () => {
      applyTitoliChartPreset("last3");
      console.log("[Titoli] range annullato");
    });
  }

  if (titoliSeriesToggleButton) {
    titoliSeriesToggleButton.addEventListener("click", () => {
      titoliState.seriesPanelOpen = !titoliState.seriesPanelOpen;
      syncTitoliSeriesPanel();
    });
  }

  if (titoliSeriesCloseButton) {
    titoliSeriesCloseButton.addEventListener("click", () => {
      titoliState.seriesPanelOpen = false;
      syncTitoliSeriesPanel();
    });
  }

  if (titoliSeriesSearchInput) {
    titoliSeriesSearchInput.addEventListener("input", () => {
      titoliState.seriesSearch = String(titoliSeriesSearchInput.value || "").trim();
      console.log("[Titoli] ricerca serie:", titoliState.seriesSearch);
      renderTitoliSeriesPanelList();
    });
  }

  if (titoliSeriesList) {
    titoliSeriesList.addEventListener("click", (event) => {
      const soloButton = event.target.closest("[data-titoli-series-solo]");
      if (!soloButton) return;

      const soloKey = String(soloButton.dataset.titoliSeriesSolo || "");
      if (!soloKey) return;

      (titoliState.normalized?.allSeries || []).forEach((series) => {
        titoliState.seriesVisibility[series.key] = series.key === soloKey;
      });
      renderTitoliSeriesPanelList();
      refreshTitoliChart();
      if (titoliSeriesToggleButton) titoliSeriesToggleButton.textContent = `Serie (${getVisibleTitoliSeries().length})`;
    });

    titoliSeriesList.addEventListener("change", (event) => {
      const input = event.target.closest("[data-titoli-series-check]");
      if (!input) return;
      const seriesKey = input.dataset.titoliSeriesCheck;
      titoliState.seriesVisibility[seriesKey] = input.checked;
      renderTitoliSeriesPanelList();
      refreshTitoliChart();
      if (titoliSeriesToggleButton) titoliSeriesToggleButton.textContent = `Serie (${getVisibleTitoliSeries().length})`;
    });
  }

  if (titoliSeriesAllButton) {
    titoliSeriesAllButton.addEventListener("click", () => {
      (titoliState.normalized?.allSeries || []).forEach((series) => {
        titoliState.seriesVisibility[series.key] = true;
      });
      renderTitoliSeriesPanelList();
      refreshTitoliChart();
      if (titoliSeriesToggleButton) titoliSeriesToggleButton.textContent = `Serie (${getVisibleTitoliSeries().length})`;
    });
  }

  if (titoliSeriesNoneButton) {
    titoliSeriesNoneButton.addEventListener("click", () => {
      (titoliState.normalized?.allSeries || []).forEach((series) => {
        titoliState.seriesVisibility[series.key] = false;
      });
      renderTitoliSeriesPanelList();
      refreshTitoliChart();
      if (titoliSeriesToggleButton) titoliSeriesToggleButton.textContent = `Serie (${getVisibleTitoliSeries().length})`;
    });
  }

  loadTitoliData();
}

function initDossierPage() {
  console.log("[Dossier] UI pronta");
  loadDossierChartPreferences();
  initDossierChartControls();
  initDossierDetailControls();
  initDossierTotalsControls();
  fetchDossierBaseData();
}

function initDossierChartControls() {
  if (dossierChartPreset) {
    dossierChartPreset.addEventListener("change", () => {
      applyDossierChartPreset(dossierChartPreset.value || "last3");
      persistDossierChartPreferences();
      refreshDossierChart();
    });
  }

  if (dossierChartApplyButton) {
    dossierChartApplyButton.addEventListener("click", () => {
      const start = String(dossierChartFromInput?.value || "").trim();
      const end = String(dossierChartToInput?.value || "").trim();

      if (!isValidDossierChartPeriod(start) || !isValidDossierChartPeriod(end)) {
        console.warn("[Dossier][chart range] Range custom non valido:", { start, end });
        return;
      }

      if (start > end) {
        console.warn("[Dossier][chart range] Range custom non applicato: Da maggiore di A", { start, end });
        return;
      }

      setDossierChartRange(start, end, "custom");
      persistDossierChartPreferences();
      refreshDossierChart();
    });
  }

  if (dossierChartCancelButton) {
    dossierChartCancelButton.addEventListener("click", syncDossierChartRangeInputs);
  }

  if (dossierChartToggle) {
    dossierChartToggle.addEventListener("click", (event) => {
      const button = event.target.closest("[data-dossier-mode]");
      if (!button) return;

      dossierChartState.mode = button.dataset.dossierMode === "year" ? "year" : "month";
      syncDossierChartControls();
      persistDossierChartPreferences();
      refreshDossierChart();
    });
  }

  if (dossierSeriesToggleButton) {
    dossierSeriesToggleButton.addEventListener("click", (event) => {
      event.stopPropagation();
      setDossierSeriesPanelOpen(!dossierChartState.seriesPanelOpen);
    });
  }

  if (dossierSeriesSearchInput) {
    dossierSeriesSearchInput.addEventListener("input", () => {
      dossierChartState.seriesSearch = String(dossierSeriesSearchInput.value || "").trim().toLowerCase();
      renderDossierSeriesList();
    });
  }

  if (dossierSeriesAllButton) {
    dossierSeriesAllButton.addEventListener("click", () => {
      getDossierChartCatalog().forEach((item) => {
        dossierChartState.seriesVisibility[item.id] = true;
      });
      persistDossierChartPreferences();
      renderDossierSeriesList();
      refreshDossierChart();
    });
  }

  if (dossierSeriesNoneButton) {
    dossierSeriesNoneButton.addEventListener("click", () => {
      getDossierChartCatalog().forEach((item) => {
        dossierChartState.seriesVisibility[item.id] = false;
      });
      persistDossierChartPreferences();
      renderDossierSeriesList();
      refreshDossierChart();
    });
  }

  if (dossierSeriesList) {
    dossierSeriesList.addEventListener("click", (event) => {
      const soloButton = event.target.closest("[data-dossier-series-solo]");
      if (soloButton) {
        const soloId = String(soloButton.dataset.dossierSeriesSolo || "");
        if (!soloId) return;

        getDossierChartCatalog().forEach((item) => {
          dossierChartState.seriesVisibility[item.id] = item.id === soloId;
        });
        persistDossierChartPreferences();
        renderDossierSeriesList();
        refreshDossierChart();
        return;
      }
    });

    dossierSeriesList.addEventListener("change", (event) => {
      const checkbox = event.target.closest("[data-dossier-series-check]");
      if (!checkbox) return;

      const id = String(checkbox.dataset.dossierSeriesCheck || "");
      if (!id) return;

      dossierChartState.seriesVisibility[id] = checkbox.checked;
      persistDossierChartPreferences();
      updateDossierSeriesButton();
      renderDossierSeriesList();
      refreshDossierChart();
    });
  }

  document.addEventListener("click", (event) => {
    if (!dossierChartState.seriesPanelOpen || !dossierSeriesPanel || !dossierSeriesToggleButton) return;
    const target = event.target;
    if (dossierSeriesPanel.contains(target) || dossierSeriesToggleButton.contains(target)) return;
    setDossierSeriesPanelOpen(false);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && dossierChartState.seriesPanelOpen) {
      setDossierSeriesPanelOpen(false);
    }
  });

  setDossierSeriesPanelOpen(false);
}

function initDossierDetailControls() {
  [
    dossierDetailPeriodSelect,
    dossierDetailYearSelect,
    dossierDetailMonthSelect,
    dossierDetailDossierSelect,
  ].forEach((control) => {
    if (!control) return;
    control.addEventListener("change", renderDossierDetailTable);
  });
}

function initDossierTotalsControls() {
  [
    dossierTotalsPeriodSelect,
    dossierTotalsYearSelect,
    dossierTotalsMonthSelect,
  ].forEach((control) => {
    if (!control) return;
    control.addEventListener("change", renderDossierTotalsTable);
  });
}

function populateDossierSelect() {
  if (!dossierDetailDossierSelect) return;

  const visibleDossiers = (dossierPageState.dossiers || [])
    .filter((dossier) => dossier.visible !== false)
    .slice()
    .sort((first, second) => {
      const firstOrder = Number(first.order);
      const secondOrder = Number(second.order);
      const orderDiff = (Number.isFinite(firstOrder) ? firstOrder : Number.MAX_SAFE_INTEGER) -
        (Number.isFinite(secondOrder) ? secondOrder : Number.MAX_SAFE_INTEGER);

      if (orderDiff !== 0) return orderDiff;
      return String(first.label || "").localeCompare(String(second.label || ""), "it");
    });

  dossierDetailDossierSelect.textContent = "";

  visibleDossiers.forEach((dossier) => {
    const option = document.createElement("option");
    const label = String(dossier.label || dossier.account_id || "").trim();

    option.value = String(dossier.account_id || "");
    option.textContent = dossier.is_closed === true ? `${label} (CHIUSO)` : label;
    dossierDetailDossierSelect.appendChild(option);
  });

  console.log("[Dossier] dossier visibili caricati:", visibleDossiers);
}

function getDossierSnapshotYears() {
  const years = new Set();

  (dossierPageState.snapshots || []).forEach((snapshot) => {
    const year = String(snapshot.snapshot_date || "").slice(0, 4);
    if (/^\d{4}$/.test(year)) years.add(year);
  });

  return Array.from(years).sort((first, second) => Number(second) - Number(first));
}

function getDossierDefaultMonth(year) {
  const months = new Set();

  (dossierPageState.snapshots || []).forEach((snapshot) => {
    const date = String(snapshot.snapshot_date || "");
    if (date.slice(0, 4) !== String(year)) return;

    const month = date.slice(5, 7);
    if (/^\d{2}$/.test(month)) months.add(month);
  });

  return Array.from(months).sort().at(-1) || "";
}

function populateDossierYearSelect(selectElement, years, defaultYear) {
  if (!selectElement) return;

  selectElement.textContent = "";

  years.forEach((year) => {
    const option = document.createElement("option");
    option.value = year;
    option.textContent = year;
    selectElement.appendChild(option);
  });

  if (defaultYear) selectElement.value = defaultYear;
}

function populateDossierMonthSelect(selectElement, defaultMonth) {
  if (!selectElement) return;

  const monthLabels = [
    "Gennaio",
    "Febbraio",
    "Marzo",
    "Aprile",
    "Maggio",
    "Giugno",
    "Luglio",
    "Agosto",
    "Settembre",
    "Ottobre",
    "Novembre",
    "Dicembre",
  ];

  selectElement.textContent = "";

  monthLabels.forEach((label, index) => {
    const option = document.createElement("option");
    option.value = String(index + 1).padStart(2, "0");
    option.textContent = label;
    selectElement.appendChild(option);
  });

  if (defaultMonth) selectElement.value = defaultMonth;
}

function populateDossierControls() {
  populateDossierSelect();

  const years = getDossierSnapshotYears();
  const defaultYear = years[0] || "";
  const defaultMonth = defaultYear ? getDossierDefaultMonth(defaultYear) : "";

  populateDossierYearSelect(dossierDetailYearSelect, years, defaultYear);
  populateDossierYearSelect(dossierTotalsYearSelect, years, defaultYear);
  populateDossierMonthSelect(dossierDetailMonthSelect, defaultMonth);
  populateDossierMonthSelect(dossierTotalsMonthSelect, defaultMonth);

  console.log("[Dossier] anni trovati:", years);
  console.log("[Dossier] mese default scelto:", defaultMonth || "—");
}

function loadDossierChartPreferences() {
  try {
    const mode = localStorage.getItem("dossier_chart_mode");
    if (mode === "month" || mode === "year") dossierChartState.mode = mode;

    const rangeRaw = localStorage.getItem("dossier_chart_range");
    if (rangeRaw) {
      const parsed = JSON.parse(rangeRaw);
      if (parsed?.from && parsed?.to) {
        dossierChartState.range = {
          start: parsed.from,
          end: parsed.to,
          preset: parsed.preset || "last3",
        };
      }
    }

    const customRangeRaw = localStorage.getItem("dossier_chart_custom_range");
    if (!rangeRaw && customRangeRaw) {
      const parsed = JSON.parse(customRangeRaw);
      if (parsed?.from && parsed?.to) {
        dossierChartState.range = {
          start: parsed.from,
          end: parsed.to,
          preset: "custom",
        };
      }
    }

    const seriesRaw = localStorage.getItem("dossier_chart_series_visibility");
    if (seriesRaw) {
      const parsed = JSON.parse(seriesRaw);
      if (parsed && typeof parsed === "object") {
        dossierChartState.seriesVisibility = parsed;
      }
    }
  } catch (error) {
    console.warn("[Dossier] Impossibile leggere preferenze grafico:", error);
  }
}

function persistDossierChartPreferences() {
  try {
    localStorage.setItem("dossier_chart_mode", dossierChartState.mode || "month");
    localStorage.setItem("dossier_chart_range", JSON.stringify({
      from: dossierChartState.range?.start || "",
      to: dossierChartState.range?.end || "",
      preset: dossierChartState.range?.preset || "last3",
    }));
    if (dossierChartState.range?.preset === "custom") {
      localStorage.setItem("dossier_chart_custom_range", JSON.stringify({
        from: dossierChartState.range?.start || "",
        to: dossierChartState.range?.end || "",
      }));
    }
    localStorage.setItem("dossier_chart_series_visibility", JSON.stringify(dossierChartState.seriesVisibility || {}));
  } catch (error) {
    console.warn("[Dossier] Impossibile salvare preferenze grafico:", error);
  }
}

function setDossierChartState(message, type = "info") {
  if (!dossierChartStateElement) return;

  dossierChartStateElement.textContent = message || "";
  dossierChartStateElement.className = `dashboard-chart-state ${message ? "is-visible" : ""} ${type ? `is-${type}` : ""}`;
}

function getDossierChartCatalog() {
  return (dossierPageState.dossiers || [])
    .filter((dossier) => dossier.visible !== false)
    .map((dossier) => ({
      id: String(dossier.account_id || "").trim().toUpperCase(),
      name: String(dossier.label || dossier.account_id || "").trim(),
      isClosed: dossier.is_closed === true,
      order: Number.isFinite(Number(dossier.order)) ? Number(dossier.order) : 999,
    }))
    .filter((item) => item.id)
    .sort((first, second) => {
      const closedDiff = Number(first.isClosed) - Number(second.isClosed);
      if (closedDiff !== 0) return closedDiff;
      const orderDiff = first.order - second.order;
      if (orderDiff !== 0) return orderDiff;
      return first.name.localeCompare(second.name, "it");
    });
}

function syncDossierChartSeriesVisibility() {
  const catalog = getDossierChartCatalog();
  const knownIds = new Set(catalog.map((item) => item.id));

  catalog.forEach((item) => {
    if (typeof dossierChartState.seriesVisibility[item.id] !== "boolean") {
      dossierChartState.seriesVisibility[item.id] = true;
    }
  });

  Object.keys(dossierChartState.seriesVisibility || {}).forEach((id) => {
    if (!knownIds.has(id)) delete dossierChartState.seriesVisibility[id];
  });
}

function getVisibleDossierChartSeriesIds() {
  return getDossierChartCatalog()
    .filter((item) => dossierChartState.seriesVisibility[item.id] !== false)
    .map((item) => item.id);
}

function updateDossierSeriesButton() {
  if (!dossierSeriesToggleButton) return;

  const count = getVisibleDossierChartSeriesIds().length;
  dossierSeriesToggleButton.textContent = `Serie (${count})`;
}

function setDossierSeriesPanelOpen(isOpen) {
  dossierChartState.seriesPanelOpen = Boolean(isOpen);

  if (dossierSeriesPanel) {
    dossierSeriesPanel.classList.toggle("is-hidden", !dossierChartState.seriesPanelOpen);
    dossierSeriesPanel.classList.toggle("is-open", dossierChartState.seriesPanelOpen);
    dossierSeriesPanel.setAttribute("aria-hidden", dossierChartState.seriesPanelOpen ? "false" : "true");
  }

  if (dossierSeriesToggleButton) {
    dossierSeriesToggleButton.classList.toggle("is-active", dossierChartState.seriesPanelOpen);
    dossierSeriesToggleButton.setAttribute("aria-expanded", dossierChartState.seriesPanelOpen ? "true" : "false");
  }
}

function renderDossierSeriesList() {
  if (!dossierSeriesList) return;

  updateDossierSeriesButton();

  const query = String(dossierChartState.seriesSearch || "").trim().toLowerCase();
  const catalog = getDossierChartCatalog().filter((item) => {
    if (!query) return true;
    return item.name.toLowerCase().includes(query) || item.id.toLowerCase().includes(query);
  });

  dossierSeriesList.textContent = "";

  if (!catalog.length) {
    const empty = document.createElement("div");
    empty.className = "dossier-series-empty";
    empty.textContent = "Nessuna serie trovata.";
    dossierSeriesList.appendChild(empty);
    return;
  }

  catalog.forEach((item) => {
    const row = document.createElement("div");
    const label = document.createElement("label");
    const input = document.createElement("input");
    const name = document.createElement("span");
    const soloButton = document.createElement("button");

    row.className = "dossier-series-row";
    row.classList.toggle("is-closed", item.isClosed);
    label.className = "dossier-series-option";
    input.type = "checkbox";
    input.checked = dossierChartState.seriesVisibility[item.id] !== false;
    input.dataset.dossierSeriesCheck = item.id;
    name.className = "dossier-series-name";
    name.textContent = item.isClosed ? `${item.name} (CHIUSO)` : item.name;
    soloButton.type = "button";
    soloButton.className = "dossier-series-solo";
    soloButton.dataset.dossierSeriesSolo = item.id;
    soloButton.textContent = "Solo";

    label.appendChild(input);
    label.appendChild(name);
    row.appendChild(label);
    row.appendChild(soloButton);
    dossierSeriesList.appendChild(row);
  });
}

function syncDossierChartControls() {
  if (dossierChartPreset) dossierChartPreset.value = dossierChartState.range.preset || "last3";
  if (dossierChartToggle) {
    dossierChartToggle.querySelectorAll("[data-dossier-mode]").forEach((button) => {
      button.classList.toggle("is-active", button.dataset.dossierMode === dossierChartState.mode);
    });
  }
  if (dossierSeriesSearchInput) dossierSeriesSearchInput.value = dossierChartState.seriesSearch || "";
  syncDossierChartRangeInputs();
}

function getDossierChartBounds() {
  const periods = (dossierPageState.snapshots || [])
    .map((snapshot) => parseDossierSnapshotDate(snapshot.snapshot_date).slice(0, 7))
    .filter(Boolean)
    .sort();

  if (!periods.length) return null;
  return {
    min: periods[0],
    max: periods[periods.length - 1],
  };
}

function applyDossierChartPreset(preset = "last3") {
  const bounds = getDossierChartBounds();
  if (!bounds) return;

  let start = bounds.min;
  let end = bounds.max;
  const today = new Date();
  const currentPeriod = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}`;

  if (preset === "last3") {
    start = shiftDashboardPeriod(currentPeriod, -2);
    end = currentPeriod;
  } else if (preset === "last6") {
    start = shiftDashboardPeriod(currentPeriod, -5);
    end = currentPeriod;
  } else if (preset === "last12") {
    start = shiftDashboardPeriod(currentPeriod, -11);
    end = currentPeriod;
  }

  setDossierChartRange(start, end, preset);
}

function isValidDossierChartPeriod(period) {
  return /^\d{4}-\d{2}$/.test(String(period || ""));
}

function setDossierChartRange(start, end, preset = "custom") {
  const normalizedStart = String(start || "").trim();
  const normalizedEnd = String(end || "").trim();

  if (!normalizedStart || !normalizedEnd) return;

  dossierChartState.range = {
    start: normalizedStart,
    end: normalizedEnd,
    preset: preset || "custom",
  };
  syncDossierChartControls();
}

function syncDossierChartRangeInputs() {
  if (dossierChartFromInput) dossierChartFromInput.value = dossierChartState.range?.start || "";
  if (dossierChartToInput) dossierChartToInput.value = dossierChartState.range?.end || "";
}

function normalizeDossierChartPointDate(value) {
  return parseDossierSnapshotDate(value);
}

function buildDossierChartGlobalLabels(accountIds) {
  const allowedAccounts = new Set(accountIds);
  const labels = new Set();

  (dossierPageState.snapshots || []).forEach((snapshot) => {
    const accountId = String(snapshot.account_id || "").trim().toUpperCase();
    const snapshotDate = normalizeDossierChartPointDate(snapshot.snapshot_date);
    if (allowedAccounts.has(accountId) && snapshotDate) labels.add(snapshotDate);
  });

  return Array.from(labels).sort((first, second) => first.localeCompare(second));
}

function buildDossierChartPointsForAccount(accountId, globalLabels) {
  const normalizedAccountId = String(accountId || "").trim().toUpperCase();
  const valueByDate = {};
  const basisList = [];

  (dossierPageState.snapshots || []).forEach((snapshot) => {
    const snapshotAccountId = String(snapshot.account_id || "").trim().toUpperCase();
    const snapshotDate = normalizeDossierChartPointDate(snapshot.snapshot_date);
    const value = Number(snapshot.value);
    if (snapshotAccountId !== normalizedAccountId || !snapshotDate || !Number.isFinite(value)) return;
    valueByDate[snapshotDate] = (valueByDate[snapshotDate] || 0) + value;
  });

  (dossierPageState.basisEvents || []).forEach((event) => {
    const eventAccountId = String(event.account_id || "").trim().toUpperCase();
    const effectiveDate = normalizeDossierChartPointDate(event.effective_date);
    const costBasis = Number(event.cost_basis);
    if (eventAccountId !== normalizedAccountId || !effectiveDate || !Number.isFinite(costBasis)) return;
    basisList.push({ effectiveDate, costBasis });
  });

  basisList.sort((first, second) => first.effectiveDate.localeCompare(second.effectiveDate));

  let basisIndex = 0;
  let latestBasis = null;
  const capitalChangeDates = new Set(basisList.map((item) => item.effectiveDate));

  return (globalLabels || []).map((dateIso) => {
    while (basisIndex < basisList.length && basisList[basisIndex].effectiveDate <= dateIso) {
      latestBasis = basisList[basisIndex].costBasis;
      basisIndex += 1;
    }

    const totalValue = Object.prototype.hasOwnProperty.call(valueByDate, dateIso) ? valueByDate[dateIso] : null;
    const totalCostBasis = Number.isFinite(latestBasis) ? latestBasis : null;
    const value = totalValue !== null && totalCostBasis !== null && totalCostBasis !== 0
      ? ((totalValue - totalCostBasis) / totalCostBasis) * 100
      : null;
    const previousBasis = getPreviousDossierChartBasis(basisList, dateIso);
    const capitalDelta = totalCostBasis !== null
      ? totalCostBasis - (Number.isFinite(previousBasis) ? previousBasis : 0)
      : 0;

    return {
      dateIso,
      period: dateIso.slice(0, 7),
      value,
      totalValue,
      totalCostBasis,
      isCapitalChange: capitalChangeDates.has(dateIso),
      capitalDelta,
    };
  });
}

function getPreviousDossierChartBasis(basisList, dateIso) {
  let previous = NaN;

  (basisList || []).forEach((item) => {
    if (item.effectiveDate < dateIso) previous = item.costBasis;
  });

  return previous;
}

function buildDossierYearlyChartPoints(points) {
  const byYear = new Map();

  (points || []).forEach((point) => {
    const period = String(point.period || "");
    const year = Number(period.slice(0, 4));
    const month = Number(period.slice(5, 7));
    if (!Number.isFinite(year) || !Number.isFinite(month)) return;

    const existing = byYear.get(year);
    if (!existing || (month === 12 && existing.month !== 12) || (existing.month !== 12 && month > existing.month)) {
      byYear.set(year, { ...point, year, month });
    }
  });

  return Array.from(byYear.values()).sort((first, second) => first.year - second.year);
}

function filterDossierChartPoints(points) {
  const { start, end } = dossierChartState.range;
  return (points || []).filter((point) => {
    const period = String(point.period || "");
    return period && (!start || period >= start) && (!end || period <= end);
  });
}

function computeDossierChartRange(values) {
  const finiteValues = (values || []).filter((value) => Number.isFinite(value));
  if (!finiteValues.length) return null;

  const minValue = Math.min(...finiteValues);
  const maxValue = Math.max(...finiteValues);
  const range = maxValue - minValue;
  const pad = range === 0 ? 1 : range * 0.1;
  let yMin = minValue - pad;
  let yMax = maxValue + pad;

  if (minValue > -5) yMin = Math.max(yMin, minValue - 2);
  if (yMax <= yMin) yMax = yMin + 1;

  const rawStep = (yMax - yMin) / 6;
  const exp = 10 ** Math.floor(Math.log10(rawStep || 1));
  const frac = rawStep / exp;
  const niceFrac = frac <= 1 ? 1 : frac <= 2 ? 2 : frac <= 5 ? 5 : 10;
  const step = niceFrac * exp;

  yMin = Math.floor(yMin / step) * step;
  yMax = Math.ceil(yMax / step) * step;
  if (yMax <= yMin) yMax = yMin + step;

  return { min: yMin, max: yMax, step };
}

function setDossierChartMeta(labels) {
  if (!labels.length) {
    if (dossierChartRangeElement) dossierChartRangeElement.textContent = "—";
    if (dossierChartSubtitle) dossierChartSubtitle.textContent = "—";
    return;
  }

  const first = labels[0];
  const last = labels[labels.length - 1];

  if (dossierChartState.mode === "year") {
    if (dossierChartRangeElement) dossierChartRangeElement.textContent = `${first} → ${last} · ${labels.length} punti`;
    if (dossierChartSubtitle) dossierChartSubtitle.textContent = `${first} → ${last} · Anno`;
    return;
  }

  if (dossierChartRangeElement) {
    dossierChartRangeElement.textContent = `${formatDashboardChartMonth(first.slice(0, 7))} → ${formatDashboardChartMonth(last.slice(0, 7))} · ${labels.length} punti`;
  }
  if (dossierChartSubtitle) {
    dossierChartSubtitle.textContent = `${formatDashboardChartMonthYear(first.slice(0, 7))} → ${formatDashboardChartMonthYear(last.slice(0, 7))} · Mese`;
  }
}

function clearDossierChart() {
  if (dossierChart) {
    dossierChart.destroy();
    dossierChart = null;
  }

  if (dossierChartLegend) dossierChartLegend.innerHTML = "";
  if (dossierChartCanvas) {
    const context = dossierChartCanvas.getContext("2d");
    if (context) context.clearRect(0, 0, dossierChartCanvas.width, dossierChartCanvas.height);
  }
}

function initializeDossierChartData() {
  syncDossierChartSeriesVisibility();
  renderDossierSeriesList();
  if (!dossierChartState.range.start || !dossierChartState.range.end) {
    applyDossierChartPreset(dossierChartState.range.preset || "last3");
  } else {
    syncDossierChartControls();
  }
  refreshDossierChart();
}

function refreshDossierChart() {
  if (!dossierChartCanvas) return;

  const catalog = getDossierChartCatalog();
  const accountIds = catalog.map((item) => item.id);

  if (!accountIds.length) {
    setDossierChartState("Nessuna serie disponibile.", "empty");
    clearDossierChart();
    return;
  }

  const globalLabels = buildDossierChartGlobalLabels(accountIds);
  const visibleIds = new Set(getVisibleDossierChartSeriesIds());
  const seriesPointsById = {};

  catalog.forEach((item) => {
    seriesPointsById[item.id] = filterDossierChartPoints(buildDossierChartPointsForAccount(item.id, globalLabels));
  });

  const visibleCatalog = catalog.filter((item) => visibleIds.has(item.id));

  if (!visibleCatalog.length) {
    setDossierChartState("Nessuna serie selezionata.", "empty");
    setDossierChartMeta([]);
    clearDossierChart();
    return;
  }

  const labelsSet = new Set();
  visibleCatalog.forEach((item) => {
    const points = dossierChartState.mode === "year"
      ? buildDossierYearlyChartPoints(seriesPointsById[item.id])
      : seriesPointsById[item.id];
    points.forEach((point) => {
      if (Number.isFinite(point.value)) labelsSet.add(dossierChartState.mode === "year" ? String(point.year) : point.dateIso);
    });
  });

  const labels = Array.from(labelsSet).sort((first, second) => first.localeCompare(second));

  if (!labels.length) {
    setDossierChartState("Nessun dato disponibile per il periodo selezionato.", "empty");
    setDossierChartMeta([]);
    clearDossierChart();
    return;
  }

  const tooltipMetaById = {};
  const palette = ["#4F7DF3", "#2FA36B", "#E38B2C", "#7C3AED", "#DC2626", "#0F766E", "#9333EA"];
  const chartSeries = visibleCatalog.map((item, index) => {
    const points = dossierChartState.mode === "year"
      ? buildDossierYearlyChartPoints(seriesPointsById[item.id])
      : seriesPointsById[item.id];
    const byLabel = new Map(points.map((point) => [dossierChartState.mode === "year" ? String(point.year) : point.dateIso, point]));
    const values = labels.map((label) => {
      const point = byLabel.get(label);
      return point && Number.isFinite(point.value) ? point.value : null;
    });
    const markers = labels.map((label) => byLabel.get(label)?.isCapitalChange === true);

    tooltipMetaById[item.id] = labels.map((label) => byLabel.get(label) || null);

    return {
      key: item.id,
      name: item.name || item.id,
      isClosed: item.isClosed === true,
      values,
      color: palette[index % palette.length],
      fillColor: "transparent",
      lineWidth: 2,
      spanGaps: false,
      pointColors: markers.map((marker) => marker ? "#E38B2C" : null),
      pointRadii: markers.map((marker) => marker ? 4 : 0),
    };
  });

  const allValues = chartSeries.flatMap((series) => series.values).filter((value) => Number.isFinite(value));
  const yRange = computeDossierChartRange(allValues);
  const singleSeries = chartSeries.length === 1;

  setDossierChartState("");
  setDossierChartMeta(labels);
  clearDossierChart();

  dossierChart = new DashboardMiniLookerChart({
    canvas: dossierChartCanvas,
    legendEl: dossierChartLegend,
    labels,
    series: chartSeries.map((series) => ({
      ...series,
      fillColor: singleSeries ? "rgba(79,125,243,0.18)" : "transparent",
    })),
    yFormat: formatDashboardPctValue,
    yAxisFormat: formatDashboardPctAxis,
    yTickStep: yRange?.step || null,
    yTickMax: 6,
    yMin: yRange?.min ?? null,
    yMax: yRange?.max ?? null,
    xLabelFormat: (label) => dossierChartState.mode === "year" ? label : formatDashboardMonthYearFromISOShort(label),
    xTooltipFormat: (label) => dossierChartState.mode === "year" ? `Anno ${label}` : formatDashboardDateLongFromISO(label),
    tooltipMode: "nearestSeries",
    tooltipExtra: (index, context) => {
      const seriesKey = String(context?.series?.key || "");
      const meta = tooltipMetaById[seriesKey]?.[index] || null;
      const total = Number(meta?.totalValue);
      const basis = Number(meta?.totalCostBasis);
      const lines = [
        `Valore: ${Number.isFinite(total) ? formatEuro(total) : "—"}`,
        `Carico: ${Number.isFinite(basis) ? formatEuro(basis) : "—"}`,
      ];
      const delta = Number(meta?.capitalDelta);
      if (meta?.isCapitalChange === true && Number.isFinite(delta)) {
        lines.push(`Variazione capitale: ${formatDossierSignedEuro(delta)}`);
      }
      return lines;
    },
    fill: singleSeries,
    pointRadius: 0,
    pointHoverRadius: 4,
    yZeroLine: { value: 0, color: "rgba(55,65,81,0.35)", width: 1, dash: [4, 4] },
    xLabelWidth: 80,
    legendFilter: (series) => series?.isClosed !== true,
  });

  dossierChartCanvas.classList.remove("chart-fade");
  void dossierChartCanvas.offsetWidth;
  dossierChartCanvas.classList.add("chart-fade");

  console.log("[Dossier][chart debug]", {
    seriesCount: chartSeries.length,
    visibleSeries: chartSeries.map((series) => series.key),
    range: dossierChartState.range,
    mode: dossierChartState.mode,
    pointsPerSeries: Object.fromEntries(chartSeries.map((series) => [series.key, series.values.filter((value) => Number.isFinite(value)).length])),
    capitalMarkers: Object.fromEntries(chartSeries.map((series) => [
      series.key,
      (tooltipMetaById[series.key] || []).filter((point) => point?.isCapitalChange === true).map((point) => point.dateIso),
    ])),
  });
}

function setDossierDetailState(message, type = "info") {
  if (!dossierDetailStateElement) return;

  dossierDetailStateElement.textContent = message || "";
  dossierDetailStateElement.className = `dashboard-chart-state ${message ? "is-visible" : ""} ${type ? `is-${type}` : ""}`;
}

function setDossierTotalsState(message, type = "info") {
  if (!dossierTotalsStateElement) return;

  dossierTotalsStateElement.textContent = message || "";
  dossierTotalsStateElement.className = `dashboard-chart-state ${message ? "is-visible" : ""} ${type ? `is-${type}` : ""}`;
}

function parseDossierSnapshotDate(value) {
  const text = String(value || "").slice(0, 10);
  return /^\d{4}-\d{2}-\d{2}$/.test(text) ? text : "";
}

function getDossierMonthIndex(year, month) {
  const numericYear = Number(year);
  const numericMonth = Number(month);

  if (!Number.isFinite(numericYear) || !Number.isFinite(numericMonth)) return NaN;
  return numericYear * 12 + numericMonth - 1;
}

function getDossierSelectedRange() {
  const period = String(dossierDetailPeriodSelect?.value || "month");
  const year = String(dossierDetailYearSelect?.value || "");
  const month = String(dossierDetailMonthSelect?.value || "");
  const numericYear = Number(year);
  const numericMonth = Number(month);
  const endMonthIndex = getDossierMonthIndex(year, month);

  if (!year) return null;

  if (period === "year") {
    return {
      startDate: `${year}-01-01`,
      endDate: `${String(numericYear + 1).padStart(4, "0")}-01-01`,
    };
  }

  if (!Number.isFinite(endMonthIndex) || !Number.isFinite(numericYear) || !Number.isFinite(numericMonth)) return null;

  const windowSizeByPeriod = {
    month: 1,
    last3: 3,
    last6: 6,
    last12: 12,
  };
  const windowSize = windowSizeByPeriod[period] || 1;
  const startDate = new Date(numericYear, numericMonth - windowSize, 1);
  const endDate = new Date(numericYear, numericMonth, 1);

  return {
    startDate: formatTitoliDateValue(startDate),
    endDate: formatTitoliDateValue(endDate),
  };
}

function getDossierTotalsSelectedRange() {
  const period = String(dossierTotalsPeriodSelect?.value || "month");
  const year = String(dossierTotalsYearSelect?.value || "");
  const month = String(dossierTotalsMonthSelect?.value || "");
  const numericYear = Number(year);
  const numericMonth = Number(month);
  const endMonthIndex = getDossierMonthIndex(year, month);

  if (!year) return null;

  if (period === "year") {
    return {
      startDate: `${year}-01-01`,
      endDate: `${String(numericYear + 1).padStart(4, "0")}-01-01`,
    };
  }

  if (!Number.isFinite(endMonthIndex) || !Number.isFinite(numericYear) || !Number.isFinite(numericMonth)) return null;

  const windowSizeByPeriod = {
    month: 1,
    last3: 3,
    last6: 6,
    last12: 12,
  };
  const windowSize = windowSizeByPeriod[period] || 1;
  const startDate = new Date(numericYear, numericMonth - windowSize, 1);
  const endDate = new Date(numericYear, numericMonth, 1);

  return {
    startDate: formatTitoliDateValue(startDate),
    endDate: formatTitoliDateValue(endDate),
  };
}

function isDossierSnapshotInRange(snapshotDate, range) {
  if (!snapshotDate || !range) return false;
  return snapshotDate >= range.startDate && snapshotDate < range.endDate;
}

function getLatestDossierBasis(accountId, snapshotDate) {
  let latestEvent = null;
  const normalizedAccountId = String(accountId || "").trim().toUpperCase();

  (dossierPageState.basisEvents || []).forEach((event) => {
    const eventAccountId = String(event.account_id || "").trim().toUpperCase();
    const effectiveDate = parseDossierSnapshotDate(event.effective_date);
    const costBasis = Number(event.cost_basis);

    if (eventAccountId !== normalizedAccountId || !effectiveDate || effectiveDate > snapshotDate || !Number.isFinite(costBasis)) {
      return;
    }

    if (!latestEvent || effectiveDate >= latestEvent.effectiveDate) {
      latestEvent = { effectiveDate, costBasis };
    }
  });

  return latestEvent ? latestEvent.costBasis : NaN;
}

function formatDossierPercent(value) {
  if (!Number.isFinite(value)) return "—";
  const sign = value > 0 ? "+" : value < 0 ? "-" : "";
  const formatted = new Intl.NumberFormat("it-IT", {
    style: "percent",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Math.abs(value));
  return `${sign}${formatted}`;
}

function formatDossierSignedEuro(value) {
  if (!Number.isFinite(value)) return "—";
  if (value === 0) return formatEuro(0);

  const sign = value > 0 ? "+" : "-";
  return `${sign}${formatEuro(Math.abs(value))}`;
}

function formatDossierMonthDivider(snapshotDate) {
  const date = parseDashboardISODate(snapshotDate);
  if (!date) return "";

  const months = [
    "Gennaio",
    "Febbraio",
    "Marzo",
    "Aprile",
    "Maggio",
    "Giugno",
    "Luglio",
    "Agosto",
    "Settembre",
    "Ottobre",
    "Novembre",
    "Dicembre",
  ];

  return `${months[date.getMonth()]} ${date.getFullYear()}`;
}

function appendDossierMonthDivider(label) {
  if (!dossierDetailTableBody || !label) return;

  const row = document.createElement("tr");
  const cell = document.createElement("td");

  row.className = "dossier-month-divider-row";
  cell.colSpan = 6;
  cell.textContent = label;
  row.appendChild(cell);
  dossierDetailTableBody.appendChild(row);
}

function appendDossierTotalsMonthDivider(label) {
  if (!dossierTotalsTableBody || !label) return;

  const row = document.createElement("tr");
  const cell = document.createElement("td");

  row.className = "dossier-month-divider-row";
  cell.colSpan = 6;
  cell.textContent = label;
  row.appendChild(cell);
  dossierTotalsTableBody.appendChild(row);
}

function appendDossierAmountCell(row, value, formatter = formatEuro, colorize = false) {
  const cell = document.createElement("td");

  cell.classList.add("num");
  cell.textContent = Number.isFinite(value) ? formatter(value) : "—";
  if (colorize && Number.isFinite(value)) {
    cell.classList.add(getValueClass(value));
  }
  row.appendChild(cell);
}

function buildDossierDetailRows() {
  const accountId = String(dossierDetailDossierSelect?.value || "").trim().toUpperCase();
  const range = getDossierSelectedRange();

  if (!accountId || !range) return [];

  const snapshots = (dossierPageState.snapshots || [])
    .map((snapshot) => ({
      snapshotDate: parseDossierSnapshotDate(snapshot.snapshot_date),
      accountId: String(snapshot.account_id || "").trim().toUpperCase(),
      total: Number(snapshot.value),
    }))
    .filter((snapshot) => snapshot.accountId === accountId)
    .filter((snapshot) => snapshot.snapshotDate && Number.isFinite(snapshot.total))
    .filter((snapshot) => snapshot.snapshotDate < range.endDate)
    .sort((first, second) => first.snapshotDate.localeCompare(second.snapshotDate));

  let previousTotal = NaN;
  let previousBasis = null;
  const rows = [];

  snapshots.forEach((snapshot) => {
    const basis = getLatestDossierBasis(accountId, snapshot.snapshotDate);
    const basisValue = Number.isFinite(basis) ? basis : null;

    if (snapshot.snapshotDate < range.startDate) {
      previousTotal = snapshot.total;
      previousBasis = basisValue;
      return;
    }

    if (!isDossierSnapshotInRange(snapshot.snapshotDate, range)) return;

    const deltaVsBasis = Number.isFinite(basis) ? snapshot.total - basis : NaN;
    const pctVsBasis = Number.isFinite(basis) && basis !== 0 ? deltaVsBasis / basis : NaN;
    const netCurrent = Number.isFinite(basis) && basis > 0 ? snapshot.total - basis : NaN;
    const netPrevious = Number.isFinite(previousTotal) && Number.isFinite(previousBasis) && previousBasis > 0
      ? previousTotal - previousBasis
      : NaN;
    let deltaVsPrevious = NaN;

    if (Number.isFinite(previousTotal)) {
      deltaVsPrevious = Number.isFinite(netCurrent) && Number.isFinite(netPrevious)
        ? netCurrent - netPrevious
        : snapshot.total - previousTotal;
    }

    rows.push({
      ...snapshot,
      basis,
      deltaVsBasis,
      pctVsBasis,
      deltaVsPrevious,
      previousTotalUsed: Number.isFinite(previousTotal) ? previousTotal : null,
      basisChanged: false,
    });

    previousTotal = snapshot.total;
    previousBasis = basisValue;
  });

  let previousBasisForFlag = null;
  rows.forEach((row) => {
    const basisValue = Number.isFinite(row.basis) ? row.basis : null;
    row.basisChanged = Number.isFinite(previousBasisForFlag) && Number.isFinite(basisValue) && basisValue !== previousBasisForFlag;
    previousBasisForFlag = basisValue;
  });

  return rows;
}

function renderDossierDetailTable() {
  if (!dossierDetailTableBody) return;

  try {
    dossierDetailTableBody.textContent = "";

    const rows = buildDossierDetailRows();

    if (!rows.length) {
      setDossierDetailState("Nessun dato disponibile per il filtro selezionato.", "empty");
      return;
    }

    setDossierDetailState("");
    let lastMonthKey = "";

    rows
      .slice()
      .sort((first, second) => second.snapshotDate.localeCompare(first.snapshotDate))
      .forEach((item) => {
        const row = document.createElement("tr");
        const dateCell = document.createElement("td");
        const monthKey = String(item.snapshotDate || "").slice(0, 7);

        if (monthKey && monthKey !== lastMonthKey) {
          appendDossierMonthDivider(formatDossierMonthDivider(item.snapshotDate));
          lastMonthKey = monthKey;
        }
        row.classList.toggle("dossier-basis-change-row", item.basisChanged);
        dateCell.textContent = formatDate(item.snapshotDate);
        row.appendChild(dateCell);

        appendDossierAmountCell(row, item.basis);
        appendDossierAmountCell(row, item.total);
        appendDossierAmountCell(row, item.deltaVsBasis, formatDossierSignedEuro, true);
        appendDossierAmountCell(row, item.pctVsBasis, formatDossierPercent, true);
        appendDossierAmountCell(row, item.deltaVsPrevious, formatDossierSignedEuro, true);

        console.log("[Dossier][table debug]", {
          snapshot_date: item.snapshotDate,
          value: item.total,
          basis: Number.isFinite(item.basis) ? item.basis : null,
          previousValueUsed: item.previousTotalUsed,
          deltaPrev: Number.isFinite(item.deltaVsPrevious) ? item.deltaVsPrevious : null,
        });

        dossierDetailTableBody.appendChild(row);
      });
  } catch (error) {
    console.error("[Dossier] Errore rendering tabella Dossier:", error);
    if (dossierDetailTableBody) dossierDetailTableBody.textContent = "";
    setDossierDetailState(`Errore tabella Dossier: ${error.message || error}`, "error");
  }
}

function getDossierTotalsAccountIds() {
  const accountIds = new Set();

  (dossierPageState.snapshots || []).forEach((snapshot) => {
    const accountId = String(snapshot.account_id || "").trim().toUpperCase();
    if (accountId) accountIds.add(accountId);
  });

  return Array.from(accountIds);
}

function buildDossierBasisMap(accountIds, rangeEndDate) {
  const allowedAccounts = new Set(accountIds);
  const basisByAccount = {};

  accountIds.forEach((accountId) => {
    basisByAccount[accountId] = [];
  });

  (dossierPageState.basisEvents || []).forEach((event) => {
    const accountId = String(event.account_id || "").trim().toUpperCase();
    const effectiveDate = parseDossierSnapshotDate(event.effective_date);
    const costBasis = Number(event.cost_basis);

    if (!allowedAccounts.has(accountId) || !effectiveDate || effectiveDate >= rangeEndDate || !Number.isFinite(costBasis)) {
      return;
    }

    basisByAccount[accountId].push({
      effectiveDate,
      costBasis,
    });
  });

  accountIds.forEach((accountId) => {
    basisByAccount[accountId].sort((first, second) => first.effectiveDate.localeCompare(second.effectiveDate));
  });

  return basisByAccount;
}

function buildDossierSnapshotsByDate(accountIds, rangeEndDate) {
  const allowedAccounts = new Set(accountIds);
  const snapshotsByDate = {};

  (dossierPageState.snapshots || []).forEach((snapshot) => {
    const accountId = String(snapshot.account_id || "").trim().toUpperCase();
    const snapshotDate = parseDossierSnapshotDate(snapshot.snapshot_date);
    const value = Number(snapshot.value);

    if (!allowedAccounts.has(accountId) || !snapshotDate || snapshotDate >= rangeEndDate || !Number.isFinite(value)) {
      return;
    }

    if (!Array.isArray(snapshotsByDate[snapshotDate])) {
      snapshotsByDate[snapshotDate] = [];
    }

    snapshotsByDate[snapshotDate].push({ accountId, value });
  });

  return snapshotsByDate;
}

function buildDossierTotalsRows() {
  const range = getDossierTotalsSelectedRange();
  if (!range) return [];

  const accountIds = getDossierTotalsAccountIds();
  if (!accountIds.length) return [];

  const snapshotsByDate = buildDossierSnapshotsByDate(accountIds, range.endDate);
  const timeline = Object.keys(snapshotsByDate).sort((first, second) => first.localeCompare(second));
  if (!timeline.length) return [];

  const basisByAccount = buildDossierBasisMap(accountIds, range.endDate);
  const basisIndexByAccount = {};
  const lastBasisByAccount = {};

  accountIds.forEach((accountId) => {
    basisIndexByAccount[accountId] = 0;
    lastBasisByAccount[accountId] = null;
  });

  let previousTotalValue = null;
  let previousTotalBasis = null;
  const rows = [];

  timeline.forEach((snapshotDate) => {
    let totalValue = 0;
    let valueCount = 0;
    let totalBasis = 0;
    let basisCount = 0;
    const basisSeenAccounts = new Set();
    const daySnapshots = snapshotsByDate[snapshotDate] || [];

    daySnapshots.forEach((snapshot) => {
      const accountId = snapshot.accountId;
      const basisList = basisByAccount[accountId] || [];
      let basisIndex = basisIndexByAccount[accountId] || 0;

      while (basisIndex < basisList.length && basisList[basisIndex].effectiveDate <= snapshotDate) {
        lastBasisByAccount[accountId] = basisList[basisIndex].costBasis;
        basisIndex += 1;
      }

      basisIndexByAccount[accountId] = basisIndex;
      totalValue += snapshot.value;
      valueCount += 1;

      if (!basisSeenAccounts.has(accountId) && Number.isFinite(lastBasisByAccount[accountId])) {
        totalBasis += lastBasisByAccount[accountId];
        basisCount += 1;
        basisSeenAccounts.add(accountId);
      }
    });

    const rowTotalValue = valueCount ? totalValue : null;
    const rowTotalBasis = basisCount ? totalBasis : null;

    if (snapshotDate < range.startDate) {
      if (Number.isFinite(rowTotalValue)) {
        previousTotalValue = rowTotalValue;
        previousTotalBasis = Number.isFinite(rowTotalBasis) ? rowTotalBasis : null;
      }
      return;
    }

    if (!isDossierSnapshotInRange(snapshotDate, range)) return;

    const hasBasis = Number.isFinite(rowTotalBasis) && rowTotalBasis > 0;
    const deltaVsBasis = hasBasis && Number.isFinite(rowTotalValue) ? rowTotalValue - rowTotalBasis : NaN;
    const pctVsBasis = hasBasis && Number.isFinite(deltaVsBasis) ? deltaVsBasis / rowTotalBasis : NaN;
    const netCurrent = Number.isFinite(rowTotalValue) && Number.isFinite(rowTotalBasis) && rowTotalBasis > 0
      ? rowTotalValue - rowTotalBasis
      : NaN;
    const netPrevious = Number.isFinite(previousTotalValue) && Number.isFinite(previousTotalBasis) && previousTotalBasis > 0
      ? previousTotalValue - previousTotalBasis
      : NaN;
    let deltaVsPrevious = NaN;

    if (Number.isFinite(previousTotalValue) && Number.isFinite(rowTotalValue)) {
      deltaVsPrevious = Number.isFinite(netCurrent) && Number.isFinite(netPrevious)
        ? netCurrent - netPrevious
        : rowTotalValue - previousTotalValue;
    }

    rows.push({
      snapshotDate,
      total: Number.isFinite(rowTotalValue) ? rowTotalValue : NaN,
      basis: Number.isFinite(rowTotalBasis) ? rowTotalBasis : NaN,
      deltaVsBasis,
      pctVsBasis,
      deltaVsPrevious,
      previousTotalUsed: Number.isFinite(previousTotalValue) ? previousTotalValue : null,
      basisChanged: false,
    });

    if (Number.isFinite(rowTotalValue)) {
      previousTotalValue = rowTotalValue;
      previousTotalBasis = Number.isFinite(rowTotalBasis) ? rowTotalBasis : null;
    }
  });

  let previousBasisForFlag = null;
  rows.forEach((row) => {
    const basisValue = Number.isFinite(row.basis) ? row.basis : null;
    row.basisChanged = Number.isFinite(previousBasisForFlag) && Number.isFinite(basisValue) && basisValue !== previousBasisForFlag;
    previousBasisForFlag = basisValue;
  });

  return rows;
}

function renderDossierTotalsTable() {
  if (!dossierTotalsTableBody) return;

  try {
    dossierTotalsTableBody.textContent = "";

    const rows = buildDossierTotalsRows();

    if (!rows.length) {
      setDossierTotalsState("Nessun dato disponibile per il filtro selezionato.", "empty");
      return;
    }

    setDossierTotalsState("");
    let lastMonthKey = "";

    rows
      .slice()
      .sort((first, second) => second.snapshotDate.localeCompare(first.snapshotDate))
      .forEach((item) => {
        const row = document.createElement("tr");
        const dateCell = document.createElement("td");
        const monthKey = String(item.snapshotDate || "").slice(0, 7);

        if (monthKey && monthKey !== lastMonthKey) {
          appendDossierTotalsMonthDivider(formatDossierMonthDivider(item.snapshotDate));
          lastMonthKey = monthKey;
        }

        row.classList.toggle("dossier-basis-change-row", item.basisChanged);
        dateCell.textContent = formatDate(item.snapshotDate);
        row.appendChild(dateCell);

        appendDossierAmountCell(row, item.basis);
        appendDossierAmountCell(row, item.total);
        appendDossierAmountCell(row, item.deltaVsBasis, formatDossierSignedEuro, true);
        appendDossierAmountCell(row, item.pctVsBasis, formatDossierPercent, true);
        appendDossierAmountCell(row, item.deltaVsPrevious, formatDossierSignedEuro, true);

        console.log("[Dossier][totals debug]", {
          date: item.snapshotDate,
          totalValue: item.total,
          totalBasis: Number.isFinite(item.basis) ? item.basis : null,
          previousTotalValue: item.previousTotalUsed,
          deltaPrev: Number.isFinite(item.deltaVsPrevious) ? item.deltaVsPrevious : null,
        });

        dossierTotalsTableBody.appendChild(row);
      });
  } catch (error) {
    console.error("[Dossier] Errore rendering tabella Totali:", error);
    if (dossierTotalsTableBody) dossierTotalsTableBody.textContent = "";
    setDossierTotalsState(`Errore tabella Totali: ${error.message || error}`, "error");
  }
}

async function fetchDossierBaseData() {
  if (!supabaseClient) {
    console.error("[Dossier] Credenziali Supabase mancanti.");
    return;
  }

  try {
    const [dossiersResult, snapshotsResult, basisEventsResult] = await Promise.all([
      supabaseClient
        .from("dossiers")
        .select("account_id,label,is_closed,order,visible"),
      supabaseClient
        .from("investments_snapshots")
        .select("snapshot_date,account_id,value"),
      supabaseClient
        .from("investments_basis_events")
        .select("effective_date,account_id,cost_basis"),
    ]);

    if (dossiersResult.error) {
      console.error("[Dossier] Errore lettura dossiers:", dossiersResult.error);
    }

    if (snapshotsResult.error) {
      console.error("[Dossier] Errore lettura investments_snapshots:", snapshotsResult.error);
    }

    if (basisEventsResult.error) {
      console.error("[Dossier] Errore lettura investments_basis_events:", basisEventsResult.error);
    }

    if (dossiersResult.error || snapshotsResult.error || basisEventsResult.error) {
      return;
    }

    dossierPageState = {
      dossiers: dossiersResult.data ?? [],
      snapshots: snapshotsResult.data ?? [],
      basisEvents: basisEventsResult.data ?? [],
    };

    console.log("[Dossier] dossiers:", dossiersResult.data ?? []);
    console.log("[Dossier] snapshots:", snapshotsResult.data ?? []);
    console.log("[Dossier] basis events:", basisEventsResult.data ?? []);
    populateDossierControls();
    initializeDossierChartData();
    renderDossierDetailTable();
    renderDossierTotalsTable();
  } catch (error) {
    console.error("[Dossier] Errore fetch dati base:", error);
  }
}

async function loadMovimenti() {
  if (!supabaseClient) {
    renderMovimentiState("error-state", "Credenziali Supabase mancanti.");
    setSummaryError();
    return;
  }

  const { startDate, endDateExclusive } = getMovimentiDateRange();
  applyMovimentiFilterButton.disabled = true;
  applyMovimentiFilterButton.textContent = "Carico...";
  renderMovimentiState("loading-state", "Caricamento movimenti...", true);
  const summariesPromise = loadMovimentiSummaries();

  try {
    const { data, error } = await supabaseClient
      .from("transactions")
      .select("*")
      .gte("date", startDate)
      .lt("date", endDateExclusive)
      .order("date", { ascending: false })
      .limit(100);

    if (error) {
      renderMovimentiState("error-state", `Errore lettura movimenti: ${error.message}`);
      return;
    }

    renderMovimentiTable(data);
  } catch (error) {
    renderMovimentiState("error-state", `Errore lettura movimenti: ${error.message}`);
  } finally {
    await summariesPromise;
    applyMovimentiFilterButton.disabled = false;
    applyMovimentiFilterButton.textContent = "Applica";
  }
}

initAuthGate();
