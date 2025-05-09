export class PlayerStats {
    showStats() {
        document.getElementById("statsPopup").style.display = "block";
    }

    closeStats() {
        document.getElementById("statsPopup").style.display = "none";
    }
}