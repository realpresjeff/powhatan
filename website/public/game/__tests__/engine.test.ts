// tests/engine.unit.test.ts
import { Engine } from '../engine';

describe('Engine class basic logic', () => {
    let engine: Engine;

    beforeEach(() => {
        // Create new instance before each test
        engine = new Engine();

        // Optionally stub out or spy on heavy methods like animate or renderer
        jest.spyOn(engine, 'animate').mockImplementation(() => { });
    });

    test('initial camera angle and distance', () => {
        expect(engine.cameraAngle).toBe(0);
        expect(engine.cameraDistance).toBe(15);
    });

    test('camera angle updates correctly on arrow keys', () => {
        // Manually call the keyboard event handler if needed (or extract it as a method)
        // Or simulate keydown event in the document
        const eventLeft = new KeyboardEvent('keydown', { key: 'ArrowLeft' });
        document.dispatchEvent(eventLeft);
        expect(engine.cameraAngle).toBeCloseTo(-0.1);

        const eventRight = new KeyboardEvent('keydown', { key: 'ArrowRight' });
        document.dispatchEvent(eventRight);
        expect(engine.cameraAngle).toBeCloseTo(0); // Because it was -0.1 then +0.1
    });

    test('player starts not moving', () => {
        expect(engine.isMoving).toBe(false);
    });

    test('move_player sets isMoving to false when close to target', () => {
        engine.isMoving = true;
        engine.targetPosition = engine.player.position.clone();
        engine.move_player();
        expect(engine.isMoving).toBe(false);
    });
});
