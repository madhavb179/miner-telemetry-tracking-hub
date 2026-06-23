/*import React, { useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';

// This is the 3D model component that moves based on live data
function MinerModel({ rotation }) {
  return (
    <mesh rotation={[rotation.pitch, rotation.yaw, rotation.roll]}>
      { //A simple box representing the miner's torso / sensor }
      <boxGeometry args={[2, 3, 1]} />
      <meshStandardMaterial color="#e67e22" wireframe={false} />
    </mesh>
  );
}

function App() {
  const [telemetry, setTelemetry] = useState({
    minerId: "Loading...",
    lastUpdated: "Never",
    chest: { pitch: 0, roll: 0, yaw: 0 }
  });

  // Fetch data from your Node.js API every 500ms
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/sensor-data');
        const data = await response.json();
        setTelemetry(data);
      } catch (error) {
        console.error("Error fetching telemetry:", error);
      }
    };

    const interval = setInterval(fetchData, 500); // Polling interval
    return () => clearInterval(interval);
  }, []);

  // Convert degrees to radians for Three.js rotations
  const degreesToRadians = (deg) => (deg * Math.PI) / 180;
  
  const minerRotation = {
    pitch: degreesToRadians(telemetry.chest.pitch),
    roll: degreesToRadians(telemetry.chest.roll),
    yaw: degreesToRadians(telemetry.chest.yaw),
  };

  return (
    <div style={{ display: 'flex', height: '100vh', fontFamily: 'sans-serif', backgroundColor: '#1a1a1a', color: '#fff' }}>
      {// Left Sidebar: Telemetry Numbers }
      <div style={{ width: '30%', padding: '20px', borderRight: '2px solid #333' }}>
        <h2>👷 Miner Tracking Hub</h2>
        <hr style={{ borderColor: '#333' }} />
        <p><strong>ID:</strong> {telemetry.minerId}</p>
        <p><strong>Last Updated:</strong> {telemetry.lastUpdated}</p>
        
        <div style={{ backgroundColor: '#2a2a2a', padding: '15px', borderRadius: '8px', marginTop: '20px' }}>
          <h3>Chest Sensor Orientation</h3>
          <p style={{ color: '#e74c3c' }}>🔴 <strong>Pitch (X):</strong> {telemetry.chest.pitch}°</p>
          <p style={{ color: '#2ecc71' }}>🟢 <strong>Roll (Z):</strong> {telemetry.chest.roll}°</p>
          <p style={{ color: '#3498db' }}>🔵 <strong>Yaw (Y):</strong> {telemetry.chest.yaw}°</p>
        </div>
      </div>

      {// Right Canvas: Three.js Live 3D Viewport }
      <div style={{ width: '70%', height: '100%', position: 'relative' }}>
        <Canvas camera={{ position: [0, 0, 6], fov: 50 }}>
          <ambientLight intensity={0.6} />
          <directionalLight position={[10, 10, 5]} intensity={1} />
          <MinerModel rotation={minerRotation} />
          <OrbitControls />
        </Canvas>
        <div style={{ position: 'absolute', bottom: '20px', right: '20px', background: 'rgba(0,0,0,0.5)', padding: '10px', borderRadius: '5px' }}>
          Click & drag to rotate camera view
        </div>
      </div>
    </div>
  );
}

export default App;*/


import React, { useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Text } from '@react-three/drei';

