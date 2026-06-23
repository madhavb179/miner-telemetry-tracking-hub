const express = require("express");
const mqtt = require("mqtt");
const cors = require("cors");

const app = express();
const PORT = 3000;

// Middleware configurations
app.use(cors());
app.use(express.json());

// Global state holding telemetry from the miner's chest sensor
let minerTelemetry = {
    minerId: "miner01",
    lastUpdated: "No data received yet",
    chest: { pitch: 0, roll: 0, yaw: 0 }
};

// Connect to the local Mosquitto broker running on your computer
const mqttClient = mqtt.connect("mqtt://10.36.253.233:1883");

mqttClient.on("connect", () => {
    console.log("Node.js Server successfully connected to Mosquitto Broker!");
    
    // Subscribe to your specific chest sensor channel topic
    mqttClient.subscribe("mine/miner01/body/chest", (err) => {
        if (!err) {
            console.log("Subscribed to topic: mine/miner01/body/chest");
        }
    });
});

mqttClient.on("message", (topic, message) => {
    try {
        const payload = JSON.parse(message.toString());
        minerTelemetry.lastUpdated = new Date().toLocaleTimeString();
        
        // Save the raw incoming sensor data object straight to memory
        minerTelemetry.chest = payload;

        console.log(`Incoming Data:`, payload);
    } catch (error) {
        console.log("Received telemetry, but it wasn't a valid JSON string.");
    }
});

// The endpoint that Person 3 (React Charts) & Person 4 (Three.js Engine) will read
app.get("/api/sensor-data", (req, res) => {
    res.json(minerTelemetry);
});

app.listen(PORT, () => {
    console.log(`Backend tracking server running at http://localhost:${PORT}`);
});
