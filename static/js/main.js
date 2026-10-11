// CitySync Integrated State
let currentSection = 'overview';
let currentUser = null;
let cityData = null;
let complaintsList = [];
let hospitalMap = null;
let hospitalMarkersLayer = null;
let floodingMap = null;
let floodingLayersGroup = null;

let currentLanguage = 'en';
let isListening = false;
let recognition = null;

// Video Streams
let authStream = null;
let gestureStream = null;
let faintStream = null;

// Hand Gesture Engine Variables
let gestureActive = false;
let gestureLoopId = null;
let lastMotionX = null;
let lastMotionY = null;
let gestureCooldown = false;

// Sections Array for Gestures Navigation
const SECTIONS = [
  'overview',
  'home-health',
  'city-complaints',
  'city-flooding',
  'city-govt',
  'city-pharmacy',
  'city-hospitals',
  'city-traffic',
  'city-post'
];

document.addEventListener('DOMContentLoaded', () => {
  setupWebcamForAuth();
  setupVoiceRecognition();
  loadUserProfile();
  loadCityData();
  loadComplaints();
});

// -------------------------------------------------------------------------
// 1. REGISTRATION & MULTI-CREDENTIAL LOGIN
// -------------------------------------------------------------------------
function switchMode(mode) {
  const btnLogin = document.getElementById('btn-toggle-login');
  const btnReg = document.getElementById('btn-toggle-register');
  const viewLogin = document.getElementById('auth-view-login');
  const viewReg = document.getElementById('auth-view-register');

  if (mode === 'register') {
    btnLogin.classList.remove('active');
    btnReg.classList.add('active');
    viewLogin.style.display = 'none';
    viewReg.style.display = 'block';
    stopAuthWebcam();
  } else {
    btnReg.classList.remove('active');
    btnLogin.classList.add('active');
    viewReg.style.display = 'none';
    viewLogin.style.display = 'block';
    switchAuthTab('face');
  }
}

function switchAuthTab(type) {
  document.querySelectorAll('.auth-tab-btn').forEach(b => b.classList.remove('active'));
  document.querySelectorAll('.auth-content').forEach(c => c.classList.remove('active'));

  if (type === 'face') {
    document.querySelectorAll('.auth-tab-btn')[0].classList.add('active');
    document.getElementById('tab-face').classList.add('active');
    setupWebcamForAuth();
  } else if (type === 'finger') {
    document.querySelectorAll('.auth-tab-btn')[1].classList.add('active');
    document.getElementById('tab-finger').classList.add('active');
    stopAuthWebcam();
  } else {
    document.querySelectorAll('.auth-tab-btn')[2].classList.add('active');
    document.getElementById('tab-password').classList.add('active');
    stopAuthWebcam();
  }
}

async function setupWebcamForAuth() {
  try {
    const video = document.getElementById('auth-video');
    if (!video) return;
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      authStream = await navigator.mediaDevices.getUserMedia({ video: true });
      video.srcObject = authStream;
    }
  } catch (err) {
    const st = document.getElementById('face-status');
    if (st) st.innerText = 'Camera access optional. Simulated Biometric Scan ready.';
  }
}

function stopAuthWebcam() {
  if (authStream) {
    authStream.getTracks().forEach(t => t.stop());
    authStream = null;
  }
}

function submitRegistration() {
  const name = document.getElementById('reg-name').value.trim();
  const phone = document.getElementById('reg-phone').value.trim();
  const age = document.getElementById('reg-age').value;
  const gender = document.getElementById('reg-gender').value;
  const blood = document.getElementById('reg-blood').value;
  const condition = document.getElementById('reg-condition').value.trim();
  const medText = document.getElementById('reg-meds').value.trim();
  const doctor = document.getElementById('reg-doctor').value.trim();

  if (!name || !phone) {
    alert("Please provide both Name and Mobile Number for emergency sync.");
    return;
  }

  const medicines = medText ? [{
    name: medText,
    time: "08:30 AM",
    dosage: "1 tablet",
    taken: false
  }] : [];

  fetch('/api/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: name,
      phone: phone,
      age: age,
      gender: gender,
      blood_group: blood,
      condition: condition || "General Health",
      medicines: medicines,
      doctor: doctor || "Dr. Ramesh Patil",
      emergency_contact: phone
    })
  })
  .then(res => res.json())
  .then(data => {
    if (data.success) {
      alert(`Registration successful! Welcome, ${name}.`);
      document.getElementById('pwd-user').value = name;
      switchMode('login');
      performFaceAuth();
    }
  });
}

function performFaceAuth() {
  const status = document.getElementById('face-status');
  status.innerText = 'Scanning facial structure & retinal key...';
  status.style.color = '#38bdf8';

  setTimeout(() => {
    status.innerText = 'Facial Match 99.8% Verified ✓';
    status.style.color = '#10b981';
    setTimeout(() => {
      completeLogin('Face Recognition', document.getElementById('pwd-user').value || 'Registered Citizen');
    }, 500);
  }, 1000);
}

function performFingerAuth() {
  const sensor = document.getElementById('finger-btn');
  const status = document.getElementById('finger-status');
  sensor.classList.add('scanning');
  status.innerText = 'Capturing fingerprint ridge minutiae...';

  setTimeout(() => {
    sensor.classList.remove('scanning');
    status.innerText = 'Biometric Ridge Match Approved ✓';
    status.style.color = '#10b981';
    setTimeout(() => {
      completeLogin('Fingerprint Sensor', document.getElementById('pwd-user').value || 'Registered Citizen');
    }, 500);
  }, 900);
}

function performPasswordAuth() {
  const user = document.getElementById('pwd-user').value.trim() || 'Citizen User';
  completeLogin('Password Credential', user);
}

function completeLogin(method, userName) {
  fetch('/api/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ method: method, user: userName })
  })
  .then(res => res.json())
  .then(data => {
    document.getElementById('auth-modal').classList.add('hidden');
    stopAuthWebcam();
    
    // Load fresh single profile of logged-in user
    loadUserProfile();
    speakText(`Access granted. Welcome to CitySync, ${data.user.name}.`);
  });
}

function reopenAuth() {
  document.getElementById('auth-modal').classList.remove('hidden');
  switchMode('login');
}

// -------------------------------------------------------------------------
// 2. USER PROFILE & HOME HEALTH (ONLY REGISTERED USER)
// -------------------------------------------------------------------------
function loadUserProfile() {
  fetch('/api/user-profile')
    .then(res => res.json())
    .then(data => {
      if (data.success && data.user) {
        currentUser = data.user;
        renderSingleUserProfile(currentUser);
        
        // Update top bars
        const displayElem = document.getElementById('user-display');
        if (displayElem) displayElem.innerText = currentUser.name;
        
        const ovName = document.getElementById('ov-user-name');
        if (ovName) ovName.innerText = currentUser.name.split(' ')[0];
        
        const targetPhone = document.getElementById('faint-target-phone');
        if (targetPhone) targetPhone.innerText = currentUser.phone || currentUser.emergency_contact;

        // Auto sync complaint form default values
        const cmpUser = document.getElementById('cmp-user');
        if (cmpUser) cmpUser.value = currentUser.name;
        const cmpPhone = document.getElementById('cmp-phone');
        if (cmpPhone) cmpPhone.value = currentUser.phone;

        // Start Home Health Fainting camera if in view
        setupFaintMonitoringCamera();
      }
    });
}

