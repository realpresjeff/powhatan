import { Engine } from './engine';
import { Inventory } from './inventory';

const engine = new Engine();

// Pass shared objects to Inventory
const inventory = new Inventory({ scene: engine.scene, player: engine.player, camera: engine.camera });

// Now Inventory has access to necessary shared state
