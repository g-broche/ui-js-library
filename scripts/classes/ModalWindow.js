"use strict"
/**
 * This class serves to add behavior for a modal component following the structure :
 * 
 * <div id="modal-window" class="display-none modal-window">
        <header>
            <span id="modal-window-title" class="modal-window__title">modal title</span>
        </header>
        <main>
            <span id="modal-window-message" class="modal-window__message">modal text</span>
        </main> 
        <footer>
            <button id="modal-window-close" class="modal-window__button-close" class="button button-confirm">Close</button>
        </footer>
    </div>
    <div id="modal-overlay" class="display-none modal-overlay"></div>
 * While the modalWindowId is variable, the elements inside the container must follow the format specification modalContainerId-elementRole.
 * Currently supported roles are title, message, close.
 */
export class ModalWindow {
    /**
     * handle the display of a modal window with customizable text, while the modalWindowId is variable, the elements inside the container
     * must follow the format specification modalContainerId-elementRole. Currently supported roles are title, message, close.
     * @param {string} modalWindowId id of the modal window container
     * @param {string} modalOverlayId id of the background div of the modal overlay
     * @param {bool} hideOnLoad define if the modal is hidden by default on page load
     */
    constructor(modalWindowId, modalOverlayId, hideOnLoad=true){
        this.mustDisplay = !hideOnLoad
        this.DOM_Elements = {
            window : document.getElementById(modalWindowId),
            title : document.getElementById(`${modalWindowId}-title`),
            message : document.getElementById(`${modalWindowId}-message`),
            buttonClose : document.getElementById(`${modalWindowId}-close`),
            overlay : document.getElementById(modalOverlayId),
        }
        this.DOM_Elements.overlay.addEventListener("click", ()=>{this.display(false)})
        this.DOM_Elements.buttonClose.addEventListener("click", ()=>{this.display(false)})
    }
    /**
     * set the title text of the modal window
     * @param {string} newTitle 
     */
    setTitle(newTitle){
        this.DOM_Elements.title.textContent = newTitle
    }
    /**
     * set the main text of the modal window
     * @param {string} newMessage 
     */
    setMessage(newMessage){
        this.DOM_Elements.message.textContent = newMessage
    }
    /**
     * remove the classes hiding the modal window
     */
    #showModal(){
        this.DOM_Elements.overlay.classList.remove("display-none")
        this.DOM_Elements.window.classList.remove("display-none")
    }
    /**
     * add the classes hiding the modal window
     */
    #hideModal(){
        this.DOM_Elements.overlay.classList.add("display-none")
        this.DOM_Elements.window.classList.add("display-none")
    }
    /**
     * set display value and apply it
     * @param {boolean} mustDisplay display if set to true or remove if set to false
     */
    display(mustDisplay){
        this.mustDisplay = mustDisplay
        this.#toggleDisplay()
    }
    /**
     * toggle display on and off depending on mustDisplay status
     * @returns 
     */
    #toggleDisplay(){
        if(this.mustDisplay){
            this.#showModal()
            return;
        }
        if(!this.mustDisplay){
            this.#hideModal()
            return;
        }
    }
}