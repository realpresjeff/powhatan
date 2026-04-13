export function createHealthBar3D(width = 3, height = 0.25) {
    const group = new THREE.Group();
    // Background (dark red)
    const bg = new THREE.Mesh(new THREE.PlaneGeometry(width, height), new THREE.MeshBasicMaterial({ color: 0x330000 }));
    // Fill (starts green)
    const fill = new THREE.Mesh(new THREE.PlaneGeometry(width, height), new THREE.MeshBasicMaterial({ color: 0x00ff00 }));
    fill.position.z = 0.001;
    group.add(bg);
    group.add(fill);
    // Animation properties
    group.fullWidth = width;
    group.currentPercent = 1;
    group.targetPercent = 1;
    group.animationSpeed = 0.1;
    group.fill = fill;
    // Color interpolation helper
    function lerpColor(color1, color2, t) {
        return color1.clone().lerp(color2, t);
    }
    // Update animation each frame
    group.update = function () {
        // Smooth shrink
        this.currentPercent += (this.targetPercent - this.currentPercent);
        // Update bar size
        this.fill.scale.x = this.currentPercent;
        this.fill.position.x = -(1 - this.currentPercent) * (this.fullWidth / 2);
        // Interpolated color: green → yellow → red
        const pct = this.currentPercent;
        let newColor;
        if (pct > 0.5) {
            // Green → Yellow
            newColor = lerpColor(new THREE.Color(0x00ff00), new THREE.Color(0xffff00), (1 - pct) * 2);
        }
        else {
            // Yellow → Red
            newColor = lerpColor(new THREE.Color(0xffff00), new THREE.Color(0xff0000), (0.5 - pct) * 2);
        }
        this.fill.material.color = newColor;
    };
    return group;
}
export function createDamageSplash(value, model, customHeight = 2.5) {
    // --- 1. Create text on a canvas ---
    const canvas = document.createElement("canvas");
    canvas.width = 256;
    canvas.height = 128;
    const ctx = canvas.getContext("2d");
    ctx.font = "bold 72px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    // red for damage, green for healing
    ctx.fillStyle = value > 0 ? "#ff4444" : "#44ff44";
    ctx.fillText(value.toString(), canvas.width / 2, canvas.height / 2);
    const texture = new THREE.CanvasTexture(canvas);
    // --- 2. Make a 3D model (plane) using that texture ---
    const geo = new THREE.PlaneGeometry(2.5, 1.2); // size in world units
    const mat = new THREE.MeshBasicMaterial({
        map: texture,
        transparent: true,
    });
    const mesh = new THREE.Mesh(geo, mat);
    // --- 3. Position above the model ---
    mesh.position.set(0, customHeight, 0);
    // --- 4. Make it face the camera (optional) ---
    mesh.userData.lookAtCamera = true;
    // Attach to model so it moves with it
    model.add(mesh);
    // --- 5. Remove after 1 second ---
    setTimeout(() => {
        model.remove(mesh);
        texture.dispose();
        geo.dispose();
        mat.dispose();
    }, 1000);
    return mesh;
}
