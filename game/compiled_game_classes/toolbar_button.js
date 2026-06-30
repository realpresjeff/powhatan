export class ToolBarButton {
    constructor(buttonId, popupId) {
        this.attachListener = (document) => {
            document.getElementById(`${this.buttonId}`).addEventListener('click', () => {
                this.togglePopup(document);
            });
        };
        this.togglePopup = (document) => {
            const popup = document.getElementById(`${this.popupId}`);
            popup.style.display = popup.style.display === "block" ? "none" : "block";
        };
        this.buttonId = buttonId;
        this.popupId = popupId;
    }
}
