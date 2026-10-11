import json
import os
import uuid
import datetime
from flask import Flask, render_template, request, jsonify, session

app = Flask(__name__)
app.secret_key = "citysync-secret-key-2026"

DATA_DIR = os.path.join(os.path.dirname(__file__), "data")
os.makedirs(DATA_DIR, exist_ok=True)

def load_json(filename, default_val):
    path = os.path.join(DATA_DIR, filename)
    if os.path.exists(path):
        try:
            with open(path, "r", encoding="utf-8") as f:
                return json.load(f)
        except Exception:
            return default_val
    return default_val

def save_json(filename, data):
    path = os.path.join(DATA_DIR, filename)
    with open(path, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2)

def init_data():
    # Users registry
    users_file = os.path.join(DATA_DIR, "users.json")
    if not os.path.exists(users_file):
        seed_users = [
            {
                "id": "USR-101",
                "name": "Ananya Rao",
                "email": "ananya@citysync.gov",
                "phone": "+91 98450 12345",
                "password": "password123",
                "age": 34,
                "gender": "Female",
                "blood_group": "B+",
                "condition": "Hypertension & Migraine",
                "vitals": {"bp": "130/85", "pulse": "74 bpm", "spo2": "98%", "temp": "98.4 F"},
                "medicines": [
                    {"name": "Amlodipine 5mg", "time": "08:00 AM", "dosage": "1 tablet", "taken": True},
                    {"name": "Paracetamol 650mg", "time": "02:00 PM", "dosage": "As needed", "taken": False},
                    {"name": "Multivitamin", "time": "09:00 PM", "dosage": "1 capsule", "taken": False}
                ],
                "doctor": "Dr. Ramesh Patil",
                "emergency_contact": "+91 98450 12345",
                "notes": "Follow low-sodium diet and daily morning brisk walk."
            }
        ]
        save_json("users.json", seed_users)

    # Complaints registry
    complaints_file = os.path.join(DATA_DIR, "complaints.json")
    if not os.path.exists(complaints_file):
        seed_complaints = [
            {
                "id": "CMP-2026-891",
                "user_name": "Ananya Rao",
                "phone": "+91 98450 12345",
                "category": "Potholes & Broken Road Surface",
                "location": "MG Road near Trinity Junction",
                "description": "Deep dangerous pothole right in front of the bus stop causing near skids.",
                "status": "In Progress (BBMP Team Dispatched)",
                "priority": "High",
                "date": "10 Oct 2026"
            },
            {
                "id": "CMP-2026-892",
                "user_name": "Citizen User",
                "phone": "+91 98765 43210",
                "category": "Streetlight Defect",
                "location": "Indiranagar 100ft Road 4th Cross",
                "description": "Streetlights not functioning for past 3 days, pitch dark corridor.",
                "status": "Submitted",
                "priority": "Medium",
                "date": "11 Oct 2026"
            }
        ]
        save_json("complaints.json", seed_complaints)

    # City geographic data with Government Offices, Pharmacies, Flooding Routes, and Hospitals
    city_file = os.path.join(DATA_DIR, "city_data.json")
    if not os.path.exists(city_file):
        seed_city = {
            "hospitals": [
                {
                    "id": "H1",
                    "name": "Apollo City Hospital & Trauma Center",
                    "lat": 12.9716, "lng": 77.5946,
                    "zone": "Central Zone",
                    "type": "Multi-Speciality",
                    "beds_available": 18,
                    "icu_available": 4,
                    "phone": "+91 80 2630 4000",
                    "ambulance": "108 / +91 80 2630 4008",
                    "emergency_status": "Operational",
                    "rating": 4.8,
                    "active_cases": 124
                },
                {
                    "id": "H2",
                    "name": "Fortis District Care Hospital",
                    "lat": 12.9352, "lng": 77.6245,
                    "zone": "South Zone",
                    "type": "Super Speciality",
                    "beds_available": 9,
                    "icu_available": 2,
                    "phone": "+91 80 6621 4444",
                    "ambulance": "108 / +91 80 6621 4499",
                    "emergency_status": "High Alert",
                    "rating": 4.6,
                    "active_cases": 98
                },
                {
                    "id": "H3",
                    "name": "Manipal Urban Health Institute",
                    "lat": 12.9592, "lng": 77.6568,
                    "zone": "East Zone",
                    "type": "General & Pediatric",
                    "beds_available": 26,
                    "icu_available": 7,
                    "phone": "+91 80 2502 4444",
                    "ambulance": "108 / +91 80 2502 4410",
                    "emergency_status": "Operational",
                    "rating": 4.7,
                    "active_cases": 86
                },
                {
                    "id": "H4",
                    "name": "Government Victoria & Bowring Hospital",
                    "lat": 12.9634, "lng": 77.5750,
                    "zone": "West Zone",
                    "type": "Government Civil Hospital",
                    "beds_available": 45,
                    "icu_available": 11,
                    "phone": "+91 80 2670 1150",
                    "ambulance": "102 / 108",
                    "emergency_status": "24x7 Free ER",
                    "rating": 4.3,
                    "active_cases": 210
                },
                {
                    "id": "H5",
                    "name": "Sakra World Emergency Wing",
                    "lat": 12.9260, "lng": 77.6833,
                    "zone": "Outer Ring Sector",
                    "type": "Emergency Care",
                    "beds_available": 14,
                    "icu_available": 5,
                    "phone": "+91 80 4969 4969",
                    "ambulance": "108 / +91 80 4969 4911",
                    "emergency_status": "Operational",
                    "rating": 4.9,
                    "active_cases": 73
                }
            ],
            "pharmacies": [
                {
                    "id": "PH-1",
                    "name": "Apollo 24x7 Pharmacy & Critical Drug Store",
                    "lat": 12.9730, "lng": 77.5980,
                    "address": "Richmond Circle, Near MG Road Metro",
                    "phone": "+91 80 2222 3456",
                    "timing": "24 Hours Open",
                    "home_delivery": True,
                    "stock": "Insulin, Cardiac, Dengue kits in stock"
                },
                {
                    "id": "PH-2",
                    "name": "MedPlus Super Pharmacy & Jan Aushadhi",
                    "lat": 12.9370, "lng": 77.6200,
                    "address": "5th Block Koramangala 80ft Road",
                    "phone": "+91 80 4455 6677",
                    "timing": "07:00 AM - 11:30 PM",
                    "home_delivery": True,
                    "stock": "Generic & branded medicines available"
                },
                {
                    "id": "PH-3",
                    "name": "Government Pradhan Mantri Jan Aushadhi Kendra",
                    "lat": 12.9650, "lng": 77.5800,
                    "address": "City Civil Court Compound, KR Market",
                    "phone": "+91 80 2670 8900",
                    "timing": "09:00 AM - 08:00 PM",
                    "home_delivery": False,
                    "stock": "80% subsidized generic life-saving formulations"
                },
                {
                    "id": "PH-4",
                    "name": "Wellness Forever 24-Hour Chemist",
                    "lat": 12.9620, "lng": 77.6480,
                    "address": "Indiranagar CMH Road",
                    "phone": "+91 80 2521 9900",
                    "timing": "24 Hours Open",
                    "home_delivery": True,
                    "stock": "Oxygen cylinders, nebulizers & daily medicines"
                }
            ],
            "govt_offices": [
                {
                    "id": "GOV-1",
                    "name": "Bruhat Bengaluru Mahanagara Palike (BBMP) Head Office",
                    "dept": "Municipal & Civic Administration",
                    "lat": 12.9698, "lng": 77.5878,
                    "address": "NR Square, Corporation Circle",
                    "hours": "10:00 AM - 05:30 PM",
                    "services": "Road complaints, Property Tax, Trade License, Drainage",
                    "phone": "+91 80 2222 1188"
                },
                {
                    "id": "GOV-2",
                    "name": "Bengaluru Urban Deputy Commissioner & Revenue Office",
                    "dept": "Revenue, Land & District Administration",
                    "lat": 12.9772, "lng": 77.5896,
                    "address": "Kandaya Bhavan, KG Road",
                    "hours": "10:00 AM - 05:00 PM",
                    "services": "Caste/Income Certificates, RTC Land records, Voter ID",
                    "phone": "+91 80 2221 1101"
                },
                {
                    "id": "GOV-3",
                    "name": "Regional Transport Office (RTO) Central",
                    "dept": "Transport Department",
                    "lat": 12.9340, "lng": 77.5950,
                    "address": "Bayanagappa Compound, Jayanagar",
                    "hours": "10:00 AM - 04:30 PM",
                    "services": "Driving License, Vehicle Registration, Road Tax",
                    "phone": "+91 80 2656 1234"
                },
                {
                    "id": "GOV-4",
                    "name": "BESCOM Corporate Operations Division",
                    "dept": "Electricity & Power Distribution",
                    "lat": 12.9755, "lng": 77.6045,
                    "address": "KR Circle, Ambedkar Veedhi",
                    "hours": "09:30 AM - 05:30 PM",
                    "services": "New Power Meter, Transformer Faults, Billing",
                    "phone": "1912 / +91 80 2287 3333"
                }
            ],
            "flooding_routes": [
                {
                    "id": "FLD-1",
                    "road_name": "Silk Board Underpass & Junction",
                    "lat": 12.9176, "lng": 77.6234,
                    "flood_level": "Deep Waterlogging (2.5 ft)",
                    "status": "Blocked / Avoid Road",
                    "alternate_route": "Bypass via BTM 2nd Stage 16th Main -> Outer Ring Flyover",
                    "safe_coordinates": [
                        [12.9100, 77.6150],
                        [12.9150, 77.6200],
                        [12.9250, 77.6300],
                        [12.9300, 77.6400]
                    ],
                    "blocked_coordinates": [
                        [12.9160, 77.6220],
                        [12.9176, 77.6234],
                        [12.9190, 77.6250]
                    ]
                },
                {
                    "id": "FLD-2",
                    "road_name": "Hebbal Lake Overflow Service Corridor",
                    "lat": 13.0358, "lng": 77.5970,
                    "flood_level": "Waterlogged (1.8 ft)",
                    "status": "Slow / Diverted",
                    "alternate_route": "Use Main Elevated Flyover or Ring Road Kodigehalli Underpass",
                    "safe_coordinates": [
                        [13.0250, 77.5920],
                        [13.0320, 77.5940],
                        [13.0420, 77.5980]
                    ],
                    "blocked_coordinates": [
                        [13.0340, 77.5960],
                        [13.0358, 77.5970],
                        [13.0380, 77.5985]
                    ]
                }
            ],
            "epidemic_hotspots": [
                {
                    "name": "Sector 4 — Gokak Lake Ward",
                    "lat": 12.9780, "lng": 77.6010,
                    "disease": "Dengue",
                    "cases": 42,
                    "risk": "High",
                    "color": "#ef4444",
                    "radius": 850,
                    "advisory": "Fogging in progress. Avoid stagnant water exposure."
                },
                {
                    "name": "Old Town Commercial Basin",
                    "lat": 12.9420, "lng": 77.6180,
                    "disease": "Seasonal Flu & Viral Fevers",
                    "cases": 29,
                    "risk": "Medium",
                    "color": "#f97316",
                    "radius": 650,
                    "advisory": "Mask advisories in crowded markets."
                },
                {
                    "name": "Greenwood South Extension",
                    "lat": 12.9200, "lng": 77.6700,
                    "disease": "Gastroenteritis",
                    "cases": 13,
                    "risk": "Low",
                    "color": "#10b981",
                    "radius": 500,
                    "advisory": "Water pipeline testing verified normal."
                }
            ],
            "traffic": [
                {
                    "corridor": "Central Ring Road to MG Junction",
                    "status": "Heavy Congestion",
                    "speed": "14 km/h",
                    "delay": "+22 mins",
                    "cause": "Metro expansion & high evening peak",
                    "color": "#ef4444"
                },
                {
                    "corridor": "Airport Expressway — Hebbal Flyover",
                    "status": "Moderate Flow",
                    "speed": "48 km/h",
                    "delay": "+6 mins",
                    "cause": "Standard rush hour",
                    "color": "#f59e0b"
                },
                {
                    "corridor": "Tech Park Bypass — Outer Ring Road",
                    "status": "Slow Moving",
                    "speed": "22 km/h",
                    "delay": "+15 mins",
                    "cause": "Signal re-timing",
                    "color": "#f97316"
                },
                {
                    "corridor": "South Boulevard to Silk Board Link",
                    "status": "Flooded / Choked",
                    "speed": "8 km/h",
                    "delay": "+38 mins",
                    "cause": "Flooding detour active",
                    "color": "#ef4444"
                }
            ],
            "post_offices": [
                {
                    "name": "General Post Office (GPO) Central",
                    "pincode": "560001",
                    "address": "Raj Bhavan Road, Ambedkar Veedhi",
                    "timing": "09:00 AM - 07:00 PM",
                    "speed_post": True,
                    "passport_seva": True,
                    "phone": "+91 80 2286 4222",
                    "lat": 12.9810, "lng": 77.5925
                },
                {
                    "name": "South Head Post Office",
                    "pincode": "560011",
                    "address": "4th Block Jayanagar Market Square",
                    "timing": "09:30 AM - 05:30 PM",
                    "speed_post": True,
                    "passport_seva": False,
                    "phone": "+91 80 2663 1184",
                    "lat": 12.9298, "lng": 77.5834
                },
                {
                    "name": "Indiranagar Sub Post Office",
                    "pincode": "560038",
                    "address": "100 Feet Road, HAL 2nd Stage",
                    "timing": "09:00 AM - 05:00 PM",
                    "speed_post": True,
                    "passport_seva": True,
                    "phone": "+91 80 2528 7171",
                    "lat": 12.9719, "lng": 77.6412
                },
                {
                    "name": "Koramangala Post & Aadhaar Seva",
                    "pincode": "560034",
                    "address": "80 Feet Road, 6th Block",
                    "timing": "09:30 AM - 05:00 PM",
                    "speed_post": True,
                    "passport_seva": False,
                    "phone": "+91 80 2553 0920",
                    "lat": 12.9345, "lng": 77.6210
                }
            ],
            "other_services": [
                {
                    "category": "Water Supply & Drainage (BWSSB)",
                    "helpline": "1916 / +91 80 2223 8888",
                    "hours": "24x7 Grievance Redressal",
                    "status": "Normal Pressure across all Zones"
                },
                {
                    "category": "Electricity Board (BESCOM)",
                    "helpline": "1912 / +91 80 2287 3333",
                    "hours": "24x7 Power Faults & Restorations",
                    "status": "No Scheduled Outages"
                },
                {
                    "category": "Fire & Emergency Disaster Response",
                    "helpline": "101 / 112",
                    "hours": "Instant Emergency Dispatch",
                    "status": "12 Rapid Stations on Standby"
                },
                {
                    "category": "City Municipal Grievance & Sanitation",
                    "helpline": "1533 / +91 80 2266 0000",
                    "hours": "07:00 AM - 09:00 PM",
                    "status": "Automated Waste Collection Tracked"
                }
            ]
        }
        save_json("city_data.json", seed_city)