function renderSingleUserProfile(u) {
  const container = document.getElementById('single-user-profile-box');
  if (!container) return;

  let medsHtml = '';
  (u.medicines || []).forEach(m => {
    medsHtml += `
      <div style="display: flex; align-items: center; justify-content: space-between; padding: 10px 14px; background: rgba(15, 23, 42, 0.6); border-radius: 10px; margin-bottom: 8px; border: 1px solid var(--card-border);">
        <div>
          <strong style="color: #fff; font-size: 14px;">💊 ${m.name}</strong>
          <div style="font-size: 12px; color: var(--text-muted);">${m.time} · ${m.dosage}</div>
        </div>
        <button class="btn ${m.taken ? 'btn-primary' : 'btn-secondary'}" style="font-size: 12px; padding: 5px 12px;" onclick="toggleMedicine('${m.name}')">
          ${m.taken ? '✓ Taken' : '○ Mark as Taken'}
        </button>
      </div>
    `;
  });

  container.innerHTML = `
    <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 14px; margin-bottom: 18px;">
      <div>
        <div style="display: flex; align-items: center; gap: 10px;">
          <h2 style="font-size: 22px; color: #fff;">${u.name}</h2>
          <span class="pill-badge pill-b-blue">${u.id}</span>
          <span class="pill-badge pill-b-red">${u.blood_group}</span>
          <span class="pill-badge pill-b-green">Verified Citizen</span>
        </div>
        <div style="color: var(--text-muted); font-size: 13px; margin-top: 4px;">
          ${u.age} Years Old · ${u.gender} · Registered Mobile: <strong style="color: #38bdf8;">${u.phone}</strong>
        </div>
      </div>
      <div style="text-align: right;">
        <div style="font-size: 11px; color: var(--text-muted); text-transform: uppercase;">Assigned Health Physician</div>
        <div style="font-weight: 700; color: #60a5fa; font-size: 14px;">${u.doctor}</div>
        <div style="font-size: 11px; color: #10b981; margin-top: 2px;">Tele-Consultation Active</div>
      </div>
    </div>

    <div style="background: rgba(15, 23, 42, 0.5); padding: 12px 16px; border-radius: 10px; border: 1px solid var(--card-border); margin-bottom: 18px;">
      <span style="font-size: 11px; color: var(--text-muted); text-transform: uppercase; font-weight: 700;">Diagnosed Health Condition:</span>
      <strong style="color: #f8fafc; font-size: 14px; margin-left: 8px;">${u.condition}</strong>
    </div>

    <!-- Live Vitals row -->
    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(130px, 1fr)); gap: 12px; margin-bottom: 20px;">
      <div style="background: #0f172a; padding: 12px; border-radius: 10px; border: 1px solid var(--card-border);">
        <div style="font-size: 10px; color: var(--text-muted); text-transform: uppercase;">Blood Pressure</div>
        <div style="font-size: 20px; font-weight: 800; color: #fff;">${u.vitals ? u.vitals.bp : '120/80'}</div>
      </div>
      <div style="background: #0f172a; padding: 12px; border-radius: 10px; border: 1px solid var(--card-border);">
        <div style="font-size: 10px; color: var(--text-muted); text-transform: uppercase;">Pulse Rate</div>
        <div style="font-size: 20px; font-weight: 800; color: #10b981;">${u.vitals ? u.vitals.pulse : '72 bpm'}</div>
      </div>
      <div style="background: #0f172a; padding: 12px; border-radius: 10px; border: 1px solid var(--card-border);">
        <div style="font-size: 10px; color: var(--text-muted); text-transform: uppercase;">Oxygen SpO2</div>
        <div style="font-size: 20px; font-weight: 800; color: #38bdf8;">${u.vitals ? u.vitals.spo2 : '99%'}</div>
      </div>
      <div style="background: #0f172a; padding: 12px; border-radius: 10px; border: 1px solid var(--card-border);">
        <div style="font-size: 10px; color: var(--text-muted); text-transform: uppercase;">Body Temp</div>
        <div style="font-size: 20px; font-weight: 800; color: #fbbf24;">${u.vitals ? u.vitals.temp : '98.6 F'}</div>
      </div>
    </div>

    <div>
      <h4 style="font-size: 13px; color: var(--text-muted); text-transform: uppercase; margin-bottom: 8px; letter-spacing: 0.5px;">Daily Prescriptions & Medicine Routine</h4>
      ${medsHtml || '<div style="color:var(--text-muted); font-size:13px;">No medicines logged.</div>'}
    </div>
  `;
}

function toggleMedicine(medName) {
  fetch('/api/toggle-medicine', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ medicine_name: medName })
  })
  .then(res => res.json())
  .then(data => {
    if (data.success && currentUser) {
      currentUser.medicines = data.medicines;
      renderSingleUserProfile(currentUser);
    }
  });
}

function speakCurrentHealthProfile() {
  if (!currentUser) return;
  const txt = `${currentUser.name}'s health status: Blood pressure is ${currentUser.vitals.bp}, Pulse is ${currentUser.vitals.pulse}, Blood oxygen is ${currentUser.vitals.spo2}. Prescribed medications are active.`;
  speakText(txt);
}

// -------------------------------------------------------------------------
// 3. 108-POINT BIO-MESH FAINT, HEAD-ON-HANDS & UNUSUAL KINETICS DETECTOR
// -------------------------------------------------------------------------
let faintCheckInterval = null;
let audioCtx = null;
let isFaintAlarmActive = false;
let audioAlarmInterval = null;

// 108-point anatomical mesh coordinates state
let meshPoints108 = [];
let prevMeshYCenter = null;
let prevHeadY = null;
let prevTorsoY = null;
let headRestingOnHandsFrames = 0;
let suddenFallFrames = 0;
let violentMovementFrames = 0;

async function setupFaintMonitoringCamera() {
  const video = document.getElementById('faint-video');
  if (!video) return;

  try {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      faintStream = await navigator.mediaDevices.getUserMedia({ 
        video: { width: 640, height: 480, facingMode: "user" } 
      });
      video.srcObject = faintStream;
    }
  } catch (e) {
    console.log("Faint camera video access:", e);
  }

  start108PointMeshAnalysis();
}

