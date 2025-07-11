let billNo = parseInt(localStorage.getItem("lastBillNo")) || 100;

function loadBill() {
  const data = JSON.parse(localStorage.getItem("billData"));
  if (!data) {
    document.getElementById("billData").textContent = "No data available.";
    return;
  }

  const date = document.getElementById("date").value;
  const name = document.getElementById("customerName").value;
  const city = document.getElementById("customerCity").value;

  const html = `
    <strong>Bill No:</strong> ${billNo}<br>
    <strong>Date:</strong> ${date}<br>
    <strong>Customer:</strong> ${name} (${city})<br><hr>
    Type: ${data.type}<br>
    Size: ${data.height} x ${data.width} (${data.unit})<br>
    Area: ${data.area.toFixed(2)} sq.ft<br>
    Rate: ₹${data.rate}/sq.ft<br><hr>
    <strong>Total: ₹${data.total.toFixed(2)}</strong>
  `;
  document.getElementById("billData").innerHTML = html;

  // Save history
  if (date && name && city) {
    const history = JSON.parse(localStorage.getItem("billHistory") || "[]");
    history.push({ billNo, name, city, date, total: data.total });
    localStorage.setItem("billHistory", JSON.stringify(history));
    billNo++;
    localStorage.setItem("lastBillNo", billNo.toString());
  }
}

function printBill() {
  window.print();
}

function downloadPDF() {
  html2pdf().from(document.getElementById("billData")).save("ShaikhDigital_Bill.pdf");
}

document.getElementById("date").addEventListener("change", loadBill);
document.getElementById("customerName").addEventListener("input", loadBill);
document.getElementById("customerCity").addEventListener("input", loadBill);

// Set default date to today
document.getElementById("date").value = new Date().toISOString().split("T")[0];

loadBill();