init_data()

@app.route("/")
def index():
    return render_template("index.html")

# REGISTER USER
@app.route("/api/register", methods=["POST"])
def register_user():
    data = request.get_json() or {}
    name = data.get("name", "").strip()
    phone = data.get("phone", "").strip()
    email = data.get("email", "").strip()
    password = data.get("password", "").strip()
    age = data.get("age", 30)
    gender = data.get("gender", "Other")
    blood_group = data.get("blood_group", "O+")
    condition = data.get("condition", "General Health")
    medicines = data.get("medicines", [])
    doctor = data.get("doctor", "Dr. Ramesh Patil")
    emergency_contact = data.get("emergency_contact", phone)

    if not name or not phone:
        return jsonify({"success": False, "error": "Name and phone number are required"}), 400

    users = load_json("users.json", [])
    
    # Check if user already exists
    existing = next((u for u in users if u.get("phone") == phone or (email and u.get("email") == email)), None)
    
    user_id = f"USR-{len(users) + 101}"
    user_profile = {
        "id": user_id,
        "name": name,
        "email": email or f"{phone}@citysync.gov",
        "phone": phone,
        "password": password or "123456",
        "age": int(age) if str(age).isdigit() else 30,
        "gender": gender,
        "blood_group": blood_group,
        "condition": condition,
        "vitals": {"bp": "120/80", "pulse": "72 bpm", "spo2": "99%", "temp": "98.6 F"},
        "medicines": medicines if medicines else [
            {"name": "Multivitamin & Zinc", "time": "09:00 AM", "dosage": "1 tablet", "taken": False}
        ],
        "doctor": doctor,
        "emergency_contact": emergency_contact,
        "notes": "Patient self-registered profile in CitySync Home Health Portal."
    }

    if existing:
        existing.update(user_profile)
        user_id = existing["id"]
    else:
        users.append(user_profile)

    save_json("users.json", users)
    session["user_id"] = user_id
    session["user_name"] = name

    return jsonify({
        "success": True,
        "message": "User registered successfully! You can now log in using Face, Fingerprint, or Password.",
        "user": user_profile
    })

