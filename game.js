// Main Game Controller
const physics = new PhysicsWorld();
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x87ceeb);
scene.fog = new THREE.FogExp2(0x87ceeb, 0.003);

const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
document.body.appendChild(renderer.domElement);

// Lighting Setup (Sun & Ambient Light)
const sun = new THREE.DirectionalLight(0xffffff, 1.2);
sun.position.set(50, 100, 50);
sun.castShadow = true;
scene.add(sun);
scene.add(new THREE.AmbientLight(0x404040, 0.6));

// Instantiations
const input = new InputHandler();
const terrain = new Terrain(scene, physics);
const player = new Tank(scene, physics);
const gameCam = new GameCamera(camera, player.mesh);
const weapons = new WeaponSystem(scene, physics);
const enemy = new EnemyAI(scene, physics, player);
const ui = new UIManager();

const clock = new THREE.Clock();

function animate() {
    requestAnimationFrame(animate);

    const dt = clock.getDelta();

    // Movement logic
    const forward = (input.keys.forward ? 1 : 0) - (input.keys.backward ? 1 : 0);
    const turn = (input.keys.right ? 1 : 0) - (input.keys.left ? 1 : 0);
    player.move(forward, turn);

    // Camera Mode Check
    gameCam.isScope = input.keys.scope;
    ui.toggleScope(input.keys.scope);

    // Shooting Mechanics
    if (input.keys.fire) {
        const fireDirection = new THREE.Vector3(0, 0, 1).applyQuaternion(player.mesh.quaternion);
        const spawnPos = player.mesh.position.clone().add(fireDirection.clone().multiplyScalar(3.5));
        
        if (weapons.fire(spawnPos, fireDirection)) {
            input.keys.fire = false; // Single tap action
        }
    }

    // Engine Updates
    physics.update(dt);
    player.update();
    enemy.update();
    weapons.update(dt);
    gameCam.update();
    ui.updateHUD(player.health, player.ammo);

    renderer.render(scene, camera);
}

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

animate();
