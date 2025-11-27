export class ToolBarButton {
    buttonId;
    popupId;

    constructor(buttonId, popupId) {
        this.buttonId = buttonId;
        this.popupId = popupId;
    }

    attachListener = (document) => {
        document.getElementById(`${this.buttonId}`).addEventListener('click', () => {
            this.togglePopup(document);
        })
    }

    togglePopup = (document) => {
        const popup = document.getElementById(`${this.popupId}`);
        popup.style.display = popup.style.display === "block" ? "none" : "block";
    }
}
