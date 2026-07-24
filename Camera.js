class GameCamera {
    constructor(camera, target) {
        this.camera = camera;
        this.target = target;
        this.isScope = false;
        this.offset = new THREE.Vector3(0, 4, -10);
    }

    update() {
        if (!this.target) return;

        if (this.isScope) {
            // First Person Scope Mode
            const scopePos = this.target.position.clone().add(new THREE.Vector3(0, 1.8, 1));
            this.camera.position.copy(scopePos);
            const lookTarget = this.target.position.clone().add(
                new THREE.Vector3(0, 1.8, 50).applyQuaternion(this.target.quaternion)
            );
            this.camera.lookAt(lookTarget);
            this.camera.fov = 20;
        } else {
            // Third Person Orbit Follow Mode
            const relativeOffset = this.offset.clone().applyQuaternion(this.target.quaternion);
            const cameraPos = this.target.position.clone().add(relativeOffset);
            this.camera.position.lerp(cameraPos, 0.1);
            this.camera.lookAt(this.target.position.clone().add(new THREE.Vector3(0, 1.5, 0)));
            this.camera.fov = 60;
        }
        this.camera.updateProjectionMatrix();
    }
}
