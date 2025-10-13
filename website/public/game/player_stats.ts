export class PlayerStats {
    show_stats() {
        document.getElementById("statsPopup").style.display = "block";
    }

    close_stats() {
        document.getElementById("statsPopup").style.display = "none";
    }
}