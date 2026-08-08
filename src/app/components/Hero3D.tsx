"use client";

import { Canvas } from "@react-three/fiber";
import { Float, MeshDistortMaterial, Torus, Icosahedron } from "@react-three/drei";

function VaultCore() {
  return (
    <Float speed={1.2} rotationIntensity={0.6} floatIntensity={1.2}>
      <group position={[3, 0.5, 0]}>
        {/* Core "sealed asset" shape */}
        <Icosahedron args={[1.1, 1]}>
          <MeshDistortMaterial
            color="#0E9E86"
            distort={0.15}
            speed={1}
            roughness={0.2}
            metalness={0.6}
          />
        </Icosahedron>

        {/* Orbiting security ring */}
        <Torus args={[1.7, 0.04, 16, 100]} rotation={[Math.PI / 2.5, 0, 0]}>
          <meshStandardMaterial
            color="#F4B740"
            roughness={0.3}
            metalness={0.7}
          />
        </Torus>
        <Torus args={[1.9, 0.02, 16, 100]} rotation={[Math.PI / 1.8, 0.3, 0]}>
          <meshStandardMaterial
            color="#0F1B2B"
            roughness={0.4}
            metalness={0.5}
          />
        </Torus>
      </group>
    </Float>
  );
}

export default function Hero3D() {
  return (
    <div className="absolute inset-0 z-0 opacity-90 pointer-events-none">
      <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
        <ambientLight intensity={1} />
        <directionalLight position={[3, 4, 3]} intensity={1.8} />
        <pointLight position={[-3, -2, 2]} intensity={0.5} color="#F4B740" />
        <VaultCore />
      </Canvas>
    </div>
  );
}
