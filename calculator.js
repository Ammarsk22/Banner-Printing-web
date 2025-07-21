let bannerCount = 0;
const bannerContainer = document.getElementById("bannerContainer");
const totalAmountEl = document.getElementById("totalAmount");
const totalSqftEl = document.getElementById("totalSqft");
const billForm = document.getElementById("calcForm");

// localStorage key constants
const STORAGE_KEYS = {
  PRESET_RATES: 'shaikhDigital_presetRates',
  BILL_HISTORY: 'shaikhDigital_billHistory',
  CURRENT_BILL: 'shaikhDigital_currentBill',
  LAST_UPDATE: 'shaikhDigital_lastUpdate'
};

// Default preset rates
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
  } catch (e) {
    console.log("Error loading preset rates from localStorage:", e);
  }
  
  // If no stored rates, save defaults and return them
  localStorage.setItem(STORAGE_KEYS.PRESET_RATES, JSON.stringify(defaultPresetRates));
  return defaultPresetRates;
}

// Load bill history from localStorage
function loadBillHistory() {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.BILL_HISTORY);
    if (stored) {
      const history = JSON.parse(stored);
      console.log("Loaded bill history:", history.length, "bills");
      return history;
    }
  } catch (e) {
    console.log("Error loading bill history from localStorage:", e);
  }
  
  // Initialize empty history if none exists
  const emptyHistory = [];
  localStorage.setItem(STORAGE_KEYS.BILL_HISTORY, JSON.stringify(emptyHistory));
  console.log("Initialized empty bill history");
  return emptyHistory;
}

// Save bill history to localStorage
function saveBillHistory(billHistory) {
  try {
    localStorage.setItem(STORAGE_KEYS.BILL_HISTORY, JSON.stringify(billHistory));
    console.log("Saved bill history:", billHistory.length, "bills");
    
    // Update last update timestamp to notify admin panel
    localStorage.setItem(STORAGE_KEYS.LAST_UPDATE, Date.now().toString());
    return true;
  } catch (e) {
    console.log("Error saving bill history to localStorage:", e);
    return false;
  }
}

// Save current bill to localStorage for display
function saveCurrentBill(billData) {
  try {
    localStorage.setItem(STORAGE_KEYS.CURRENT_BILL, JSON.stringify(billData));
    console.log("Saved current bill:", billData.billNo);
    return true;
  } catch (e) {
    console.log("Error saving current bill to localStorage:", e);
    return false;
  }
}

// Update banner row presets when admin changes them
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
    
    // Try to restore previous selection
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
    <input type="text" placeholder="Banner Name" class="banner-name" />
    <input type="number" placeholder="Height (ft)" class="height" min="0" step="0.1" />
    <input type="number" placeholder="Width (ft)" class="width" min="0" step="0.1" />
    <input type="number" placeholder="Qty" class="quantity" value="1" min="1" />
    <select class="rateSelect" onchange="handleRateChange(this)">
      ${optionsHtml}
    </select>
    <input type="number" placeholder="Rate/sq.ft" class="rateInput" min="0" />
    <label>
      <input type="checkbox" class="bondCheckbox" onchange="toggleBondInput(this)"> Bond?
    </label>
    <input type="number" placeholder="Bond Qty" class="bondQty" style="display:none;" min="0" value="0" />
    <button type="button" onclick="removeBanner(this)">❌</button>
  `;

  bannerContainer.appendChild(row);
  bannerCount++;
  attachInputListeners(row);
}

function addBanner() {
  createBannerRow();
  updateTotal();
}

function attachInputListeners(row) {
  const inputs = row.querySelectorAll("input, select");
  inputs.forEach(input => input.addEventListener("input", updateTotal));
}

function toggleBondInput(checkbox) {
  const bondQtyInput = checkbox.parentElement.parentElement.querySelector(".bondQty");
  bondQtyInput.style.display = checkbox.checked ? "block" : "none";
  if (!checkbox.checked) {
    bondQtyInput.value = 0;
  }
  updateTotal();
}

function handleRateChange(select) {
  const row = select.closest(".bannerRow");
  const rateInput = row.querySelector(".rateInput");
  if (select.value === "custom") {
    rateInput.value = "";
    rateInput.disabled = false;
    rateInput.focus();
  } else if (select.value === "") {
    rateInput.value = "";
    rateInput.disabled = false;
  } else {
    rateInput.value = select.value;
    rateInput.disabled = true;
  }
  updateTotal();
}

function removeBanner(button) {
  const row = button.parentElement;
  row.remove();
  updateTotal();
}

function updateTotal() {
  const rows = document.querySelectorAll(".bannerRow");
  let total = 0;
  let totalSqft = 0;

  rows.forEach(row => {
    const height = parseFloat(row.querySelector(".height")?.value || 0);
    const width = parseFloat(row.querySelector(".width")?.value || 0);
    const quantity = parseInt(row.querySelector(".quantity")?.value || 1);
    const rate = parseFloat(row.querySelector(".rateInput")?.value || 0);
    const bondQty = parseInt(row.querySelector(".bondQty")?.value || 0);
    
    const sqFt = height * width * quantity;
    const bannerTotal = height * width * rate * quantity;
    const bondCharge = bondQty * 50; // ₹50 per bond
    
    total += bannerTotal + bondCharge;
    totalSqft += sqFt;
  });

  totalAmountEl.innerText = `Total: ₹${total.toFixed(2)}`;
  if (totalSqftEl) {
    totalSqftEl.innerText = `Total Sq.ft: ${totalSqft.toFixed(2)}`;
  }
  
  return total;
}

function togglePending() {
  const box = document.getElementById("pendingAmountBox");
  const checkbox = document.getElementById("isPending");
  box.style.display = checkbox.checked ? "block" : "none";
  
  if (!checkbox.checked) {
    document.getElementById("pendingAmount").value = "";
  }
}

// Form validation
function validateForm() {
  const customerName = document.getElementById("customerName").value.trim();
  const bannerRows = document.querySelectorAll(".bannerRow");
  
  if (!customerName) {
    showNotification("Please enter customer name!", "error");
    return false;
  }
  
  if (bannerRows.length === 0) {
    showNotification("Please add at least one banner!", "error");
    return false;
  }
  
  // Check if all banner rows have valid data
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
    position: fixed;
    top: 20px;
    right: 20px;
    background: ${type === 'error' ? '#e74c3c' : type === 'success' ? '#27ae60' : '#3498db'};
    color: white;
    padding: 15px 20px;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.2);
    z-index: 1000;
    font-weight: 600;
    animation: slideIn 0.3s ease;
  `;
  
  notification.innerHTML = message;
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.remove();
  }, 4000);
}

