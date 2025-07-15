# 🧾 Banner Printing Billing System – Shaikh Digital & Redium

A modern and responsive billing system for banner printing businesses, built using HTML, CSS, and JavaScript.  
This tool is designed to simplify and automate calculations for banner size, quantity, rate, bonding, and payments — perfect for shops like **Shaikh Digital & Redium**.

> 🔗 [Live Demo »](https://ammarsk22.github.io/Banner-Printing-web/index.html)

---

## ✨ Key Features

✅ **Real-time Calculation**  
- Automatically calculates area (sq.ft), total price, bonding charges, and quantity.  
- Live total amount and sq.ft updates.

✅ **Smart Billing**  
- Supports custom rate or preset rate selection (Vinyl, Flex, Glow Sign).  
- Payment pending section with amount input.  
- Auto-generated bill with print & download support.

✅ **Admin Panel**  
- Secure login (Password: `Shaikh@2012`)  
- Rename banner types and update their rates  
- Broadcast changes to the main calculator page.

✅ **Bill History**  
- View, search, and delete previous bills  
- Stored in browser's `localStorage` (no backend required)

✅ **Mobile Responsive**  
- Works great on phones, tablets, and desktops.

---

## 📸 Preview

<img width="1920" height="2046" alt="image" src="https://github.com/user-attachments/assets/ddb0ba17-4955-4bed-a302-00fc66b90ed5" />


---

## 📂 Project Structure

| File | Description |
|------|-------------|
| `index.html` | Main calculator form |
| `bill.html` | Generated bill preview with print/download |
| `admin.html` | Admin panel to update preset banner types |
| `history.html` | View past bills |
| `calculator.js` | Main logic for form and calculation |
| `bill.js` | Loads current bill data |
| `README.md` | Project documentation |

---

## 🚀 How to Use

1. Visit: **[https://ammarsk22.github.io/Banner-Printing-web/](https://ammarsk22.github.io/Banner-Printing-web/)**
2. Fill in customer and banner details
3. Click **"Generate Bill"**
4. View, print, or download the final bill

Admin panel access:
- Go to the menu → Admin Panel
- Enter password: `Shaikh@2012`
- Edit and save your banner type presets

---

## 👨‍💻 Developed By

**Ammar Shaikh**  
📧 Email: [ammarsk200422@gmail.com](mailto:ammarsk200422@gmail.com)  
🌐 GitHub: [@Ammarsk22](https://github.com/Ammarsk22)  
🛠 Built as a personal project for my father’s business – **Shaikh Digital & Redium**, Shindkheda (MH)

---

## 📜 License

This project is open-source and free to use under the [MIT License](LICENSE).

---

> ⚠️ No backend or server is required. All data is stored in browser `localStorage`. For production use, you can later integrate Firebase or database features.