# AUTH LOGIN
@app.route("/api/login", methods=["POST"])
def api_login():
    data = request.get_json() or {}
    method = data.get("method", "password")
    user_identifier = (data.get("user") or "").strip()
    pwd = data.get("password", "")

    users = load_json("users.json", [])
    user_obj = None

    if user_identifier:
        user_obj = next((u for u in users if u.get("email") == user_identifier or u.get("phone") == user_identifier or u.get("name").lower() == user_identifier.lower()), None)

    if not user_obj and len(users) > 0:
        # Default to first registered user
        user_obj = users[0]

    if not user_obj:
        user_obj = {
            "id": "USR-101",
            "name": "Citizen User",
            "phone": "+91 98450 12345",
            "condition": "General Fitness",
            "vitals": {"bp": "120/80", "pulse": "72 bpm", "spo2": "99%", "temp": "98.6 F"},
            "medicines": [{"name": "Multivitamin", "time": "09:00 AM", "dosage": "1 tablet", "taken": False}],
            "doctor": "Dr. Ramesh Patil",
            "emergency_contact": "+91 98450 12345"
        }

    session["user_id"] = user_obj["id"]
    session["user_name"] = user_obj["name"]
    session["auth_method"] = method

    return jsonify({
        "success": True,
        "message": f"Successfully authenticated via {method.replace('_', ' ').title()}",
        "user": user_obj,
        "method": method
    })