// Fixed form submission with proper bill history handling
billForm.addEventListener("submit", (e) => {
  e.preventDefault();
  
  if (!validateForm()) {
    return;
  }
  
  console.log("Form submitted, processing bill...");
  
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
    const bannerTotal = (height * width * rate * qty) + (bondQty * 50);
    totalAmount += bannerTotal;
    totalSqft += sqFt;

    banners.push({ 
      name, 
      height, 
      width, 
      qty, 
      rate, 
      bondQty,
      sqFt: sqFt,
      amount: bannerTotal
    });
  });

  // Load existing bill history
  const existingHistory = loadBillHistory();
  
  // Generate new bill number
  const billNo = existingHistory.length > 0 ? Math.max(...existingHistory.map(b => parseInt(b.billNo) || 0)) + 1 : 100;

  const billData = {
    billNo: billNo,
    customerName: customerName,
    customerCity: customerCity,
    date: date,
    bannerTitle: bannerTitle || "Banner Order",
    banners: banners,
    totalAmount: totalAmount,
    totalSqft: totalSqft,
    isPending: isPending,
    pendingAmount: pendingAmount,
    createdAt: new Date().toISOString()
  };

  console.log("Bill data created:", billData);

  // Add to existing history
  existingHistory.push(billData);
  
  // Save updated history
  if (saveBillHistory(existingHistory)) {
    console.log("Bill saved to history successfully");
    
    // Save current bill for display
    if (saveCurrentBill(billData)) {
      console.log("Current bill saved for display");
      
      // Show success message
      showNotification(`Bill #${billNo} generated successfully!`, "success");
      
      // Redirect to bill page after a short delay
      setTimeout(() => {
        window.location.href = "bill.html";
      }, 1000);
    } else {
      showNotification("Error saving bill for display!", "error");
    }
  } else {
    showNotification("Error saving bill to history!", "error");
  }
});

// Periodic check for preset updates from admin panel (every 5 seconds)
function checkForPresetUpdates() {
  try {
    const lastUpdate = localStorage.getItem(STORAGE_KEYS.LAST_UPDATE);
    const currentPresets = JSON.stringify(loadPresetRates());
    
    // Check if presets have changed
    const storedPresets = localStorage.getItem(STORAGE_KEYS.PRESET_RATES);
    if (storedPresets && storedPresets !== currentPresets) {
      updateBannerRowPresets();
    }
  } catch (e) {
    console.log("Error checking for preset updates:", e);
  }
}

setInterval(checkForPresetUpdates, 5000);

// Initialize on page load
document.addEventListener("DOMContentLoaded", function() {
  console.log("Calculator initialized");
  
  // Ensure localStorage is working
  try {
    localStorage.setItem('test', 'test');
    localStorage.removeItem('test');
    console.log("localStorage is working");
  } catch (e) {
    console.error("localStorage not available:", e);
    showNotification("Warning: Data storage not available. Bills may not be saved.", "error");
  }
  
  // Load and verify bill history
  const history = loadBillHistory();
  console.log("Current bill history count:", history.length);
  
  // Create first banner row
  createBannerRow();
  
  // Auto-fill today's date if not set
  const dateInput = document.getElementById("billDate");
  if (dateInput && !dateInput.value) {
    dateInput.valueAsDate = new Date();
  }
  
  // Add CSS for notifications
  const style = document.createElement('style');
  style.textContent = `
    @keyframes slideIn {
      from { transform: translateX(100%); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
  `;
  document.head.appendChild(style);
  
  console.log("Calculator setup complete");
});