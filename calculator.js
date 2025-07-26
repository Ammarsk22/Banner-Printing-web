// ==INTERNAL STYLE (example, adjust your internal CSS blocks here)==
// <style>
// .bannerRow { margin-bottom: 8px; }
// .rateSelect, .rateInput, .quantity, .height, .width { margin-right: 7px; }
// </style>

// BANNER BILLING LOGIC - With Import Backup & Dynamic Bond Rate

let bannerCount = 0;
const bannerContainer = document.getElementById("bannerContainer");
const totalAmountEl = document.getElementById("totalAmount");
const totalSqftEl = document.getElementById("totalSqft");
const billForm = document.getElementById("calcForm");

const STORAGE_KEYS = {
  PRESET_RATES: 'shaikhDigital_presetRates',
  BILL_HISTORY: 'shaikhDigital_billHistory',
  CURRENT_BILL: 'shaikhDigital_currentBill',
  LAST_UPDATE: 'shaikhDigital_lastUpdate',
  BOND_RATE: 'shaikhDigital_bondRate', // New
};

// ===== Default bond rate =====
const DEFAULT_BOND_RATE = 50;

// Get Bond Rate (can be updated programmatically)
function getBondRate() {
  // If not present, use default and save
  const r = parseFloat(localStorage.getItem(STORAGE_KEYS.BOND_RATE));
  if (r && !isNaN(r)) return r;
  localStorage.setItem(STORAGE_KEYS.BOND_RATE, DEFAULT_BOND_RATE);
  return DEFAULT_BOND_RATE;
}
function setBondRate(rate) {
  localStorage.setItem(STORAGE_KEYS.BOND_RATE, rate);
}

// ===== Default preset rates =====
const defaultPresetRates = {
  "Flex": 30,
  "Vinyl": 40,
  "Glow Sign": 50
};

// Load preset rates from localStorage
function loadPresetRates() {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.PRESET_RATES);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {}
  localStorage.setItem(STORAGE_KEYS.PRESET_RATES, JSON.stringify(defaultPresetRates));
  return defaultPresetRates;
}