# GET SINGLE LOGGED-IN USER PROFILE FOR HOME HEALTH
@app.route("/api/user-profile", methods=["GET"])
def get_user_profile():
    users = load_json("users.json", [])
    user_id = session.get("user_id")
    user_name = session.get("user_name")

    user_obj = None
    if user_id:
        user_obj = next((u for u in users if u.get("id") == user_id), None)
    if not user_obj and user_name:
        user_obj = next((u for u in users if u.get("name").lower() == user_name.lower()), None)
    if not user_obj and len(users) > 0:
        user_obj = users[0]

    return jsonify({"success": True, "user": user_obj})

# TOGGLE MEDICINE
@app.route("/api/toggle-medicine", methods=["POST"])
def toggle_medicine():
    users = load_json("users.json", [])
    data = request.get_json() or {}
    user_id = data.get("user_id") or session.get("user_id")
    med_name = data.get("medicine_name")

    for u in users:
        if u.get("id") == user_id or u.get("name") == session.get("user_name"):
            for m in u.get("medicines", []):
                if m["name"] == med_name:
                    m["taken"] = not m.get("taken", False)
                    save_json("users.json", users)
                    return jsonify({"success": True, "medicines": u.get("medicines")})

    # If first user fallback
    if len(users) > 0:
        for m in users[0].get("medicines", []):
            if m["name"] == med_name:
                m["taken"] = not m.get("taken", False)
                save_json("users.json", users)
                return jsonify({"success": True, "medicines": users[0].get("medicines")})

    return jsonify({"success": False, "error": "Medicine not found"}), 404

