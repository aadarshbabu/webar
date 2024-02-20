// const { MarkerModule, Package } = ARjsStudioBackend;

const previewUrl = (file, name, isMarker) => {
  const markerImage = document.getElementById("marker");
  const markerDownloadButton = document.getElementById("marker-download");

  markerDownloadButton.setAttribute("href", file);
  markerImage.setAttribute("src", file);
};

const previewVideoTemplate = (fileUrl, name) => {
  const contentPreview = document.getElementById("content-preview");
  contentPreview.innerHTML = "";
  const video = document.createElement("video");
  video.src = fileUrl;
  video.setAttribute("id", "video");
  video.setAttribute("controls", "true");
  console.log("Video", video);
  contentPreview.appendChild(video);
};

const unloadFileTemplate = (fileName, fileURL) => `
        <div onclick="onclick="handleContentUpload(true)" class="remove-marker">
            <span class="crossmark" onclick="handleContentUpload(true)">&times;</span>
            <span class="filename">Change</span>
        </div>
   `;

// const previewModelTemplate = () => {
//   let preview = document.getElementById("content-preview");
//   preview.innerHTML = previewModelTemplateHtml;
// };

const unloadFileStyle = `
 .remove-marker{
    cursor:pointer
 }
    .crossmark {
        vertical-align: middle;
    }
    .download-marker {
        display: flex;
    }
    .download-marker span {
        display: flex;
        padding: 0.25em 0em;
    }
    .filename {
        vertical-align: middle;
        font-style: italic;
        font-weight: bold;
        font-size: 18px;
    }`;

const previewModelStyle = `
    .modelFrame {
        width: 10em;
        height: 10em;
        object-fit: contain;
        font-size: 1.25em;
        text-align: center;
    }
    .filename-container {
        display: flex;
        align-items: center;
        justify-content: space-between;
        cursor: pointer;
    }`;

const previewModelTemplate = (fileURL, fileName) => `
    <style>
        ${previewModelStyle}
        ${unloadFileStyle}
    </style>
    <div class="modelFrame" id="modelFrame">
        <a-scene
            renderer="logarithmicDepthBuffer: true;"
            embedded
            loading-screen="enabled: false;"
            vr-mode-ui="enabled: false">
            <a-assets>
                <a-asset-item id="model" src="${fileURL}"></a-asset-item>
            </a-assets>

            <a-entity position="0 0.9 -2">
                <a-entity animation-mixer="loop: repeat" model-controller="target:#modelFrame" gltf-model="#model"></a-entity>
            </a-entity>

            <a-sky color="#ECECEC"></a-sky>
            <a-entity camera position="0 1 0">
     
            </a-entity>
        </a-scene>
    </div>
    ${unloadFileTemplate(fileName, fileURL)}
    `;

const makeZip = () => {
  if (!window.markerImage) return alert("please select a marker image");
  if (!window.assetType) return alert("please select the correct content type");
  if (!window.assetFile || !window.assetName)
    return alert("please upload a content");

  MarkerModule.getMarkerPattern(window.markerImage)
    .then(
      (markerPattern) =>
        new Package({
          arType: "pattern",
          assetType: window.assetType, // image/audio/video/3d
          assetFile: window.assetFile,
          assetName: window.assetName,
          assetParam: window.assetParam,
          markerPatt: markerPattern,
        })
    )
    .then((package) => package.serve({ packageType: "zip" }))
    .then((base64) => {
      // window.location = `data:application/zip;base64,${base64}`;
      // sometimes it doesn't work by use window.location directly, so change to this way
      const link = document.createElement("a");
      link.href = `data:application/zip;base64,${base64}`;
      link.download = "ar.zip";
      link.click();
    });
};

const clientID = "89699af404caf50e8e38";
const redirectURI =
  "https://blog.socialschedule.in/webar/markerBaseAR/publish/index.html";
const randomString = Math.round(334) * 234 + "repo";

// const publish = document.getElementById("publish");

// publish.setAttribute(
//   "href",
//   `https://github.com/login/oauth/authorize?client_id=${clientID}&scope=public_repo&state=${randomString}&redirect_uri=${redirectURI}`
// );

function createUploadableAsset() {
  if (!window.markerImage) return alert("Please, select a marker image.");
  if (!window.assetType)
    return alert("Please, select the correct content type.");
  if (!window.assetFile || !window.assetName)
    return alert("Please, upload a content.");

  MarkerModule.getMarkerPattern(window.markerImage).then((markerPattern) => {
    window.name = JSON.stringify({
      arType: "pattern",
      assetType: window.assetType, // image/audio/video/3d
      assetFile: window.assetFile,
      assetName: window.assetName,
      assetParam: window.assetParam,
      markerPatt: markerPattern,
      markerImage: window.markerImage,
      fullMarkerImage: window.fullMarkerImage,
    });
  });
}

function openFilePicker() {
  document.getElementById("formFileSm").click();
}
function openAssetsPicker() {
  document.getElementById("content-file").click();
}

const saveBtn = () => {
  createUploadableAsset();

  const projectName = document.getElementById("projectName").value;
  localStorage.setItem("projectName", projectName);
  localStorage.setItem("randomString", randomString);

  window.location = `https://github.com/login/oauth/authorize?client_id=${clientID}&scope=public_repo&state=${randomString}&redirect_uri=${redirectURI}`;
};
