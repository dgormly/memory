/* Main editor variables. */
let BeatLoader = VueSpinner.BeatLoader;
let originalImages = {}; // Object containing the original images as B64.
let currentImage = null; // The current image that is being edited.
let bgImages = {};
let croppedSave = {}; // Cropped images saved when going to next screen.
let imageCounter = document.getElementById("imageCounter"); // The image counter DOM tag.
const defaultImageUrl = ""; // The default image URL used for the background image.
const numRequired = 32; // The number of images required to be uploaded for the user to be able to select next.

/* Title Text shown at the top of the Vue App */
let uploadText = "Upload a Memory!";
let instructionText = "Upload 32 memories that you would like to play with!";
let cropText = "Crop the photo to fit on the card";
let nextText = "Press next to select a card background";
let backgroundText = "Select a Card Background Image";
var titleText = uploadText; // Changing this letiable changes the text in the app.

/* The configured croppy default settings for the editor to use. */
let croppieSettings = {
  viewport: { height: 425, width: 300, type: "square" },
  enableOrientation: true,
  showZoomer: true,
  enableExif: true,
  enforceBoundary:false
};

let croppie;

document.querySelector("#uploadMsg").innerText = instructionText;

Vue.component("top-nav", {
  props: ["title", "editing", "numimages", "numrequired"],
  template: `
    <nav class="navbar navbar-dark bg-dark text-end top-nav fixed-top">
        <div class="container-fluid">
          <input id="imageInput" type="file" onclick="this.value = null;" @change="setImage" accept="image/x-png,image/gif,image/jpeg"  />
          <button
            class="btn btn-success"
            @click="addPhoto()"
            v-bind:class="{
              hide: editing != 'CARDS' || numimages == numrequired
            }"
          >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="white" class="btn-success" viewBox="0 0 16 16">
          <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"/>
        </svg>
          </button>
          <span v-bind:class="{ 
            hide: editing != 'CROP' 
          }">
            <button
              id="cancelBtn"
              class="btn btn-secondary"
              @click="cancelPhoto()"
            >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="black" class="bi bi-x" viewBox="0 0 16 16">
            <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
          </svg>
            </button>
          </span>
          <span
            id="uploadText"
            class="text-center"
            >{{ title }}</span
          >
          <span
            id="imageCounter"
            class="text-right badge bg-secondary"
            v-bind:class="{ 
              hide: editing != 'CARDS'
            }"
            >{{ numimages }}/{{ numrequired }}</span
          >
          <button
            id="rotateBtn"
            onclick="croppie.rotate(90)"
            class="btn btn-light"
            v-bind:class="{ 
              hide: editing != 'CROP'
            }"
          >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="black" class="bi bi-arrow-repeat" viewBox="0 0 16 16">
          <path d="M11.534 7h3.932a.25.25 0 0 1 .192.41l-1.966 2.36a.25.25 0 0 1-.384 0l-1.966-2.36a.25.25 0 0 1 .192-.41zm-11 2h3.932a.25.25 0 0 0 .192-.41L2.692 6.23a.25.25 0 0 0-.384 0L.342 8.59A.25.25 0 0 0 .534 9z"/>
          <path fill-rule="evenodd" d="M8 3c-1.552 0-2.94.707-3.857 1.818a.5.5 0 1 1-.771-.636A6.002 6.002 0 0 1 13.917 7H12.9A5.002 5.002 0 0 0 8 3zM3.1 9a5.002 5.002 0 0 0 8.757 2.182.5.5 0 1 1 .771.636A6.002 6.002 0 0 1 2.083 9H3.1z"/>
        </svg>
          </button>
        </div>
      </nav>
  `,
  methods: {
    addPhoto() {
      document.getElementById("imageInput").click();
    },
    cancelPhoto() {
      this.$emit("cancel-photo");
    },
    rotateImage() {

    },
    setImage(event) { // Select the image for croppie to crop.
      titleText = cropText;
      let reader = new FileReader(); // Allow the user to select a photo that they would like to crop.
      let that = this;
      reader.onload = (e) => {
        that.$emit("upload-photo", e.currentTarget.result);
      };
      reader.readAsDataURL(event.currentTarget.files[0]);
    },
  },
});

Vue.component("bottom-nav", {
  props: ["editing"],
  template: `
    <nav
        id="bottomActionBar"
        class="navbar fixed-bottom navbar-dark bg-dark text-end top-nav"
      >
        <div class="container-fluid">
          <button
            class="btn btn-outline-danger"
            v-on:click="clearPhotos"
            v-bind:class="{ hidden: editing != 'CARDS' }"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="red" class="bi bi-trash-fill" viewBox="0 0 16 16">
  <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0z"/>
</svg>
          </button>
          <span>
            <button
              id="nextButton"
              class="btn btn-success"
              data-bs-toggle="modal"
              data-bs-target="#morePhotosModal"
              @click="nextScreen()"
              v-bind:class="{ 
                hidden: editing != 'NEXT' && editing != 'BGSELECTED'
              }"
            >
              Next
            </button>
            <button
              id="addBtn"
              class="btn btn-success"
              @click="saveCrop()"
              v-bind:class="{ 
                hide: editing != 'CROP'
              }"
            >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="white" class="bi bi-plus" viewBox="0 0 16 16">
            <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"/>
          </svg>
            </button>
          </span>
        </div>
      </nav>
  `,
  data: function () {
    return {};
  },
  methods: {
    saveCrop() {
      this.$emit("save-crop");
    },
    clearPhotos() {
      this.$emit("clear-photos");
    },
    nextScreen() {
      this.$emit("next-screen");
    },
  },
});

