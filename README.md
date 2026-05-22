# 📸 GetWeb Screenshot

GetWeb Screenshot is a sleek, premium, and fully responsive web-based application designed to capture high-quality screenshots of any webpage instantly. Powered by React, Vite, and the Microlink API, it delivers a gorgeous glassmorphic interface with robust download and export options.

---

## ✨ Features

- **Instant Captures:** Fetch full-page screenshot previews in seconds simply by pasting a URL.
- **Device Viewport Presets:** Quick-toggle layout widths matching standard device dimensions:
  - 🖥️ **Desktop** (1920px)
  - 📁 **Tablet** (768px)
  - 📱 **Mobile** (375px)
- **Custom Viewport Control:** Manually specify pixel widths to test layouts at any breakpoint.
- **Multiple Formats:** Capture and save screenshots in high-fidelity **PNG** or optimized **JPG**.
- **Cors-Safe Image Downloads:** Safe, local downloads utilizing a proxy helper to ensure reliable file downloads.
- **Export to PDF:** Instantly generate a printable PDF version of your captured webpage.
- **Modern Premium UI/UX:** Stunning glassmorphism styling built with vanilla CSS variables, interactive micro-animations, loading skeletons, and fluid transition effects.

---

## 🛠️ Technology Stack

- **Framework:** React 19
- **Build Tool:** Vite 8
- **Icons:** Lucide React
- **Styles:** Custom Vanilla CSS (featuring CSS Custom Properties for theme tokens)
- **API Engine:** Microlink API (for cloud-based screenshot generation)

---

## 🚀 Getting Started

Follow these steps to run the project locally on your machine.

### Prerequisites

Ensure you have [Node.js](https://nodejs.org/) installed (version 18+ is recommended).

### 1. Clone the repository & Navigate
```bash
cd GetWeb_Screenshot-main
```

### 2. Install dependencies
```bash
npm install
```

### 3. Start the development server
```bash
npm run dev
```
The application will start, typically available at `http://localhost:5173`.

### 4. Build for production
```bash
npm run build
```

---

## 📂 Project Structure

```text
GetWeb_Screenshot-main/
├── public/                 # Static assets (Favicons, images)
├── src/
│   ├── assets/             # Images and design resources
│   ├── App.css             # Supplementary template styles
│   ├── App.jsx             # Core application layout, state, and API logic
│   ├── index.css           # Styling system & glassmorphism theme rules
│   └── main.jsx            # React root mount point
├── index.html              # HTML shell
├── package.json            # Scripts & dependencies
└── vite.config.js          # Vite build configuration
```
