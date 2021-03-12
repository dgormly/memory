
var BeatLoader = VueSpinner.BeatLoader
var croppedImages = {};
var originalImages = {};
var currentImage = null;
var countID = 0;
var imageCounter = document.getElementById("imageCounter");
const defaultImageUrl = "";
const numRequired = 1;

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
    numRequired: 32,
    croppedImages: cropped,
  },
  methods: {
    saveImages: saveImages,
    clearPhotos: clearPhotos,
  },
  components: {
    BeatLoader
  }
});

Vue.component('card', {
  props: ['cardid', "imgurl", "loading", "uploaded"],
  template: `<div :data-id=cardid class='text-center'>
            <img :src=imgurl class='card-img memory-card' />
            <button v-on:click="deleteImage(cardid)"  v-bind:class="{ hide: !uploaded }" type='button' aria-label='Close' class='btn-close'></button>
            <beat-loader :loading=!uploaded style="margin: 8px;"></beat-loader>
            </div>`,
  components: {
    BeatLoader
  }
});

function clearPhotos() {
  var answer = confirm("Are you sure you want to clear all photos?");
  if (answer) {
    editorApp.croppedImages = {};
    editorApp.$forceUpdate();
    countID = 0;
  }
}

function saveImages() {
  // TODO send photos to server.
  // Create a new user
  fetch('http://127.0.0.1:80/upload', {
  headers: { "Content-Type": "application/json; charset=utf-8" },
  method: 'POST',
  body: JSON.stringify({
    username: 'Elon Musk',
    email: 'elonmusk@gmail.com',
  })
}).then(response => response.json())
.then(data=>console.log(data))
}

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

function cancelImage() {
  $("#viewer").croppie("destroy");
  editorApp.editing = false;
}

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

function deleteImage(id) {
  delete editorApp.croppedImages[id];
  editorApp.$forceUpdate();
}