/* Card component used to represent a memory game card. */
Vue.component("card", {
  props: ["cardid", "imgurl", "uploaded", "uploadError", "deleteError", "mode", "selected"],
  data: function () {
    return {
      imageUploaded: false,
      imageLoading: true
    };
  },
  template: `<div :data-id=cardid class='text-center'>
              <img alt="Card Loading" loading="lazy" @load='loadingImage()' :src=imgurl class='card-img memory-card' @click='selectedCard(mode, cardid)' v-bind:class='{ select: selected, pointer: mode == "BACKGROUND" }' />
              <div class="uploadError" @click="retryUpload(cardid)" v-bind:class="{ hide: !uploadError }">
                <svg xmlns="http://www.w3.org/2000/svg" height="32px" viewBox="0 0 24 24" width="32px" fill="#000000"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M3 12c0 2.21.91 4.2 2.36 5.64L3 20h6v-6l-2.24 2.24C5.68 15.15 5 13.66 5 12c0-2.61 1.67-4.83 4-5.65V4.26C5.55 5.15 3 8.27 3 12zm8 5h2v-2h-2v2zM21 4h-6v6l2.24-2.24C18.32 8.85 19 10.34 19 12c0 2.61-1.67 4.83-4 5.65v2.09c3.45-.89 6-4.01 6-7.74 0-2.21-.91-4.2-2.36-5.64L21 4zm-10 9h2V7h-2v6z"/></svg>
              </div>
              <div class="uploadError" @click="deleteCard(cardid)" v-bind:class="{ hide: !deleteError }">
              <svg xmlns="http://www.w3.org/2000/svg" height="32px" viewBox="0 0 24 24" width="32px" fill="#000000"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M3 12c0 2.21.91 4.2 2.36 5.64L3 20h6v-6l-2.24 2.24C5.68 15.15 5 13.66 5 12c0-2.61 1.67-4.83 4-5.65V4.26C5.55 5.15 3 8.27 3 12zm8 5h2v-2h-2v2zM21 4h-6v6l2.24-2.24C18.32 8.85 19 10.34 19 12c0 2.61-1.67 4.83-4 5.65v2.09c3.45-.89 6-4.01 6-7.74 0-2.21-.91-4.2-2.36-5.64L21 4zm-10 9h2V7h-2v6z"/></svg>
            </div>
              <button v-on:click="deleteCard(cardid)"  v-bind:class="{ hide: !uploaded || uploadError || deleteError || this.imageLoading || mode == 'BACKGROUND' || mode == 'BGSELECTED' }" type='button' aria-label='Close' class='btn-close'></button>
              <beat-loader :loading="!uploaded || this.imageLoading" style="margin: 8px;"></beat-loader>
            </div>`,
  methods: {
    deleteCard(cardid) { // Fire event to delete a card.
      this.$emit("delete-card", cardid);
    },
    retryUpload(cardid) {
      this.$emit("retry-upload", cardid);
    },
    selectedCard(mode, cardid) { // Fire event to highlight the selected card.
      if (mode != "BACKGROUND") return;
      this.$emit("card-selected", cardid);
    },
    loadingImage() {
      this.imageLoading = false;
    }
  },
  components: {
    BeatLoader, // Spinner used to represent when an image being uploaded.
  },
});

/* Cards component where all cards will be displayed in the app. */
Vue.component("card-display", {
  props: ["cards", "mode"],
  data: function () {
    return {
      cardChosen: null,
    };
  },
  template: `
    <div id="cardDisplay" class="text-center">
    <card
      v-for="(card, key) in cards"
      v-bind:key="card.id"
      v-bind:cardid="card.id"
      v-bind:imgurl="card.img"
      v-bind:uploadError="card.uploadError || false"
      v-bind:deleteError="card.deleteError || false"
      v-bind:uploaded="card.uploaded"
      v-bind:mode="mode"
      v-bind:selected="cardChosen == card.id && mode == 'BGSELECTED'"
      class="thumbnail text-center"
      @delete-card="deleteCard"
      @retry-upload="retryUpload"
      @card-selected="cardSelected"
    ></card>
  </div>
  `,
  methods: {
    async retryUpload(cardid) {
      this.cards[cardid].uploaded = false;
      uploadNewPhoto(cardid, this.cards[cardid].img).then((res) => {
        this.cards[cardid].uploaded = true;
        this.cards[cardid].uploadError = !res;
      });
    },
    deleteCard(cardid) { // Fire event to delete a card in the editorApp component.
      this.$emit("delete-image", cardid);
    },
    cardSelected(cardid) { // Fire event to highligh the selected background card image.
      this.cardChosen = cardid;
      this.$emit("background-selected", this.cardChosen);
    },
  },
});