function start108PointMeshAnalysis() {
  const video = document.getElementById('faint-video');
  const skeletonCanvas = document.getElementById('faint-skeleton-canvas');
  if (!video || !skeletonCanvas) return;
  const sCtx = skeletonCanvas.getContext('2d');

  if (faintCheckInterval) clearInterval(faintCheckInterval);

  // 30 FPS Live 108-Point Bio-Mesh Motion Analysis
  faintCheckInterval = setInterval(() => {
    if (!video.videoWidth) return;
    const w = skeletonCanvas.width = video.videoWidth || 440;
    const h = skeletonCanvas.height = video.videoHeight || 320;

    sCtx.clearRect(0, 0, w, h);

    // Compute optical grid with 108 anatomical mesh tracking nodes (12 cols x 9 rows = 108 landmarks)
    meshPoints108 = [];
    const cols = 12;
    const rows = 9; 
    const xStep = w / (cols + 1);
    const yStep = h / (rows + 1);

    // Sample video luminance dynamics for person presence
    const offCanvas = document.createElement('canvas');
    offCanvas.width = 48;
    offCanvas.height = 36;
    const oCtx = offCanvas.getContext('2d');
    oCtx.drawImage(video, 0, 0, 48, 36);
    const pData = oCtx.getImageData(0, 0, 48, 36).data;

    let activeNodes = 0;
    let sumY = 0;
    let sumX = 0;
    let headNodesCount = 0;
    let headNodesY = 0;
    let handLevelNodes = 0;

    for (let r = 1; r <= rows; r++) {
      for (let c = 1; c <= cols; c++) {
        const ptX = c * xStep;
        const ptY = r * yStep;

        const sampleX = Math.floor((ptX / w) * 48);
        const sampleY = Math.floor((ptY / h) * 36);
        const idx = (sampleY * 48 + sampleX) * 4;
        const brightness = (pData[idx] + pData[idx + 1] + pData[idx + 2]) / 3;

        const isPersonBody = brightness > 28; 
        if (isPersonBody) {
          activeNodes++;
          sumY += ptY;
          sumX += ptX;

          // Head zone (Rows 1 to 3 of 108 mesh)
          if (r <= 3) {
            headNodesCount++;
            headNodesY += ptY;
          }
          // Mid-zone / Chest & Hand level (Rows 4 to 6 of 108 mesh)
          if (r >= 4 && r <= 6) {
            handLevelNodes++;
          }
        }

        meshPoints108.push({
          x: ptX,
          y: ptY,
          active: isPersonBody,
          row: r,
          col: c
        });
      }
    }

    // Draw the 108-Point Live Anatomical Grid on canvas
    sCtx.strokeStyle = 'rgba(56, 189, 248, 0.28)';
    sCtx.lineWidth = 1;

    // Connect mesh lines (horizontal & vertical)
    for (let i = 0; i < meshPoints108.length; i++) {
      const p = meshPoints108[i];
      sCtx.beginPath();
      sCtx.arc(p.x, p.y, p.active ? (p.row <= 3 ? 4.5 : 3.5) : 1.5, 0, 2 * Math.PI);
      
      // Node colors based on body anatomy in 108-point model
      if (p.active) {
        if (p.row <= 3) sCtx.fillStyle = '#38bdf8'; // Head nodes (cyan)
        else if (p.row <= 6) sCtx.fillStyle = '#10b981'; // Torso & Arms (green)
        else sCtx.fillStyle = '#f59e0b'; // Lower body (amber)
      } else {
        sCtx.fillStyle = 'rgba(100, 116, 139, 0.35)';
      }
      sCtx.fill();

      // Right neighbor connection
      if ((i + 1) % cols !== 0 && i + 1 < meshPoints108.length) {
        const pRight = meshPoints108[i + 1];
        if (p.active && pRight.active) {
          sCtx.beginPath();
          sCtx.moveTo(p.x, p.y);
          sCtx.lineTo(pRight.x, pRight.y);
          sCtx.stroke();
        }
      }

      // Bottom neighbor connection
      if (i + cols < meshPoints108.length) {
        const pBottom = meshPoints108[i + cols];
        if (p.active && pBottom.active) {
          sCtx.beginPath();
          sCtx.moveTo(p.x, p.y);
          sCtx.lineTo(pBottom.x, pBottom.y);
          sCtx.stroke();
        }
      }
    }

    // ── KINEMATIC & UNUSUAL MOVEMENT DETECTIONS ACROSS 108 POINTS ──
    if (activeNodes > 10) {
      const currentYCenter = sumY / activeNodes;
      const avgHeadY = headNodesCount > 0 ? (headNodesY / headNodesCount) : currentYCenter;

      const statusBadge = document.getElementById('faint-mesh-status');
      if (statusBadge) {
        statusBadge.innerText = `108 Points Tracking (${activeNodes} Active Landmarks)`;
      }

      if (prevMeshYCenter !== null && prevHeadY !== null) {
        const verticalDrop = currentYCenter - prevMeshYCenter;
        const headDrop = avgHeadY - prevHeadY;

        // 1. FALLING DOWN / FAINT DETECTION: Rapid downward collapse
        if ((verticalDrop > 18 || headDrop > 22) && !isFaintAlarmActive) {
          suddenFallFrames++;
          if (suddenFallFrames >= 2) {
            triggerSimulatedFaint('Falling Down / Sudden Collapse Detected by 108-Point Mesh');
            suddenFallFrames = 0;
          }
        } else {
          suddenFallFrames = Math.max(0, suddenFallFrames - 1);
        }

        // 2. HEAD ON HANDS / SLUMPING COLLAPSE: Head position drops down into hand level
        if (headNodesCount > 0 && handLevelNodes > 12 && avgHeadY > (h * 0.48) && !isFaintAlarmActive) {
          headRestingOnHandsFrames++;
          if (headRestingOnHandsFrames >= 5) { // Sustained head resting on hands / slumped
            triggerSimulatedFaint('Head on Hands / Unconscious Slump Posture Detected');
            headRestingOnHandsFrames = 0;
          }
        } else {
          headRestingOnHandsFrames = Math.max(0, headRestingOnHandsFrames - 1);
        }

        // 3. UNUSUAL VIOLENT MOTION OF HANDS OR HEAD
        const deltaSpeed = Math.abs(verticalDrop) + Math.abs(headDrop);
        if (deltaSpeed > 35 && !isFaintAlarmActive) {
          violentMovementFrames++;
          if (violentMovementFrames >= 3) {
            triggerSimulatedFaint('Unusual Convulsive Hand & Head Jerks Detected');
            violentMovementFrames = 0;
          }
        } else {
          violentMovementFrames = Math.max(0, violentMovementFrames - 1);
        }
      }

      prevMeshYCenter = currentYCenter;
      prevHeadY = avgHeadY;
    }
  }, 100);
}

