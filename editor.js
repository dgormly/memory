const localstorage = window.localStorage;

var croppedImages = {};
var originalImages = {};
var currentImage = null;
var countID =
  window.localStorage.getItem("counter") !== null
    ? window.localStorage.getItem("counter")
    : 0;
var imageCounter = document.getElementById("imageCounter");
const defaultImageUrl = "";
const numRequired = 32;

let croppieSettings = {
  viewport: { height: 425, width: 300, type: "square" },
  enableOrientation: true,
  showZoomer: false,
  enableExif: true,
};

let keys = window.localStorage.getItem("keys") !== null ? window.localStorage.getItem("keys").split(',') : [];
let cropped = {};
for (var i = 0; i < keys.length; i++) {
  cropped[keys[i]] = window.localStorage.getItem(keys[i]);
}

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
  try {
    window.localStorage.clear();

    let keys = Object.keys(editorApp.croppedImages);
    let values = Object.values(editorApp.croppedImages);

    window.localStorage.setItem("keys", keys);
    
    for (var i = 0; i < keys.length; i++) {
      window.localStorage.setItem(keys[i], values[i]);
    }
    
    window.localStorage.setItem("counter", countID);
    alert("Images have been successfully saved.");
  } catch (err) {
    alert("Memory full. Unable to save progress.");
  }
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
