// const { MarkerModule, Package } = ARjsStudioBackend;

const previewUrl = (file, name, isMarker) => {
  //
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
    <div class="filename-container">
        <div class="remove-marker">
            <span class="crossmark" onclick="handleUnload(this)">&times;</span>
            <span class="filename">Remove</span>
        </div>
    </div>`;

// const previewModelTemplate = () => {
//   let preview = document.getElementById("content-preview");
//   preview.innerHTML = previewModelTemplateHtml;
// };

const unloadFileStyle = `
    .crossmark {
        vertical-align: middle;
        font-size: 2.25em;
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
        width: 23.75em;
        height: 23.75em;
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

//
