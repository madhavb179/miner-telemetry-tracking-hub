import React, { useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Center } from '@react-three/drei';

const degreesToRadians = (deg) => deg * Math.PI / 180;

function MinerModel({ chestRot, arm1Rot, arm2Rot }) {
  const skinColor = "#dfc3b2";

  return (
    <group
      rotation={[
        chestRot.pitch,
        chestRot.yaw,
        chestRot.roll
      ]}
    >

      {/* TORSO */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[2.2, 2.8, 1.2]} />
        <meshStandardMaterial color="#718096" />
      </mesh>

      {/* HEAD */}
      <group position={[0, 1.4, 0]}>
        <mesh position={[0, 0.7, 0]}>
          <sphereGeometry args={[0.55, 32, 32]} />
          <meshStandardMaterial color={skinColor} />
        </mesh>
      </group>

      {/* RIGHT ARM */}
      <group
        position={[1.3, 1.1, 0]}
        rotation={[
          arm1Rot.pitch,
          arm1Rot.yaw,
          arm1Rot.roll
        ]}
      >
        <mesh>
          <sphereGeometry args={[0.28, 24, 24]} />
          <meshStandardMaterial color="#00ffcc" />
        </mesh>

        <mesh position={[0, -0.6, 0]}>
          <cylinderGeometry args={[0.22, 0.2, 1]} />
          <meshStandardMaterial color="#00ffcc" />
        </mesh>

        <mesh position={[0, -1.1, 0]}>
          <sphereGeometry args={[0.22, 24, 24]} />
          <meshStandardMaterial color="#00ffcc" />
        </mesh>

        <mesh position={[0, -1.6, 0]}>
          <cylinderGeometry args={[0.19, 0.16, 1]} />
          <meshStandardMaterial color="#00ffcc" />
        </mesh>
      </group>

      {/* LEFT ARM */}
      <group
        position={[-1.3, 1.1, 0]}
        rotation={[
          arm2Rot.pitch,
          arm2Rot.yaw,
          arm2Rot.roll
        ]}
      >
        <mesh>
          <sphereGeometry args={[0.28, 24, 24]} />
          <meshStandardMaterial color="#f472b6" />
        </mesh>

        <mesh position={[0, -0.6, 0]}>
          <cylinderGeometry args={[0.22, 0.2, 1]} />
          <meshStandardMaterial color="#f472b6" />
        </mesh>

        <mesh position={[0, -1.1, 0]}>
          <sphereGeometry args={[0.22, 24, 24]} />
          <meshStandardMaterial color="#f472b6" />
        </mesh>

        <mesh position={[0, -1.6, 0]}>
          <cylinderGeometry args={[0.19, 0.16, 1]} />
          <meshStandardMaterial color="#f472b6" />
        </mesh>
      </group>
    </group>
  );
}

export default function App() {

  const [telemetry, setTelemetry] = useState({
    minerId: "miner01",
    lastUpdated: "--",

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
  });

  useEffect(() => {

    const fetchData = async () => {
      try {

        const response =
          await fetch(
            'http://localhost:3000/api/sensor-data'
          );

        const data = await response.json();

        setTelemetry(data);

      } catch (err) {
        console.log(
          "Waiting for backend..."
        );
      }
    };

    fetchData();

    const interval =
      setInterval(fetchData, 500);

    return () => clearInterval(interval);

  }, []);

  const chestRotation = {
    pitch: degreesToRadians(
      telemetry.chest.pitch
    ),
    roll: degreesToRadians(
      telemetry.chest.roll
    ),
    yaw: degreesToRadians(
      telemetry.chest.yaw
    )
  };

  const arm1Rotation = {
    pitch: degreesToRadians(
      telemetry.arm1.pitch
    ),
    roll: degreesToRadians(
      telemetry.arm1.roll
    ),
    yaw: degreesToRadians(
      telemetry.arm1.yaw
    )
  };

  const arm2Rotation = {
    pitch: degreesToRadians(
      telemetry.arm2.pitch
    ),
    roll: degreesToRadians(
      telemetry.arm2.roll
    ),
    yaw: degreesToRadians(
      telemetry.arm2.yaw
    )
  };

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        background: "#0f172a"
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 20,
          left: 20,
          zIndex: 10,
          color: "white",
          background: "#1e293bcc",
          padding: 20,
          borderRadius: 12
        }}
      >
        <h2>👷 Miner Telemetry</h2>

        <p>
          Last Update:
          {telemetry.lastUpdated}
        </p>

        <hr />

        <p>
          Chest:
          P {telemetry.chest.pitch}
          R {telemetry.chest.roll}
          Y {telemetry.chest.yaw}
        </p>

        <p>
          Arm1:
          P {telemetry.arm1.pitch}
          R {telemetry.arm1.roll}
          Y {telemetry.arm1.yaw}
        </p>

        <p>
          Arm2:
          P {telemetry.arm2.pitch}
          R {telemetry.arm2.roll}
          Y {telemetry.arm2.yaw}
        </p>
      </div>

      <Canvas camera={{ position: [0, 1, 8] }}>
        <ambientLight intensity={0.8} />
        <directionalLight
          position={[5, 5, 5]}
          intensity={1}
        />

        <Center>
          <MinerModel
            chestRot={chestRotation}
            arm1Rot={arm1Rotation}
            arm2Rot={arm2Rotation}
          />
        </Center>

        <OrbitControls />
      </Canvas>
    </div>
  );
}