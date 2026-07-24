class InputHandler {
    constructor() {
        this.keys = { forward: false, backward: false, left: false, right: false, fire: false, scope: false };
        
        window.addEventListener('keydown', (e) => this.onKeyChange(e, true));
        window.addEventListener('keyup', (e) => this.onKeyChange(e, false));
        window.addEventListener('mousedown', (e) => { if (e.button === 0) this.keys.fire = true; });
        window.addEventListener('mouseup', (e) => { if (e.button === 0) this.keys.fire = false; });
        window.addEventListener('contextmenu', (e) => { e.preventDefault(); this.keys.scope = !this.keys.scope; });
    }

    onKeyChange(e, isPressed) {
        switch (e.code) {
            case 'KeyW': case 'ArrowUp': this.keys.forward = isPressed; break;
            case 'KeyS': case 'ArrowDown': this.keys.backward = isPressed; break;
            case 'KeyA': case 'ArrowLeft': this.keys.left = isPressed; break;
            case 'KeyD': case 'ArrowRight': this.keys.right = isPressed; break;
            case 'Space': this.keys.fire = isPressed; break;
        }
    }
}
