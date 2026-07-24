class PhysicsWorld {
    constructor() {
        this.world = new CANNON.World();
        this.world.gravity.set(0, -9.82, 0);
        this.world.broadphase = new CANNON.NaiveBroadphase();
        this.world.solver.iterations = 10;

        // Friction and restitution setup
        this.groundMaterial = new CANNON.Material("ground");
        this.tankMaterial = new CANNON.Material("tank");

        const contact = new CANNON.ContactMaterial(this.groundMaterial, this.tankMaterial, {
            friction: 0.8,
            restitution: 0.1
        });
        this.world.addContactMaterial(contact);
    }

    update(dt) {
        this.world.step(1 / 60, dt, 3);
    }
}
