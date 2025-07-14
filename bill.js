// In-memory storage
let sessionData = {
  latestBill: null
};

// Load bill from localStorage
function loadLatestBill() {
  try {
    const stored = localStorage.getItem("latestBill");
    if (stored) {
      sessionData.latestBill = JSON.parse(stored);
    }
  } catch (e) {
    console.log("No latest bill found");
  }
}

window.onload = function () {
  loadLatestBill();
  const data = sessionData.latestBill;
  if (!data) {
    alert("No bill data found! Redirecting...");
    window.location.href = "index.html";
    return;
  }

  document.getElementById("billNo").textContent = data.billNo || "-";
  document.getElementById("billDate").textContent = data.date || "-";
  document.getElementById("customerName").textContent = data.customerName || "-";
  document.getElementById("customerCity").textContent = data.customerCity || "-";
  document.getElementById("bannerTitle").textContent = data.bannerTitle || "-";

  const tbody = document.getElementById("bannerTableBody");
  tbody.innerHTML = "";
  let grandTotal = 0;

  data.banners.forEach((banner, index) => {
    const height = parseFloat(banner.height || 0);
    const width = parseFloat(banner.width || 0);
    const qty = parseInt(banner.qty || 1);
    const rate = parseFloat(banner.rate || 0);
    const bondQty = parseInt(banner.bondQty || 0);

    const size = `${height}×${width} ft`;
    const bannerCost = height * width * rate * qty;
    const bondCost = bondQty * 50;
    const total = bannerCost + bondCost;
    grandTotal += total;

    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${index + 1}</td>
      <td>${banner.name || "Banner"}</td>
      <td>${size}</td>
      <td>${qty}</td>
      <td>₹${rate.toFixed(2)}</td>
      <td>${bondQty}</td>
      <td>₹${total.toFixed(2)}</td>
    `;
    tbody.appendChild(tr);
  });

  document.getElementById("totalAmount").textContent = grandTotal.toFixed(2);

  if (data.isPending && parseFloat(data.pendingAmount) > 0) {
    document.getElementById("pendingAmountText").style.display = "block";
    document.getElementById("pendingAmount").textContent = parseFloat(data.pendingAmount).toFixed(2);
  }
};

function downloadPDF() {
  alert("🛠 PDF download feature coming soon! Use Print for now.");
  window.print();
}