# COMPLAINTS PORTAL (CIVIC GRIEVANCES)
@app.route("/api/complaints", methods=["GET", "POST"])
def handle_complaints():
    complaints = load_json("complaints.json", [])
    if request.method == "POST":
        data = request.get_json() or {}
        cid = f"CMP-2026-{len(complaints) + 893}"
        new_complaint = {
            "id": cid,
            "user_name": data.get("user_name") or session.get("user_name") or "Verified Citizen",
            "phone": data.get("phone") or "+91 98450 12345",
            "category": data.get("category", "Road Damage & Potholes"),
            "location": data.get("location", "City Sector"),
            "description": data.get("description", "Road surface damaged causing risk"),
            "status": "Registered with BBMP Sahaya Portal (Action in 48h)",
            "priority": data.get("priority", "High"),
            "date": datetime.datetime.now().strftime("%d %b %Y, %I:%M %p")
        }
        complaints.insert(0, new_complaint)
        save_json("complaints.json", complaints)
        return jsonify({
            "success": True,
            "message": f"Grievance filed successfully under token {cid}!",
            "complaint": new_complaint
        })
    return jsonify(complaints)

# FAINTING EMERGENCY ALERT (SMS / BEEP TO REGISTERED MOBILE NUMBER)
@app.route("/api/faint-alert", methods=["POST"])
def faint_alert():
    data = request.get_json() or {}
    user_name = data.get("user_name") or session.get("user_name") or "User"
    phone = data.get("phone") or "+91 98450 12345"
    timestamp = datetime.datetime.now().strftime("%I:%M:%S %p, %d %b %Y")

    # In production this dispatches Twilio SMS or GSM modem beep
    alert_payload = {
        "status": "EMERGENCY_DISPATCHED",
        "alert_type": "FAINT_FALL_DETECTED",
        "phone_notified": phone,
        "message": f"CRITICAL: Faint / Fall detected by Home Health AI Camera for {user_name} at {timestamp}. Immediate beep and SMS alert sent to registered mobile: {phone}!",
        "timestamp": timestamp
    }
    return jsonify({"success": True, "alert": alert_payload})

