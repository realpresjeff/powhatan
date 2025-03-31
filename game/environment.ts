class Environment {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // Lighting
    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(10, 20, 10);
    scene.add(light);

    // Ground (map)
    const groundGeometry = new THREE.PlaneGeometry(100, 100);
    const groundMaterial = new THREE.MeshStandardMaterial({ color: 0x228B22 });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    scene.add(ground);

    function generateEnvironment() {
        // 🌊 Generate Water & Fishing Spots
        // Create small water bodies (1x1 or 2x2)
        waters.push(createWater({ x: 25, y: 0, z: 10 }, { width: 50, height: 10 }));

        // Add a couple of fishing spots in the small water
        fishingSpots.push(createFishingSpot({ x: 10, y: 0, z: 14 }));

        // ⛏️ Generate Natural Coal Mine
        createCoalMine({ x: 42.5, y: 0, z: -10 });

        createOpenLogFire({ x: 20, y: 0, z: -10 });

        // create a longhouse
        const myLonghouse = createLonghouse({ x: -40, y: 0, z: 0 }, 20, 35, 10); // 30ft long, 15ft wide, 10ft tall
        // createBrickOven({ x: -35, y: 0, z: 0 });
        createBank({ x: -45, y: 0, z: -10 });

        // create a smith shop
        const smithshop = createLonghouse({ x: 20, y: 0, z: -40 }, 20, 15, 5); // 30ft long, 15ft wide, 10ft tall
        createAnvil({ x: 15, y: 0, z: -40 });
        createSmelt({ x: 25, y: 0, z: -43 })

        const teePee = createBuilding({ x: 0, y: 0, z: 40 }, 10, 8, 5, true, false);

        const europeanBuilding = createBuilding({ x: 40, y: 0, z: 40 }, 15, 20, 5, false, true);
    }

            // function createBrickOven(position, size = 4) {
        //     const oven = new THREE.Group();
        //     oven.userData = { isOven: true };

        //     // Brick Material
        //     const brickMaterial = new THREE.MeshStandardMaterial({ color: "#B22222" }); // Reddish-brown bricks

        //     // Base (Rectangular brick foundation)
        //     const baseGeometry = new THREE.BoxGeometry(size, size / 2, size);
        //     const base = new THREE.Mesh(baseGeometry, brickMaterial);
        //     base.position.set(position.x, position.y + size / 4, position.z);
        //     oven.add(base);

        //     // Dome (Clay oven top)
        //     const domeGeometry = new THREE.SphereGeometry(size / 2, 16, 16, 0, Math.PI);
        //     const dome = new THREE.Mesh(domeGeometry, brickMaterial);
        //     dome.position.set(position.x, position.y + size / 2 + size / 4, position.z);
        //     oven.add(dome);

        //     // Arch Entrance (Cutout for the opening)
        //     const entranceGeometry = new THREE.CylinderGeometry(size / 4, size / 4, size / 2, 16, 1, true, 0, Math.PI);
        //     const entrance = new THREE.Mesh(entranceGeometry, brickMaterial);
        //     entrance.rotation.x = Math.PI / 2;
        //     entrance.position.set(position.x, position.y + size / 2, position.z + size / 3);
        //     oven.add(entrance);

        //     // Chimney (Small cylinder for smoke exit)
        //     const chimneyGeometry = new THREE.CylinderGeometry(size / 8, size / 8, size / 2, 12);
        //     const chimney = new THREE.Mesh(chimneyGeometry, brickMaterial);
        //     chimney.position.set(position.x, position.y + size, position.z - size / 3);
        //     oven.add(chimney);

        //     const loader = new THREE.GLTFLoader();
        //     loader.load('assets/brick_ovenfurnace_triangulate_game_asset.glb', function (gltf) {
        //         oven.add(gltf.scene);
        //     }, undefined, function (error) {
        //         console.error("Error loading model:", error);
        //     });


        //     // Save references
        //     oven.userData = { isOven: true };

        //     scene.add(oven);
        //     return oven;
        // }

        function createLonghouse(position, length = 20, width = 10, height = 8) {
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

            scene.add(longhouse);
            return longhouse;
        }

        function createBuilding(position, length = 20, width = 10, height = 8, hasCircularWalls = false, hasTriangularRoof = false) {
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
            scene.add(longhouse);
            return longhouse;
        }

        const herbTypes = [
            { name: "Creasey Greens", color: "#4CAF50" }, // Traditional plant from Powhatan, VA
            { name: "Wild Mint", color: "#3B873E" },
            { name: "Chamomile", color: "#FFD700" },
            { name: "Lavender", color: "#8A2BE2" }
        ];

        // Generate a random herb
        function createHerb(position) {
            const herbType = herbTypes[Math.floor(Math.random() * herbTypes.length)];

            const herbGeometry = new THREE.SphereGeometry(0.3, 6, 6); // Small plant-like object
            const herbMaterial = new THREE.MeshStandardMaterial({ color: herbType.color });
            const herb = new THREE.Mesh(herbGeometry, herbMaterial);

            herb.position.set(position.x, position.y, position.z);
            herb.userData = { isHerb: true, name: herbType.name, pickupable: true };

            scene.add(herb);
            return herb;
        }

        // Function to remove herb & schedule respawn
        function forageHerb(herb) {
            console.log(`Picked up ${herb.userData.name}`);

            // Remove from scene
            scene.remove(herb);

            // Schedule respawn (random 1-2 min)
            const respawnTime = Math.random() * 60000 + 60000; // Between 60s - 120s
            setTimeout(() => {
                const newHerb = createHerb(herb.position);
                console.log(`${newHerb.userData.name} has respawned!`);
            }, respawnTime);
        }

                // Generate herbs (random locations)
                for (let i = 0; i < 5; i++) {
                    const position = {
                        x: Math.random() * worldSize.width - worldSize.width / 2,
                        y: 0,
                        z: Math.random() * worldSize.height - worldSize.height / 2
                    };
                    createHerb(position);
                }
        

}