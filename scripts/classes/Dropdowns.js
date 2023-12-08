"use strict"

/*
    These classes intends to replicate the behavior of select elements by associating JS classes to html elements having a structure
    consisting of :

    <div id="idOfDropdownContainer">
        <button> buttonText </button>
        <ul>
            <li data-value=uniqueValue>Text</li>
            ...
            <li data-value=uniqueValue>Text</li>
        </ul>
    </div>
*/

/**
 * parent class of all dropdown classes
 */
class DropdownBase {
    /**
     * instantiate a drowpdown object to add the dropdown logic to the html elements
     * @param {string} dropdownContainer id of the parent element containing the dropdown elements
     */
    constructor(dropdownContainer) {
        this.isOpen = false
        this.DOM_Elements = {
            wrapper: document.getElementById(dropdownContainer),
            trigger: document.getElementById(dropdownContainer).querySelector('button'),
            list: document.getElementById(dropdownContainer).querySelector('ul'),
            listItems: document.getElementById(dropdownContainer).querySelectorAll('li')
        }
        this.onOpen = {         //property defining classes enabled when list is opened
            triggerClasses: [],
            listClasses: []
        }
        this.onClose = {        //property defining classes enabled when list is closed
            triggerClasses: [],
            listClasses: []
        }
        this.DOM_Elements.wrapper.addEventListener("focusout", (e) => {this.hasLostFocus(e)})
        this.DOM_Elements.trigger.addEventListener("click", (e) => { e.preventDefault(), this.toggleList() })   //add open list event
    }

    /**
     * Define the classes that will be attributed on the dropdown elements when opened
     * @param {array} triggerClasses classes for the button when list is open
     * @param {array} itemListClasses classes for the ul when list is open
     */
    setClassesOnOpen(triggerClasses = [], itemListClasses = []) {
        this.onOpen.triggerClasses = triggerClasses
        this.onOpen.listClasses = itemListClasses
    }

    /**
     * Define the classes that will be attributed on the dropdown elements when closed
     * @param {array} triggerClasses classes for the button when list is closed
     * @param {array} itemListClasses classes for the ul when list is closed
     */
    setClassesOnClose(triggerClasses = [], itemListClasses = []) {
        this.onClose.triggerClasses = triggerClasses
        this.onClose.listClasses = itemListClasses
    }
    /**
     * Attribute classes and boolean when list is opened
     */
    openList() {
        this.DOM_Elements.trigger.classList.add(...this.onOpen.triggerClasses)
        this.DOM_Elements.list.classList.add(...this.onOpen.listClasses)
        this.DOM_Elements.trigger.classList.remove(...this.onClose.triggerClasses)
        this.DOM_Elements.list.classList.remove(...this.onClose.listClasses)
        this.isOpen = true
    }
    /**
     * Attribute classes and boolean when list is closed
     */
    closeList() {
        this.DOM_Elements.trigger.classList.add(...this.onClose.triggerClasses)
        this.DOM_Elements.list.classList.add(...this.onClose.listClasses)
        this.DOM_Elements.trigger.classList.remove(...this.onOpen.triggerClasses)
        this.DOM_Elements.list.classList.remove(...this.onOpen.listClasses)
        this.isOpen = false
    }
    /**
     * Toggle between opened and closed state
     */
    toggleList() {
        if (this.isOpen) {
            this.closeList()
        } else {
            this.openList()
        }
    }
    /**
     * check if the new event focus a target that is not in the dropdown and closes the dropdown if that's the case.
     * @param {*} newEvent newly generated event in the DOM
     */
    hasLostFocus(newEvent) {
        let newTarget = newEvent.relatedTarget
        let targetIsTrigger = false
        let targetIsList = false
        let targetIsListItem = false
        if (newTarget == this.DOM_Elements.trigger) {
            targetIsTrigger = true
        }
        if (newTarget == this.DOM_Elements.list) {
            targetIsList = true
        }
        for (const item of this.DOM_Elements.listItems) {
            if (newTarget == item) {
                targetIsListItem = true
            }
        }
        if (!(targetIsTrigger || targetIsList || targetIsListItem)) {
            this.closeList()
        }
    }
        /**
     * Get data from the specified element of the list
     * @param {*} listItem targeted list item of the dropdown
     * @returns returns an object in the format {text : li.textContent, value : li.dataset.value}
     */
        getItemData(listItem) {      //return textcontent and dataset value of an element in the list
            return {
                text: listItem.textContent,
                value: listItem.dataset.value
            }
        }
}

