/* Main editor variables. */
let BeatLoader = VueSpinner.BeatLoader;
let originalImages = {}; // Object containing the original images as B64.
let currentImage = null; // The current image that is being edited.
let bgImages = {};
let cropped = {};
let countID =  Math.round(Math.random() * 100000); // The image ID counter each image is assigned when created.
let imageCounter = document.getElementById("imageCounter"); // The image counter DOM tag.
const defaultImageUrl = ""; // The default image URL used for the background image.
const numRequired = 2; // The number of images required to be uploaded for the user to be able to select next.

/* Title Text shown at the top of the Vue App */
let uploadText = "Upload a Memory!";
let cropText = "Crop the Photo to Fit on the Card";
let nextText = "Press Next to Select a Card Background";
let backgroundText = "Select a Card Background";
var titleText = uploadText; // Changing this letiable changes the text in the app.

/* The configured croppy default settings for the editor to use. */
let croppieSettings = {
  viewport: { height: 425, width: 300, type: "square" },
  enableOrientation: true,
  showZoomer: false,
  enableExif: true,
};


/* The main editor Vue App */
let editorApp = new Vue({
  el: "#editorApp",
  data: {
    editing: false,
    backgroundSelect: false,
    numRequired: numRequired,
    croppedImages: cropped,
    backgroundImages: bgImages
  },
  methods: {
    clearPhotos: clearPhotos,
  },
  components: {
    BeatLoader, // Image upload spinner
  },
  async created() {
    this.croppedImages = getCurrentPhotos();
  }
});

/* Card component used to represent a memory game card. */
Vue.component("card", {
  props: ["cardid", "imgurl", "uploaded"],
  data: function () {
    return {
      imageUploaded: true, // This is inverted.
    };
  },
  template: `<div :data-id=cardid class='text-center'>
              <img :src=imgurl class='card-img memory-card' />
              <button v-on:click="deleteImage(cardid)"  v-bind:class="{ hide: this.imageUploaded }" type='button' aria-label='Close' class='btn-close'></button>
              <beat-loader :loading=this.imageUploaded style="margin: 8px;"></beat-loader>
            </div>`,
  components: {
    BeatLoader, // Spinner used to represent when an image being uploaded.
  },
  // When an image is cropped using croppie, upload it to the server and then change the spinner.
  created: () => {
          debugger;
          // Upload new photo. TODO pass photo file.
          let res = uploadNewPhoto();
      
          if (!res) {
            console.log("Failed to upload the image.");
            // TODO convert to failed icon w/ onclick to reupload.
          } else {
            console.log("Image successfully uploaded.")
            // Turn off spinner.
            imageUploaded = !res;
        }
  }
});


/**
 * Force dom to reload v-if
 */
window.addEventListener("load", function(event) {
  editorApp.$forceUpdate();
});

/**
 * Sends a HTTP request to the server to clear all photos associated with the account.
 */
function clearPhotos() {
  let answer = confirm("Are you sure you want to clear all photos?");
  if (!answer) return;

  let res = deleteAllPhotos();
  if (res) {
    console.log("Clearing all photos...");
    editorApp.croppedImages = {};
    editorApp.$forceUpdate();
    countID = Math.round(Math.random() * 100000);

    titleText = nextText;
  } else {
    alert("An error occured attempting to delete the ");
    console.log("An error ocurred deleting all photos.");
  }
}

/**
 * Once 32 photos have been uploaded. The next option allows the user to select a background
 * texture.
 */
function nextPressed() {
  // TODO Check that
  console.log("Moving to background selector.");
  alert("Moving to background selector.");
  // Hide the images div
  // Present all the cards of the background textures, backgroundTexturesURL.
  // Show summarise page.
  // Go to payment page.
}

/**
 * Once an image has been selected using the uploader, the cropping library is set with the image.
 *
 * @param {*} event
 */
function setImage(event) {
  editorApp.editing = true;
  titleText = cropText;
  let reader = new FileReader(); // Allow the user to select a photo that they would like to crop.
  reader.onload = function (e) {
    document.getElementById("viewer").src = e.currentTarget.result;
    currentImage = e.currentTarget.result;
    $("#viewer").croppie(croppieSettings);
  };
  reader.readAsDataURL(event.currentTarget.files[0]);
}

/**
 * Remove the current image from croppie and cancel the request.
 */
function cancelImage() {
  $("#viewer").croppie("destroy");
  editorApp.editing = false;

  if (Object.keys(editorApp.croppedImages).length === numRequired) {
    titleText = nextText;
  } else {
    titleText = uploadText;
  }
}

/**
 * Add the cropped image to the background and upload the image to the server via a HTTP request.
 */
function addImage() {
  $("#viewer")
    .croppie("result", {
      type: "base64",
      size: "original",
    })
    .then(function (imageBase64) {
      editorApp.editing = false;
      let image = document.createElement("img");
      image.src = imageBase64;
      image.height = 85;
      image.width = 65;
      editorApp.croppedImages[countID] = imageBase64;
      countID++;
      $("#viewer").croppie("destroy");


      // Change text.
      if (Object.keys(editorApp.croppedImages).length === numRequired) {
        titleText = nextText;
      } else {
        titleText = uploadText;
      }
    });
}

/**
 * Delete an image from the server via a HTTP request.
 *
 * @param {string} id
 */
function deleteImage(id) {

  let res = deletePhoto(id);

  if (res) {
    console.log(`Successfully deleted photo '${id}'.`);
    delete editorApp.croppedImages[id];
    editorApp.$forceUpdate();

    if (Object.keys(editorApp.croppedImages).length == numRequired) {
      titleText = nextText;
    } else {
      titleText = uploadText;
    }
  } else {
    console.log(`Request to server failed. Failed to delete photo '${id}'.`);
  }
}
