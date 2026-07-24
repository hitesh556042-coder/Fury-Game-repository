class Tank {
    constructor(scene, physicsWorld, listener) {
        this.scene = scene;
        this.physicsWorld = physicsWorld;
        this.listener = listener;
        this.health = 100;
        this.ammo = 30;

        this.mesh = new THREE.Group();
        this.scene.add(this.mesh);

        // Physics Rigid Body setup (approximate dimensions for tank.glb)
        const boxShape = new CANNON.Box(new CANNON.Vec3(1.5, 0.9, 2.8));
        this.body = new CANNON.Body({ mass: 15000, material: physicsWorld.tankMaterial });
        this.body.addShape(boxShape);
        this.body.position.set(0, 1.5, 0);
        this.physicsWorld.world.addBody(this.body);

        // Load 3D GLB Model
        this.loadModel();
        
        // Setup Engine Sound
        this.setupEngineSound();
    }

    loadModel() {
        const loader = new THREE.GLTFLoader();
        loader.load('models/tank.glb', (gltf) => {
            this.model = gltf.scene;
            
            // Shadows enable karna
            this.model.traverse((child) => {
                if (child.isMesh) {
                    child.castShadow = true;
                    child.receiveShadow = true;
                }
            });

            this.mesh.add(this.model);
        }, undefined, (error) => {
            console.error('Error loading GLB tank model:', error);
        });
    }

    setupEngineSound() {
        this.engineSound = new THREE.PositionalAudio(this.listener);
        const audioLoader = new THREE.AudioLoader();
        audioLoader.load('sounds/engine.mp3', (buffer) => {
            this.engineSound.setBuffer(buffer);
            this.engineSound.setLoop(true);
            this.engineSound.setVolume(0.5);
            this.engineSound.setRefDistance(10);
            this.engineSound.play();
        });
        this.mesh.add(this.engineSound);
    }

    move(forward, turn) {
        const forceMagnitude = 250000;
        const forwardVec = new THREE.Vector3(0, 0, 1).applyQuaternion(this.mesh.quaternion);
        
        if (forward !== 0) {
            const force = new CANNON.Vec3(
                forwardVec.x * forward * forceMagnitude,
                0,
                forwardVec.z * forward * forceMagnitude
            );
            this.body.applyForce(force, this.body.position);
        }

        if (turn !== 0) {
            this.body.angularVelocity.y = -turn * 1.5;
        }

        // Engine sound pitch control based on speed
        if (this.engineSound && this.engineSound.isPlaying) {
            const speed = this.body.velocity.length();
            this.engineSound.setPlaybackRate(1 + speed * 0.05);
        }
    }

    update() {
        this.mesh.position.copy(this.body.position);
        this.mesh.quaternion.copy(this.body.quaternion);
    }
}