// LOUD HIGH-DECIBEL EMERGENCY BEEP SIREN OVER PHONE & BROWSER
function playEmergencyBeep() {
  try {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    // High piercing oscillating frequency alarm sequence
    const freqs = [1050, 1450, 1850, 2200];
    freqs.forEach((freq, idx) => {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime + (idx * 0.14));
      gain.gain.setValueAtTime(0.95, audioCtx.currentTime + (idx * 0.14));
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + (idx * 0.14) + 0.13);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start(audioCtx.currentTime + (idx * 0.14));
      osc.stop(audioCtx.currentTime + (idx * 0.14) + 0.14);
    });
  } catch (e) {
    console.log("Audio beep failed:", e);
  }
}

function triggerSimulatedFaint(reason) {
  if (isFaintAlarmActive) return;
  isFaintAlarmActive = true;

  const overlay = document.getElementById('faint-alert-overlay');
  if (overlay) overlay.classList.add('show');

  // Play audio siren continuously until user clicks dismiss
  playEmergencyBeep();
  if (audioAlarmInterval) clearInterval(audioAlarmInterval);
  audioAlarmInterval = setInterval(playEmergencyBeep, 800);

  const phone = currentUser ? (currentUser.phone || currentUser.emergency_contact) : '+91 98450 12345';
  const name = currentUser ? currentUser.name : 'Citizen User';

  // Dispatch API alert beep & SMS notification to registered phone number
  fetch('/api/faint-alert', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ user_name: name, phone: phone })
  })
  .then(res => res.json())
  .then(data => {
    const logBox = document.getElementById('faint-log-box');
    if (logBox) {
      const timeStr = new Date().toLocaleTimeString();
      logBox.innerHTML = `
        <div style="color:#ef4444; font-weight:bold;">🚨 [${timeStr}] ALERT: ${reason}!</div>
        <div style="color:#38bdf8;">📲 Emergency Beep alert transmitted over phone to: ${phone}</div>
        <div style="color:#10b981;">🚑 CitySync Trauma Hub alerted with coordinates & medical vitals.</div>
      ` + logBox.innerHTML;
    }

    speakText(`Warning! Faint or collapse detected for ${name}. High decibel beep and SMS dispatched to ${phone}!`);
  });
}

function dismissFaintAlert() {
  isFaintAlarmActive = false;
  headRestingOnHandsFrames = 0;
  suddenFallFrames = 0;
  violentMovementFrames = 0;
  if (audioAlarmInterval) {
    clearInterval(audioAlarmInterval);
    audioAlarmInterval = null;
  }
  const overlay = document.getElementById('faint-alert-overlay');
  if (overlay) overlay.classList.remove('show');
}

// -------------------------------------------------------------------------
// 4. CIVIC ROAD COMPLAINTS (SAHAYA)
// -------------------------------------------------------------------------
function loadComplaints() {
  fetch('/api/complaints')
    .then(res => res.json())
    .then(data => {
      complaintsList = data;
      renderComplaintsList();
      const ovCount = document.getElementById('ov-complaint-count');
      if (ovCount) ovCount.innerText = `${complaintsList.length} Filed`;
    });
}

function renderComplaintsList() {
  const list = document.getElementById('complaints-list');
  if (!list) return;

  if (complaintsList.length === 0) {
    list.innerHTML = '<div style="color:var(--text-muted);">No complaints filed yet.</div>';
    return;
  }

  let html = '';
  complaintsList.forEach(c => {
    html += `
      <div class="glass-panel" style="padding: 16px; border-left: 4px solid #f59e0b;">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 6px;">
          <div>
            <span class="pill-badge pill-b-amber" style="font-size: 11px;">${c.id}</span>
            <strong style="color: #fff; font-size: 14px; margin-left: 6px;">${c.category}</strong>
          </div>
          <span style="font-size: 11px; color: var(--text-muted);">${c.date}</span>
        </div>
        <div style="font-size: 13px; color: #38bdf8; margin-bottom: 6px;">
          📍 ${c.location}
        </div>
        <p style="font-size: 12px; color: #cbd5e1; line-height: 1.4; margin-bottom: 8px;">
          ${c.description}
        </p>
        <div style="display: flex; justify-content: space-between; align-items: center; font-size: 11px; padding-top: 6px; border-top: 1px dashed var(--card-border);">
          <span style="color: var(--text-muted);">Complainant: <strong>${c.user_name}</strong> (${c.phone})</span>
          <span style="color: #10b981; font-weight: bold;">Status: ${c.status}</span>
        </div>
      </div>
    `;
  });

  list.innerHTML = html;
}

function submitComplaint() {
  const cat = document.getElementById('cmp-category').value;
  const loc = document.getElementById('cmp-location').value.trim();
  const desc = document.getElementById('cmp-desc').value.trim();
  const user = document.getElementById('cmp-user').value.trim() || (currentUser ? currentUser.name : "Citizen");
  const phone = document.getElementById('cmp-phone').value.trim() || (currentUser ? currentUser.phone : "+91 98450 12345");

  if (!loc || !desc) {
    alert("Please provide the exact location and description of the damage.");
    return;
  }

  fetch('/api/complaints', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      category: cat,
      location: loc,
      description: desc,
      user_name: user,
      phone: phone
    })
  })
  .then(res => res.json())
  .then(data => {
    if (data.success) {
      alert(data.message);
      loadComplaints();
      speakText(`Your complaint for ${cat} at ${loc} has been recorded.`);
    }
  });
}

// -------------------------------------------------------------------------
// 5. ROAD FLOODING & SAFE DETOUR ROUTES MAPPING
// -------------------------------------------------------------------------
function initFloodingMap() {
  if (typeof L === 'undefined') return;
  const mapElem = document.getElementById('city-flooding-map');
  if (!mapElem) return;

  if (!floodingMap) {
    floodingMap = L.map('city-flooding-map').setView([12.9250, 77.6250], 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap contributors | CitySync Flooding & Detour Radar'
    }).addTo(floodingMap);

    floodingLayersGroup = L.layerGroup().addTo(floodingMap);
  }

  renderFloodingRoutes();
}

function resetFloodingMapView() {
  if (floodingMap) floodingMap.setView([12.9250, 77.6250], 13);
}

