/**
 * Manager.js controls the logic around the HTTP requests to the server.
 */

/*
 * POST method implementation:
*/

async function postData(url = '', imgdata = {}) {
    const response = await fetch(url, {
        method: 'POST',
        mode: 'no-cors',                    // no-cors, *cors, same-origin
        cache: 'no-cache',                  // *default, no-cache, reload, force-cache, only-if-cached
        credentials: 'same-origin',         // include, *same-origin, omit
        headers: {
            'X-CSRFToken': csrftoken,
            'Content-Type': 'image/png; base64;',
        },
        redirect: 'follow',                 // manual, *follow, error
        referrerPolicy: 'same-origin',
        body: JSON.stringify(imgdata)           // body data type must match "Content-Type" header
    }).then(response => response.json())
        .then(result => {
            console.log('Success:', result);
    //    });
        }).catch(error => {
            console.error('Error:', error);
        });
    //return response.json(); // parses JSON response into native JavaScript objects
    //TODO: needs deterministic results and error checking

}


/**
 * Gets the background images available for the user to pick from.
 *
 * @returns {object} key represents the countid and the value is the image src.
 */
function getBackgroundImages() {
    // TODO update to correct API
    console.log("Manager: Getting all card backgrounds.");
    const url = "/create/image/backs/";
    return fetch(url)
        .then(response => response.json())
        .then(function (data) {
            var json = data
            console.log(json);
            return json //testdata
        })
    //TODO: needs deterministic results and error checking
}


/**
 * Gets the current photos that are stored under the user.
 *
 * @returns {object} key represents the countid and the value is the image src.
 */

//async function fetchJSON(url) {
async function getCurrentPhotos(){
    const url = "/create/image/fronts/";
    let response = await fetch(url);
    if (response.ok) {
        let data = await response.json();
        if (data.length === 0) return {};

        // convert array to object.
        let retObj = {};
        for (var i = 0; i < data.length; i++) {
            let el = data[i];
            retObj[el.id] = el;
        }
        return retObj;
    } else {
        // Failed to fetch
	return {};
    }

    //return fetch(url)
    //    .then(response => response.json())
    //    .then(function (data) {
    //        var json = data;
    //        console.log(json);
    //        //if (Array.isArray(json)) return {};
    //        return json //testdata
    //    })
    //TODO: needs deterministic results and error checking
}

/* experimental */
function getCurrentPhotos2() {
    var testdata={
        0: {id: 0, img: "/media/user_images/user_3/90966.png", uploaded: true},
        1: {id: 1, img: "/media/user_images/user_3/90966.png", uploaded: true},
        2: {id: 2, img: "/media/user_images/user_3/90966.png", uploaded: true},
    }
    console.log('local: ')
    console.log(testdata);
    return testdata
}



/**
 * Function called to upload a new photo to the server.
 *
 * @param {string} photoID - Photo in B64 to upload to the system
 * @returns boolean, True if successful, false otherwise.
 */
async function uploadNewPhoto(photoID,photoImg) {
    console.log("Manager: Uploading new photo: "+photoID);
    var url="/create/image/"+photoID+"/", photoImg
    const res = await fetch(url,{
        method: 'POST',
        mode: 'no-cors',                    // no-cors, *cors, same-origin
        cache: 'no-cache',                  // *default, no-cache, reload, force-cache, only-if-cached
        credentials: 'same-origin',         // include, *same-origin, omit
        headers: {
            'X-CSRFToken': csrftoken,
            'Content-Type': 'image/png; base64;',
        },
        redirect: 'follow',                 // manual, *follow, error
        referrerPolicy: 'same-origin',
        body: JSON.stringify(photoImg)           // body data type must match "Content-Type" header
    });

    return res.ok;
}


/**
 * Deletes an image on the server under the users folder containing the given photo ID.
 *
 * @param {string} photoID - ID of the photo to delete.
 * @returns boolean, True if successful, false otherwise.
 */
async function deletePhoto(photoID) {
    console.log("Manager: Deleting photo: "+photoID);
    const url = "/create/image/"+photoID+"/del/";
    let response = await fetch(url);
    return response.ok;
}


/**
 * Deletes all photos for the given user.
 *
 * @returns boolean, True if successful, false otherwise.
 */
async function deleteAllPhotos() {
    console.log("Manager: Deleting all photos.");
    const url = "/create/image/all/del/";
    let response = await fetch(url);
    return response.ok;
}


/**
 * Sets the background image for the cards.
 *
 * @param {string} backgroundID
 */
function selectCardBackground(backgroundID) {
    console.log("Manager: Selecting background image.");
    // TODO
    return true;
}


/**
 * Returns a list of backgrounds to choose from.
 */
function getCardBackgroundList() {
    console.log("Manager: Getting background image list.");
    // TODO
    return ["background.jpg"];
}