/**
 * Dropdown element reproducing the behavior of a regular select
 */
export class DropdownSingle extends DropdownBase{
    /**
     * instantiate a simple drowpdown object to add the dropdown logic to the html elements
     * @param {string} dropdownContainer id of the parent element containing the dropdown elements
     * @param {string} selectedItemClass class that will be toggled for the selected item
     */
    constructor(dropdownContainer, selectedItemClass="dropdown-selected") {
        super(dropdownContainer)
        this.selectedListItem = null
        this.selectedItemInfos = null
        this.selectedItemClass = selectedItemClass
        for (const item of this.DOM_Elements.listItems) {
            item.addEventListener("click", (e) => {this.selectItem(e.target), this.closeList() })
        }
    }
    overwriteTriggerText(newText=null){
        if(typeof newText === "string" && newText != null)
        this.DOM_Elements.trigger.textContent=newText
    }
    /**
     * Select an item from the list
     * @param {*} listItem new item to select
     */
    selectItem(listItem){
        if(this.selectedListItem !== null){
            this.selectedListItem.classList.remove(this.selectedItemClass)
        }
        this.selectedItemInfos = this.getItemData(listItem)
        listItem.classList.add(this.selectedItemClass)
        this.overwriteTriggerText(this.selectedItemInfos.text)
        this.selectedListItem = listItem
    }
    /**
     * gets text and value of currently selected item
     * @returns object containing text and value of currently selected item
     */
    getSelectedItemInfos(){
        return this.selectedItemInfos
    }
}

/**
 * Base parent class of all dropdowns having a behavior supporting multiple values.
 */
class DropdownMultipleBase extends DropdownBase {
    constructor(dropdownContainer) {
        super(dropdownContainer)
        this.selectedItems = []
    }

    /**
     * Add the data of an element to the array of selectedItems
     * @param {*} listItem targeted list item of the dropdown
     */
    addItemToSelectedArray(listItem) {
        let itemToAdd = this.getItemData(listItem)
        if (!this.selectedItems.includes(itemToAdd)) {
            this.selectedItems.push(itemToAdd)
        }
    }
    /**
     * Remove the data of an element from the array of selectedItems using the dataset value
     * @param {*} targetItemValue Unique value of the item to remove
     */
    removeItemFromSelectedArray(targetItemValue) {
        let itemIndex = this.selectedItems.findIndex(selectedItem => { return selectedItem.value === targetItemValue })
        if (itemIndex !== -1) {
            this.selectedItems.splice(itemIndex, 1)
        }
    }

    /**
     * Get all currently selected items
     * @returns array of object having the properties text and value
     */
    getAllSelectedItems() {
        return this.selectedItems
    }
}



/**
 * instantiate a dropdown with multiple selection
 */
export class DropdownMultipleExtracting extends DropdownMultipleBase {

    /**
     * Add an item to the array of selected Items and remove the item from the list
     * @param {*} listItem 
     */
    pickListItem(listItem) {
        this.addItemToSelectedArray(listItem)
        this.removeItemFromDisplayedList(listItem)
    }

    /**
     * drop an item from the array of selected Items and add it back the item from the list
     * @param {*} listItemValue unique value corresponding to list item dataset value
     */
    dropSelectedItem(listItemValue) {
        this.removeItemFromSelectedArray(listItemValue)
        this.addItemBackToList(listItemValue)
    }

    /**
     * Diplay the item in the list having the required value
     * @param {*} targetItemValue value to compare to the dataset property of all htmlElements inside the list
     */
    addItemBackToList(targetItemValue) {
        for (const listItem of this.DOM_Elements.listItems) {
            if (listItem.dataset.value == targetItemValue) {
                listItem.style.display = "block"
            }
        }
    }

    /**
     * Remove from display the corresponding item in the list
     * @param {*} targetItemValue item to remove from the list
     */
    removeItemFromDisplayedList(listItem) {
        listItem.style.display = "none"
    }

    /**
     * Add a callback to all items in the list in order to pass the selected data to the calling script
     * @param {*} callbackSelectItem callback function that will get the data from the clicked item
     */
    addListeners(callbackSelectItem) {   //add the given callback to the click on item event to return the item info, then close list
        for (const item of this.DOM_Elements.listItems) {
            item.addEventListener("click", (e) => { callbackSelectItem(this.getItemData(e.target)),this.pickListItem(e.target), this.closeList() })
        }
    }
}