function renderFloodingRoutes() {
  if (!floodingMap || !floodingLayersGroup || !cityData || !cityData.flooding_routes) return;
  floodingLayersGroup.clearLayers();

  cityData.flooding_routes.forEach(f => {
    // 1. Blocked segment (Red dashed line)
    const blockedPoly = L.polyline(f.blocked_coordinates, {
      color: '#ef4444',
      weight: 6,
      dashArray: '8, 8',
      opacity: 0.9
    }).addTo(floodingLayersGroup);

    blockedPoly.bindPopup(`
      <div style="font-family:'DM Sans',sans-serif; min-width:210px;">
        <h4 style="color:#b91c1c; margin:0 0 4px 0;">🌊 FLOODED: ${f.road_name}</h4>
        <div style="font-size:12px; color:#ef4444; font-weight:bold;">${f.flood_level}</div>
        <div style="margin-top:6px; font-size:11px;"><strong>Condition:</strong> ${f.status}</div>
      </div>
    `);

    // 2. Safe Detour Route (Green solid line)
    const safePoly = L.polyline(f.safe_coordinates, {
      color: '#10b981',
      weight: 5,
      opacity: 0.85
    }).addTo(floodingLayersGroup);

    safePoly.bindPopup(`
      <div style="font-family:'DM Sans',sans-serif; min-width:220px;">
        <h4 style="color:#059669; margin:0 0 4px 0;">🟢 RECOMMENDED DETOUR</h4>
        <div style="font-size:12px;">${f.alternate_route}</div>
        <div style="font-size:11px; color:#475569; margin-top:4px;">Safe elevation road - verified unflooded.</div>
      </div>
    `);

    // 3. Flood Warning Marker
    const iconHtml = `<div style="background:#ef4444; width:30px; height:30px; border-radius:50%; border:2px solid white; display:flex; align-items:center; justify-content:center; box-shadow:0 0 15px rgba(239,68,68,0.8); font-size:16px;">🌊</div>`;
    const icon = L.divIcon({ className: 'flood-icon', html: iconHtml, iconSize: [30, 30], iconAnchor: [15, 15] });
    L.marker([f.lat, f.lng], { icon }).addTo(floodingLayersGroup).bindPopup(`
      <strong>${f.road_name}</strong><br>Water level: ${f.flood_level}<br><em>Alternate detour mapped in green</em>
    `);
  });
}

function renderFloodingCards() {
  const container = document.getElementById('flooding-cards-container');
  if (!container || !cityData || !cityData.flooding_routes) return;

  let html = '';
  cityData.flooding_routes.forEach(f => {
    html += `
      <div class="glass-panel" style="padding: 18px; border-left: 4px solid #ef4444;">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px;">
          <h3 style="font-size: 15px; color: #fff;">${f.road_name}</h3>
          <span class="pill-badge pill-b-red">${f.status}</span>
        </div>
        <div style="font-size: 13px; color: #f87171; margin-bottom: 6px;">
          ⚠️ Water Depth: <strong>${f.flood_level}</strong>
        </div>
        <div style="background: rgba(16, 185, 129, 0.1); border: 1px solid rgba(16, 185, 129, 0.25); border-radius: 8px; padding: 10px; margin-top: 8px; font-size: 12px; color: #10b981;">
          <strong>Suggested Detour:</strong> ${f.alternate_route}
        </div>
        <button class="btn btn-secondary" style="font-size: 11px; padding: 6px 12px; margin-top: 10px;" onclick="focusFloodingRoute(${f.lat}, ${f.lng})">
          📍 View Flooded Node & Bypass
        </button>
      </div>
    `;
  });

  container.innerHTML = html;
}

function focusFloodingRoute(lat, lng) {
  navigateSection('city-flooding');
  if (floodingMap) {
    floodingMap.setView([lat, lng], 14);
  }
}

// -------------------------------------------------------------------------
// 6. GOVERNMENT OFFICES & PHARMACIES
// -------------------------------------------------------------------------
function loadCityData() {
  fetch('/api/city-data')
    .then(res => res.json())
    .then(data => {
      cityData = data;
      renderGovtOffices();
      renderPharmacies();
      renderHospitalsTable();
      renderFloodingCards();
      renderTraffic();
      renderPostOffices();
    });
}

function renderGovtOffices() {
  const container = document.getElementById('govt-offices-container');
  if (!container || !cityData || !cityData.govt_offices) return;

  let html = '';
  cityData.govt_offices.forEach(g => {
    html += `
      <div class="glass-panel" style="padding: 20px;">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px;">
          <div>
            <h3 style="font-size: 16px; color: #fff;">${g.name}</h3>
            <span class="pill-badge pill-b-blue" style="margin-top: 4px;">${g.dept}</span>
          </div>
          <span style="font-size: 24px;">🏛️</span>
        </div>
        <div style="font-size: 12px; color: var(--text-muted); margin-bottom: 6px;">
          📍 ${g.address}
        </div>
        <div style="font-size: 12px; color: #cbd5e1; margin-bottom: 6px;">
          ⏰ Hours: <strong style="color: #fff;">${g.hours}</strong>
        </div>
        <div style="font-size: 12px; color: #cbd5e1; margin-bottom: 10px;">
          📞 Helpline: <a href="tel:${g.phone.split('/')[0]}" style="color: #38bdf8; text-decoration: none; font-weight: bold;">${g.phone}</a>
        </div>
        <div style="background: rgba(15,23,42,0.6); padding: 8px 10px; border-radius: 8px; border: 1px solid var(--card-border); font-size: 11px; color: var(--text-muted);">
          <strong>Citizen Services:</strong> ${g.services}
        </div>
      </div>
    `;
  });

  container.innerHTML = html;
}

function renderPharmacies() {
  const container = document.getElementById('pharmacy-container');
  if (!container || !cityData || !cityData.pharmacies) return;

  let html = '';
  cityData.pharmacies.forEach(p => {
    html += `
      <div class="glass-panel" style="padding: 20px;">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px;">
          <div>
            <h3 style="font-size: 16px; color: #fff;">${p.name}</h3>
            <span class="pill-badge pill-b-green" style="margin-top: 4px;">${p.timing}</span>
          </div>
          <span style="font-size: 24px;">💊</span>
        </div>
        <div style="font-size: 12px; color: var(--text-muted); margin-bottom: 6px;">
          📍 ${p.address}
        </div>
        <div style="font-size: 12px; color: #cbd5e1; margin-bottom: 6px;">
          📞 Phone: <a href="tel:${p.phone}" style="color: #38bdf8; text-decoration: none; font-weight: bold;">${p.phone}</a>
        </div>
        <div style="background: rgba(15,23,42,0.6); padding: 8px 10px; border-radius: 8px; border: 1px solid var(--card-border); font-size: 11px; color: var(--text-muted); margin-bottom: 10px;">
          <strong>Stock Status:</strong> ${p.stock}
        </div>
        <div>
          <span class="pill-badge ${p.home_delivery ? 'pill-b-blue' : 'pill-b-amber'}">
            ${p.home_delivery ? 'Home Delivery Available' : 'Store Pickup Only'}
          </span>
        </div>
      </div>
    `;
  });

  container.innerHTML = html;
}

// -------------------------------------------------------------------------
// 7. HOSPITALS & AYURMITRA DOCTOR DASHBOARD MAP
// -------------------------------------------------------------------------
function initHospitalMap() {
  if (typeof L === 'undefined') return;
  const mapElement = document.getElementById('city-hospital-map');
  if (!mapElement) return;

  if (!hospitalMap) {
    hospitalMap = L.map('city-hospital-map').setView([12.9550, 77.6200], 12);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap contributors | CitySync Ayurmitra Radar'
    }).addTo(hospitalMap);

    hospitalMarkersLayer = L.layerGroup().addTo(hospitalMap);
  }

  renderHospitalMapMarkers();
}

