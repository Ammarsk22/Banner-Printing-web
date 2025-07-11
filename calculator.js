function saveAndGo() {
  const unit = document.getElementById("unit").value;
  const height = parseFloat(document.getElementById("height").value);
  const width = parseFloat(document.getElementById("width").value);
  const type = document.getElementById("type").value;

  if (isNaN(height) || isNaN(width)) {
    alert("Please enter height and width.");
    return;
  }

  const rateMap = { vinyl: 35, flex: 25, glow: 45 };
  const rate = rateMap[type];

  const h = unit === "inch" ? height / 12 : height;
  const w = unit === "inch" ? width / 12 : width;
  const area = h * w;
  const total = area * rate;

  // Save in localStorage
  localStorage.setItem("billData", JSON.stringify({ unit, height, width, h, w, area, rate, type, total }));

  window.location.href = "bill.html";
}

document.getElementById("height").addEventListener("input", liveCalc);
document.getElementById("width").addEventListener("input", liveCalc);
document.getElementById("unit").addEventListener("change", liveCalc);
document.getElementById("type").addEventListener("change", liveCalc);

function liveCalc() {
  const unit = document.getElementById("unit").value;
  const height = parseFloat(document.getElementById("height").value);
  const width = parseFloat(document.getElementById("width").value);
  const type = document.getElementById("type").value;

  if (isNaN(height) || isNaN(width)) {
    document.getElementById("result").textContent = "Enter values to calculate...";
    return;
  }

  const rateMap = { vinyl: 35, flex: 25, glow: 45 };
  const rate = rateMap[type];
  const h = unit === "inch" ? height / 12 : height;
  const w = unit === "inch" ? width / 12 : width;
  const area = h * w;
  const total = area * rate;

  document.getElementById("result").innerHTML = `Area: <b>${area.toFixed(2)} sq.ft</b><br>Total: ₹${total.toFixed(2)} (${type})`;
}
