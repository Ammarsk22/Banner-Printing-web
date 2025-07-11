let latestArea = 0;
let latestTotal = 0;
let billNo = 100;

function calculate() {
  const unit = document.getElementById('unit').value;
  const height = parseFloat(document.getElementById('height').value);
  const width = parseFloat(document.getElementById('width').value);
  const rate = parseFloat(document.getElementById('rate').value);

  if (isNaN(height) || isNaN(width) || isNaN(rate)) {
    document.getElementById('result').textContent = 'Please enter valid numbers for all fields.';
    return;
  }

  const heightFeet = unit === 'inch' ? height / 12 : height;
  const widthFeet = unit === 'inch' ? width / 12 : width;
  const area = heightFeet * widthFeet;
  const total = area * rate;

  latestArea = area;
  latestTotal = total;

  document.getElementById('result').innerHTML = `
    Area: <strong>${area.toFixed(2)} sq. ft.</strong><br>
    Total Price: <strong>₹${total.toFixed(2)}</strong>
  `;
}

function generateBill() {
  const height = document.getElementById('height').value;
  const width = document.getElementById('width').value;
  const rate = document.getElementById('rate').value;
  const unit = document.getElementById('unit').value;
  const date = document.getElementById('date').value;
  const name = document.getElementById('customerName').value.trim();
  const city = document.getElementById('customerCity').value.trim();

  if (!height || !width || !rate || !name || !city || !date || latestArea === 0 || latestTotal === 0) {
    alert('Please fill in all fields and calculate first.');
    return;
  }

  const billText = `
    <strong>Bill No:</strong> ${billNo++}<br>
    <strong>Date:</strong> ${date}<br>
    <strong>Customer Name:</strong> ${name}<br>
    <strong>City:</strong> ${city}<br><hr>
    Dimensions: ${height} × ${width} (${unit})<br>
    Converted to Feet: ${(unit === 'inch' ? (height / 12).toFixed(2) : height)} × ${(unit === 'inch' ? (width / 12).toFixed(2) : width)} ft<br>
    Area: ${latestArea.toFixed(2)} sq. ft<br>
    Rate: ₹${rate} per sq. ft<br><hr>
    <strong>Total Amount: ₹${latestTotal.toFixed(2)}</strong>
  `;

  document.getElementById('billContent').innerHTML = billText;
  document.getElementById('billSection').style.display = 'block';
}

function printBill() {
  window.print();
}

function downloadPDF() {
  const element = document.getElementById('billSection');
  html2pdf().from(element).save('ShaikhDigital_Bill.pdf');
}

document.getElementById('height').addEventListener('input', calculate);
document.getElementById('width').addEventListener('input', calculate);
document.getElementById('rate').addEventListener('input', calculate);
document.getElementById('unit').addEventListener('change', calculate);
