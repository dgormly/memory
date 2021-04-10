/* Main editor variables. */
let BeatLoader = VueSpinner.BeatLoader;
let originalImages = {}; // Object containing the original images as B64.
let currentImage = null; // The current image that is being edited.
let bgImages = {};
let countID = Math.round(Math.random() * 100000); // The image ID counter each image is assigned when created.
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

Vue.component("top-nav", {
  props: ["title", "editing", "numimages", "numrequired"],
  template: `
    <nav class="navbar navbar-dark bg-dark text-end">
        <div class="container-fluid">
          <input id="imageInput" type="file" @change="setImage" />
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
              Cancel
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
            onclick="$('#viewer').croppie('rotate', 90)"
            class="btn btn-light"
            v-bind:class="{ 
              hide: editing != 'CROP'
            }"
          >
            Rotate
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
    setImage(event) {
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
        class="navbar fixed-bottom navbar-dark bg-dark text-end"
      >
        <div class="container-fluid">
          <button
            class="btn btn-outline-danger"
            v-on:click="clearPhotos"
            v-bind:class="{ hidden: editing == 'CROP' }"
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
              onclick="nextPressed()"
              v-bind:class="{ 
                hidden: editing != 'NEXT'
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
              Add
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
    }
  },
});

/* Card component used to represent a memory game card. */
Vue.component("card", {
  props: ["cardid", "imgurl", "uploaded"],
  data: function () {
    return {
      imageUploaded: false,
    };
  },
  template: `<div :data-id=cardid class='text-center'>
              <img :src=imgurl class='card-img memory-card' />
              <button v-on:click="deleteCard(cardid)"  v-bind:class="{ hide: !uploaded }" type='button' aria-label='Close' class='btn-close'></button>
              <beat-loader :loading=!uploaded style="margin: 8px;"></beat-loader>
            </div>`,
  methods: {
    deleteCard(cardid) {
      this.$emit("delete-card", cardid);
    }
  },
  components: {
    BeatLoader, // Spinner used to represent when an image being uploaded.
  }
});

/* Cards component where all cards will be displayed in the app. */
Vue.component("card-display", {
  props: ["cards"],
  data: function () {
    return {};
  },
  template: `
    <div class="text-center">
    <card
      v-for="(card, key) in cards"
      v-bind:key="key"
      v-bind:cardid="key"
      v-bind:imgurl="card.img"
      v-bind:uploaded="card.uploaded"
      class="thumbnail text-center"
      @delete-card="deleteCard"
    ></card>
  </div>
  `,
  methods: {
    deleteCard(cardid) {
      this.$emit("delete-image", cardid);
    }
  }
});

/* The main editor Vue App */
let editorApp = new Vue({
  el: "#editorApp",
  data: function () {
    return {
      mode: "CARDS",
      currentImage: null,
      titleText: titleText,
      backgroundSelect: false,
      numRequired: numRequired,
      croppedImages: {},
      backgroundImages: bgImages,
    };
  },
  methods: {
    cropPhoto(image) {
      this.mode = "CROP";
      this.titleText = cropText;
      document.getElementById("viewer").src = image;
      currentImage = image;
      $("#viewer").croppie(croppieSettings);
    },
    cancelImage() {
      this.mode = 'CARDS';
      this.titleText = uploadText;
      $("#viewer").croppie("destroy");
    
      if (Object.keys(this.croppedImages).length === numRequired) {
        titleText = nextText;
        this.mode = "NEXT";
      } else {
        titleText = uploadText;
      }
    },
    addImage,
    clearPhotos,
    deleteImage
  },
  components: {
    BeatLoader, // Image upload spinner
  },
  async created() {
    this.croppedImages = getCurrentPhotos();
  },
});

/**
 * 
 */
function addImage() {
  var that = this;
  $("#viewer")
    .croppie("result", {
      type: "base64",
      size: "original",
    })
    .then((imageBase64) => {
      that.mode = 'CARDS';

      let image = document.createElement("img");
      image.src = imageBase64;
      image.height = 85;
      image.width = 65;
      Vue.set(that.croppedImages, countID, {
        uploaded: false,
        img: imageBase64
      });

      $("#viewer").croppie("destroy");

      // TODO upload
      var result = uploadNewPhoto(countID, imageBase64);
      var cropResult = that.croppedImages[countID];
      cropResult.uploaded = result;
      Vue.set(that.croppedImages, countID, cropResult);

      countID++;
      // Change text.
      if (Object.values(that.croppedImages).filter(data => data.uploaded == true).length === numRequired) {
        that.titleText = nextText;
        that.mode = "NEXT"; 
      } else {
        that.titleText = uploadText;
      }
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
 * Delete an image from the server via a HTTP request.
 *
 * @param {string} id
 */
function deleteImage(id) {
  let res = deletePhoto(id);

  if (res) {
    console.log(`Successfully deleted photo '${id}'.`);
    Vue.delete(this.croppedImages, id);
  } else {
    console.log(`Request to server failed. Failed to delete photo '${id}'.`);
  }
}
