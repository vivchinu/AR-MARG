# AR-MARG (એઆર માર્ગ) — Offline WebXR Augmented Reality Maintenance Assistant

> **100% On-Device Spatial AR Troubleshooting Guide for Underground Infrastructure & Industrial Equipment Rooms in Gujarati and English**

🔗 **Live Hosted WebXR Website**: [https://vivchinu.github.io/AR-MARG/](https://vivchinu.github.io/AR-MARG/)  
📦 **GitHub Repository**: [https://github.com/vivchinu/AR-MARG](https://github.com/vivchinu/AR-MARG)

---

## ⚡ Problem Statement & Solution

### The Challenge
Maintenance staff frequently operate in deep underground tunnel sections, subway substations, and reinforced concrete equipment rooms with **zero cellular connectivity or Wi-Fi**. Conventional technical manuals are voluminous PDF documents (hundreds of pages long). When an unfamiliar critical fault occurs, locating the exact troubleshooting procedure takes excessive time, and cloud-based AI tools are unusable without network connectivity.

### The Solution: AR-MARG
**AR-MARG** is an offline-first Augmented Reality web application built with **WebXR and Three.js** that runs entirely client-side on the device:
1. **Zero Cloud Dependency**: Operates 100% offline via PWA caching and client-side indexing.
2. **Dual Input Modes**:
   - **Describe Fault**: Technicians describe symptoms via text or voice (Web Speech API) in **Gujarati** or **English**.
   - **Photograph Fault**: Technicians snap a photo or upload an image; client-side visual classification analyzes damage patterns (thermal hotspots, oil leaks, carbon burns, pink silica saturation) and highlights the affected area.
3. **Cross-Platform Augmented Reality**:
   - **Meta Quest 3**: Native WebXR `immersive-ar` session with color passthrough, hand/controller ray pointing, and a floating 3D spatial HUD panel in the technician's room.
   - **Smartphones (Android & iOS)**: WebXR ARCore surface hit-testing or high-performance Camera Passthrough AR with touch gesture rotation, zoom, and placement.
   - **Desktop / Laptop**: Interactive 3D Digital Twin inspection sandbox with exploded view and thermal heatmap layers.
4. **Bilingual Gujarati & English**:
   - Instant language toggle for all UI elements, 3D spatial pins, manuals, safety protocols (Lockout-Tagout LOTO), and offline Text-to-Speech (TTS) voice narration.

---

## 🛠️ Key Technical Features

- **Procedural 3D Equipment Digital Twins**:
  - `PUMP-400X`: Heavy-Duty 3-Phase Induction Motor & Centrifugal Slurry Pump.
  - `TX-HV-11KV`: Substation 11kV/415V Oil-Immersed Step-Down Transformer.
  - `HVAC-800T`: Industrial Water-Cooled Chiller & Semi-Hermetic Screw Compressor.
- **3D Inspection Layers**:
  - **Exploded View Slider (0% - 100%)**: Smoothly separates components with connection offsets.
  - **Thermal Heatmap Shader**: Renders infrared false-color temperatures (detecting >85°C hotspots).
  - **X-Ray Wireframe Casing**: Inspect internal shafts, bearings, and impellers without disassembly.
- **Virtual AR Tool Simulation**:
  - 🌡️ **Infrared Thermal Scanner**: Surface temperature target readout.
  - ⚡ **Digital Multimeter**: 0.0V AC Lockout-Tagout isolation verification with synthesized audio beeps.
  - 🔧 **Torque Wrench**: Bolt tightening feedback with calibrated ratchet sound effects.
  - 🔍 **Inspection Loupe / Endoscope**: Micro-crack and cavitation analysis.
- **Custom Document Ingestion**:
  - Technicians can drop custom PDF, TXT, or JSON manuals directly from local device storage for immediate offline indexing.

---

## 🚀 How to Run & Access

### 1. Start the Secure Local Dev Server
WebXR requires a Secure Context (HTTPS or localhost). Vite is preconfigured with `@vitejs/plugin-basic-ssl`:

```bash
# Install dependencies
npm install

# Start Vite dev server with SSL & network exposure
npm run dev
```

The terminal displays your access addresses:
```
➜  Local:   https://localhost:5173/
➜  Network: https://<your-local-ip>:5173/
```

### 2. Opening on Meta Quest 3
1. Connect your Meta Quest 3 to the same local Wi-Fi network as your host computer.
2. Open the **Meta Quest Browser** inside the headset.
3. Navigate to `https://<your-local-ip>:5173/` (accept the self-signed local SSL certificate).
4. Tap **"Launch Meta Quest 3 / WebXR AR"**.
5. The Quest 3 switches to color passthrough mode:
   - The 3D equipment model appears directly in front of you.
   - A floating **3D Spatial Canvas HUD** appears to the right with Gujarati/English instructions.
   - Point your Quest controller laser ray and click the floating 3D buttons to step through procedures or trigger Gujarati audio.

### 3. Opening on Smartphones (Android / iPhone)
- **WebXR Mode (Android Chrome with ARCore)**: Tap "Launch Meta Quest 3 / WebXR AR" to place the machine on any detected surface.
- **Camera AR Mode (All phones including iOS Safari)**: Tap **"Phone Camera AR"** to activate the rear camera feed with the 3D model overlaid in real-time. Use touch gestures to drag, rotate, and zoom.

---

## 📂 Project Structure

```
├── index.html                   # Responsive WebXR entry point & spatial HUD
├── vite.config.js               # SSL-enabled Vite configuration
├── package.json                 # Project dependencies (Three.js, Lucide, Vite)
├── public/
│   ├── manifest.json            # PWA manifest for offline installation
│   ├── sw.js                    # Service Worker caching for underground use
│   └── icon.svg                 # Vector PWA icon
└── src/
    ├── index.css                # Cyber-Industrial Glassmorphic HUD styles
    ├── main.js                  # Master application coordinator
    ├── data/
    │   ├── manuals.js           # Bilingual technical manual database
    │   ├── translations.js      # English & Gujarati localization strings
    │   └── sample-fault-images.js # Test fault image generators
    └── engine/
        ├── equipment-models.js  # Procedural Three.js 3D industrial machines
        ├── xr-manager.js        # Universal WebXR & Camera AR manager
        ├── spatial-tools.js     # Virtual AR tools with Web Audio SFX
        └── fault-analyzer.js    # On-device visual classifier & voice engine
```
