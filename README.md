# 🧾 Banner Printing Billing System – Shaikh Digital & Redium

A modern, responsive, and backend-less billing system for banner printing businesses, built with **HTML, CSS, and JavaScript**.  
This tool is designed for easy, automated bill calculation: handling banner size, quantity, dynamic bond rate, different material rates, full bill history, and complete admin control — ideal for shops like **Shaikh Digital & Redium**.

> 🔗 [Live Demo »](https://ammarsk22.github.io/Banner-Printing-web/index.html)

---

## ✨ Key Features

- **Real-Time Calculation:**  
  Automatically calculates area (sq.ft), total price, quantity, and bonding charges using up-to-date preset or custom rates for Flex, Vinyl, Glow Sign, etc.

- **Dynamic Bond Rate Management:**  
  Bond charges (₹/piece) are now fully dynamic. Change bond rate anytime from the Admin Panel or using the browser console (`setBondRate(newRate)`).  
  Default bond rate: **₹50**

- **Preset Banner Rate Management:**  
  Admin Panel allows full control to add, remove, rename, or set rates for banner types. Presets are instantly reflected across the system.

- **Smart Billing:**  
  Custom or preset rates per item, payment pending tracking, auto-generated, incrementing Bill No., instant and printable/downloadable bill formats.

- **Secure Bill History:**  
  View, search, and delete previous bills, with all bill data stored locally in your browser (no backend needed).  
  Bill numbers auto-increment from **100**.

- **Import/Export Backup (JSON):**  
  Export complete application data (bills, rates, bond rate) as a backup. Restore everything anytime, on any device—import JSON backups using the Admin Panel.

- **Admin Panel:**  
  Secure admin area (Password: `Shaikh@2012`) for:
  - Editing banner rates/types
  - Changing bond rate
  - Importing/exporting backups (all settings + history)
  - All actions live-sync to main calculator

- **Mobile Responsive:**  
  Clean UI, fully responsive — works on phone, tablet, desktop.

- **No Backend Required:**  
  All data is saved using browser `localStorage`. Runs offline, out-of-the-box.

---

## 📸 Screenshots

| Main Calculator |
|-----------------|
| <img width="1920" height="1894" alt="image" src="https://github.com/user-attachments/assets/c886ea6e-7cc4-4bc3-80a3-a1313498234a" />

| Admin Panel |
|-----------------|
| <img width="1920" height="2357" alt="image" src="https://github.com/user-attachments/assets/c50ee293-a7e8-44c9-82e0-dd93a69d6b02" />

| Bill Preview |
|-----------------|
| <img width="1920" height="1084" alt="image" src="https://github.com/user-attachments/assets/c7c1123b-1f52-408f-80eb-28a9f97a534a" /> |

---

## 📂 Project Structure

| File           | Description                                      |
|----------------|--------------------------------------------------|
| `index.html`   | Main calculator form                             |
| `bill.html`    | Bill preview with print/download                 |
| `admin.html`   | Admin Panel (rates, bond, backup control)        |
| `history.html` | Previous bills viewer                            |
| `calculator.js`| Main calculation & app logic                     |
| `bill.js`      | Loads & displays current bill                    |
| `README.md`    | Project documentation                            |

---

## 🚀 How to Use

1. Visit: **[https://ammarsk22.github.io/Banner-Printing-web/](https://ammarsk22.github.io/Banner-Printing-web/)**
2. Fill customer details, select/enter banner details (size, qty, rate, bond quantity if needed).
3. Click **"Generate Bill"**.  
   > Total amount & square feet auto-calculate.
4. Print or download your bill.

### Admin Panel Access

- Menu → **Admin Panel**
- Password: `Shaikh@2012`
- Manage everything here:
  - Add/Edit/Rename/Delete Banner Types & Rates
  - Change Bond Rate
  - Import entire backup (`JSON`) to restore all data/settings
  - Export backup (`JSON`) to save all rates, bond settings, and bill history

---

## 🧰 Example: Bond Rate & Backup Management

- Change bond rate for all bills any time (e.g., Admin Panel or run `setBondRate(60)` in browser console).
- Backup everything:  
  - Create/export backup to archive or transfer all bills and settings.
  - Import backup to restore on any browser/device.

---

## 🗃 Bill History

- Auto-increment Bill No. (starts at 100)
- Full history saved securely in browser storage.
- Search previous bills; delete if needed.

---

## 👩‍💻 Technologies Used

- HTML5 + CSS3 (Responsive)
- Vanilla JavaScript (no frameworks)
- Data saved in `localStorage`; can expand with backend if needed (e.g., Firebase, MySQL).

---

## 👨‍💻 Developed By

**Ammar Shaikh**  
📧 Email: [ammarsk200422@gmail.com](mailto:ammarsk200422@gmail.com)  
🌐 GitHub: [@Ammarsk22](https://github.com/Ammarsk22)  
🛠 Built as a personal/family business project for **Shaikh Digital & Redium**, Shindkheda (MH)

---

## 📜 License

This project is open-source and free to use under the [MIT License](LICENSE).

---

> ⚠️ Note: All data is stored locally on your browser. No internet/server required.  
> For production use, cloud/database features can be added later.

