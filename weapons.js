class WeaponSystem {
    constructor(scene, physicsWorld) {
        this.scene = scene;
        this.physicsWorld = physicsWorld;
        this.shells = [];
        this.particles = [];
        this.isReloading = false;
    }

    fire(spawnPos, direction) {
        if (this.isReloading) return false;

        // Visual Bullet Tracer (Red Glow)
        const geo = new THREE.CylinderGeometry(0.08, 0.08, 1.5);
        const mat = new THREE.MeshBasicMaterial({ color: 0xff0000 });
        const shellMesh = new THREE.Mesh(geo, mat);
        shellMesh.position.copy(spawnPos);
        shellMesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction);
        this.scene.add(shellMesh);

        // Physics Shell
        const shape = new CANNON.Sphere(0.1);
        const body = new CANNON.Body({ mass: 5 });
        body.position.copy(spawnPos);
        body.velocity.copy(direction.clone().multiplyScalar(120));
        this.physicsWorld.world.addBody(body);

        this.shells.push({ mesh: shellMesh, body: body, life: 3.0 });
        this.createMuzzleFlash(spawnPos);

        return true;
    }

    createMuzzleFlash(pos) {
        const light = new THREE.PointLight(0xffaa00, 5, 10);
        light.position.copy(pos);
        this.scene.add(light);
        setTimeout(() => this.scene.remove(light), 50);
    }

    createExplosion(pos) {
        // Impact particles (Dust & Fire Smoke)
        const count = 30;
        const geometry = new THREE.BufferGeometry();
        const positions = [];
        for (let i = 0; i < count; i++) {
            positions.push(
                pos.x + (Math.random() - 0.5) * 2,
                pos.y + Math.random() * 2,
                pos.z + (Math.random() - 0.5) * 2
            );
        }
        geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
        const material = new THREE.PointsMaterial({ color: 0xff4500, size: 0.5 });
        const pSystem = new THREE.Points(geometry, material);
        this.scene.add(pSystem);
        setTimeout(() => this.scene.remove(pSystem), 400);
    }

    update(dt) {
        for (let i = this.shells.length - 1; i >= 0; i--) {
            const s = this.shells[i];
            s.life -= dt;
            s.mesh.position.copy(s.body.position);
            s.mesh.quaternion.copy(s.body.quaternion);

            if (s.life <= 0 || s.body.position.y <= 0) {
                this.createExplosion(s.mesh.position);
                this.scene.remove(s.mesh);
                this.physicsWorld.world.remove(s.body);
                this.shells.splice(i, 1);
            }
        }
    }
}
