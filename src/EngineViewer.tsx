import React, { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  Bounds,
  Center,
  OrbitControls,
  useAnimations,
  useGLTF
} from "@react-three/drei";
import * as THREE from "three";

type MotionPart = {
  object: THREE.Object3D;
  position: THREE.Vector3;
  axisOffset: number;
  radialOffset: THREE.Vector3;
  weight: number;
};

function TurbofanModel() {
  const { scene, animations } = useGLTF("/scene.glb");
  const modelRef = useRef<THREE.Group>(null);
  const motionRootRef = useRef<THREE.Group>(null);
  const { actions } = useAnimations(animations, modelRef);

  const parts = useMemo<MotionPart[]>(() => {
    const box = new THREE.Box3().setFromObject(scene);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());

    const axis = size.x >= size.y && size.x >= size.z
      ? new THREE.Vector3(1, 0, 0)
      : size.y >= size.z
        ? new THREE.Vector3(0, 1, 0)
        : new THREE.Vector3(0, 0, 1);

    const candidates: MotionPart[] = [];

    scene.traverse((object) => {
      if (object === scene || object.children.length > 0 && object.parent !== scene) return;
      if (!(object instanceof THREE.Mesh)) return;

      const objectBox = new THREE.Box3().setFromObject(object);
      const objectCenter = objectBox.getCenter(new THREE.Vector3());
      const relative = objectCenter.clone().sub(center);
      const projection = relative.dot(axis);
      const radial = relative.clone().sub(axis.clone().multiplyScalar(projection));

      candidates.push({
        object,
        position: object.position.clone(),
        axisOffset: Math.sign(projection) || 0,
        radialOffset: radial.normalize(),
        weight: Math.min(1, Math.max(0.18, objectBox.getSize(new THREE.Vector3()).length() / size.length()))
      });
    });

    return candidates;
  }, [scene]);

  useEffect(() => {
    scene.traverse((object) => {
      if (!(object instanceof THREE.Mesh)) return;

      object.castShadow = true;
      object.receiveShadow = true;

      const materials = Array.isArray(object.material)
        ? object.material
        : [object.material];

      materials.forEach((material) => {
        if ("metalness" in material && typeof material.metalness === "number") {
          material.metalness = Math.max(material.metalness, 0.22);
        }
        if ("roughness" in material && typeof material.roughness === "number") {
          material.roughness = Math.min(material.roughness, 0.48);
        }
      });
    });

    Object.values(actions).forEach((action) => {
      action?.reset().fadeIn(0.35).play();
    });

    return () => {
      Object.values(actions).forEach((action) => action?.stop());
    };
  }, [actions, scene]);

  useFrame((state, delta) => {
    const root = motionRootRef.current;
    if (!root) return;

    const elapsed = state.clock.elapsedTime;
    // Slow whole-engine presentation rotation. Dragging with OrbitControls remains available.
    root.rotation.y += delta * 0.16;
    root.rotation.x = Math.sin(elapsed * 0.42) * 0.025;

    // If Fusion's animation was exported into the GLB, let the actual clips drive it.
    // Otherwise reproduce the intended motion-study feel procedurally:
    // closed -> progressively opened/exploded -> held -> reassembled.
    if (animations.length === 0) {
      const box = new THREE.Box3().setFromObject(scene);
      const size = box.getSize(new THREE.Vector3());
      const axis = size.x >= size.y && size.x >= size.z
        ? new THREE.Vector3(1, 0, 0)
        : size.y >= size.z
          ? new THREE.Vector3(0, 1, 0)
          : new THREE.Vector3(0, 0, 1);

      const cycle = 18;
      const phase = elapsed % cycle;
      let explode = 0;

      if (phase < 5) {
        explode = phase / 5;
      } else if (phase < 10) {
        explode = 1;
      } else if (phase < 15) {
        explode = 1 - (phase - 10) / 5;
      }

      parts.forEach(({ object, position, axisOffset, radialOffset, weight }) => {
        const axial = axisOffset * explode * 0.62 * (0.45 + weight);
        const radial = radialOffset.multiplyScalar(explode * 0.08 * weight);
        object.position.copy(position).add(
          new THREE.Vector3(
            axis.x * axial,
            axis.y * axial,
            axis.z * axial
          )
        ).add(radial);
      });
    }

    // Keep identifiable rotating turbofan internals moving like the real rotating assembly.
    scene.traverse((object) => {
      const name = object.name.toLowerCase();
      if (!/(fan|rotor|blade|spinner|hub|shaft|turbine|compressor)/.test(name)) return;

      object.rotation.z += delta * 2.8;
    });

    // Very subtle breathing motion keeps the presentation alive without distorting the CAD.
    root.scale.setScalar(1 + Math.sin(elapsed * 0.7) * 0.006);
  });

  return (
    <group ref={modelRef}>
      <group ref={motionRootRef}>
        <Center>
          <primitive object={scene} dispose={null} />
        </Center>
      </group>
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
            shadows
            camera={{ position: [4.8, 2.6, 6.2], fov: 34 }}
            dpr={[1, 1.5]}
            gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
            onCreated={({ gl }) => {
              gl.toneMapping = THREE.ACESFilmicToneMapping;
              gl.toneMappingExposure = 1.12;
            }}
          >
            <hemisphereLight intensity={1.5} color="#e8f5ff" groundColor="#1a1110" />
            <directionalLight
              position={[5, 6, 7]}
              intensity={4.5}
              castShadow
              shadow-mapSize={[2048, 2048]}
            />
            <directionalLight position={[-5, 2, 2]} intensity={2.2} color="#89d8ff" />
            <directionalLight position={[2, -2, -6]} intensity={2.4} color="#ffb078" />

            <Suspense fallback={null}>
              <Bounds fit clip observe margin={1.18}>
                <TurbofanModel />
              </Bounds>
            </Suspense>

            <OrbitControls
              enablePan={false}
              minDistance={2.5}
              maxDistance={9}
              enableDamping
              dampingFactor={0.06}
              rotateSpeed={0.65}
              zoomSpeed={0.7}
            />
          </Canvas>
        </EngineErrorBoundary>
      )}
    </div>
  );
}
