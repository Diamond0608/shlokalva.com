import React, { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  Bounds,
  Center,
  OrbitControls,
  useAnimations,
  useBounds,
  useGLTF
} from "@react-three/drei";
import * as THREE from "three";
import { RotateCcw, ZoomIn, ZoomOut } from "lucide-react";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";

// scene.glb is a single merged mesh (one node, no named bodies), so a true exploded view of separate
// parts is not possible from it. Instead the "inspection cycle" is a slow lengthwise cutaway: a clipping
// plane sweeps down through the engine, holds on the opened view, then closes again.
const CYCLE = 44; // seconds: closed, slow opening, long hold, closing, closed
const smooth = (t: number) => t * t * (3 - 2 * t);

function cutProgress(elapsed: number) {
  const phase = elapsed % CYCLE;
  if (phase < 5) return 0;
  if (phase < 19) return smooth((phase - 5) / 14);
  if (phase < 35) return 1;
  if (phase < 43) return 1 - smooth((phase - 35) / 8);
  return 0;
}

function StudioEnvironment() {
  const { gl, scene } = useThree();
  useEffect(() => {
    const generator = new THREE.PMREMGenerator(gl);
    const env = generator.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = env;
    return () => {
      scene.environment = null;
      env.dispose();
      generator.dispose();
    };
  }, [gl, scene]);
  return null;
}

// Bounds can fit before the model has been laid out; re-fit a few times shortly after mount.
function RefitBounds() {
  const api = useBounds();
  useEffect(() => {
    const refit = () => api.refresh().clip().fit();
    const timers = [60, 250, 700].map((delay) => window.setTimeout(refit, delay));
    return () => timers.forEach((id) => window.clearTimeout(id));
  }, [api]);
  return null;
}

function TurbofanModel() {
  const { scene, animations } = useGLTF("/scene.glb");
  const modelRef = useRef<THREE.Group>(null);
  const motionRootRef = useRef<THREE.Group>(null);
  const { actions } = useAnimations(animations, modelRef);
  const plane = useMemo(() => new THREE.Plane(new THREE.Vector3(0, -1, 0), 1e6), []);
  const range = useRef<{ min: number; max: number } | null>(null);

  // Global clipping plane on the renderer (simpler and sturdier than per-material planes).
  const gl = useThree((state) => state.gl);
  useEffect(() => {
    gl.clippingPlanes = [plane];
    return () => {
      gl.clippingPlanes = [];
    };
  }, [gl, plane]);

  useEffect(() => {
    scene.traverse((object) => {
      if (!(object instanceof THREE.Mesh)) return;
      object.castShadow = true;
      object.receiveShadow = true;

      const materials = Array.isArray(object.material) ? object.material : [object.material];
      materials.forEach((material: THREE.Material) => {
        const standard = material as THREE.MeshStandardMaterial;
        // Brushed-steel look: reflective, lightly rough, lit by the studio environment.
        standard.metalness = 0.92;
        standard.roughness = 0.26;
        standard.color = new THREE.Color("#cfd5dc");
        standard.envMapIntensity = 1.15;
        standard.side = THREE.DoubleSide; // the cutaway shows interior surfaces
        standard.needsUpdate = true;
      });
    });

    Object.values(actions).forEach((action) => {
      action?.reset().fadeIn(0.35).play();
    });

    return () => {
      Object.values(actions).forEach((action) => action?.stop());
    };
  }, [actions, scene, plane]);

  useFrame((state) => {
    const root = motionRootRef.current;
    if (!root) return;
    if (!range.current) {
      const box = new THREE.Box3().setFromObject(root);
      if (box.isEmpty()) return;
      range.current = { min: box.min.y, max: box.max.y };
    }
    const { min, max } = range.current;
    const mid = (min + max) / 2;
    const cut = cutProgress(state.clock.elapsedTime);
    // Everything above the plane is removed; at cut = 1 only the lower half remains.
    plane.constant = max + 1 - cut * (max + 1 - (mid + (max - min) * 0.02));
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
  const [visible] = useState(true);
  const controlsRef = useRef<any>(null);
  const stateRef = useRef<{ camera: THREE.Camera } | null>(null);
  const startPos = useRef<THREE.Vector3 | null>(null);
  const level = useRef(0);

  // Buttons rather than scroll-wheel zoom, so the engine never hijacks page scrolling.
  const zoom = (step: number) => {
    const controls = controlsRef.current;
    const camera = stateRef.current?.camera;
    if (!controls || !camera) return;
    const next = Math.max(-3, Math.min(5, level.current + step));
    if (next === level.current) return;
    level.current = next;
    const factor = step > 0 ? 1 / 1.28 : 1.28;
    camera.position.sub(controls.target).multiplyScalar(factor).add(controls.target);
    controls.update();
  };

  const reset = () => {
    const controls = controlsRef.current;
    const camera = stateRef.current?.camera;
    if (!controls || !camera) return;
    controls.reset();
    level.current = 0;
  };

  return (
    <div className="engine-viewer">
      {!visible ? (
        <EngineLoading />
      ) : (
        <EngineErrorBoundary>
          <Canvas
            shadows
            camera={{ position: [4.8, 2.6, 6.2], fov: 34 }}
            dpr={[1, 1.5]}
            gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
            onCreated={(state) => {
              const { gl } = state;
              stateRef.current = state;
              gl.toneMapping = THREE.ACESFilmicToneMapping;
              gl.toneMappingExposure = 1.05;
              gl.localClippingEnabled = true;
            }}
          >
            <StudioEnvironment />
            <hemisphereLight intensity={0.9} color="#ffffff" groundColor="#202020" />
            <directionalLight
              position={[5, 6, 7]}
              intensity={2.4}
              castShadow
              shadow-mapSize={[2048, 2048]}
            />
            <directionalLight position={[-5, 2, 2]} intensity={1.7} color="#ffffff" />
            <directionalLight position={[2, -2, -6]} intensity={1.4} color="#ffffff" />

            <Suspense fallback={null}>
              <Bounds fit clip margin={1.18}>
                <TurbofanModel />
                <RefitBounds />
              </Bounds>
            </Suspense>

            <OrbitControls
              ref={controlsRef}
              enablePan={false}
              enableZoom={false}
              enableDamping
              dampingFactor={0.06}
              rotateSpeed={0.65}
            />
          </Canvas>
          <div className="engine-zoom" role="group" aria-label="Turbofan zoom controls">
            <button onClick={() => zoom(1)} aria-label="Zoom in">
              <ZoomIn size={17} />
            </button>
            <button onClick={() => zoom(-1)} aria-label="Zoom out">
              <ZoomOut size={17} />
            </button>
            <button onClick={reset} aria-label="Reset view">
              <RotateCcw size={16} />
            </button>
          </div>
        </EngineErrorBoundary>
      )}
    </div>
  );
}
