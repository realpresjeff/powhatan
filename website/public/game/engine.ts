import { Character } from './player_character.js';
import { Tree } from './tree.js';
import { Monster } from './monster.js';
import { Notifications } from './notifications.js';
import { CombatManager } from "./combat_manager.js";

export class Engine {
    // Camera settings
    cameraAngle = 0; // Angle around the player
    cameraDistance = 15; // Camera distance from player
    cameraHeight = 10;
    cameraVerticalOffset = 0; // Vertical offset for panning up and down
    minCameraHeight = 1; // Minimum height of the camera (stop panning down below this level)

    // scene setup
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

    // Player character (simple cube)
    character = new Character(this.scene);
    playerGeometry = new THREE.BoxGeometry(1, 2, 1);
    playerMaterial = new THREE.MeshStandardMaterial({ color: 0x0000ff });
    player = this.character.draw_character();

    // Ground (map)
    groundGeometry = new THREE.PlaneGeometry(100, 100);
    groundMaterial = new THREE.MeshStandardMaterial({ color: 0x228B22 });
    ground = new THREE.Mesh(this.groundGeometry, this.groundMaterial);

    isMoving = false;
    targetPosition = this.player.position.clone();
    moveSpeed = 0.5;

    renderer = new THREE.WebGLRenderer();

    // Click-to-move setup (for player movement)
    raycaster = new THREE.Raycaster();
    mouse = new THREE.Vector2();

    notification_bus = new Notifications();

    constructor() {
        this.setup_scene();
        this.setup_lighting();
        this.create_ground();
        this.create_player();
        this.update_camera_position();
        this.setup_keyboard_inputs();
        this.scroll_to_zoom();
        this.click_to_move();
        this.move_player();
        this.handle_window_resizing();
        this.handle_right_click();
        this.createWater({ x: 25, y: 0, z: 10 }, { width: 50, height: 10 });
        this.createFishingSpot({ x: 10, y: 0, z: 14 });
        this.animate();
        // const teePee = this.createBuilding({ x: 0, y: 0, z: 40 }, 10, 8, 5, true, false);
        // const europeanBuilding = this.createBuilding({ x: 40, y: 0, z: 40 }, 15, 20, 5, false, true);
        // create a longhouse
        const myLonghouse = this.createLonghouse({ x: -40, y: 0, z: 0 }, 20, 35, 10); // 30ft long, 15ft wide, 10ft tall
        // createBrickOven({ x: -35, y: 0, z: 0 });
        // createBank({ x: -45, y: 0, z: -10 });
        const smithshop = this.createLonghouse({ x: 20, y: 0, z: -40 }, 20, 15, 5); // 30ft long, 15ft wide, 10ft tall
        // this.createAnvil({ x: 15, y: 0, z: -40 });
        this.createSmelt({ x: 25, y: 0, z: -43 })
        this.createCoalMine({ x: 42.5, y: 0, z: -10 });
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
        new Tree('pine', { x: 30, y: 0, z: 0 }, true, this.scene);
        // Initialize a deer
        const deer = new Monster({ x: 5, y: 0, z: -5 }, this.scene, 'DEER');
    }

    create_player() {
        // Player character (simple cube)
        this.player.position.y = 5;
        this.scene.add(this.player);
    }

