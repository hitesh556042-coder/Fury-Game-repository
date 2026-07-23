import * as THREE from 'three';
import * as CANNON from 'cannon-es';

export function createEnvironment(scene, world) {
    const size = 300;
    const segments = 100;

    // 1. Terrain Mesh
    const geometry = new THREE.PlaneGeometry(size, size, segments, segments);
    geometry.rotateX(-Math.PI / 2);
    const pos = geometry.attributes.position;
    const matrix = [];

    for (let i = 0; i <= segments; i++) {
        matrix.push([]);
        for (let j = 0; j <= segments; j++) {
            const index = i * (segments + 1) + j;
            const x = pos.getX(index);
            const z = pos.getZ(index);
            
            // Perlin/Sine Waves for Hills
            const h = Math.sin(x * 0.03) * Math.cos(z * 0.03) * 5 + Math.sin(x * 0.08) * 2;
            pos.setY(index, h);
            matrix[i].push(h);
        }
    }
    geometry.computeVertexNormals();

    const material = new THREE.MeshStandardMaterial({ color: 0x3b5323, roughness: 0.8 });
    const terrainMesh = new THREE.Mesh(geometry, material);
    terrainMesh.receiveShadow = true;
    scene.add(terrainMesh);

    // Physics Heightfield Ground
    const shape = new CANNON.Heightfield(matrix, { elementSize: size / segments });
    const body = new CANNON.Body({ mass: 0 });
    body.addShape(shape);
    body.position.set(-size / 2, 0, size / 2);
    body.quaternion.setFromEuler(-Math.PI / 2, 0, 0);
    world.addBody(body);

    // 2. Add Trees & Rocks
    spawnEnvironmentObjects(scene, world);

    return { terrainMesh, body };
}

function spawnEnvironmentObjects(scene, world) {
    const treeGeo = new THREE.ConeGeometry(1, 4, 8);
    const treeMat = new THREE.MeshStandardMaterial({ color: 0x1b4d3e });
    const trunkGeo = new THREE.CylinderGeometry(0.2, 0.2, 1);
    const trunkMat = new THREE.MeshStandardMaterial({ color: 0x4a2e00 });

    for (let i = 0; i < 40; i++) {
        const x = (Math.random() - 0.5) * 200;
        const z = (Math.random() - 0.5) * 200;

        const treeGroup = new THREE.Group();
        const trunk = new THREE.Mesh(trunkGeo, trunkMat);
        const foliage = new THREE.Mesh(treeGeo, treeMat);
        foliage.position.y = 2.5;

        treeGroup.add(trunk, foliage);
        treeGroup.position.set(x, 1, z);
        scene.add(treeGroup);
    }
}
