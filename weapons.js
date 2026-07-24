class WeaponSystem {
    constructor(scene, physicsWorld, listener) {
        this.scene = scene;
        this.physicsWorld = physicsWorld;
        this.listener = listener;
        this.shells = [];
        this.isReloading = false;

        this.loadTextures();
        this.loadAudio();
    }

    loadTextures() {
        const loader = new THREE.TextureLoader();
        this.smokeTexture = loader.load('textures/smoke.png');
        this.flashTexture = loader.load('textures/flash.png');
    }

    loadAudio() {
        this.audioLoader = new THREE.AudioLoader();
        
        // Fire Sound Buffer
        this.fireBuffer = null;
        this.audioLoader.load('sounds/fire.mp3', (buffer) => {
            this.fireBuffer = buffer;
        });

        // Reload Sound Buffer
        this.reloadBuffer = null;
        this.audioLoader.load('sounds/reload.mp3', (buffer) => {
            this.reloadBuffer = buffer;
        });
    }

    fire(spawnPos, direction) {
        if (this.isReloading) return false;

        // Play Fire Audio
        if (this.fireBuffer) {
            const fireSound = new THREE.PositionalAudio(this.listener);
            fireSound.setBuffer(this.fireBuffer);
            fireSound.setVolume(1.0);
            fireSound.play();
        }

        // Tracer Bullet (Red Beam)
        const geo = new THREE.CylinderGeometry(0.08, 0.08, 1.5);
        const mat = new THREE.MeshBasicMaterial({ color: 0xff1100 });
        const shellMesh = new THREE.Mesh(geo, mat);
        shellMesh.position.copy(spawnPos);
        shellMesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction);
        this.scene.add(shellMesh);

        // Physics Shell Body
        const shape = new CANNON.Sphere(0.1);
        const body = new CANNON.Body({ mass: 5 });
        body.position.copy(spawnPos);
        body.velocity.copy(direction.clone().multiplyScalar(120));
        this.physicsWorld.world.addBody(body);

        this.shells.push({ mesh: shellMesh, body: body, life: 3.0 });
        this.createMuzzleFlash(spawnPos);

        // Reload Cooldown (3 seconds)
        this.isReloading = true;
        setTimeout(() => {
            this.isReloading = false;
            if (this.reloadBuffer) {
                const reloadSound = new THREE.PositionalAudio(this.listener);
                reloadSound.setBuffer(this.reloadBuffer);
                reloadSound.setVolume(0.8);
                reloadSound.play();
            }
        }, 3000);

        return true;
    }

    createMuzzleFlash(pos) {
        // Point Light Flash
        const light = new THREE.PointLight(0xffaa00, 8, 12);
        light.position.copy(pos);
        this.scene.add(light);

        // Sprite Flash with Texture
        if (this.flashTexture) {
            const mat = new THREE.SpriteMaterial({ map: this.flashTexture, transparent: true });
            const sprite = new THREE.Sprite(mat);
            sprite.position.copy(pos);
            sprite.scale.set(3, 3, 3);
            this.scene.add(sprite);
            setTimeout(() => this.scene.remove(sprite), 60);
        }

        setTimeout(() => this.scene.remove(light), 60);
    }

    createExplosion(pos) {
        // Smoke Particles using textures/smoke.png
        const count = 20;
        const geometry = new THREE.BufferGeometry();
        const positions = [];

        for (let i = 0; i < count; i++) {
            positions.push(
                pos.x + (Math.random() - 0.5) * 3,
                pos.y + Math.random() * 3,
                pos.z + (Math.random() - 0.5) * 3
            );
        }

        geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
        const material = new THREE.PointsMaterial({
            size: 1.5,
            map: this.smokeTexture,
            transparent: true,
            opacity: 0.8,
            depthWrite: false
        });

        const pSystem = new THREE.Points(geometry, material);
        this.scene.add(pSystem);
        setTimeout(() => this.scene.remove(pSystem), 500);
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
