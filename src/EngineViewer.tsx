import React, { Suspense, useEffect, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Center, OrbitControls, useGLTF } from "@react-three/drei";
import * as THREE from "three";

function TurbofanModel() {
  const { scene } = useGLTF("/scene.glb");
  const modelRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (!modelRef.current) return;
    modelRef.current.rotation.y += delta * 0.38;
    modelRef.current.rotation.x = Math.sin(performance.now() * 0.00035) * 0.035;
  });

  return (
    <group ref={modelRef}>
      <Center>
        <primitive object={scene} />
      </Center>
    </group>
  );
}

function EngineLoading() {
  return (
    <div className="engine-loading">
      <span>PROPULSION SYSTEM</span>
      <strong>LOADING TURBOFAN MODEL</strong>
      <p>Preparing the interactive CAD display…</p>
    </div>
  );
}

class EngineErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { failed: boolean }
> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error: unknown) {
    console.error("Engine viewer failed to load:", error);
  }

  render() {
    if (this.state.failed) {
      return (
        <div className="engine-fallback">
          <span>PROPULSION SYSTEM</span>
          <strong>3D VIEWER TEMPORARILY UNAVAILABLE</strong>
          <p>The rest of the portfolio remains fully available.</p>
        </div>
      );
    }

    return this.props.children;
  }
}

export default function EngineViewer() {
  const [visible, setVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = containerRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "500px 0px" }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} className="engine-viewer">
      {!visible ? (
        <EngineLoading />
      ) : (
        <EngineErrorBoundary>
          <Canvas
            camera={{ position: [0, 0, 5], fov: 38 }}
            dpr={[1, 1.5]}
            gl={{ antialias: true, alpha: true }}
          >
            <ambientLight intensity={1.7} />
            <directionalLight position={[4, 5, 6]} intensity={3.2} />
            <directionalLight position={[-4, -2, -3]} intensity={1.4} />
            <Suspense fallback={null}>
              <TurbofanModel />
            </Suspense>
            <OrbitControls
              enablePan={false}
              minDistance={2.4}
              maxDistance={7}
              enableDamping
              dampingFactor={0.06}
            />
          </Canvas>
        </EngineErrorBoundary>
      )}
    </div>
  );
}

