class EnemyAI {
    constructor(scene, physicsWorld, playerTank) {
        this.scene = scene;
        this.physicsWorld = physicsWorld;
        this.player = playerTank;

        this.tank = new Tank(scene, physicsWorld);
        this.tank.body.position.set(30, 1.5, 40); // Initial enemy spawn
    }

    update() {
        if (!this.player) return;

        // Basic AI tracking logic
        const dir = new THREE.Vector3().subVectors(this.player.mesh.position, this.tank.mesh.position);
        dir.y = 0;
        dir.normalize();

        // Rotate AI Tank towards player
        const targetAngle = Math.atan2(dir.x, dir.z);
        this.tank.body.quaternion.setFromAxisAngle(new CANNON.Vec3(0, 1, 0), targetAngle);
        
        this.tank.update();
    }
}
