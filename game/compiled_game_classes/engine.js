import * as THREE from 'three';
export class Engine {
    constructor() {
        // Camera settings
        this.cameraAngle = 0; // Angle around the player
        this.cameraDistance = 15; // Camera distance from player
        this.cameraHeight = 10;
        this.cameraVerticalOffset = 0; // Vertical offset for panning up and down
        this.minCameraHeight = 1; // Minimum height of the camera (stop panning down below this level)
        // scene setup
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        // Player character (simple cube)
        this.playerGeometry = new THREE.BoxGeometry(1, 2, 1);
        this.playerMaterial = new THREE.MeshStandardMaterial({ color: 0x0000ff });
        this.player = new THREE.Mesh(this.playerGeometry, this.playerMaterial);
        // Ground (map)
        this.groundGeometry = new THREE.PlaneGeometry(100, 100);
        this.groundMaterial = new THREE.MeshStandardMaterial({ color: 0x228B22 });
        this.ground = new THREE.Mesh(this.groundGeometry, this.groundMaterial);
        this.isMoving = false;
        this.targetPosition = this.player.position.clone();
        this.moveSpeed = 0.1;
        this.renderer = new THREE.WebGLRenderer();
        // Click-to-move setup (for player movement)
        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();
        this.setup_scene();
        this.setup_lighting();
        this.create_ground();
        this.create_player();
        this.update_camera_position();
        this.setup_keyboard_inputs();
        this.scroll_to_zoom();
        this.click_to_move();
        this.move_player();
        this.animate();
        this.handle_window_resizing();
    }
    setup_scene() {
        // Scene setup
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(this.renderer.domElement);
    }
    setup_lighting() {
        // Lighting
        const light = new THREE.DirectionalLight(0xffffff, 1);
        light.position.set(10, 20, 10);
        this.scene.add(light);
    }
    create_ground() {
        // Create Ground
        this.ground.rotation.x = -Math.PI / 2;
        this.scene.add(this.ground);
    }
    create_player() {
        // Player character (simple cube)
        this.player.position.y = 1;
        this.scene.add(this.player);
    }
    // Update camera position to orbit around the player
    update_camera_position() {
        const offsetX = Math.sin(this.cameraAngle) * this.cameraDistance;
        const offsetZ = Math.cos(this.cameraAngle) * this.cameraDistance;
        this.camera.position.set(this.player.position.x + offsetX, this.player.position.y + this.cameraHeight + this.cameraVerticalOffset, this.player.position.z + offsetZ);
        // Prevent camera from going below the ground
        if (this.camera.position.y < this.minCameraHeight) {
            this.camera.position.y = this.minCameraHeight; // Stop panning down
            this.cameraVerticalOffset = 0; // Prevent further downward panning
        }
        this.camera.lookAt(this.player.position);
    }
    setup_keyboard_inputs() {
        // Handle keyboard input for camera rotation
        document.addEventListener("keydown", (event) => {
            const rotationSpeed = 0.1; // Increased rotation speed
            const verticalSpeed = 0.1; // Increased vertical speed to match horizontal speed
            if (event.key === "ArrowLeft") {
                this.cameraAngle -= rotationSpeed; // Reverse the direction: Rotate right
            }
            else if (event.key === "ArrowRight") {
                this.cameraAngle += rotationSpeed; // Reverse the direction: Rotate left
            }
            else if (event.key === "ArrowUp") {
                this.cameraVerticalOffset += verticalSpeed; // Increased vertical panning speed
            }
            else if (event.key === "ArrowDown") {
                if (this.camera.position.y > this.minCameraHeight) {
                    this.cameraVerticalOffset -= verticalSpeed; // Increased vertical panning speed
                }
            }
            this.update_camera_position();
        });
    }
    scroll_to_zoom() {
        // Mouse input for zooming (scrolling to zoom)
        document.addEventListener('wheel', (event) => {
            // this.cameraDistance += even             // addToInventory(object);t.deltaY * 0.05; // Adjust zoom speed (now modifies distance from player)
            this.cameraDistance += event.deltaY * 0.05; // Adjust zoom speed (now modifies distance from player)
            this.cameraDistance = Math.max(5, Math.min(this.cameraDistance, 30)); // Limiting zoom in and out range
            this.update_camera_position();
        });
    }
    click_to_move(onItemFound = (item) => { }) {
        document.addEventListener('click', (event) => {
            if (event.button === 0) { // Left-click to move
                this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
                this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
                this.raycaster.setFromCamera(this.mouse, this.camera);
                const intersects = this.raycaster.intersectObjects([this.ground]);
                if (intersects.length > 0) {
                    this.targetPosition = intersects[0].point;
                    this.targetPosition.y = this.player.position.y; // Keep player on ground level
                    this.isMoving = true;
                }
                const itemintersections = this.raycaster.intersectObjects(this.scene.children);
                if (itemintersections.length > 1) {
                    const object = itemintersections[0].object;
                    if (object.userData.isRemovable) {
                        onItemFound(object.userData);
                        // addToInventory(object.userData);
                        this.scene.remove(object);
                    }
                }
            }
        });
    }
    // Smooth movement function (player movement)
    move_player() {
        if (this.isMoving) {
            this.player.position.lerp(this.targetPosition, this.moveSpeed);
            if (this.player.position.distanceTo(this.targetPosition) < 0.1) {
                this.isMoving = false;
            }
        }
    }
    // Animation loop
    animate() {
        // requestAnimationFrame(this.animate);
        this.move_player();
        this.update_camera_position();
        this.renderer.render(this.scene, this.camera);
    }
    handle_window_resizing() {
        // Handle window resizing
        window.addEventListener('resize', () => {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        });
    }
}
