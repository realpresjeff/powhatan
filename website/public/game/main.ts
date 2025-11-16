import { Engine } from './engine.js';
import { Inventory } from './inventory.js';

const engine = new Engine();

// Pass shared objects to Inventory
const inventory = new Inventory({
    scene: engine.scene,
    player: engine.player,
    camera: engine.camera,
    mouse: engine.mouse,
    raycaster: engine.raycaster,
    showContextMenu: () => { }
});

// Now Inventory has access to necessary shared state
