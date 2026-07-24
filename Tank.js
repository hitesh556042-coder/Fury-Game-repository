import * as THREE from 'three';
import * as CANNON from 'cannon-es';

export class Tank {
    constructor(scene, world) {
        this.scene = scene;
        this.world = world;
        this.health = 100;
        this.ammo = 20;
        this.isReloading = false;

        // 3D Chassis
        const bodyGeo = new THREE.BoxGeometry(3, 1.2, 5);
        const mat = new THREE.MeshStandardMaterial({ color: 0x2e3b23 });
        this.mesh = new THREE.Mesh(bodyGeo, mat);
        this.mesh.castShadow = true;
        scene.add(this.mesh);

        // Turret
        const turretGeo = new THREE.BoxGeometry(2, 0.8, 2.2);
        this.turret = new THREE.Mesh(turretGeo, mat);
        this.turret.position.set(0, 1, 0);
        this.mesh.add(this.turret);

        // Barrel (For Recoil)
        const barrelGeo = new THREE.CylinderGeometry(0.12, 0.12, 3.5);
        this.barrel = new THREE.Mesh(barrelGeo, new THREE.MeshStandardMaterial({ color: 0x111111 }));
        this.barrel.rotation.x = Math.PI / 2;
        this.barrel.position.set(0, 0.2, -2);
        this.turret.add(this.barrel);

        // Physics Body (With Suspension Gravity)
        const shape = new CANNON.Box(new CANNON.Vec3(1.5, 0.6, 2.5));
        this.body = new CANNON.Body({ mass: 2000 });
        this.body.addShape(shape);
        this.body.position.set(0, 5, 0);
        this.body.angularDamping = 0.5; // Controls roll stability
        world.addBody(this.body);
    }

    // Cannon Recoil Effect
    applyRecoil() {
        this.barrel.position.z += 0.5; // Backward Kick
        this.body.applyLocalImpulse(new CANNON.Vec3(0, 0, 1500), new CANNON.Vec3(0, 0, 0)); // Tank kickback
    }

    update() {
        this.mesh.position.copy(this.body.position);
        this.mesh.quaternion.copy(this.body.quaternion);

        // Smooth Recoil Return
        this.barrel.position.z = THREE.MathUtils.lerp(this.barrel.position.z, -2, 0.1);
    }
}
