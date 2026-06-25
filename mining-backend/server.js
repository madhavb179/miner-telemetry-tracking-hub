const express = require('express');
const mqtt = require('mqtt');
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

let minerTelemetry = {
    minerId: "miner01",
    lastUpdated: "No data received yet",

    chest: {
        pitch: 0,
        roll: 0,
        yaw: 0
    },

    arm1: {
        pitch: 0,
        roll: 0,
        yaw: 0
    },

    arm2: {
        pitch: 0,
        roll: 0,
        yaw: 0
    }
};

const MQTT_BROKER_URL = 'mqtt://127.0.0.1:1883';

const client = mqtt.connect(MQTT_BROKER_URL);

client.on('connect', () => {
    console.log('📡 Connected to MQTT Broker');

    client.subscribe('mine/miner01/body/chest');
    client.subscribe('mine/miner01/body/arm1');
    client.subscribe('mine/miner01/body/arm2');

    console.log('📥 Subscribed to chest, arm1, arm2');
});

client.on('message', (topic, message) => {
    try {
        const payload = JSON.parse(message.toString());

        minerTelemetry.lastUpdated =
            new Date().toLocaleTimeString();

        switch (topic) {

            case 'mine/miner01/body/chest':
                minerTelemetry.chest = payload;
                break;

            case 'mine/miner01/body/arm1':
                minerTelemetry.arm1 = payload;
                break;

            case 'mine/miner01/body/arm2':
                minerTelemetry.arm2 = payload;
                break;

            default:
                break;
        }

        console.log(`📥 ${topic}`, payload);

    } catch (err) {
        console.error("❌ Invalid JSON:", err.message);
    }
});

app.get('/api/sensor-data', (req, res) => {
    res.json(minerTelemetry);
});

app.listen(PORT, () => {
    console.log(
        `🚀 Server running at http://localhost:${PORT}`
    );
});