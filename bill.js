// Get bill data from localStorage
function getBillFromLocalStorage() {
  try {
    const stored = localStorage.getItem("currentBill");
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.warn("Error reading bill data from localStorage");
  }
  return null;
}

window.onload = function () {
  const data = getBillFromLocalStorage();
  
  if (!data) {
    alert("No bill data found! Redirecting...");
    window.location.href = "index.html";
    return;
  }

  // Populate bill header information
  document.getElementById("billNo").textContent = data.billNo || "-";
  document.getElementById("billDate").textContent = data.date || "-";
  document.getElementById("customerName").textContent = data.customerName || "-";
  document.getElementById("customerCity").textContent = data.customerCity || "-";
  document.getElementById("bannerTitle").textContent = data.bannerTitle || "-";

  // Populate banner table
  const tbody = document.getElementById("bannerTableBody");
  tbody.innerHTML = "";
  let grandTotal = 0;
  let totalSqft = 0;

  data.banners.forEach((banner, index) => {
    const height = parseFloat(banner.height || 0);
    const width = parseFloat(banner.width || 0);
    const qty = parseInt(banner.qty || 1);
    const rate = parseFloat(banner.rate || 0);
    const bondQty = parseInt(banner.bondQty || 0);

    const size = `${height}×${width} ft`;
    const sqFt = height * width * qty;
    const bannerCost = height * width * rate * qty;
    const bondCost = bondQty * 50;
    const total = bannerCost + bondCost;
    
    grandTotal += total;
    totalSqft += sqFt;

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

  // Update totals
  document.getElementById("totalAmount").textContent = grandTotal.toFixed(2);
  document.getElementById("totalSqft").textContent = totalSqft.toFixed(2);

  // Handle pending amount
  if (data.isPending && parseFloat(data.pendingAmount || 0) > 0) {
    const pendingBox = document.getElementById("pendingAmountBox");
    const pendingAmount = document.getElementById("pendingAmount");
    
    if (pendingBox && pendingAmount) {
      pendingBox.style.display = "block";
      pendingAmount.textContent = parseFloat(data.pendingAmount).toFixed(2);
    }
  }
};

function downloadPDF() {
  // Show a modern notification instead of alert
  showNotification("🛠 PDF download feature coming soon! Use Print for now.", "info");
  
  // Trigger print as fallback
  setTimeout(() => {
    window.print();
  }, 1000);
}

function showNotification(message, type = "info") {
  const notification = document.createElement('div');
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: ${type === 'info' ? '#3498db' : '#27ae60'};
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
  
  // Add slide-in animation
  const style = document.createElement('style');
  style.textContent = `
    @keyframes slideIn {
      from { transform: translateX(100%); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
  `;
  document.head.appendChild(style);
  
  setTimeout(() => {
    notification.remove();
    style.remove();
  }, 4000);
}

// Clean up localStorage when leaving the page
window.addEventListener('beforeunload', function() {
  try {
    localStorage.removeItem("currentBill");
  } catch (e) {
    console.warn("Error cleaning up localStorage");
  }
});