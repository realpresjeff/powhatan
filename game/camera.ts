class Camera {
            // Camera settings
            let cameraAngle = 0; // Angle around the player
            let cameraDistance = 15; // Camera distance from player
            const cameraHeight = 10;
            let cameraVerticalOffset = 0; // Vertical offset for panning up and down
            const minCameraHeight = 1; // Minimum height of the camera (stop panning down below this level)
    
            // Update camera position to orbit around the player
            function updateCameraPosition() {
                const offsetX = Math.sin(cameraAngle) * cameraDistance;
                const offsetZ = Math.cos(cameraAngle) * cameraDistance;
    
                camera.position.set(
                    player.position.x + offsetX,
                    player.position.y + cameraHeight + cameraVerticalOffset,
                    player.position.z + offsetZ
                );
    
                // Prevent camera from going below the ground
                if (camera.position.y < minCameraHeight) {
                    camera.position.y = minCameraHeight; // Stop panning down
                    cameraVerticalOffset = 0; // Prevent further downward panning
                }
    
                camera.lookAt(player.position);
            }
            updateCameraPosition();
    
            // Handle keyboard input for camera rotation
            document.addEventListener("keydown", (event) => {
                const rotationSpeed = 0.1; // Increased rotation speed
                const verticalSpeed = 0.1; // Increased vertical speed to match horizontal speed
                if (event.key === "ArrowLeft") {
                    cameraAngle -= rotationSpeed; // Reverse the direction: Rotate right
                } else if (event.key === "ArrowRight") {
                    cameraAngle += rotationSpeed; // Reverse the direction: Rotate left
                } else if (event.key === "ArrowUp") {
                    cameraVerticalOffset += verticalSpeed; // Increased vertical panning speed
                } else if (event.key === "ArrowDown") {
                    if (camera.position.y > minCameraHeight) {
                        cameraVerticalOffset -= verticalSpeed; // Increased vertical panning speed
                    }
                }
                updateCameraPosition();
            });
    
            // Mouse input for zooming (scrolling to zoom)
            document.addEventListener('wheel', (event) => {
                cameraDistance += event.deltaY * 0.05; // Adjust zoom speed (now modifies distance from player)
                cameraDistance = Math.max(5, Math.min(cameraDistance, 30)); // Limiting zoom in and out range
                updateCameraPosition();
            });
    
            // Click-to-move setup (for player movement)
            const raycaster = new THREE.Raycaster();
    
            raycaster.far = 500;
            const mouse = new THREE.Vector2();
            let targetPosition = player.position.clone();
            let isMoving = false;
            const moveSpeed = 0.1;
    
            document.addEventListener('click', (event) => {
                if (event.button === 0) { // Left-click to move
                    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
                    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
                    raycaster.setFromCamera(mouse, camera);
                    const intersects = raycaster.intersectObjects([ground]);
                    // console.log(intersects);
    
                    if (intersects.length > 0) {
                        targetPosition = intersects[0].point;
                        targetPosition.y = player.position.y; // Keep player on ground level
                        isMoving = true;
    
                        socket.emit("message", { username: playerObj.username, position: targetPosition, isMoving, type: "player_moved" });
                    }
    
                    const itemintersections = raycaster.intersectObjects(scene.children);
    
                    if (itemintersections.length > 1) {
                        const object = itemintersections[0].object;
    
                        if (object.userData.pickupable === true) {
                            addToInventory(object.userData);
                            socket.emit("message", { item: object, type: "remove_item_mesh" });
                            console.log(object)
    
                            // scene.remove(object);
                        }
                    }
                }
            });
}