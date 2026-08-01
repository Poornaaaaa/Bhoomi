# 🏗️ Pc | 3D Architectural Visualizer & ERP

**Pc Builders ERP** is an all-in-one interactive WebGL 3D architectural visualizer and construction project management platform. Designed for architectural directors, civil engineers, project managers, and clients, it combines real-time 3D building rendering with complete construction supply chain, inventory, and quality audit management.

---

## ✨ Features

### 🏢 1. Real-Time 3D Architectural Visualizer & Designer
* **Interactive 3D WebGL Engine**: Powered by Three.js with full 360° pan, zoom, and rotate controls.
* **Parametric Customization**: Dynamically alter floors (1–3 stories), balcony styles (glass/steel), roof architecture (flat/sloped), exterior walls, doors, and verandas in real-time.
* **Lighting Controls**: Switch between Day Mode, Night Mode, ambient lighting, and toggle interior house lights.
* **Texture & Material Switching**: Real-time rendering of vitrified tiles, marble, timber, concrete, and painted surfaces.

### 📐 2. Interactive Site Floor Plan & Defect Pinning (Punch List)
* **2D Floor Plan Blueprint**: Interactive spatial view of building zones (Living Core, Bedroom Suite, Balconies).
* **Defect Location Pinning**: Click anywhere on the floor plan to pinpoint site issues (tile voids, exposed rebars, expansion joints).
* **Severity Tracking**: Filter and manage pins by severity (`Critical`, `Warning`, `Resolved`), assign supervisors, and log detailed engineering notes.

### 📦 3. Materials Inventory & Cost Calculator
* **Live Material Inventory**: Track stock levels for key construction resources (TMT Rebars, OPC Cement, Vitrified Tiles, Aggregates, River Sand).
* **Stock Alert System**: Automated status badges (`Optimal`, `Low Stock`) when inventory drops below safety thresholds.
* **Cost Estimator**: Calculate subtotal, taxes, labor rates, and total expenditure dynamically.

### 🚚 4. Supply Chain & Purchase Order (PO) Management
* **Purchase Order Tracking**: Full lifecycle tracking of procurement orders across vendors (Kajaria, JSW Steel, UltraTech, Asian Paints).
* **PO Status Workflow**: Track status from `Pending` and `Approved` to `In Transit` and `Delivered & Stored`.
* **Financial Breakdowns**: Transparent subtotal, GST/tax calculations, and itemized receipts.

### 📊 5. Financial Analytics & Executive Dashboard
* **Budget Tracking**: Monitor overall project budget, total spend, and completion progress percentage.
* **Planned vs. Actual Spend Charting**: Multi-month financial analysis comparing baseline budget vs. real-world expenses.
* **Quality Audit Inspection Logs**: Track site compliance (Concrete Slump tests, Rebar cover checks, Scaffolding safety).
* **Daily Engineering Tips**: Rotating engineering tip banner for site best practices.

### 🎨 6. Modern Glassmorphism UI & Dynamic Multi-Theme
* **Glassmorphism Design System**: Sleek liquid glass backdrop with floating glass cards, blur effects, and smooth micro-animations.
* **Multi-Color Theme Picker**: Instantly switch UI color themes:
  * 🔵 **Blue Ocean** (Default)
  * 🔴 **Red Ruby**
  * ⚪ **Frost White**
  * 🟢 **Emerald Green**
  * ✨ **Ultra Glossy**
* **Responsive Navigation & Search**: Horizontal tab navigation and global search across stock, POs, and 3D specs.

---

## 🛠️ Tech Stack

| Component | Technology |
| :--- | :--- |
| **3D Rendering** | [Three.js (r128)](https://threejs.org/) + OrbitControls |
| **Styling & UI** | CSS3 (Vanilla Glassmorphic Utilities) + [Tailwind CSS CDN](https://tailwindcss.com/) |
| **Logic & State** | Pure JavaScript (ES6+ Vanilla JS) |
| **Typography** | Google Fonts (*Plus Jakarta Sans* & *Lora*) |
| **Icons** | Google Material Symbols Outlined |

---

## 🚀 Getting Started

Since this is a lightweight, zero-dependency client-side application, no build steps or bundlers are required!

### Prerequisites
* Any modern web browser (Google Chrome, Mozilla Firefox, Microsoft Edge, Safari) with WebGL support enabled.

### Run Locally

1. **Clone the repository:**
   ```bash
   git clone https://github.com/YourUsername/construction-erp.git