// --- SELF-CONTAINED MINER MODEL COMPONENT ---
function MinerModel({ rotation, minerId }) {
  return (
    // This 'group' moves the entire structural assembly based on your live telemetry
    <group rotation={[rotation.pitch, rotation.yaw, rotation.roll]}>
      
      {/* THE MAIN BODY (Industrial Matte Metallic Enclosure) */}
      <mesh position={[0, 0, 0]} castShadow>
        <boxGeometry args={[2.5, 3.5, 1]} />
        <meshStandardMaterial 
          roughness={0.3} 
          metalness={0.8} 
          color="#7f8c8d" // Sleek dark steel/silver color
        />
      </mesh>

      {/* THE DISPLAY SCREEN BOX */}
      <mesh position={[0, 1.1, 0.51]}>
        <planeGeometry args={[1.8, 0.7]} />
        <meshBasicMaterial color="#0b0c10" />
      </mesh>
      
      {/* Live Glowing Miner ID Text inside the 3D space */}
      <Text
        position={[0, 1.1, 0.52]} 
        fontSize={0.22}
        color="#00ffcc" // Neon cyan digital glow
        anchorX="center"
        anchorY="middle"
      >
        {minerId.toUpperCase()}
      </Text>

      {/* THE HAZARD BASE (High-visibility Safety Orange Accent) */}
      <mesh position={[0, -1.2, 0.51]}> 
        <planeGeometry args={[2.5, 0.8]} />
        <meshStandardMaterial 
          color="#d35400" // Safety orange accents
          roughness={0.5}
          metalness={0.2}
        />
      </mesh>

      {/* REINFORCED BATTERY PACK (On the side) */}
      <mesh position={[1.4, 0, 0]}>
        <boxGeometry args={[0.3, 2, 0.8]} />
        <meshStandardMaterial 
          color="#2c3e50" // Dark navy/midnight blue structural pack
          roughness={0.7}
          metalness={0.5}
        />
      </mesh>
    </group>
  );
}

function App() {
  const [telemetry, setTelemetry] = useState({
    minerId: "Loading...",
    lastUpdated: "Never",
    chest: { pitch: 0, roll: 0, yaw: 0 }
  });

  // Pull data from your Node API backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/sensor-data');
        const data = await response.json();
        setTelemetry(data);
      } catch (error) {
        console.error("Error fetching telemetry:", error);
      }
    };

    const interval = setInterval(fetchData, 500);
    return () => clearInterval(interval);
  }, []);

  const degreesToRadians = (deg) => (deg * Math.PI) / 180;
  
  const minerRotation = {
    pitch: degreesToRadians(telemetry.chest.pitch),
    roll: degreesToRadians(telemetry.chest.roll),
    yaw: degreesToRadians(telemetry.chest.yaw),
  };

  return (
    <div style={{ display: 'flex', height: '100vh', fontFamily: 'sans-serif', backgroundColor: '#11171a', color: '#fff' }}>
      {/* Dashboard Control Sidebar */}
      <div style={{ width: '30%', padding: '20px', borderRight: '2px solid #24333c', backgroundColor: '#162229' }}>
        <h2>👷 Miner Tracking Hub</h2>
        <hr style={{ borderColor: '#24333c' }} />
        <p style={{ fontSize: '1.1rem' }}><strong>ID:</strong> <span style={{ color: '#00ffcc' }}>{telemetry.minerId}</span></p>
        <p><strong>Last Updated:</strong> {telemetry.lastUpdated}</p>
        
        <div style={{ backgroundColor: '#1f2e38', padding: '15px', borderRadius: '8px', marginTop: '20px', border: '1px solid #24333c' }}>
          <h3 style={{ marginTop: 0 }}>Chest Sensor Orientation</h3>
          <p style={{ color: '#ff6b6b' }}>🔴 <strong>Pitch (X):</strong> {telemetry.chest.pitch}°</p>
          <p style={{ color: '#51cf66' }}>🟢 <strong>Roll (Z):</strong> {telemetry.chest.roll}°</p>
          <p style={{ color: '#339af0' }}>🔵 <strong>Yaw (Y):</strong> {telemetry.chest.yaw}°</p>
        </div>
      </div>

      {/* Live 3D Viewport window */}
      <div style={{ width: '70%', height: '100%', position: 'relative', backgroundColor: '#0d1316' }}>
        <Canvas camera={{ position: [0, 0, 6], fov: 50 }}>
          <ambientLight intensity={0.6} />
          <pointLight position={[10, 10, 10]} intensity={1.5} />
          <directionalLight position={[-5, 5, 2]} intensity={0.8} />
          <MinerModel rotation={minerRotation} minerId={telemetry.minerId} />
          <OrbitControls />
        </Canvas>
        <div style={{ position: 'absolute', bottom: '20px', right: '20px', background: 'rgba(0,0,0,0.7)', padding: '10px', borderRadius: '5px', fontSize: '0.9rem', color: '#888' }}>
          🖱️ Click & drag to spin device view
        </div>
      </div>
    </div>
  );
}

export default App;