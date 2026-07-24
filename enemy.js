import * as THREE from 'three';
import * as CANNON from 'cannon-es';

export class EnemyTank {
    constructor(scene, world, position) {
        this.scene = scene;
        this.world = world;
        this.health = 80;

        const geo = new THREE.BoxGeometry(3, 1.2, 5);
        const mat = new THREE.MeshStandardMaterial({ color: 0x7a2323 }); // Red Enemy Tank
        this.mesh = new THREE.Mesh(geo, mat);
        scene.add(this.mesh);

        const shape = new CANNON.Box(new CANNON.Vec3(1.5, 0.6, 2.5));
        this.body = new CANNON.Body({ mass: 1500 });
        this.body.addShape(shape);
        this.body.position.copy(position);
        world.addBody(this.body);
    }

    update(playerTankPosition) {
        if (this.health <= 0) return;

        // Move towards Player
        const dir = new THREE.Vector3().subVectors(playerTankPosition, this.mesh.position).normalize();
        this.body.velocity.x = dir.x * 4;
        this.body.velocity.z = dir.z * 4;

        this.mesh.position.copy(this.body.position);
        this.mesh.quaternion.copy(this.body.quaternion);
    }

    takeDamage(amount) {
        this.health -= amount;
        if (this.health <= 0) {
            this.destroy();
        }
    }

    destroy() {
        this.scene.remove(this.mesh);
        this.world.removeBody(this.body);
    }
}
