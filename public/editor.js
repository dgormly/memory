
var BeatLoader = VueSpinner.BeatLoader
var croppedImages = {};
var originalImages = {};
var currentImage = null;
var countID = 0;
var imageCounter = document.getElementById("imageCounter");
const defaultImageUrl = "";
const numRequired = 2;

let croppieSettings = {
  viewport: { height: 425, width: 300, type: "square" },
  enableOrientation: true,
  showZoomer: false,
  enableExif: true,
};

let cropped = {};

var editorApp = new Vue({
  el: "#editorApp",
  data: {
    editing: false,
    numRequired: numRequired,
    croppedImages: cropped
  },
  methods: {
    clearPhotos: clearPhotos
  },
  components: {
    BeatLoader
  }
});

Vue.component('card', {
  props: ['cardid', "imgurl", "uploaded"],
  data:  function () {
    return {
      imageUploaded: true
  }},
  template: `<div :data-id=cardid class='text-center'>
            <img :src=imgurl class='card-img memory-card' />
            <button v-on:click="deleteImage(cardid)"  v-bind:class="{ hide: this.imageUploaded }" type='button' aria-label='Close' class='btn-close'></button>
            <beat-loader :loading=this.imageUploaded style="margin: 8px;"></beat-loader>
            </div>`,
  components: {
    BeatLoader
  },
  async created() {
    const res = await fetch("http://localhost:3000/upload");
    var upload = await res.json();
    if (upload.success) {
      // TODO UPLOAD IMAGE LOGIC
      this.imageUploaded = !upload.success;
    }
  }
});


/**
 * Sends a HTTP request to the server to clear all photos associated with the account.
 */
function clearPhotos() {
  var answer = confirm("Are you sure you want to clear all photos?");
  if (answer) {
    editorApp.croppedImages = {};
    editorApp.$forceUpdate();
    countID = 0;
    console.log("Clearing photos...");
    /*
    const res = fetch("http://localhost:3000/clear");
    var upload = await res.json();
    if (upload.success) {
      // TODO CLEAR IMAGE LOGIC
    }
    */
  }
}

/**
 * Once 32 photos have been uploaded. The next option allows the user to select a background
 * texture.
 */
function nextPressed() {
  alert("yo");
}


/**
 * Once an image has been selected using the uploader, the cropping library is set with the image.
 * 
 * @param {*} event 
 */
function setImage(event) {
  editorApp.editing = true;
  var reader = new FileReader();
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
}

/**
 * Add the cropped  image to the background and upload the image to the server via a HTTP request.
 */
function addImage() {
  $("#viewer")
    .croppie("result", {
      type: "base64",
      size: "original",
    })
    .then(function (imageBase64) {
      editorApp.editing = false;
      var image = document.createElement("img");
      image.src = imageBase64;
      image.height = 85;
      image.width = 65;
      editorApp.croppedImages[countID] = imageBase64;
      countID++;
      $("#viewer").croppie("destroy");
    });
}

/**
 * Delete an image from the server via a HTTP request.
 * @param {*} id 
 */
function deleteImage(id) {
  delete editorApp.croppedImages[id];
  editorApp.$forceUpdate();
}
