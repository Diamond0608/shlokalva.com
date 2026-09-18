import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { Bounds, Center, OrbitControls, useGLTF } from "@react-three/drei";
import * as THREE from "three";

function ProjectModel({ src }: { src: string }) {
  const { scene } = useGLTF(src);

  return (
    <Center>
      <primitive object={scene} dispose={null} />
    </Center>
  );
}

function Loading() {
  return (
    <div className="project-model-loading">
      <span>3D MODEL</span>
      <strong>LOADING PROJECT MODEL</strong>
    </div>
  );
}

export default function ProjectModelViewer({ src }: { src: string }) {
  return (
    <div className="project-model-viewer">
      <Canvas
        camera={{ position: [4, 3, 5], fov: 38 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        onCreated={({ gl }) => {
          gl.toneMapping = THREE.ACESFilmicToneMapping;
          gl.toneMappingExposure = 1;
        }}
      >
        <hemisphereLight intensity={1.8} color="#ffffff" groundColor="#202020" />
        <directionalLight position={[5, 6, 7]} intensity={4.5} />
        <directionalLight position={[-4, 2, 3]} intensity={2.2} />
        <directionalLight position={[2, -2, -5]} intensity={1.8} />

        <Suspense fallback={null}>
          <Bounds fit clip margin={1.25}>
            <ProjectModel src={src} />
          </Bounds>
        </Suspense>

        <OrbitControls
          enablePan={false}
          enableDamping
          dampingFactor={0.06}
          rotateSpeed={0.7}
        />
      </Canvas>
      <div className="project-model-hint">Drag To Inspect</div>
      <div className="project-model-loading-fallback"><Loading /></div>
    </div>
  );
}
