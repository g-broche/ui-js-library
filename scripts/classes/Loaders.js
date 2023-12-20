/**
 * This function works in conjunction with an html element with visibility hidden by default and will set its visibility to visible once ready
 * state is either not on loading anymore. Used mainly to avoid flash of unstyled content issue.
 * @param {string} selector CSS selector for the single element which visibility style will be set to visible.
 */
export function makeElementVisibleOnPageLoad(selector){
    if(document.readyState == 'loading'){
        document.addEventListener('DOMContentLoaded', ()=>{makeElementVisibleOnPageLoad(selector)})
    }else{
        document.querySelector(selector).style.visibility = "visible"
    }
}

/**
 * This function serves to set visibility of the parent wrapper of an img to visible once the image is fully loaded.
 * @param {HTMLElement} imgContainer Parent container of the img to load
 * @param {string} classToRemove class that will be remove once the image is loaded. This class should be the one hiding the parent container.
 */
export async function displayImgOnceLoaded(imgContainer, classToRemove){
    if(imgContainer && classToRemove){
        const image = imgContainer.querySelector('img');
        if(image.complete){
            imgContainer.classList.remove(classToRemove)
            return
        }
        const hasImageLoaded = async function (image) {
            return new Promise((resolve, reject)=>{
                image.onload = () => {
                    if(image.width > 0 && image.height > 0){
                        (resolve(image))
                    } 
                }
                image.onerror= reject
            })
        }
        try {
            const loadedImage = await hasImageLoaded(image)
            imgContainer.classList.remove(classToRemove)
        } catch (error) {  
        }
    }
}

/**
 * This function serves to set visibility of all parents wrapper of images to visible once the images are fully loaded.
 * @param {string} collectionSelector query selector targeting the parents of all concerned images
 * @param {string} classToRemove class that will be remove once the images are loaded. This class should be the one hiding the parent containers.
 */
export async function displayImgCollectionOnceLoaded(collectionSelector, classToRemove){
    const imageContainers = document.querySelectorAll(collectionSelector)
        for (const imageContainer of imageContainers) {
            displayImgOnceLoaded(imageContainer, classToRemove)
        }
}