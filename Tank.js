class Tank {
    constructor(scene, physicsWorld) {
        this.scene = scene;
        this.physicsWorld = physicsWorld;
        this.health = 100;
        this.ammo = 30;

        this.mesh = new THREE.Group();
        this.buildModel();
        this.scene.add(this.mesh);

        // Physics Rigid Body setup
        const boxShape = new CANNON.Box(new CANNON.Vec3(1.5, 0.75, 2.5));
        this.body = new CANNON.Body({ mass: 15000, material: physicsWorld.tankMaterial });
        this.body.addShape(boxShape);
        this.body.position.set(0, 1.5, 0);
        this.physicsWorld.world.addBody(this.body);
    }

    buildModel() {
        const mat = new THREE.MeshStandardMaterial({ color: 0x2e3b23, roughness: 0.6 });
        
        // Base Hull
        const hull = new THREE.Mesh(new THREE.BoxGeometry(3, 1.2, 5), mat);
        hull.position.y = 0.6;
        this.mesh.add(hull);

        // Rotating Turret
        this.turret = new THREE.Mesh(new THREE.BoxGeometry(2, 0.8, 2.2), mat);
        this.turret.position.set(0, 1.6, -0.2);
        this.mesh.add(this.turret);

        // Main Cannon Barrel
        const barrelMat = new THREE.MeshStandardMaterial({ color: 0x111111 });
        this.barrel = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.15, 3.5), barrelMat);
        this.barrel.rotation.x = Math.PI / 2;
        this.barrel.position.set(0, 1.6, 2.2);
        this.mesh.add(this.barrel);
    }

    move(forward, turn) {
        const forceMagnitude = 250000;
        const torqueMagnitude = 180000;

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
    }

    update() {
        this.mesh.position.copy(this.body.position);
        this.mesh.quaternion.copy(this.body.quaternion);
    }
}