// Bill history routines here ...
function loadBillHistory() {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.BILL_HISTORY);
    if (stored) return JSON.parse(stored);
  } catch (e) {}
  const emptyHistory = [];
  localStorage.setItem(STORAGE_KEYS.BILL_HISTORY, JSON.stringify(emptyHistory));
  return emptyHistory;
}
function saveBillHistory(billHistory) {
  try {
    localStorage.setItem(STORAGE_KEYS.BILL_HISTORY, JSON.stringify(billHistory));
    localStorage.setItem(STORAGE_KEYS.LAST_UPDATE, Date.now().toString());
    return true;
  } catch (e) { return false; }
}
function saveCurrentBill(billData) {
  try {
    localStorage.setItem(STORAGE_KEYS.CURRENT_BILL, JSON.stringify(billData)); return true;
  } catch (e) { return false; }
}
function updateBannerRowPresets() {
  const presets = loadPresetRates();
  document.querySelectorAll('.rateSelect').forEach(select => {
    const currentValue = select.value;
    let optionsHtml = '<option value="">Select Type</option>';
    Object.entries(presets).forEach(([name, rate]) => {
      optionsHtml += `<option value="${rate}">${name} – ₹${rate}</option>`;
    });
    optionsHtml += '<option value="custom">Custom</option>';
    select.innerHTML = optionsHtml;
    if (currentValue && currentValue !== "custom") {
      select.value = currentValue;
    }
  });
}
function createBannerRow() {
  const row = document.createElement("div");
  row.className = "bannerRow";
  row.setAttribute("data-id", bannerCount);

  // Get preset rates dynamically
  const presets = loadPresetRates();
  let optionsHtml = '<option value="">Select Type</option>';
  Object.entries(presets).forEach(([name, rate]) => {
    optionsHtml += `<option value="${rate}">${name} – ₹${rate}</option>`;
  });
  optionsHtml += '<option value="custom">Custom</option>';
  row.innerHTML = `
    <input class="banner-name" placeholder="Banner Name" style="width:120px">
    <select class="rateSelect">${optionsHtml}</select>
    <input class="rateInput" type="number" placeholder="Rate" min="1" style="width:75px">
    <input class="height" type="number" placeholder="H (ft)" min="0.1" step="any" style="width:60px">
    <input class="width" type="number" placeholder="W (ft)" min="0.1" step="any" style="width:60px">
    <input class="quantity" type="number" placeholder="Qty" min="1" value="1" style="width:50px">
    <label style="margin-left:8px;">
      Bond? <input class="bondCheck" type="checkbox" style="margin-left:2px;">
    </label>
    <input class="bondQty" type="number" min="0" placeholder="Bond Qty" style="display:none;width:50px;">
    <button type="button" class="removeBanner" style="margin-left:7px;">❌</button>
  `;
  bannerContainer.appendChild(row);
  bannerCount++;
  attachInputListeners(row);
}
function addBanner() { createBannerRow(); updateTotal(); }
function attachInputListeners(row) {
  const inputs = row.querySelectorAll("input, select");
  inputs.forEach(input => input.addEventListener("input", updateTotal));
  row.querySelector(".bondCheck").addEventListener("change", function() {
    const bondQtyInput = row.querySelector(".bondQty");
    bondQtyInput.style.display = this.checked ? "inline-block" : "none";
    if (!this.checked) bondQtyInput.value = 0;
    updateTotal();
  });
  row.querySelector(".rateSelect").addEventListener("change", function () {
    const rateInput = row.querySelector(".rateInput");
    if (this.value === "custom") {
      rateInput.value = "";
      rateInput.disabled = false;
      rateInput.focus();
    } else if (this.value === "") {
      rateInput.value = "";
      rateInput.disabled = false;
    } else {
      rateInput.value = this.value;
      rateInput.disabled = true;
    }
    updateTotal();
  });
  row.querySelector(".removeBanner").addEventListener("click", function () {
    row.remove();
    updateTotal();
  });
}
// Central calculation uses dynamic bond rate now!
function updateTotal() {
  const rows = document.querySelectorAll(".bannerRow");
  let total = 0;
  let totalSqft = 0;
  const bondRate = getBondRate();
  rows.forEach(row => {
    const height = parseFloat(row.querySelector(".height")?.value || 0);
    const width = parseFloat(row.querySelector(".width")?.value || 0);
    const quantity = parseInt(row.querySelector(".quantity")?.value || 1);
    const rate = parseFloat(row.querySelector(".rateInput")?.value || 0);
    const bondQty = parseInt(row.querySelector(".bondQty")?.value || 0);
    const sqFt = height * width * quantity;
    const bannerTotal = height * width * rate * quantity;
    const bondCharge = bondQty * bondRate; // Now uses dynamic bond rate
    total += bannerTotal + bondCharge;
    totalSqft += sqFt;
  });
  totalAmountEl.innerText = `Total: ₹${total.toFixed(2)}`;
  if (totalSqftEl) {
    totalSqftEl.innerText = `Total Sq.ft: ${totalSqft.toFixed(2)}`;
  }
}

function validateForm() {
  const customerName = document.getElementById("customerName").value.trim();
  const bannerRows = document.querySelectorAll(".bannerRow");
  if (!customerName) { showNotification("Please enter customer name!", "error"); return false; }
  if (bannerRows.length === 0) { showNotification("Please add at least one banner!", "error"); return false; }
  for (let row of bannerRows) {
    const height = parseFloat(row.querySelector(".height")?.value || 0);
    const width = parseFloat(row.querySelector(".width")?.value || 0);
    const rate = parseFloat(row.querySelector(".rateInput")?.value || 0);
    if (height <= 0 || width <= 0 || rate <= 0) {
      showNotification("Please fill all banner details with valid values!", "error");
      return false;
    }
  }
  return true;
}

function showNotification(message, type = "info") {
  const notification = document.createElement('div');
  notification.style.cssText = `
position: fixed;top:20px;right:20px;
background: ${type === 'error' ? '#e74c3c' : type === 'success' ? '#27ae60' : '#3498db'};
color:white;padding: 15px 20px; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.2); z-index: 1000;
font-weight:600;animation:slideIn 0.3s;
  `;
  notification.innerHTML = message;
  document.body.appendChild(notification);
  setTimeout(() => { notification.remove(); }, 3500);
}

