# 🏙️ CitySync — Integrated Smart Urban & Health Ecosystem

CitySync is an intelligent, multi-modal civic and personal health ecosystem connecting citizen medical vitals with city infrastructure services.

---

## 🌟 Key Features

1. **Unified Authentication Gateway:**
   - **Citizen Registration:** Pre-registration capturing name, mobile, age, gender, blood group, medical condition, daily medications, and consulting physician.
   - **Biometric Face ID:** Optical face scanning via device webcam with alignment laser.
   - **Fingerprint Verification:** Capacitive biometric scanner simulation.
   - **Password Access:** Standard credentials fallback.

2. **AI Voice Assistant (Priority Control):**
   - Built-in Web Speech Recognition and Text-to-Speech synthesis.
   - Multi-lingual regional language support: **English (`en-IN`)**, **Hindi (`hi-IN`)**, **Kannada (`kn-IN`)**, and **Telugu (`te-IN`)**.
   - Spoken query recognition:
     - *"I need to go to the government office"*
     - *"I need to find a pharmacy near me"*
     - *"There is flooding on my road"*
     - *"File a complaint about broken road"*
     - *"Open home health"*

3. **Home Health & Faint Detection Vision Guard:**
   - Exclusively shows the registered user's health card, vitals (BP, Pulse, $\text{SpO}_2$, Temp), and prescription schedule with medicine toggles.
   - Real-time optical motion analysis watching for sudden drops/collapses.
   - Synthesizes a high-pitch emergency alarm beep (950Hz - 1550Hz sawtooth waveform).
   - Automatically dispatches SMS distress alert with incident timestamp to the registered mobile number.

4. **Civic Road Grievance Portal (Sahaya):**
   - File complaints for potholes, streetlights, flooded culverts, and water pipeline leaks.
   - Instant assignment of token numbers (`CMP-2026-XXX`) tracked with status updates.

5. **Flooding Radar & Safe Detour Navigation:**
   - Interactive Leaflet GIS map.
   - **Red Dashed Polyline:** Exact waterlogged or choked road segments.
   - **Green Polyline:** Verified safe, elevated bypass/detour routes.

6. **Doctor Dashboard & Health Radar (Ayurmitra):**
   - Epidemic hotspots with case counts, risk levels, and clinical advisories.
   - Nearby hospitals with live bed counts, ICU units, and direct 108/102 ambulance dialing.

7. **Fast Hand Gesture Navigator:**
   - 60 FPS motion loop for contactless kiosk navigation.
   - Left/Right wave to switch sections; pinch/spread to zoom in/out on interactive GIS maps.

---

## 🚀 How to Run

1. **Activate Environment & Run Server:**
   ```powershell
   cd c:\Users\sanut\Downloads\CITYSYNCH
   python app.py
   ```

2. **Access the Portal:**
   Open [http://localhost:5055](http://localhost:5055) in any modern web browser (Chrome, Edge, Firefox, Brave).
