const SUPABASE_URL = "https://xtztpxvnuzdmdodfsais.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_zonUWg9hhGsoKNFV9b4pZA_bg5nXGAJ";

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
const movementModal = document.getElementById("movement-modal");
const movementModalTitle = document.getElementById("movement-modal-title");
const openMovementModalButton = document.getElementById("open-movement-modal");
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
const deleteMovementModal = document.getElementById("delete-movement-modal");
const cancelDeleteMovementButton = document.getElementById("cancel-delete-movement");
const confirmDeleteMovementButton = document.getElementById("confirm-delete-movement");
const deleteMovementModalError = document.getElementById("delete-movement-modal-error");

const hasCredentials =
  SUPABASE_URL !== "INSERISCI_QUI_SUPABASE_URL" &&
  SUPABASE_ANON_KEY !== "INSERISCI_QUI_SUPABASE_ANON_KEY";

let movementCurrentBalance = 0;
let modalMode = "create";
let editingTxId = null;
let pendingDeleteTxId = null;

const supabaseClient = hasCredentials
  ? window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  : null;

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
    } else {
      const currentBalance = movementCurrentBalance;
      const nextBalance = currentBalance + value.amount;

      currentBalancePreview.textContent = formatEuro(currentBalance);
      updateSaldoPreview();

      const { error: insertError } = await supabaseClient.from("transactions").insert({
        tx_id: crypto.randomUUID(),
        date: value.date,
        description: value.description,
        amount: value.amount,
        in_totals: value.inTotals,
        account_id: "FINECO_MAIN",
        balance: nextBalance,
      });

      saveError = insertError;
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
    const { error } = await supabaseClient
      .from("transactions")
      .delete()
      .eq("tx_id", pendingDeleteTxId);

    if (error) {
      deleteMovementModalError.textContent = `Errore eliminazione movimento: ${error.message}`;
      return;
    }

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

if (loadButton && statusElement && outputElement) {
  if (hasCredentials) {
    setStatus("Pronto per leggere da Supabase", "ok");
  } else {
    setStatus("Credenziali da configurare", "warning");
  }

  loadButton.addEventListener("click", loadTransactions);
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
