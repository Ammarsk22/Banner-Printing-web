
function addBannerRow() {
  const container = document.getElementById("bannerList");
  const row = document.createElement("div");
  row.className = "bannerRow";
  row.innerHTML = `
    <input type="number" placeholder="Height (ft)" class="height" required>
    <input type="number" placeholder="Width (ft)" class="width" required>
    <input type="number" placeholder="Rate ₹/sq.ft" class="rate" required>
    <input type="number" placeholder="Quantity" class="quantity" value="1" min="1" required>
  `;
  container.appendChild(row);
}

function toggleBond() {
  document.getElementById("bondQty").style.display =
    document.getElementById("bondingCheck").checked ? "inline-block" : "none";
}

document.getElementById("bannerForm").addEventListener("submit", function (e) {
  e.preventDefault();
  let total = 0;
  const banners = document.querySelectorAll(".bannerRow");
  banners.forEach((row) => {
    const h = parseFloat(row.querySelector(".height").value);
    const w = parseFloat(row.querySelector(".width").value);
    const r = parseFloat(row.querySelector(".rate").value);
    const q = parseInt(row.querySelector(".quantity").value);
    const area = h * w;
    total += area * r * q;
  });

  if (document.getElementById("bondingCheck").checked) {
    const bq = parseInt(document.getElementById("bondQty").value || "0");
    const bondRate = 50;
    total += bq * bondRate;
  }

  document.getElementById("totalAmount").innerHTML = "<h2>Total: ₹" + total.toFixed(2) + "</h2>";

  const billData = {
    banners: Array.from(banners).map((row) => ({
      height: parseFloat(row.querySelector(".height").value),
      width: parseFloat(row.querySelector(".width").value),
      rate: parseFloat(row.querySelector(".rate").value),
      quantity: parseInt(row.querySelector(".quantity").value),
    })),
    bondQty: document.getElementById("bondingCheck").checked
      ? parseInt(document.getElementById("bondQty").value || "0")
      : 0,
    bondRate: 50,
    total: total
  };
  localStorage.setItem("billData", JSON.stringify(billData));
});

function saveAndNext() {
  window.location.href = "bill.html";
}
