class UIManager {
    constructor() {
        this.healthBar = document.getElementById('health-bar');
        this.ammoText = document.getElementById('ammo-text');
        this.crosshair = document.getElementById('crosshair');
    }

    updateHUD(health, ammo) {
        if (this.healthBar) this.healthBar.style.width = health + '%';
        if (this.ammoText) this.ammoText.innerText = `${ammo} / 30`;
    }

    toggleScope(isScoped) {
        if (isScoped) {
            this.crosshair.classList.remove('hidden');
        } else {
            this.crosshair.classList.add('hidden');
        }
    }
}