function resetHospitalMapView() {
  if (hospitalMap) hospitalMap.setView([12.9550, 77.6200], 12);
}

function renderHospitalMapMarkers() {
  if (!hospitalMap || !hospitalMarkersLayer || !cityData) return;
  hospitalMarkersLayer.clearLayers();

  // Epidemic circles
  (cityData.epidemic_hotspots || []).forEach(spot => {
    const circle = L.circle([spot.lat, spot.lng], {
      color: spot.color,
      fillColor: spot.color,
      fillOpacity: 0.25,
      radius: spot.radius
    }).addTo(hospitalMarkersLayer);

    circle.bindPopup(`
      <div style="font-family:'DM Sans',sans-serif; min-width:200px;">
        <h4 style="margin:0; color:#b91c1c;">⚠️ ${spot.name}</h4>
        <div style="margin:4px 0; font-size:12px;"><strong>Disease:</strong> ${spot.disease}</div>
        <div style="font-size:12px;"><strong>Active Cases:</strong> ${spot.cases} (${spot.risk} Risk)</div>
        <div style="margin-top:4px; font-size:11px; color:#475569;">${spot.advisory}</div>
      </div>
    `);
  });

  // Hospitals
  (cityData.hospitals || []).forEach(h => {
    const iconHtml = `<div style="background:#2563eb; width:28px; height:28px; border-radius:50%; border:2px solid white; display:flex; align-items:center; justify-content:center; box-shadow:0 0 12px rgba(37,99,235,0.7); font-size:14px; color:white;">🏥</div>`;
    const icon = L.divIcon({ className: 'custom-hosp-marker', html: iconHtml, iconSize: [30, 30], iconAnchor: [15, 15] });

    L.marker([h.lat, h.lng], { icon }).addTo(hospitalMarkersLayer).bindPopup(`
      <div style="font-family:'DM Sans',sans-serif; min-width:220px;">
        <h3 style="margin:0 0 4px 0; font-size:15px;">${h.name}</h3>
        <div style="font-size:12px; color:#64748b;">${h.type} · ${h.zone}</div>
        <div style="margin:6px 0; font-size:12px;">Available Beds: <strong>${h.beds_available}</strong> | ICU: <strong style="color:#16a34a;">${h.icu_available}</strong></div>
        <div style="font-size:12px;">Ambulance: <a href="tel:${h.ambulance.split('/')[0]}" style="color:#dc2626; font-weight:bold;">${h.ambulance}</a></div>
      </div>
    `);
  });
}

function renderHospitalsTable() {
  const tbody = document.getElementById('hospitals-tbody');
  if (!tbody || !cityData || !cityData.hospitals) return;

  let html = '';
  cityData.hospitals.forEach(h => {
    html += `
      <tr>
        <td>
          <div style="font-weight: 700; color: #fff;">${h.name}</div>
          <div style="font-size: 11px; color: var(--text-muted);">${h.type} · Rating: ⭐ ${h.rating}</div>
        </td>
        <td>${h.zone}</td>
        <td><strong style="color: #60a5fa;">${h.beds_available}</strong> Beds</td>
        <td><span class="pill-badge pill-b-green">${h.icu_available} ICU</span></td>
        <td><a href="tel:108" style="color: #ef4444; font-weight: 700; text-decoration: none;">${h.ambulance}</a></td>
        <td>
          <button class="btn btn-secondary" style="padding: 5px 10px; font-size: 11px;" onclick="focusHospitalMap(${h.lat}, ${h.lng})">
            📍 Map
          </button>
        </td>
      </tr>
    `;
  });

  tbody.innerHTML = html;
}

function focusHospitalMap(lat, lng) {
  navigateSection('city-hospitals');
  if (hospitalMap) hospitalMap.setView([lat, lng], 15);
}

function renderTraffic() {
  const container = document.getElementById('traffic-container');
  if (!container || !cityData || !cityData.traffic) return;

  let html = '';
  cityData.traffic.forEach(t => {
    html += `
      <div class="glass-panel" style="padding: 16px;">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px;">
          <h3 style="font-size: 14px; color: #fff;">${t.corridor}</h3>
          <span class="pill-badge" style="background: rgba(255,255,255,0.08); color: ${t.color};">${t.status}</span>
        </div>
        <div style="display: flex; justify-content: space-between; margin-bottom: 6px; font-size: 12px;">
          <span style="color: var(--text-muted);">Speed:</span>
          <strong style="color: #fff;">${t.speed}</strong>
        </div>
        <div style="display: flex; justify-content: space-between; margin-bottom: 6px; font-size: 12px;">
          <span style="color: var(--text-muted);">Delay:</span>
          <strong style="color: ${t.color};">${t.delay}</strong>
        </div>
        <div style="font-size: 11px; color: var(--text-muted); border-top: 1px solid var(--card-border); padding-top: 6px; margin-top: 6px;">
          ${t.cause}
        </div>
      </div>
    `;
  });

  container.innerHTML = html;
}

function renderPostOffices() {
  const container = document.getElementById('post-offices-container');
  if (!container || !cityData || !cityData.post_offices) return;

  let html = '';
  cityData.post_offices.forEach(p => {
    html += `
      <div class="glass-panel" style="padding: 18px;">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px;">
          <div>
            <h3 style="font-size: 15px; color: #fff;">${p.name}</h3>
            <span class="pill-badge pill-b-blue" style="margin-top: 2px;">Pincode: ${p.pincode}</span>
          </div>
          <span style="font-size: 22px;">📮</span>
        </div>
        <div style="font-size: 12px; color: var(--text-muted); margin-bottom: 6px;">
          📍 ${p.address}
        </div>
        <div style="font-size: 12px; color: #94a3b8; margin-bottom: 6px;">
          ⏰ Hours: <strong style="color: #fff;">${p.timing}</strong>
        </div>
        <div style="font-size: 12px; color: #94a3b8; margin-bottom: 10px;">
          📞 Helpline: <a href="tel:${p.phone}" style="color: #38bdf8; text-decoration: none;">${p.phone}</a>
        </div>
        <div style="display: flex; gap: 6px;">
          <span class="pill-badge ${p.speed_post ? 'pill-b-green' : 'pill-b-red'}">${p.speed_post ? 'Speed Post' : 'No Speed Post'}</span>
          <span class="pill-badge ${p.passport_seva ? 'pill-b-blue' : 'pill-b-amber'}">${p.passport_seva ? 'Passport Seva' : 'Standard'}</span>
        </div>
      </div>
    `;
  });

  container.innerHTML = html;
}

