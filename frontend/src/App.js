import './App.css';
import React from 'react';
import { Canvas } from 'react-three-fiber';
import {OrbitControls} from "@react-three/drei";
function RenderingBox(){
	return (
		<mesh>
			<boxBufferGeometry args={[1, 1, 1]}/>
			<meshStandardMaterial color="#820852" />
		</mesh> 
	)
}

function App() {
  return (
    <div className="App">
		<Canvas >
		<RenderingBox />
		<OrbitControls />
		</Canvas>
    </div>
  );
}

export default App;
