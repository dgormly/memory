/**
 * Manager.js controls the logic around the HTTP requests to the server.
 */

/* Server HTTP request configs. TODO: Change over to the correct urls */
const uploadURL = "http://localhost:3000/upload";
const deleteImageURL = "http://localhost:3000/delete";
const clearAllImagesURL = "http://localhost:3000/clear";
const backgroundUploadImageURL = "http://localhost:3000/background";
const backgroundTexturesURL = "http://localhost:3000/textures";

/**
 * Function called to upload a new photo to the server.
 * 
 * @param {string} photoID - Photo in B64 to upload to the system
 * @returns boolean, True if successful, false otherwise.
 */
function uploadNewPhoto(photoID) {
    /*
    const res = await fetch("http://localhost:3000/upload");
    var upload = await res.json();
    if (upload.success) {
      // TODO UPLOAD IMAGE LOGIC
      this.imageUploaded = !upload.success;
    } 
    */
    // TODO
    return true;
}


/**
 * Deletes an image on the server under the users folder containing the given photo ID.
 * 
 * @param {string} photoID - ID of the photo to delete. 
 * @returns boolean, True if successful, false otherwise.
 */
function deletePhoto(photoID) {
    // TODO
    return true;
}


/**
 * Deletes all photos for the given user.
 * 
 * @returns boolean, True if successful, false otherwise.
 */
function deleteAllPhotos() {
    // TODO 
    return true;
}


/**
 * Sets the background image for the cards.
 * 
 * @param {string} backgroundID 
 */
function selectCardBackground(backgroundID) {
    // TODO
    return true;
}