/* The main editor Vue App */
let editorApp = new Vue({
  el: "#editorApp",
  data: function () {
    return {
      mode: "CARDS",
      currentImage: null,
      titleText: titleText,
      instructionText: instructionText,
      backgroundSelect: false,
      numRequired: numRequired,
      croppedImages: {},
      backgroundId: null,
      croppie: null
    };
  },
  methods: {
    cropPhoto(image) {
      this.mode = "CROP";
      this.titleText = cropText;
      currentImage = image;

      this.croppie.bind({
        url: image,
        zoom: 0.5
      });
    },
    cancelImage() {
      this.mode = "CARDS";
      this.titleText = uploadText;
      //this.croppie.destroy();
      //resetCroppieBug();

      if (Object.keys(this.croppedImages).length === numRequired) {
        titleText = nextText;
        this.mode = "NEXT";
      } else {
        titleText = uploadText;
      }
    },
    addImage,
    bgSelected,
    clearPhotos,
    deleteImage,
    nextPressed,
    sortObj(obj) {
      return Object.keys(obj).sort().reverse().reduce(function (result, key) {
        result[key] = obj[key];
        return result;
      }, {});
    }
  },
  computed: {
    orderedImages: {
      get () {
        return this.sortObj(this.croppedImages);
      },

      set (val) {
        this.croppedImages[val.id] = val;
      }
    },
  },
  components: {
    BeatLoader, // Image upload spinner
  },
  async created() {
    this.croppedImages = await getCurrentPhotos();
    let el = document.getElementById("viewer");
    this.croppie = new Croppie(el, croppieSettings);
    croppie = this.croppie; // Turns out I need it to be global.
  },
});

/**
 * 
 * @param {string} cardid - ID of the card background that was selectd.
 */
function bgSelected(cardid) {
  this.backgroundId = cardid;
  this.mode = "BGSELECTED";
}

function resetCroppieBug() {
        // Croppie bug. Fix DOM
        let viewer = document.querySelector("#viewer");
        let uploadMsg = document.querySelector("#uploadMsg");
        let editor = document.querySelector("#editor");
        editor.innerHTML = "";
        editor.appendChild(uploadMsg);
        editor.appendChild(viewer);  
}


/**
 *
 */
async function addImage() {
  var that = this;
  this.croppie.result({
      type: "base64",
      size: "original",
    })
    .then((imageBase64) => {
      that.mode = "CARDS";
      const timestamp = new Date().getTime();

    var newCard = {
        id: timestamp,
        uploaded: false,
        img: imageBase64,
      };

      Vue.set(that.croppedImages, timestamp, newCard);

      //this.croppie.destroy();

      // TODO manage result
      uploadNewPhoto(timestamp, imageBase64).then((res) => {
        newCard.uploaded = true;
        newCard.uploadError = !res;
        Vue.set(that.croppedImages, timestamp, newCard);
         // Change text.
        if (Object.values(that.croppedImages)
          .filter((data) => data.uploaded == true).length === numRequired) {
            that.titleText = nextText;
            that.mode = "NEXT";
        } else {
            that.titleText = uploadText;
        }
      });
        
      //resetCroppieBug();
    });
}

/**
 * Sends a HTTP request to the server to clear all photos associated with the account.
 */
function clearPhotos() {
  let answer = confirm("Are you sure you want to delete all photos?");
  if (!answer) return;

  let res = deleteAllPhotos();
  if (res) {
    console.log("Clearing all photos...");
    this.croppedImages = {};
    editorApp.$forceUpdate();
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
  if ((this.mode == "NEXT")) {
    console.log("Moving to background selector.");
    bgImages = getBackgroundImages();
    // Save cropped images.
    croppedSave = Object.assign({}, this.croppedImages);
    // Update cropped images to be the background card images.
    this.croppedImages = bgImages;
    // Update title text.
    window.location.pathname = "create/backgrounds/all/";
    // Present all the cards of the background textures, backgroundTexturesURL.
  } else if ((this.mode == "BGSELECTED")) {
    // Set background image.
    selectCardBackground(this.backgroundId)
    alert("GO TO PAYMENT");
  }
}

/**
 * Delete an image from the server via a HTTP request.
 *
 * @param {string} id
 */
function deleteImage(id) {
  // Turn spinner on
  this.croppedImages[id].uploaded = false;

  deletePhoto(id).then((res) => {
    this.croppedImages[id].uploaded = true;

    if (res) {
      console.log(`Successfully deleted photo '${id}'.`);
      Vue.delete(this.croppedImages, id);
      this.mode = "CARDS";
      this.titleText = uploadText;
    } else {
      this.croppedImages[id].deleteError = true;
      console.log(`Request to server failed. Failed to delete photo '${id}'.`);
    }
  });
}
