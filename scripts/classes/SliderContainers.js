"use strict"

/**
 * Gives a vertical sliding behavior to a block having a trigger deploying and retracting some content
 */
export class SliderContainerVertical{
    /**
     * Gives a vertical sliding behavior to a block having a trigger deploying and retracting some content. The trigger acting as a button and the sliding
     * content must respect the format sliderContainerId-toggle and sliderContainerId-content respectively. Uses maxHeight property to create the effect as it is intended
     * as a way to reveal the content from top to bottom.
     * The overflow being allowed once deployed can be necessary for cases like dropdowns that would exceed the set maxHeight. 
     * Ideally the set maxHeight should be close to the real expected height so the transition immediately has a visible effect on the UI.
     * @param {HTMLElement} sliderContainerId block element containing the trigger and the deployable content
     * @param {string} containerMaxHeight value to attribute to the content's maxHeight property for the sliding transition to work
     * @param {bool} isHiddenOnLoad define if the content is hidden on initial load
     * @param {object} options define if the Yaxis overflow must be visible after content deployment and the deployment transition timer.
     */
    constructor(sliderContainerId, containerMaxHeight, isHiddenOnLoad, {allowDeployedOverflow = false, transitionTimeoutS =.5}){
        this.DOM_Elements = {
            container : document.getElementById(sliderContainerId),
            trigger : document.getElementById(`${sliderContainerId}-toggle`),
            content : document.getElementById(`${sliderContainerId}-content`),
        }
        this.rules = {
            isDeployed : !isHiddenOnLoad,
            containerMaxHeight : containerMaxHeight,
            allowDeployedOverflow : allowDeployedOverflow,
            transitionTimeout : transitionTimeoutS * 1000,
        }
        this.DOM_Elements.trigger.addEventListener("click", () => {this.toggleDeployment()})
    }
    /**
     * deploy the content and if overflow is allowed, will add overflow at the end of the specified transition timer
     */
    deployContent(){
        this.DOM_Elements.content.style.maxHeight = this.rules.containerMaxHeight
        if(this.rules.allowDeployedOverflow){
            setTimeout(()=>{this.DOM_Elements.content.style.overflowY = "visible"}, this.rules.transitionTimeout)
        }
        
    }
    /**
     * retract the content. If overflow is allowed, will set overflow to hidden at regular interval to prevent display issue in case of 
     */
    retractContent(){
        this.DOM_Elements.content.style.maxHeight = 0
        if(this.rules.allowDeployedOverflow){
            this.DOM_Elements.content.style.overflowY = "hidden"
        }    
    }
    /**
     * deploy or retract the content depending on previous state and invert the boolean value of isDeployed to reflect the current state.
     * implements a timeout acting as a debounce mechanic to serve as an anti spam and avoid erratic behavior with repeated triggering.
     */
    toggleDeployment() {
        if (this.timeout) {
            clearTimeout(this.timeout);
        }                               
        this.timeout = setTimeout(() => {
            
            if (this.rules.isDeployed) {
                this.retractContent()
            } else {
                this.deployContent()
            }
            this.rules.isDeployed = !this.rules.isDeployed
        }, this.rules.transitionTimeout);
    }
}