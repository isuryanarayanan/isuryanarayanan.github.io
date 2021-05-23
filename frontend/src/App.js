import "./App.css";
import React, { Suspense, useRef } from "react";
import { Canvas, useFrame, useLoader } from "react-three-fiber";
import { TextureLoader } from "three/src/loaders/TextureLoader";
import { OrbitControls } from "@react-three/drei";
function Box(props) {
  const mesh = useRef();
  const texture = useLoader(TextureLoader, "./isuryanarayanan.png");
  texture.offset.set(0.2, 0.2);
  console.log(texture);

  useFrame(({ mouse }) => {
    mesh.current.rotation.x = mesh.current.rotation.y += 0.01;
    mesh.current.position.x = mouse.x * 5;
    mesh.current.position.y = mouse.y * 5;
  });

  return (
    <Suspense>
      <mesh {...props} ref={mesh}>
        <torusGeometry args={[10, 1, 10, 100]} />
        <meshStandardMaterial attach="material" map={texture} />
      </mesh>
    </Suspense>
  );
}

function App() {
  return (
    <>
      <Canvas>
        <ambientLight intensity={1} />
        <spotLight position={[10, 10, 10]} angle={0.15} />
        <Box position={[0, 0, -15]} />
        <OrbitControls />
      </Canvas>
    </>
  );
}

export default App;