    // Update camera position to orbit around the player
    update_camera_position() {
        const offsetX = Math.sin(this.cameraAngle) * this.cameraDistance;
        const offsetZ = Math.cos(this.cameraAngle) * this.cameraDistance;

        this.camera.position.set(
            this.player.position.x + offsetX,
            this.player.position.y + this.cameraHeight + this.cameraVerticalOffset,
            this.player.position.z + offsetZ
        );

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
                this.animate();
            } else if (event.key === "ArrowRight") {
                this.cameraAngle += rotationSpeed; // Reverse the direction: Rotate left
                this.animate();
            } else if (event.key === "ArrowUp") {
                this.cameraVerticalOffset += verticalSpeed; // Increased vertical panning speed
                this.animate();
            } else if (event.key === "ArrowDown") {
                if (this.camera.position.y > this.minCameraHeight) {
                    this.cameraVerticalOffset -= verticalSpeed; // Increased vertical panning speed
                    this.animate();
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
            this.animate();
        });

    }

    click_to_move(onItemFound = (item: any) => { }) {
        document.addEventListener('click', (event) => {
            if (event.button === 0) { // Left-click to move
                this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
                this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
                this.raycaster.setFromCamera(this.mouse, this.camera);
                const intersects = this.raycaster.intersectObjects([this.ground]);

                if (intersects.length > 0) {
                    this.targetPosition = intersects[0].point;
                    this.targetPosition.y = this.player.position.y; // Keep player on ground level
                    this.character.targetPosition = this.targetPosition;
                    this.player.rotation.y = this.character.currentRotation;
                    this.character.positionX = this.player.position.x;
                    this.character.positionZ = this.player.position.z;
                    this.isMoving = true;
                    this.animate();
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
            this.character.walk();
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
            this.animate(); // *added 11/12/25
        });

    }

    handle_right_click() {
        document.addEventListener("contextmenu", (event) => {
            if (event.target.closest(".popup")) return; // Allow default context menu for popups

            event.preventDefault(); // Prevent browser context menu

            this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

            this.raycaster.setFromCamera(this.mouse, this.camera);
            const intersects = this.raycaster.intersectObjects(this.scene.children);

            if (intersects.length > 0) {
                const selectedObject = intersects[0].object;
                console.log(intersects)
                console.log("Right-clicked on:", selectedObject);

                const menuOptions = [{ label: 'Cancel', action: () => document.getElementById("contextMenu").style.display = "none" }];

                // If object has 'attackable' property
                if (selectedObject.userData.attackable) {
                    menuOptions.unshift({
                        label: `Attack ${selectedObject.userData.name || "Enemy"}`,
                        action: () => this.character.attack(selectedObject.userData.monster),
                    });
                }

                // If object has 'pickupable' property
                if (selectedObject.userData.pickupable === true && selectedObject.userData.name) {
                    menuOptions.unshift({
                        label: `Pick up ${selectedObject.userData.name || "Item"}`,
                        action: () => {
                            this.character.inventory.add_to_inventory(selectedObject.userData);
                            this.scene.remove(selectedObject);
                        }
                    });
                }

                // If object has 'pickupable' property
                if (selectedObject.userData.isOre) {
                    menuOptions.unshift({
                        label: `Mine ${selectedObject.userData.name || "Item"}`,
                        action: () => {
                            mineOre(selectedObject.userData);
                            scene.remove(selectedObject);
                        }
                    });
                }

                if (selectedObject.userData.bank) {
                    menuOptions.unshift({
                        label: "Bank",
                        action: () => {
                            openBank(selectedObject.userData);
                        }
                    });
                }

                // If object has 'isFire' property
                if (selectedObject.userData.isSmelt) {
                    menuOptions.unshift({
                        label: `Smelt ${selectedObject.userData.name || "Item"}`,
                        action: () => {
                            smelt(selectedObject.userData);
                        }
                    });
                }

                // If object has 'isFire' property
                if (selectedObject.userData.isFishingSpot) {
                    menuOptions.unshift({
                        label: `Fish the ${selectedObject.userData.name || "Item"}`,
                        action: () => {
                            this.character.fish(selectedObject.userData);
                        }
                    });
                }

                // If object has 'isFire' property
                if (selectedObject.userData.isFire || selectedObject.userData.isOven || selectedObject.userData.name === "Object_3") {
                    menuOptions.unshift({
                        label: `Cook`,
                        action: () => {
                            cook(selectedObject.userData);
                        }
                    });
                }

                // If object has 'isFire' property
                if (selectedObject.userData.isAnvil || selectedObject.userData.name === "Object_2") {
                    menuOptions.unshift({
                        label: `Smith`,
                        action: () => {
                            smith(selectedObject.userData);
                        }
                    });
                }

                // If object has 'fletch' property
                if (selectedObject.userData.fletch) {
                    menuOptions.unshift({
                        label: `Fletch ${selectedObject.userData.name}`,
                        action: () => {
                            fletch(selectedObject.userData);
                        }
                    });
                }

                // If object has a custom button label (dynamic)
                if (selectedObject.userData.customActionLabel && selectedObject.userData.customAction) {
                    menuOptions.unshift({
                        label: selectedObject.userData.customActionLabel,
                        action: selectedObject.userData.customAction,
                    });
                }

                // If object has a custom button label (dynamic)
                if (selectedObject.userData.isTree) {
                    menuOptions.unshift({
                        label: `Cut down ${selectedObject.userData.name}`,
                        action: () => {
                            selectedObject.userData.cut(this.character, this.notification_bus)
                        },
                    });
                }

                if (selectedObject.userData.smelt) {
                    menuOptions.push({
                        label: `Smelt`,
                        action: () => smelt(selectedObject.userData),
                    });
                }

                this.showContextMenu(event.clientX, event.clientY, menuOptions);
            }
        });
    }

    showContextMenu(x, y, options) {
        const menu = document.getElementById("contextMenu");
        menu.innerHTML = ""; // Clear previous menu items

        options.forEach(({ label, action }) => {
            const menuItem = document.createElement("div");
            menuItem.className = "context-menu-item";
            menuItem.textContent = label;
            menuItem.onclick = () => {
                action();
                menu.style.display = "none";
            };
            menu.appendChild(menuItem);
        });

        menu.style.top = `${y}px`;
        menu.style.left = `${x}px`;
        menu.style.display = "block";
    }

    createWater(position, size) {
        const waterGeometry = new THREE.PlaneGeometry(size.width, size.height, 32, 32);
        const waterMaterial = new THREE.MeshStandardMaterial({
            color: "#1E90FF", // Deep Blue
            transparent: true,  // Allow light to pass through
            opacity: 0.8,  // Slight transparency for a more natural look
            side: THREE.DoubleSide
        });

        const water = new THREE.Mesh(waterGeometry, waterMaterial);
        water.rotation.x = -Math.PI / 2; // Make it horizontal
        water.position.set(position.x, position.y + 0.01, position.z); // Lift slightly above ground

        water.receiveShadow = true; // Make it interact better with light
        water.userData = { isWater: true };

        this.scene.add(water);
        return water;
    }

    createFishingSpot(position) {
        const bubbles = new THREE.Mesh();
        const data = { isFishingSpot: true, fish: true, name: "Chesapeake Bay" };

        for (let i = 0; i < 5; i++) {
            const bubble = new THREE.Mesh(
                new THREE.SphereGeometry(0.2, 8, 8),
                new THREE.MeshStandardMaterial({ color: "white", transparent: true, opacity: 0.8 })
            );

            bubble.userData = { isFishingSpot: true, fish: true, name: "Chesapeake Bay" };

            bubble.position.set(
                position.x + (Math.random() - 0.5) * 0.5,
                position.y + Math.random() * 0.5,
                position.z + (Math.random() - 0.5) * 0.5
            );

            bubbles.add(bubble);
        }

        bubbles.userData = data;
        this.scene.add(bubbles);

        // Animate bubbles
        function animateBubbles() {
            bubbles.children.forEach((bubble, index) => {
                bubble.position.y += Math.sin(performance.now() / 1000 + index) * 0.005;
            });
            requestAnimationFrame(animateBubbles);
        }

        animateBubbles();

        return bubbles;
    }


    createBuilding(position, length = 20, width = 10, height = 8, hasCircularWalls = false, hasTriangularRoof = false) {
        const longhouse = new THREE.Group();

        // Wall Material
        const wallMaterial = new THREE.MeshStandardMaterial({ color: "#8B5A2B" }); // Wooden brown

        // Side Walls
        const sideWallGeometry = new THREE.BoxGeometry(1, height, width);
        const leftWall = new THREE.Mesh(sideWallGeometry, wallMaterial);
        leftWall.position.set(position.x - length / 2, position.y + height / 2, position.z);
        longhouse.add(leftWall);

        const rightWall = leftWall.clone();
        rightWall.position.set(position.x + length / 2, position.y + height / 2, position.z);
        longhouse.add(rightWall);

        // Front & Back Walls (without door using separate parts)
        const wallWidth = length / 2 - 2; // Leave space for a 4ft door
        const frontLeftWall = new THREE.Mesh(new THREE.BoxGeometry(wallWidth, height, 1), wallMaterial);
        frontLeftWall.position.set(position.x - wallWidth / 2 - 2, position.y + height / 2, position.z + width / 2);
        longhouse.add(frontLeftWall);

        const frontRightWall = frontLeftWall.clone();
        frontRightWall.position.set(position.x + wallWidth / 2 + 2, position.y + height / 2, position.z + width / 2);
        longhouse.add(frontRightWall);

        const backWall = new THREE.Mesh(new THREE.BoxGeometry(length, height, 1), wallMaterial);
        backWall.position.set(position.x, position.y + height / 2, position.z - width / 2);
        longhouse.add(backWall);

        // Floor (Dirt)
        const floorMaterial = new THREE.MeshStandardMaterial({ color: "#8B4513" }); // Dirt brown
        const floorGeometry = new THREE.PlaneGeometry(length, width);
        const floor = new THREE.Mesh(floorGeometry, floorMaterial);
        floor.rotation.x = -Math.PI / 2;
        floor.position.set(position.x, position.y, position.z);
        longhouse.add(floor);

        const roofMaterial = new THREE.MeshStandardMaterial({ color: "#D2B48C", side: THREE.DoubleSide });

        // Choose Roof Geometry Based on hasTriangularRoof
        if (hasTriangularRoof) {
            // Triangular Roof
            const roofGeometry = new THREE.ConeGeometry(width / 2, height, 3); // Triangular roof (cone)
            const roof = new THREE.Mesh(roofGeometry, roofMaterial);
            roof.position.set(position.x, position.y + height * 0.8, position.z);
            roof.userData = { isRoof: true };
            longhouse.add(roof);
            longhouse.userData = { isLonghouse: true, roof: roof };
        } else {
            // Regular Roof (Thatch, fully covers structure)
            const roofGeometry = new THREE.CylinderGeometry(width / 2 + 1, width / 2 + 1, length + 2, 8, 1, true, 0, Math.PI);
            const roof = new THREE.Mesh(roofGeometry, roofMaterial);
            roof.rotation.z = Math.PI / 2;
            roof.position.set(position.x, position.y + height * 0.8, position.z);
            roof.userData = { isRoof: true };
            longhouse.add(roof);
            longhouse.userData = { isLonghouse: true, roof: roof };
        }

        // Save references
        this.scene.add(longhouse);
        return longhouse;
    }

    createLonghouse(position, length = 20, width = 10, height = 8) {
        const longhouse = new THREE.Group();

        // Wall Material
        const wallMaterial = new THREE.MeshStandardMaterial({ color: "#8B5A2B" }); // Wooden brown

        // Side Walls
        const sideWallGeometry = new THREE.BoxGeometry(1, height, width);
        const leftWall = new THREE.Mesh(sideWallGeometry, wallMaterial);
        leftWall.position.set(position.x - length / 2, position.y + height / 2, position.z);
        longhouse.add(leftWall);

        const rightWall = leftWall.clone();
        rightWall.position.set(position.x + length / 2, position.y + height / 2, position.z);
        longhouse.add(rightWall);

        // Front & Back Walls (without door using separate parts)
        const wallWidth = length / 2 - 2; // Leave space for a 4ft door
        const frontLeftWall = new THREE.Mesh(new THREE.BoxGeometry(wallWidth, height, 1), wallMaterial);
        frontLeftWall.position.set(position.x - wallWidth / 2 - 2, position.y + height / 2, position.z + width / 2);
        longhouse.add(frontLeftWall);

        const frontRightWall = frontLeftWall.clone();
        frontRightWall.position.set(position.x + wallWidth / 2 + 2, position.y + height / 2, position.z + width / 2);
        longhouse.add(frontRightWall);

        const backWall = new THREE.Mesh(new THREE.BoxGeometry(length, height, 1), wallMaterial);
        backWall.position.set(position.x, position.y + height / 2, position.z - width / 2);
        longhouse.add(backWall);

        // Floor (Dirt)
        const floorMaterial = new THREE.MeshStandardMaterial({ color: "#8B4513" }); // Dirt brown
        const floorGeometry = new THREE.PlaneGeometry(length, width);
        const floor = new THREE.Mesh(floorGeometry, floorMaterial);
        floor.rotation.x = -Math.PI / 2;
        floor.position.set(position.x, position.y, position.z);
        longhouse.add(floor);

        // Roof (Thatch, fully covers structure)
        const roofMaterial = new THREE.MeshStandardMaterial({ color: "#D2B48C", side: THREE.DoubleSide });
        const roofGeometry = new THREE.CylinderGeometry(length / 2 + 1, length / 2 + 1, width + 2, 8, 1, true, 0, Math.PI);
        const roof = new THREE.Mesh(roofGeometry, roofMaterial);
        roof.rotation.z = Math.PI / 2;
        roof.position.set(position.x, position.y + height * .80, position.z); // Positioned to fully cover

        roofGeometry.rotateX(THREE.MathUtils.degToRad(90));  // Rotate geometry, not the object

        roof.userData = { isRoof: true };
        longhouse.add(roof);

        // Save references
        longhouse.userData = { isLonghouse: true, roof: roof };

        this.scene.add(longhouse);
        return longhouse;
    }

    createSmelt(position) {
        const smelt = new THREE.Mesh();
        smelt.userData = { isSmelt: true }

        // Furnace body (a tapered cylinder to resemble a clay/stone bloomery)
        const furnaceGeometry = new THREE.CylinderGeometry(3, 4, 6, 16, 1);
        furnaceGeometry.userData = { isSmelt: true }
        const furnaceMaterial = new THREE.MeshStandardMaterial({ color: "#8B5A2B", roughness: 0.8 }); // Clay/stone look
        furnaceMaterial.userData = { isSmelt: true }
        const furnace = new THREE.Mesh(furnaceGeometry, furnaceMaterial);
        furnace.userData = { isSmelt: true }
        furnace.position.set(0, 3, 0);
        smelt.add(furnace);

        // Furnace opening (arched door where iron/slag is extracted)
        const openingGeometry = new THREE.BoxGeometry(1.5, 2, 0.5);
        const openingMaterial = new THREE.MeshStandardMaterial({ color: "black", transparent: true, opacity: 0.5 });
        const opening = new THREE.Mesh(openingGeometry, openingMaterial);
        opening.position.set(0, 1.5, 2.01);
        smelt.add(opening);

        // Chimney hole at the top
        const chimneyGeometry = new THREE.CylinderGeometry(1, 1, 1, 8);
        const chimneyMaterial = new THREE.MeshStandardMaterial({ color: "black", roughness: 0.7 });
        const chimney = new THREE.Mesh(chimneyGeometry, chimneyMaterial);
        chimney.position.set(0, 6.5, 0);
        smelt.add(chimney);

        // Charcoal/ore pile near furnace
        const oreGeometry = new THREE.SphereGeometry(1, 8, 8);
        const oreMaterial = new THREE.MeshStandardMaterial({ color: "#3B3B3B" });
        const orePile = new THREE.Mesh(oreGeometry, oreMaterial);
        orePile.position.set(2, 0.5, 2);
        smelt.add(orePile);

        smelt.position.set(position.x, position.y, position.z);
        this.scene.add(smelt);
        console.log(smelt);
        return smelt;
    }

    createAnvil(position) {
        const anvil = new THREE.Group();
        anvil.userData = { isAnvil: true }

        anvil.position.set(position.x, position.y, position.z);

        const loader = new THREE.GLTFLoader();
        loader.load('assets/anvil_three.glb', function (gltf) {
            anvil.add(gltf.scene);
        }, undefined, function (error) {
            console.error("Error loading model:", error);
        });

        this.scene.add(anvil);
        return anvil;
    }

    createCoalMine(position) {
        const mine = new THREE.Mesh();
        mine.userData = { isOre: true, type: "coal", name: "Coal" };

        // 🪨 Base Rock Formation (Cave Walls)
        for (let i = 0; i < 6; i++) {
            const rock = new THREE.Mesh(
                new THREE.SphereGeometry(Math.random() * 2 + 1.5, 8, 8),
                new THREE.MeshStandardMaterial({ color: "#3A3A3A" }) // Dark gray coal rocks
            );

            const offsetX = (Math.random() - 0.5) * 6;
            const offsetZ = (Math.random() - 0.5) * 6;
            const offsetY = Math.random() * 3;

            rock.position.set(position.x + offsetX, position.y + offsetY, position.z + offsetZ);
            rock.rotation.y = Math.random() * Math.PI;

            rock.userData = { isOre: true, name: "Coal", type: "coal" };
            mine.add(rock);
        }

        // 🔽 Mine Entrance (A darker cave opening)
        const entrance = new THREE.Mesh(
            new THREE.CylinderGeometry(2.5, 3.5, 4, 8),
            new THREE.MeshStandardMaterial({ color: "#2C2C2C", side: THREE.DoubleSide }) // Even darker rock
        );
        entrance.position.set(position.x, position.y + 1, position.z);
        entrance.rotation.x = Math.PI / 2;
        entrance.userData = { isEntrance: true, type: "coal", name: "Coal Mine Entrance" };
        mine.add(entrance);

        this.createMineGround(position, { height: 15, width: 15 })

        // ⛏️ Coal Deposits inside the mine
        function spawnCoal() {
            const coal = new THREE.Mesh(
                new THREE.SphereGeometry(0.5, 8, 8),
                new THREE.MeshStandardMaterial({ color: "#222222" }) // Pure black for coal
            );

            const offsetX = (Math.random() - 0.5) * 3;
            const offsetZ = (Math.random() - 0.5) * 3;
            coal.position.set(position.x + offsetX, position.y + 1, position.z + offsetZ);

            coal.userData = { isOre: true, type: "coal", name: "Coal Deposit" };
            this.scene.add(coal);

            return coal;
        }

        let coalDeposits = [];
        for (let i = 0; i < 4; i++) {
            coalDeposits.push(spawnCoal());
        }

        // 🌱 Coal Respawn Mechanic
        function respawnCoal(coal) {
            setTimeout(() => {
                if (!scene.children.includes(coal)) {
                    const newCoal = spawnCoal();
                    coalDeposits.push(newCoal);
                }
            }, Math.random() * 120000 + 60000); // Respawn between 1-3 minutes
        }

        // 🏗️ Add to scene
        this.scene.add(mine);
        return mine;
    }

    createMineGround(position, size) {
        const mineGroundGeometry = new THREE.PlaneGeometry(size.width, size.height, 8, 8);
        const mineGroundMaterial = new THREE.MeshStandardMaterial({
            color: "#4F4F4F", // Dark gray for a rocky ground
            side: THREE.DoubleSide
        });

        const mineGround = new THREE.Mesh(mineGroundGeometry, mineGroundMaterial);
        mineGround.rotation.x = -Math.PI / 2;
        mineGround.position.set(position.x, position.y + 0.01, position.z); // Slightly below the mine

        this.scene.add(mineGround);
        return mineGround;
    }
}