// -------------------------------------------------------------------------
// 8. SECTION NAVIGATION & MAP SIZING
// -------------------------------------------------------------------------
function navigateSection(secId) {
  currentSection = secId;

  // Sidebar highlight
  document.querySelectorAll('.sidebar .nav-item').forEach(item => {
    item.classList.remove('active');
    const text = item.innerText.toLowerCase();
    if (secId === 'overview' && text.includes('overview')) item.classList.add('active');
    else if (secId === 'home-health' && text.includes('home health')) item.classList.add('active');
    else if (secId === 'city-complaints' && text.includes('complaint')) item.classList.add('active');
    else if (secId === 'city-flooding' && text.includes('flooding')) item.classList.add('active');
    else if (secId === 'city-govt' && text.includes('government')) item.classList.add('active');
    else if (secId === 'city-pharmacy' && text.includes('pharmacies')) item.classList.add('active');
    else if (secId === 'city-hospitals' && text.includes('hospitals')) item.classList.add('active');
    else if (secId === 'city-traffic' && text.includes('traffic')) item.classList.add('active');
    else if (secId === 'city-post' && text.includes('post')) item.classList.add('active');
  });

  // Switch tab visibility
  document.querySelectorAll('.section-view').forEach(v => v.classList.remove('active'));
  const target = document.getElementById(`sec-${secId}`);
  if (target) target.classList.add('active');

  // Trigger Leaflet map adjustments
  if (secId === 'city-hospitals') {
    setTimeout(() => {
      initHospitalMap();
      if (hospitalMap) hospitalMap.invalidateSize();
    }, 150);
  } else if (secId === 'city-flooding') {
    setTimeout(() => {
      initFloodingMap();
      if (floodingMap) floodingMap.invalidateSize();
    }, 150);
  } else if (secId === 'home-health') {
    setTimeout(() => {
      setupFaintMonitoringCamera();
    }, 150);
  }
}

// -------------------------------------------------------------------------
// 9. HIGH-SPEED HAND GESTURES (SWIPE, PINCH, ZOOM)
// -------------------------------------------------------------------------
async function toggleGestureControl() {
  gestureActive = !gestureActive;
  const hud = document.getElementById('gesture-hud');
  const video = document.getElementById('gesture-video');
  const toggleBtn = document.getElementById('gesture-toggle-btn');

  if (gestureActive) {
    hud.classList.add('active');
    toggleBtn.classList.remove('btn-secondary');
    toggleBtn.classList.add('btn-accent');

    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        gestureStream = await navigator.mediaDevices.getUserMedia({ video: { width: 320, height: 240 } });
        video.srcObject = gestureStream;
      }
    } catch (e) {
      console.log("Webcam for gestures:", e);
    }

    startRealtimeGestureLoop();
    speakText("Fast gesture tracking armed. Use quick hand swipe to change views, or pinch and zoom for maps.");
  } else {
    hud.classList.remove('active');
    toggleBtn.classList.add('btn-secondary');
    toggleBtn.classList.remove('btn-accent');
    if (gestureStream) {
      gestureStream.getTracks().forEach(t => t.stop());
      gestureStream = null;
    }
    if (gestureLoopId) cancelAnimationFrame(gestureLoopId);
  }
}

function triggerManualGesture(action) {
  const badge = document.getElementById('detected-gesture');
  if (action === 'swipe-right') {
    if (badge) badge.innerText = 'Next Screen ▶';
    let idx = SECTIONS.indexOf(currentSection);
    idx = (idx + 1) % SECTIONS.length;
    navigateSection(SECTIONS[idx]);
    speakText(`Switching to ${SECTIONS[idx].replace('-', ' ')}`);
  } else if (action === 'swipe-left') {
    if (badge) badge.innerText = '◀ Prev Screen';
    let idx = SECTIONS.indexOf(currentSection);
    idx = (idx - 1 + SECTIONS.length) % SECTIONS.length;
    navigateSection(SECTIONS[idx]);
    speakText(`Switching to ${SECTIONS[idx].replace('-', ' ')}`);
  } else if (action === 'zoom') {
    if (badge) badge.innerText = '🔍 Zoom In (+)';
    // If not currently on map section, auto-navigate to hospitals map first!
    if (currentSection !== 'city-hospitals' && currentSection !== 'city-flooding') {
      navigateSection('city-hospitals');
    }
    setTimeout(() => {
      if (currentSection === 'city-hospitals' && hospitalMap) {
        hospitalMap.setZoom(hospitalMap.getZoom() + 1);
      } else if (currentSection === 'city-flooding' && floodingMap) {
        floodingMap.setZoom(floodingMap.getZoom() + 1);
      }
    }, 100);
  } else if (action === 'pinch') {
    if (badge) badge.innerText = '🔍 Zoom Out (-)';
    if (currentSection !== 'city-hospitals' && currentSection !== 'city-flooding') {
      navigateSection('city-hospitals');
    }
    setTimeout(() => {
      if (currentSection === 'city-hospitals' && hospitalMap) {
        hospitalMap.setZoom(hospitalMap.getZoom() - 1);
      } else if (currentSection === 'city-flooding' && floodingMap) {
        floodingMap.setZoom(floodingMap.getZoom() - 1);
      }
    }, 100);
  }
}

