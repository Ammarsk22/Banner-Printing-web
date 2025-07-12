let bannerCount = 0;

document.getElementById("billDate").valueAsDate = new Date();

window.onload = () => {
  addBannerRow();
};

function addBannerRow() {
  bannerCount++;
  const div = document.createElement("div");
  div.className = "bannerRow";
  div.id = `banner-${bannerCount}`;
  div.innerHTML = `
    <input type="text" placeholder="Banner Name (optional)" class="bannerName" oninput="updatePreview()">
    <input type="number" placeholder="Height (ft)" class="height" oninput="updatePreview()">
    <input type="number" placeholder="Width (ft)" class="width" oninput="updatePreview()">
    <input type="number" placeholder="Rate (₹/sq.ft)" class="rate" oninput="updatePreview()">
    <input type="number" placeholder="Quantity" class="qty" value="1" min="1" oninput="updatePreview()">
    <button type="button" onclick="removeBannerRow('${div.id}')">❌ Cancel</button>
  `;
  document.getElementById("bannersArea").appendChild(div);
  updatePreview();
}

function removeBannerRow(id) {
  const div = document.getElementById(id);
  if (div) div.remove();
  updatePreview();
}

function toggleBondInput() {
  const bond = document.getElementById("bondingCheckbox").checked;
  document.getElementById("bondQty").style.display = bond ? "block" : "none";
  updatePreview();
}

function togglePendingInput() {
  const pending = document.getElementById("isPending").checked;
  document.getElementById("pendingAmt").style.display = pending ? "block" : "none";
  updatePreview();
}

function updatePreview() {
  const preview = document.getElementById("livePreview");
  let total = 0;
  let html = "<h3>🧾 Bill Summary</h3><ul>";

  document.querySelectorAll(".bannerRow").forEach(row => {
    const name = row.querySelector(".bannerName").value || "Unnamed Banner";
    const h = parseFloat(row.querySelector(".height").value) || 0;
    const w = parseFloat(row.querySelector(".width").value) || 0;
    const rate = parseFloat(row.querySelector(".rate").value) || 0;
    const qty = parseInt(row.querySelector(".qty").value) || 1;

    const sqft = h * w;
    const amount = sqft * rate * qty;
    total += amount;

    html += `<li><strong>${name}</strong>: ${h}ft × ${w}ft × ₹${rate}/sq.ft × ${qty} = ₹${amount.toFixed(2)}</li>`;
  });

  const bondQty = document.getElementById("bondingCheckbox").checked
    ? parseInt(document.getElementById("bondQty").value) || 0
    : 0;
  const bondAmount = bondQty * 50;
  if (bondQty > 0) {
    html += `<li><strong>Bonding</strong>: ₹50 × ${bondQty} = ₹${bondAmount.toFixed(2)}</li>`;
    total += bondAmount;
  }

  html += `</ul><h2>Total Amount: ₹${total.toFixed(2)}</h2>`;
  preview.innerHTML = html;
}

function calculateAndSave() {
  const banners = [];
  let total = 0;

  document.querySelectorAll(".bannerRow").forEach(row => {
    const h = parseFloat(row.querySelector(".height").value) || 0;
    const w = parseFloat(row.querySelector(".width").value) || 0;
    const rate = parseFloat(row.querySelector(".rate").value) || 0;
    const qty = parseInt(row.querySelector(".qty").value) || 1;
    const name = row.querySelector(".bannerName").value;

    const sqFt = h * w;
    const price = sqFt * rate * qty;
    total += price;

    banners.push({ name, h, w, rate, qty, sqFt, price });
  });

  const bondQty = document.getElementById("bondingCheckbox").checked
    ? parseInt(document.getElementById("bondQty").value) || 0
    : 0;
  const bondAmount = bondQty * 50;
  total += bondAmount;

  const name = document.getElementById("customerName").value || "N/A";
  const city = document.getElementById("customerCity").value || "N/A";
  const date = document.getElementById("billDate").value;

  const pending = document.getElementById("isPending").checked
    ? parseFloat(document.getElementById("pendingAmt").value) || 0
    : 0;

  let history = JSON.parse(localStorage.getItem("billHistory")) || [];
  const billNo = 100 + history.length;

  const billData = {
    billNo,
    customerName: name,
    city,
    date,
    banners,
    bondQty,
    total: total.toFixed(2),
    pending: pending.toFixed(2)
  };

  localStorage.setItem("lastBill", JSON.stringify(billData));
  history.push(billData);
  localStorage.setItem("billHistory", JSON.stringify(history));

  window.location.href = "bill.html";
}
