class Terrain {
    constructor(scene, physicsWorld) {
        this.scene = scene;
        this.physicsWorld = physicsWorld;

        this.createGround();
        this.createScenery();
    }

    createGround() {
        const size = 300;
        const geometry = new THREE.PlaneGeometry(size, size, 32, 32);
        geometry.rotateX(-Math.PI / 2);

        // Ground Texture Setup
        const textureLoader = new THREE.TextureLoader();
        const groundTexture = textureLoader.load('textures/ground.jpg');
        groundTexture.wrapS = THREE.RepeatWrapping;
        groundTexture.wrapT = THREE.RepeatWrapping;
        groundTexture.repeat.set(20, 20); // Repeat texture for detailed ground

        const material = new THREE.MeshStandardMaterial({ 
            map: groundTexture, 
            roughness: 0.8 
        });

        const groundMesh = new THREE.Mesh(geometry, material);
        groundMesh.receiveShadow = true;
        this.scene.add(groundMesh);

        // Ground Physics Body
        const groundShape = new CANNON.Plane();
        const groundBody = new CANNON.Body({ mass: 0, material: this.physicsWorld.groundMaterial });
        groundBody.addShape(groundShape);
        groundBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2);
        this.physicsWorld.world.addBody(groundBody);
    }

    createScenery() {
        const rockGeo = new THREE.DodecahedronGeometry(1.5, 1);
        const rockMat = new THREE.MeshStandardMaterial({ color: 0x666666, roughness: 0.9 });

        for (let i = 0; i < 25; i++) {
            const rock = new THREE.Mesh(rockGeo, rockMat);
            const x = (Math.random() - 0.5) * 200;
            const z = (Math.random() - 0.5) * 200;
            rock.position.set(x, 0.75, z);
            rock.castShadow = true;
            this.scene.add(rock);
        }
    }
}