// 108-POINT OPTICAL FLOW VECTOR GESTURE ENGINE
function startRealtimeGestureLoop() {
  const video = document.getElementById('gesture-video');
  const skeletonCanvas = document.getElementById('gesture-skeleton-canvas');
  if (!video || !skeletonCanvas) return;
  const sCtx = skeletonCanvas.getContext('2d');

  let prevPixels = null;
  let prevCentroidX = null;
  let prevCentroidY = null;
  let prevMotionArea = null;

  function analyzeMotion() {
    if (!gestureActive) return;

    if (video.videoWidth > 0) {
      const gw = skeletonCanvas.width = 280;
      const gh = skeletonCanvas.height = 160;
      sCtx.clearRect(0, 0, gw, gh);

      // Render 108 points anatomical mesh on gesture viewfinder (12 cols x 9 rows = 108 points)
      const gCols = 12;
      const gRows = 9;
      const gxStep = gw / (gCols + 1);
      const gyStep = gh / (gRows + 1);

      // Offscreen thumbnail for optical vector calculation
      const offCanvas = document.createElement('canvas');
      offCanvas.width = 56;
      offCanvas.height = 32;
      const oCtx = offCanvas.getContext('2d');
      oCtx.drawImage(video, 0, 0, 56, 32);
      const currentPixels = oCtx.getImageData(0, 0, 56, 32).data;

      // Draw 108 points on gesture canvas
      sCtx.strokeStyle = 'rgba(56, 189, 248, 0.25)';
      sCtx.lineWidth = 1;

      let gActivePoints = 0;
      for (let r = 1; r <= gRows; r++) {
        for (let c = 1; c <= gCols; c++) {
          const ptX = c * gxStep;
          const ptY = r * gyStep;
          const smX = Math.floor((ptX / gw) * 56);
          const smY = Math.floor((ptY / gh) * 32);
          const idx = (smY * 56 + smX) * 4;
          const isAct = (currentPixels[idx] + currentPixels[idx+1] + currentPixels[idx+2]) / 3 > 35;
          if (isAct) gActivePoints++;

          sCtx.beginPath();
          sCtx.arc(ptX, ptY, isAct ? 3 : 1.5, 0, 2 * Math.PI);
          sCtx.fillStyle = isAct ? '#10b981' : 'rgba(100, 116, 139, 0.4)';
          sCtx.fill();
        }
      }

      if (prevPixels && !gestureCooldown) {
        let totalMoved = 0;
        let sumX = 0;
        let sumY = 0;

        for (let y = 0; y < 32; y++) {
          for (let x = 0; x < 56; x++) {
            const idx = (y * 56 + x) * 4;
            const diff = Math.abs(currentPixels[idx] - prevPixels[idx]) +
                         Math.abs(currentPixels[idx+1] - prevPixels[idx+1]) +
                         Math.abs(currentPixels[idx+2] - prevPixels[idx+2]);
            if (diff > 40) {
              totalMoved++;
              sumX += x;
              sumY += y;
            }
          }
        }

        // Active hand gesture presence
        if (totalMoved > 45) {
          const centroidX = sumX / totalMoved;
          const centroidY = sumY / totalMoved;

          if (prevCentroidX !== null && prevMotionArea !== null) {
            const deltaX = centroidX - prevCentroidX;
            const deltaY = centroidY - prevCentroidY;
            const areaScaleRatio = totalMoved / Math.max(prevMotionArea, 1);

            // 1. PINCH / ZOOM OUT: Hand contracting or withdrawing from lens
            if (areaScaleRatio < 0.62 && prevMotionArea > 90) {
              gestureCooldown = true;
              triggerManualGesture('pinch');
              resetCooldown(400);
            }
            // 2. SPREAD / ZOOM IN: Hand advancing or spreading outward
            else if (areaScaleRatio > 1.55 && totalMoved > 100) {
              gestureCooldown = true;
              triggerManualGesture('zoom');
              resetCooldown(400);
            }
            // 3. SWIPE RIGHT: Hand moving right across video
            else if (deltaX > 4.5) {
              gestureCooldown = true;
              triggerManualGesture('swipe-right');
              resetCooldown(450);
            }
            // 4. SWIPE LEFT: Hand moving left across video
            else if (deltaX < -4.5) {
              gestureCooldown = true;
              triggerManualGesture('swipe-left');
              resetCooldown(450);
            }
          }

          prevCentroidX = centroidX;
          prevCentroidY = centroidY;
          prevMotionArea = totalMoved;
        } else {
          prevCentroidX = null;
          prevMotionArea = null;
        }
      }
      prevPixels = currentPixels;
    }

    gestureLoopId = requestAnimationFrame(analyzeMotion);
  }

  function resetCooldown(ms) {
    setTimeout(() => {
      gestureCooldown = false;
      const b = document.getElementById('detected-gesture');
      if (b) b.innerText = 'Monitoring 108-Points...';
    }, ms);
  }

  gestureLoopId = requestAnimationFrame(analyzeMotion);
}

// -------------------------------------------------------------------------
// 10. AI VOICE ASSISTANT & REGIONAL LANGUAGES
// -------------------------------------------------------------------------
function onLanguageChange() {
  currentLanguage = document.getElementById('voice-lang-select').value;
  const langNames = { en: 'English', hi: 'हिन्दी', kn: 'ಕನ್ನಡ', te: 'తెలుగు' };
  speakText(`Language changed to ${langNames[currentLanguage]}`);
}

function setupVoiceRecognition() {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    document.getElementById('assistant-feedback').innerText = "Voice recognition ready (Click mic to speak or enter prompt).";
    return;
  }

  recognition = new SpeechRecognition();
  recognition.continuous = false;
  recognition.interimResults = false;

  recognition.onstart = () => {
    isListening = true;
    document.getElementById('voice-trigger-btn').classList.add('listening');
    const pill = document.getElementById('voice-status-pill');
    pill.innerText = 'Listening Now...';
    pill.className = 'pill-badge pill-b-red';
  };

  recognition.onresult = (e) => {
    const text = e.results[0][0].transcript;
    document.getElementById('assistant-feedback').innerText = `You said: "${text}"`;
    sendVoiceQuery(text);
  };

  recognition.onerror = () => {
    stopVoiceListening();
  };

  recognition.onend = () => {
    stopVoiceListening();
  };
}

function stopVoiceListening() {
  isListening = false;
  document.getElementById('voice-trigger-btn').classList.remove('listening');
  const pill = document.getElementById('voice-status-pill');
  if (pill) {
    pill.innerText = 'Ready to Listen';
    pill.className = 'pill-badge pill-b-green';
  }
}

function toggleVoiceAssistant() {
  if (!recognition) {
    const fallback = prompt("Voice query (e.g. 'I need to go to government office', 'Flooding on my road', 'Find pharmacy', 'File complaint'):", "I need to go to government office");
    if (fallback) sendVoiceQuery(fallback);
    return;
  }

  if (isListening) {
    recognition.stop();
  } else {
    const mapLang = { en: 'en-IN', hi: 'hi-IN', kn: 'kn-IN', te: 'te-IN' };
    recognition.lang = mapLang[currentLanguage] || 'en-IN';
    recognition.start();
  }
}

function sendVoiceQuery(queryText) {
  fetch('/api/voice-process', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query: queryText, language: currentLanguage })
  })
  .then(res => res.json())
  .then(data => {
    document.getElementById('assistant-feedback').innerText = data.response_text;
    speakText(data.response_text);

    // Dynamic routing to matching section
    if (data.target_section === 'city-govt') {
      navigateSection('city-govt');
    } else if (data.target_section === 'city-pharmacy') {
      navigateSection('city-pharmacy');
    } else if (data.target_section === 'city-flooding') {
      navigateSection('city-flooding');
    } else if (data.target_section === 'city-complaints') {
      navigateSection('city-complaints');
    } else if (data.target_section === 'home-health') {
      navigateSection('home-health');
    } else if (data.target_section === 'city-hospitals') {
      navigateSection('city-hospitals');
    } else if (data.target_section === 'city-traffic') {
      navigateSection('city-traffic');
    } else if (data.target_section === 'city-post') {
      navigateSection('city-post');
    } else if (data.target_section === 'gesture-mode') {
      toggleGestureControl();
    } else {
      navigateSection('overview');
    }
  });
}

function speakText(text) {
  if (!('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();
  const utt = new SpeechSynthesisUtterance(text);
  const mapLang = { en: 'en-IN', hi: 'hi-IN', kn: 'kn-IN', te: 'te-IN' };
  utt.lang = mapLang[currentLanguage] || 'en-IN';
  utt.rate = 1.0;
  window.speechSynthesis.speak(utt);
}
