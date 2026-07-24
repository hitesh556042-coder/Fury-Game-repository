export class InputManager {
    constructor() {
        this.keys = {};
        this.touch = { moveX: 0, moveY: 0, isFiring: false };

        window.addEventListener('keydown', (e) => this.keys[e.key] = true);
        window.addEventListener('keyup', (e) => this.keys[e.key] = false);

        this.setupMobileControls();
    }

    setupMobileControls() {
        const fireBtn = document.getElementById('mobile-fire');
        if (fireBtn) {
            fireBtn.addEventListener('touchstart', () => this.touch.isFiring = true);
            fireBtn.addEventListener('touchend', () => this.touch.isFiring = false);
        }
    }
}
