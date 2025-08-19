"use client";

import { Canvas } from "@react-three/fiber";
import { Suspense, useRef, useState } from "react";
import { OrbitControls, useGLTF, Environment, Loader } from "@react-three/drei";

function GpuModel() {
  const { scene } = useGLTF("/models/nvidia-rtx-4090.glb");
  return <primitive object={scene} scale={1.5} rotation={[0.1, 0.4, 0]} />;
}

export default function GpuViewer() {
  //eslint-disable-next-line
  const controlsRef = useRef<any>(null);
  const [autoRotate, setAutoRotate] = useState(true);

  const handleStart = () => {
    setAutoRotate(false);
  };

  return (
    <div className="h-[700px] relative bg-gradient-to-b from-neutral-900 to-neutral-800 rounded-xl">
      <Loader
        containerStyles={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          backgroundColor: "#232323",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 10,
          borderRadius: "0.75rem",
        }}
        barStyles={{ backgroundColor: "#ffffff" }}
        dataStyles={{ color: "white" }}
        dataInterpolation={(p) => `Chargement... ${p.toFixed(0)}%`}
      />
      <Canvas
        camera={{
          position: [0, 0, 30],
          fov: 45,
        }}
      >
        <ambientLight intensity={1} />
        <directionalLight position={[10, 10, 10]} intensity={1.5} />

        <Suspense fallback={null}>
          <GpuModel />

          <OrbitControls
            ref={controlsRef}
            enableZoom
            minDistance={700}
            maxDistance={950}
            target={[0, 0, 0]}
            autoRotate={autoRotate}
            autoRotateSpeed={1.5}
            onStart={handleStart}
          />

          <Environment preset="warehouse" />
        </Suspense>
      </Canvas>
    </div>
  );
}
