let bannerCount = 0;
const bannerContainer = document.getElementById("bannerContainer");
const totalAmountEl = document.getElementById("totalAmount");
const billForm = document.getElementById("calcForm");

// Load preset rates from localStorage
function loadPresetRates() {
  const presets = JSON.parse(localStorage.getItem("presetRates")) || {
    "Flex": 30,
    "Vinyl": 40,
    "Glow Sign": 50
  };
  return presets;
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

// Missing addBanner function - FIX
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

  rows.forEach(row => {
    const height = parseFloat(row.querySelector(".height")?.value || 0);
    const width = parseFloat(row.querySelector(".width")?.value || 0);
    const quantity = parseInt(row.querySelector(".quantity")?.value || 1);
    const rate = parseFloat(row.querySelector(".rateInput")?.value || 0);
    const bondQty = parseInt(row.querySelector(".bondQty")?.value || 0);
    
    const sqFt = height * width;
    const bannerTotal = sqFt * rate * quantity;
    const bondCharge = bondQty * 50; // ₹50 per bond
    total += bannerTotal + bondCharge;
  });

  totalAmountEl.innerText = `Total: ₹${total.toFixed(2)}`;
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
    alert("Please enter customer name!");
    return false;
  }
  
  if (bannerRows.length === 0) {
    alert("Please add at least one banner!");
    return false;
  }
  
  // Check if all banner rows have valid data
  for (let row of bannerRows) {
    const height = parseFloat(row.querySelector(".height")?.value || 0);
    const width = parseFloat(row.querySelector(".width")?.value || 0);
    const rate = parseFloat(row.querySelector(".rateInput")?.value || 0);
    
    if (height <= 0 || width <= 0 || rate <= 0) {
      alert("Please fill all banner details with valid values!");
      return false;
    }
  }
  
  return true;
}

// Fixed form submission
billForm.addEventListener("submit", (e) => {
  e.preventDefault();
  
  if (!validateForm()) {
    return;
  }
  
  const customerName = document.getElementById("customerName").value.trim();
  const customerCity = document.getElementById("customerCity").value.trim() || "Not specified";
  const date = document.getElementById("billDate").value || new Date().toISOString().slice(0,10);
  const bannerTitle = document.getElementById("bannerTitle").value.trim();

  const isPending = document.getElementById("isPending").checked;
  const pendingAmount = isPending ? parseFloat(document.getElementById("pendingAmount").value || 0) : 0;

  const banners = [];
  let totalAmount = 0;

  document.querySelectorAll(".bannerRow").forEach(row => {
    const height = parseFloat(row.querySelector(".height")?.value || 0);
    const width = parseFloat(row.querySelector(".width")?.value || 0);
    const qty = parseInt(row.querySelector(".quantity")?.value || 1);
    const rate = parseFloat(row.querySelector(".rateInput")?.value || 0);
    const bondQty = parseInt(row.querySelector(".bondQty")?.value || 0);
    const name = row.querySelector(".banner-name")?.value.trim() || "Banner";

    const sqFt = height * width;
    const bannerTotal = (sqFt * rate * qty) + (bondQty * 50);
    totalAmount += bannerTotal;

    banners.push({ 
      name, 
      height, 
      width, 
      qty, 
      rate, 
      bondQty
    });
  });

  // Get bill history and generate new bill number
  const history = JSON.parse(localStorage.getItem("billHistory") || "[]");
  const billNo = history.length > 0 ? Math.max(...history.map(b => b.billNo || 0)) + 1 : 100;

  const billData = {
    billNo,
    customerName,
    customerCity,
    date,
    bannerTitle,
    banners,
    totalAmount,
    isPending,
    pendingAmount
  };

  // Save to history
  history.push(billData);
  localStorage.setItem("billHistory", JSON.stringify(history));
  
  // Save current bill for display
  localStorage.setItem("latestBill", JSON.stringify(billData));

  // Show success message
  alert("Bill generated successfully!");
  
  // Redirect to bill page
  window.location.href = "bill.html";
});

// Initialize first banner row
document.addEventListener("DOMContentLoaded", function() {
  createBannerRow();
  
  // Auto-fill today's date if not set
  const dateInput = document.getElementById("billDate");
  if (!dateInput.value) {
    dateInput.valueAsDate = new Date();
  }
});