import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import { createEnvironment } from './Terrain.js';
import { Tank } from './Tank.js';
import { CameraController } from './Camera.js';
import { EnemyTank } from './enemy.js';

// Setup Renderer & World
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
document.body.appendChild(renderer.domElement);

const world = new CANNON.World({ gravity: new CANNON.Vec3(0, -9.81, 0) });

// Day / Night Cycle Setup
const sun = new THREE.DirectionalLight(0xffffff, 1);
sun.position.set(50, 100, 50);
scene.add(sun, new THREE.AmbientLight(0xffffff, 0.4));

let dayTime = 0;
function updateDayNightCycle() {
    dayTime += 0.001;
    sun.position.x = Math.cos(dayTime) * 100;
    sun.position.y = Math.sin(dayTime) * 100;
    
    // Sky Color interpolation
    if (sun.position.y < 0) {
        scene.background = new THREE.Color(0x050510); // Night Sky
    } else {
        scene.background = new THREE.Color(0x87ceeb); // Day Sky
    }
}

// Entities
const environment = createEnvironment(scene, world);
const playerTank = new Tank(scene, world);
const enemyTank = new EnemyTank(scene, world, new CANNON.Vec3(20, 5, 20));
const cameraController = new CameraController(camera, playerTank.mesh);

// MiniMap Context Setup
const mapCanvas = document.getElementById('minimap');
const mapCtx = mapCanvas ? mapCanvas.getContext('2d') : null;

function updateMiniMap() {
    if (!mapCtx) return;
    mapCtx.clearRect(0, 0, 150, 150);
    
    // Draw Player
    mapCtx.fillStyle = 'green';
    mapCtx.beginPath();
    mapCtx.arc(75, 75, 5, 0, Math.PI * 2);
    mapCtx.fill();

    // Draw Enemy
    const dx = 75 + (enemyTank.mesh.position.x - playerTank.mesh.position.x);
    const dz = 75 + (enemyTank.mesh.position.z - playerTank.mesh.position.z);
    mapCtx.fillStyle = 'red';
    mapCtx.beginPath();
    mapCtx.arc(dx, dz, 4, 0, Math.PI * 2);
    mapCtx.fill();
}

// Main Game Loop
function animate() {
    requestAnimationFrame(animate);

    world.fixedStep();
    updateDayNightCycle();
    playerTank.update();
    enemyTank.update(playerTank.mesh.position);
    cameraController.update();
    updateMiniMap();

    renderer.render(scene, camera);
}

animate();
