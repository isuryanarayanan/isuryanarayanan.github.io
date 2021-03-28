import './App.css';
import React, {useRef} from 'react';
import { Canvas, useFrame } from 'react-three-fiber';
import { OrbitControls} from '@react-three/drei';

function Box(props){
	const mesh = useRef()

	useFrame(()=>{
		mesh.current.rotation.x = mesh.current.rotation.y += 0.01
	})

	return (
		<mesh {...props} ref={mesh}>
		    <boxBufferGeometry attach="geometry" args={[1, 2, 1]} />
		    <meshStandardMaterial metalness={0.9} attach="material" color={'#f4511e'} />
		</mesh>
	);
}

function App() {
  return (
		<>
		<Canvas>
		<ambientLight intensity={1} />
		<spotLight position={[10, 10, 10]} angle={0.15} />
		<Box position={[0, 0, 0]} />
		<OrbitControls />
		</Canvas>
		</>
  );
}

export default App;