billForm.addEventListener("submit", (e) => {
  e.preventDefault();
  if (!validateForm()) { return; }
  const customerName = document.getElementById("customerName").value.trim();
  const customerCity = document.getElementById("customerCity").value.trim() || "Not specified";
  const date = document.getElementById("billDate").value || new Date().toISOString().slice(0,10);
  const bannerTitle = document.getElementById("bannerTitle").value.trim();
  const isPending = document.getElementById("isPending").checked;
  const pendingAmount = isPending ? parseFloat(document.getElementById("pendingAmount").value || 0) : 0;
  const banners = [];
  let totalAmount = 0;
  let totalSqft = 0;

  document.querySelectorAll(".bannerRow").forEach(row => {
    const height = parseFloat(row.querySelector(".height")?.value || 0);
    const width = parseFloat(row.querySelector(".width")?.value || 0);
    const qty = parseInt(row.querySelector(".quantity")?.value || 1);
    const rate = parseFloat(row.querySelector(".rateInput")?.value || 0);
    const bondQty = parseInt(row.querySelector(".bondQty")?.value || 0);
    const name = row.querySelector(".banner-name")?.value.trim() || "Banner";
    const sqFt = height * width * qty;
    // Use dynamic bond rate
    const bannerTotal = (height * width * rate * qty) + (bondQty * getBondRate());
    totalAmount += bannerTotal;
    totalSqft += sqFt;
    banners.push({ name, height, width, qty, rate, bondQty, sqFt: sqFt, amount: bannerTotal });
  });

  const existingHistory = loadBillHistory();
  const billNo = existingHistory.length > 0 ? Math.max(...existingHistory.map(b => parseInt(b.billNo) || 0)) + 1 : 100;
  const billData = {
    billNo: billNo, customerName, customerCity, date, bannerTitle: bannerTitle || "Banner Order",
    banners, totalAmount, totalSqft, isPending, pendingAmount, createdAt: new Date().toISOString()
  };
  existingHistory.push(billData);
  if (saveBillHistory(existingHistory)) {
    if (saveCurrentBill(billData)) {
      showNotification(`Bill #${billNo} generated successfully!`, "success");
      setTimeout(() => { window.location.href = "bill.html"; }, 900);
    } else { showNotification("Error saving bill for display!", "error"); }
  } else { showNotification("Error saving bill to history!", "error"); }
});

// ==== IMPORT BACKUP FEATURE ====
window.importBackup = function(jsonString) {
  try {
    const backup = JSON.parse(jsonString);
    if (backup.BILL_HISTORY) {
      localStorage.setItem(STORAGE_KEYS.BILL_HISTORY, JSON.stringify(backup.BILL_HISTORY));
    }
    if (backup.PRESET_RATES) {
      localStorage.setItem(STORAGE_KEYS.PRESET_RATES, JSON.stringify(backup.PRESET_RATES));
    }
    if (backup.BOND_RATE) {
      setBondRate(backup.BOND_RATE);
    }
    showNotification("Backup imported successfully!", "success");
  } catch (e) {
    showNotification("Invalid backup file!", "error");
  }
};
// You may call `importBackup(prompt('Paste backup JSON:'))` from browser console for use.

// ==== ADMIN-ONLY: BOND RATE CHANGE FUNC ====
window.setBondRate = setBondRate;
// Usage (in browser console): setBondRate(60); // to update bond rate for all banners

// On load
document.addEventListener("DOMContentLoaded", function() {
  try { localStorage.setItem('test', 'test'); localStorage.removeItem('test'); }
  catch (e) { showNotification("Warning: Data storage not available. Bills may not be saved.", "error"); }
  loadBillHistory();
  createBannerRow();
  const dateInput = document.getElementById("billDate");
  if (dateInput && !dateInput.value) { dateInput.valueAsDate = new Date(); }
  const style = document.createElement('style');
  style.textContent = `
@keyframes slideIn { from { transform: translateX(100%); opacity:0; } to { transform: translateX(0); opacity:1; } }
  `;
  document.head.appendChild(style);
});

setInterval(() => { updateBannerRowPresets(); }, 5000);
