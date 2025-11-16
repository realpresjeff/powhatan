// Helper function to calculate mining speed
export function calculateMiningSpeed(agility, strength) {
    const baseSpeed = 1000; // Base speed of 1 second per mining action
    const agilityFactor = 0.05; // Agility impact on speed
    const strengthFactor = 0.03; // Strength impact on speed
    // Calculate mining speed where higher agility and strength reduce the time between actions
    let miningSpeed = baseSpeed - (agility * agilityFactor * baseSpeed) - (strength * strengthFactor * baseSpeed);
    // Ensure mining speed doesn't go below a minimum threshold (e.g., 200ms)
    miningSpeed = Math.max(miningSpeed, 200); // Minimum speed (200ms)
    return miningSpeed;
}
// Helper function to calculate cutting speed based on strength and agility
export function calculateCuttingSpeed(agility, strength) {
    const baseSpeed = 1000; // Base time in ms for one cut
    const agilityFactor = 10; // Agility decreases the speed (faster cutting)
    const strengthFactor = 20; // Strength decreases the speed (faster cutting)
    // Calculate cutting speed based on player's agility and strength
    const speed = baseSpeed - (agility * agilityFactor) - (strength * strengthFactor);
    // Ensure speed doesn't go below a certain threshold to avoid cutting too fast
    return Math.max(speed, 200); // Minimum speed of 200ms per cut
}
