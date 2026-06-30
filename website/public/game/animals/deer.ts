// Assumes THREE is available globally (via <script src="https://unpkg.com/three@0.165.0/build/three.min.js"></script>)
// If you're using modules: import * as THREE from "three";

function createDeer(options = {}) {
    const {
        bodyColor = 0x8b5a2b,    // main fur color
        legColor = 0x4b2e1a,
        antlerColor = 0xd2b48c,
        noseColor = 0x000000,
        scale = 1
    } = options;

    const deer = new THREE.Group();

    // ===== MATERIALS =====
    const bodyMat = new THREE.MeshStandardMaterial({ color: bodyColor });
    const legMat = new THREE.MeshStandardMaterial({ color: legColor });
    const antlerMat = new THREE.MeshStandardMaterial({ color: antlerColor });
    const noseMat = new THREE.MeshStandardMaterial({ color: noseColor });

    // ===== BODY =====
    const bodyGeom = new THREE.BoxGeometry(2, 0.7, 0.6);
    const body = new THREE.Mesh(bodyGeom, bodyMat);
    body.position.set(0, 1.2, 0);
    body.castShadow = true;
    body.receiveShadow = true;
    deer.add(body);

    // ===== LEGS =====
    const legGeom = new THREE.BoxGeometry(0.2, 1.0, 0.2);

    function makeLeg(x, z) {
        const leg = new THREE.Mesh(legGeom, legMat);
        leg.position.set(x, 0.5, z); // from ground (y=0) upward
        leg.castShadow = true;
        leg.receiveShadow = true;
        return leg;
    }

    const frontLeftLeg = makeLeg(0.6, 0.2);
    const frontRightLeg = makeLeg(0.6, -0.2);
    const backLeftLeg = makeLeg(-0.6, 0.2);
    const backRightLeg = makeLeg(-0.6, -0.2);

    deer.add(frontLeftLeg, frontRightLeg, backLeftLeg, backRightLeg);

    // ===== NECK =====
    const neckGeom = new THREE.BoxGeometry(0.3, 0.7, 0.3);
    const neck = new THREE.Mesh(neckGeom, bodyMat);
    neck.position.set(0.8, 1.7, 0);
    neck.rotation.z = -0.4; // tilt the neck forward
    neck.castShadow = true;
    neck.receiveShadow = true;
    deer.add(neck);

    // ===== HEAD =====
    const headGeom = new THREE.BoxGeometry(0.7, 0.4, 0.4);
    const head = new THREE.Mesh(headGeom, bodyMat);
    head.position.set(1.2, 2.0, 0);
    head.castShadow = true;
    head.receiveShadow = true;
    deer.add(head);

    // ===== NOSE / MUZZLE =====
    const noseGeom = new THREE.BoxGeometry(0.25, 0.25, 0.25);
    const nose = new THREE.Mesh(noseGeom, noseMat);
    nose.position.set(1.55, 1.95, 0);
    nose.castShadow = true;
    nose.receiveShadow = true;
    deer.add(nose);

    // ===== EARS =====
    const earGeom = new THREE.BoxGeometry(0.15, 0.3, 0.1);

    const leftEar = new THREE.Mesh(earGeom, bodyMat);
    leftEar.position.set(1.05, 2.2, 0.18);
    leftEar.rotation.z = -0.2;

    const rightEar = new THREE.Mesh(earGeom, bodyMat);
    rightEar.position.set(1.05, 2.2, -0.18);
    rightEar.rotation.z = -0.2;

    leftEar.castShadow = rightEar.castShadow = true;
    leftEar.receiveShadow = rightEar.receiveShadow = true;

    deer.add(leftEar, rightEar);

    // ===== ANTLERS =====
    const antlerMainGeom = new THREE.BoxGeometry(0.08, 0.6, 0.08);
    const antlerBranchGeom = new THREE.BoxGeometry(0.06, 0.3, 0.06);

    function makeAntler(sideSign) {
        const antler = new THREE.Group();

        // main vertical segment
        const main = new THREE.Mesh(antlerMainGeom, antlerMat);
        main.position.set(0, 0.3, 0);
        main.castShadow = true;
        main.receiveShadow = true;
        antler.add(main);

        // branch 1
        const branch1 = new THREE.Mesh(antlerBranchGeom, antlerMat);
        branch1.position.set(0.1 * sideSign, 0.45, 0);
        branch1.rotation.z = 0.7 * sideSign;
        branch1.castShadow = true;
        branch1.receiveShadow = true;
        antler.add(branch1);

        // branch 2
        const branch2 = new THREE.Mesh(antlerBranchGeom, antlerMat);
        branch2.position.set(0.1 * sideSign, 0.2, 0);
        branch2.rotation.z = 0.7 * sideSign;
        branch2.castShadow = true;
        branch2.receiveShadow = true;
        antler.add(branch2);

        return antler;
    }

    const leftAntler = makeAntler(1);
    leftAntler.position.set(1.1, 2.25, 0.15);

    const rightAntler = makeAntler(-1);
    rightAntler.position.set(1.1, 2.25, -0.15);

    deer.add(leftAntler, rightAntler);

    // ===== TAIL =====
    const tailGeom = new THREE.BoxGeometry(0.2, 0.3, 0.2);
    const tail = new THREE.Mesh(tailGeom, bodyMat);
    tail.position.set(-1.1, 1.4, 0);
    tail.rotation.z = 0.4;
    tail.castShadow = true;
    tail.receiveShadow = true;
    deer.add(tail);

    // Overall scale
    deer.scale.set(scale, scale, scale);

    return deer;
}

// usage
// After you’ve created scene, camera, renderer, lights, etc:
// const deer = createDeer({ scale: 1.2 }); // tweak scale as needed
// deer.position.set(0, 0, 0);             // stand on ground at origin
// scene.add(deer);