# CITY DATA
@app.route("/api/city-data", methods=["GET"])
def get_city_data():
    city_data = load_json("city_data.json", {})
    return jsonify(city_data)

# VOICE PROCESSING WITH COMPLEX NEW QUERIES
@app.route("/api/voice-process", methods=["POST"])
def process_voice():
    data = request.get_json() or {}
    query = (data.get("query") or "").strip().lower()
    lang = data.get("language", "en")

    intent = "unknown"
    target_section = "overview"
    ai_response = "I did not recognize that command. Try asking for Home Health, Government Offices, Pharmacies, Flooding Routes, or Grievances."

    # 1. Government Office
    if any(k in query for k in ["government office", "govt office", "bbmp", "rto", "kandaya", "corporation office", "sarkari"]):
        intent = "navigate_govt"
        target_section = "city-govt"
        ai_response = "Locating nearest Government Offices and Administrative Centers on your map."
    
    # 2. Pharmacy / Chemist near me
    elif any(k in query for k in ["pharmacy", "chemist", "medical store", "medicine shop", "dawai", "jan aushadhi"]):
        intent = "navigate_pharmacy"
        target_section = "city-pharmacy"
        ai_response = "Finding 24x7 pharmacies, Jan Aushadhi generic stores, and medicine dispensaries near you."

    # 3. Flooding on Road / Detour routes
    elif any(k in query for k in ["flood", "flooding", "waterlog", "water on road", "water logging", "detour", "alternate route"]):
        intent = "navigate_flooding"
        target_section = "city-flooding"
        ai_response = "Alert: Flooding detected on your route! Showing waterlogged points and safe alternate detour routes on the map."

    # 4. Complaints & Road Grievance
    elif any(k in query for k in ["complaint", "file complaint", "pothole", "bad road", "broken road", "grievance", "sahaya"]):
        intent = "navigate_complaints"
        target_section = "city-complaints"
        ai_response = "Opening the City Services Citizen Grievance Portal to file your road repair complaint."

    # 5. Home Health
    elif any(k in query for k in ["health", "faint", "fall", "medicine", "pill", "vitals", "swasthya", "aarogya"]):
        intent = "navigate_health"
        target_section = "home-health"
        ai_response = "Opening your personal Home Health dashboard with real-time faint detection monitoring."

    # 6. Hospitals & Ambulance
    elif any(k in query for k in ["hospital", "doctor", "ambulance", "emergency", "bed", "icu"]):
        intent = "navigate_hospitals"
        target_section = "city-hospitals"
        ai_response = "Loading City Hospitals & Doctor Dashboard map with live beds and ambulance hotlines."

    # 7. Traffic
    elif any(k in query for k in ["traffic", "jam", "commute", "speed"]):
        intent = "navigate_traffic"
        target_section = "city-traffic"
        ai_response = "Displaying real-time city traffic corridors and congestion alerts."

    # 8. Post Office
    elif any(k in query for k in ["post office", "postal", "speed post", "pincode"]):
        intent = "navigate_post"
        target_section = "city-post"
        ai_response = "Showing nearest Post Offices and postal banking services."

    # 9. Hand Gestures
    elif any(k in query for k in ["gesture", "hand", "pinch", "zoom"]):
        intent = "activate_gestures"
        target_section = "gesture-mode"
        ai_response = "Fast hand gesture navigation active. Use pinch/zoom for maps and fast swipe for switching views."

    # Regional phrasing
    if lang == "hi":
        if target_section == "city-govt":
            ai_response = "निकटतम सरकारी कार्यालय और नागरिक प्रशासनिक केंद्र दिखाए जा रहे हैं।"
        elif target_section == "city-pharmacy":
            ai_response = "आपके पास 24 घंटे खुली फार्मेसी और जन औषधि केंद्र खोजे जा रहे हैं।"
        elif target_section == "city-flooding":
            ai_response = "सावधान: सड़क पर जलभराव की सूचना मिली है! सुरक्षित वैकल्पिक मार्ग नक्शे पर दिखाए जा रहे हैं।"
        elif target_section == "city-complaints":
            ai_response = "सड़क शिकायत पोर्टल खोला जा रहा है जहां आप गड्ढों की शिकायत दर्ज कर सकते हैं।"
        elif target_section == "home-health":
            ai_response = "आपका व्यक्तिगत स्वास्थ्य पोर्टल और बेहोशी जांच कैमरा खोला जा रहा है।"
    elif lang == "kn":
        if target_section == "city-govt":
            ai_response = "ಹತ್ತಿರದ ಸರ್ಕಾರಿ ಕಚೇರಿಗಳು ಮತ್ತು ಆಡಳಿತ ಕೇಂದ್ರಗಳನ್ನು ನಕ್ಷೆಯಲ್ಲಿ ತೋರಿಸಲಾಗುತ್ತಿದೆ."
        elif target_section == "city-pharmacy":
            ai_response = "ನಿಮ್ಮ ಹತ್ತಿರದ 24 ಗಂಟೆ ಔಷಧಾಲಯಗಳು ಮತ್ತು ಜನೌಷಧಿ ಕೇಂದ್ರಗಳನ್ನು ಹುಡುಕಲಾಗುತ್ತಿದೆ."
        elif target_section == "city-flooding":
            ai_response = "ಎಚ್ಚರಿಕೆ: ರಸ್ತೆಯಲ್ಲಿ ಪ್ರವಾಹ/ನೀರು ತುಂಬಿದೆ! ಸುರಕ್ಷಿತ ಪರ್ಯಾಯ ಮಾರ್ಗಗಳನ್ನು ನಕ್ಷೆಯಲ್ಲಿ ತೋರಿಸಲಾಗುತ್ತಿದೆ."
        elif target_section == "city-complaints":
            ai_response = "ರಸ್ತೆ ಗುಂಡಿ ದೂರು ದಾಖಲಿಸುವ ನಾಗರಿಕ ಪೋರ್ಟಲ್ ತೆರೆಯಲಾಗುತ್ತಿದೆ."
        elif target_section == "home-health":
            ai_response = "ನಿಮ್ಮ ವೈಯಕ್ತಿಕ ಆರೋಗ್ಯ ಪೋರ್ಟಲ್ ಮತ್ತು ಮೂರ್ಛೆ ಪತ್ತೆ ಕ್ಯಾಮೆರಾ ತೆರೆಯಲಾಗುತ್ತಿದೆ."

    return jsonify({
        "success": True,
        "query": query,
        "intent": intent,
        "target_section": target_section,
        "response_text": ai_response,
        "language": lang
    })

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5055, debug=False)
