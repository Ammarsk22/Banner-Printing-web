// Load last bill from localStorage
const bill = JSON.parse(localStorage.getItem("lastBill"));

document.getElementById("billNo").innerText = bill.billNo;
document.getElementById("customerName").innerText = bill.customerName;
document.getElementById("customerCity").innerText = bill.city;
document.getElementById("billDate").innerText = bill.date;
document.getElementById("totalAmount").innerText = bill.total;
document.getElementById("bondQty").innerText = bill.bondQty;

// Banner rows
const tableBody = document.getElementById("bannerRows");

bill.banners.forEach((b, i) => {
  const tr = document.createElement("tr");
  tr.innerHTML = `
    <td>${i + 1}</td>
    <td>${b.name || "-"}</td>
    <td>${b.h} × ${b.w}</td>
    <td>${b.qty}</td>
    <td>₹${b.rate}</td>
    <td>${(b.sqFt).toFixed(2)}</td>
    <td>₹${(b.price).toFixed(2)}</td>
  `;
  tableBody.appendChild(tr);
});

// PDF download
function downloadPDF() {
  const element = document.getElementById("billContent");
  const opt = {
    margin: 0.5,
    filename: `ShaikhDigital_Bill_${bill.billNo}.pdf`,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
  };
  html2pdf().set(opt).from(element).save();
}
