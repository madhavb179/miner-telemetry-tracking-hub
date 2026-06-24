#  Miner Telemetry Tracking Hub

A real-time IoT tracking dashboard that captures physical orientation data (Pitch, Roll, Yaw) from an external on-body sensor and visualizes it onto a dynamic 3D virtual twin model. 

This project simulates tracking a miner's posture or equipment placement in real time using a robust, decoupled data pipeline.

---

##  Architecture & Data Flow

The system runs across an event-driven pipeline split into distinct layers to separate data processing from rendering logic:

[ESP32 Microcontroller + MPU-6050]
│
▼ (Sends JSON payload via MQTT over Local Hotspot)
[Mosquitto MQTT Broker (Port 1883)]
│
▼ (Passes raw data internally via loopback 127.0.0.1)
[Node.js Express Backend (Port 3000)]
│
▼ (Served via HTTP REST API endpoint /api/sensor-data)
[React Frontend App (Vite Viewport Window)]


1. **The Publisher:** An ESP32 microcontroller reading physical motion angles from an MPU-6050 sensor broadcasts telemetry text packages over a local Wi-Fi hotspot.
2. **The Broker:** An open-source Eclipse Mosquitto broker running on the host machine intercepts the wireless incoming streams.
3. **The Backend Server:** A Node.js backend hooks into Mosquitto, intercepts the sensor streams, parses the raw strings into structured JavaScript memory objects, and timestamps them.
4. **The Client Dashboard:** A modern WebGL 3D graphics canvas designed in React continuously polls the backend API to translate the raw tracking degrees into real-time visual rotations.

---

## 🛠️ The Tech Stack

* **Frontend Engine:** React, React Three Fiber (R3F), `@react-three/drei` (Three.js WebGL Wrapper)
* **Backend Server:** Node.js, Express Framework, CORS Middleware
* **Protocols & Routing:** MQTT Protocol, `mqtt` client, Eclipse Mosquitto Broker

---

## 🚀 How to Run the Project Locally

Follow these steps in sequence to boot up the telemetry tracking network:

### 1. Initialize the Mosquitto Broker
Open your Command Prompt or PowerShell terminal **as an Administrator** and execute:
```cmd
cd "C:\Program Files\Mosquitto"
.\mosquitto.exe -c .\mosquitto.conf -v

### 2. Start the Backend API Server
Navigate to your backend server project directory, install the required dependencies, and launch the Node process:
```bash
 #Install node modules (express, mqtt, cors)
npm install

# Start the tracker server
node server.js

# start the website
npm run dev
