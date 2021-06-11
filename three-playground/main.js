import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GUI } from "three/examples/jsm/libs/dat.gui.module.js";
import { MarchingCubes } from "three/examples/jsm/objects/MarchingCubes.js";
import {
  ToonShader1,
  ToonShader2,
  ToonShaderHatching,
  ToonShaderDotted,
} from "three/examples/jsm/shaders/ToonShader.js";

let container, stats;

let camera, scene, renderer;

let materials, current_material;

let light, pointLight, ambientLight;

let effect, resolution;

let effectController;

let time = 0;
const clock = new THREE.Clock();

init();
animate();

function init() {
  container = document.getElementById("container");

  camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    1,
    10000
  );
  camera.position.set(0, 200, 2000);

  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x000000);

  light = new THREE.DirectionalLight(0xffffff);
  light.position.set(0.5, 0.5, 1);
  scene.add(light);

  pointLight = new THREE.PointLight(0xff3300);
  pointLight.position.set(0, 0, 100);
  scene.add(pointLight);

  ambientLight = new THREE.AmbientLight(0x080808);
  scene.add(ambientLight);

  // MATERIALS

  materials = generateMaterials();
  current_material = "hatching";

  // MARCHING CUBES

  resolution = 28;

  effect = new MarchingCubes(
    resolution,
    materials[current_material].m,
    true,
    true
  );
  effect.position.set(0, 0, 0);
  effect.scale.set(700, 700, 700);

  effect.enableUvs = false;
  effect.enableColors = false;

  scene.add(effect);

  // RENDERER

  renderer = new THREE.WebGLRenderer();
  renderer.outputEncoding = THREE.sRGBEncoding;
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  container.appendChild(renderer.domElement);

  // CONTROLS

  //const controls = new OrbitControls(camera, renderer.domElement);
  //controls.minDistance = 500;
  //controls.maxDistance = 5000;

  // STATS

  //stats = new Stats();
  //container.appendChild(stats.dom);

  // GUI

  setupGui();

  // EVENTS

  window.addEventListener("resize", onWindowResize);
}

//

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
}

function generateMaterials() {
  const toonMaterial1 = createShaderMaterial(ToonShader1, light, ambientLight);
  const toonMaterial2 = createShaderMaterial(ToonShader2, light, ambientLight);
  const hatchingMaterial = createShaderMaterial(
    ToonShaderHatching,
    light,
    ambientLight
  );
  const dottedMaterial = createShaderMaterial(
    ToonShaderDotted,
    light,
    ambientLight
  );

  const materials = {
    toon1: {
      m: toonMaterial1,
      h: 0.2,
      s: 1,
      l: 0.75,
    },

    toon2: {
      m: toonMaterial2,
      h: 0.4,
      s: 1,
      l: 0.75,
    },

    hatching: {
      m: hatchingMaterial,
      h: 0.2,
      s: 1,
      l: 0.9,
    },

    dotted: {
      m: dottedMaterial,
      h: 0.2,
      s: 1,
      l: 0.9,
    },
  };

  return materials;
}

function createShaderMaterial(shader, light, ambientLight) {
  const u = THREE.UniformsUtils.clone(shader.uniforms);

  const vs = shader.vertexShader;
  const fs = shader.fragmentShader;

  const material = new THREE.ShaderMaterial({
    uniforms: u,
    vertexShader: vs,
    fragmentShader: fs,
  });

  material.uniforms["uDirLightPos"].value = light.position;
  material.uniforms["uDirLightColor"].value = light.color;

  material.uniforms["uAmbientLightColor"].value = ambientLight.color;

  return material;
}

//

function setupGui() {
  const createHandler = function (id) {
    return function () {
      const mat_old = materials[current_material];
      mat_old.h = m_h.getValue();
      mat_old.s = m_s.getValue();
      mat_old.l = m_l.getValue();

      current_material = id;

      const mat = materials[id];
      effect.material = mat.m;

      m_h.setValue(mat.h);
      m_s.setValue(mat.s);
      m_l.setValue(mat.l);

      effect.enableUvs = current_material === "textured" ? true : false;
      effect.enableColors =
        current_material === "colors" || current_material === "multiColors"
          ? true
          : false;
    };
  };

  effectController = {
    material: "shiny",

    speed: 0.5,
    numBlobs: 20,
    resolution: 28,
    isolation: 120,

    floor: false,
    wallx: false,
    wallz: false,

    hue: 0.52,
    saturation: 0.8,
    lightness: 1,

    lhue: 0.04,
    lsaturation: 1.0,
    llightness: 0.5,

    lx: 2.5,
    ly: 2.5,
    lz: 1.0,

    dummy: function () {},
  };

  let h;
}

function updateCubes(object, time, numblobs, floor, wallx, wallz) {
  object.reset();

  const rainbow = [
    new THREE.Color(0xff0000),
    new THREE.Color(0xff7f00),
    new THREE.Color(0xffff00),
    new THREE.Color(0x00ff00),
    new THREE.Color(0x0000ff),
    new THREE.Color(0x4b0082),
    new THREE.Color(0x9400d3),
  ];
  const subtract = 12;
  const strength = 1.2 / ((Math.sqrt(numblobs) - 1) / 4 + 1);

  for (let i = 0; i < numblobs; i++) {
    const ballx =
      Math.sin(i + 1.26 * time * (1.03 + 0.5 * Math.cos(0.21 * i))) * 0.27 +
      0.5;
    const bally =
      Math.abs(Math.cos(i + 1.12 * time * Math.cos(1.22 + 0.1424 * i))) * 0.77; // dip into the floor
    const ballz =
      Math.cos(i + 1.32 * time * 0.1 * Math.sin(0.92 + 0.53 * i)) * 0.27 + 0.5;

    object.addBall(ballx, bally, ballz, strength, subtract);
  }

  if (floor) object.addPlaneY(2, 12);
  if (wallz) object.addPlaneZ(2, 12);
  if (wallx) object.addPlaneX(2, 12);
}

//

function animate() {
  requestAnimationFrame(animate);

  render();
}

function render() {
  const delta = clock.getDelta();

  time += delta * effectController.speed * 0.5;

  // marching cubes

  if (effectController.resolution !== resolution) {
    resolution = effectController.resolution;
    effect.init(Math.floor(resolution));
  }

  if (effectController.isolation !== effect.isolation) {
    effect.isolation = effectController.isolation;
  }

  updateCubes(
    effect,
    time,
    effectController.numBlobs,
    effectController.floor,
    effectController.wallx,
    effectController.wallz
  );

  // materials

  if (effect.material instanceof THREE.ShaderMaterial) {
    effect.material.uniforms["uBaseColor"].value.setHSL(
      effectController.hue,
      effectController.saturation,
      effectController.lightness
    );
  } else {
    effect.material.color.setHSL(
      effectController.hue,
      effectController.saturation,
      effectController.lightness
    );
  }

  // lights

  light.position.set(
    effectController.lx,
    effectController.ly,
    effectController.lz
  );
  light.position.normalize();

  pointLight.color.setHSL(
    effectController.lhue,
    effectController.lsaturation,
    effectController.llightness
  );

  // render

  effect.rotation.x = effect.rotation.y + 0.01;

  renderer.render(scene, camera);
}
