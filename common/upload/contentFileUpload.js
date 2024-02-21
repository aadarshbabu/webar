function contentFileUpload(self) {
  const file = self.files[0];
  if (isValidFile(window.assetType, file, "content-error")) {
  }
}

function handleImageUpload(file) {
  alert("Currently WebAR only supported Video and 3d");

  const fileName = file.name;
  const fileURL = URL.createObjectURL(file);
  const reader = new FileReader();

  reader.readAsDataURL(file);
  reader.onloadend = function () {
    window.assetFile = reader.result.split(",")[1];
    window.assetName = file.type.replace("image/", "asset.");
    checkUserUploadStatus();
  };

  let preview = document.getElementById("content-preview");
  preview.innerHTML = previewImageTemplate(fileURL, fileName);
}

const checkUserUploadStatus = () => {
  console.log("uploded");
  //   enablePageFooter(window.markerImage && window.assetFile);
};

function handleVideoUpload(file) {
  const fileName = file.name;
  const fileURL = URL.createObjectURL(file);
  const reader = new FileReader();
  reader.readAsArrayBuffer(file);
  reader.onloadend = function () {
    //for backend api asset needs only base64 part
    window.assetFile = Array.from(new Uint8Array(reader.result));
    window.assetName = file.type.replace("video/", "asset.");
    checkUserUploadStatus();
  };
  let preview = document.getElementById("content-preview");
  previewVideoTemplate(fileURL, fileName);

  var video = document.querySelector("#video");
  video.addEventListener("canplay", () => {
    if (video.videoWidth > video.videoHeight) {
      video.style.width = "100%";
    } else {
      video.style.height = "100%";
    }

    window.assetParam.size = {
      width: video.videoWidth,
      height: video.videoHeight,
    };

    // video.parentElement.style.backgroundColor = "black";
    document.querySelector("#videoFrame").style.opacity = 1;
  });
}

// This code is for Gltf upload.
function handleModelUpload(file) {
  let fileType = file.name.split(".").slice(-1)[0];
  if (fileType === "glb") {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = function () {
      console.log("Glg");
      //for backend api asset needs only base64 part
      window.assetFile = reader.result.split(",")[1];
      window.assetName = "asset.glb";
      checkUserUploadStatus();
      let preview = document.getElementById("content-preview");
      preview.removeAttribute("style");
      preview.removeAttribute("class");

      preview.innerHTML = previewModelTemplate(reader.result, file.name);
    };
  } else if (fileType === "gltf") {
    console.log("Gltf");
    const reader = new FileReader();
    reader.readAsText(file);
    reader.onloadend = function () {
      const previewError = document.getElementById("content-error");
      try {
        let gltf = JSON.parse(reader.result);
        let buffers = gltf.buffers || [];
        let images = gltf.images || [];
        let uri;

        for (let i = 0; i < buffers.length; i++) {
          uri = buffers[i].uri;
          if (!reg4Base64.test(uri)) {
            // need a related file: data:application/octet-stream;base64,
            previewError.innerHTML =
              '*Please pack all related files to zip file and try again, consult <a class="link" target="_blank" href="https://github.com/AR-js-org/studio/blob/master/how-to-upload-gltf.md">this guide on uploading gltf.</a>';

            return;
          }
        }
        for (let i = 0; i < images.length; i++) {
          uri = images[i].uri;
          if (!reg4Base64.test(uri)) {
            // need a related file
            previewError.innerHTML =
              '*Please pack all related files to zip file and try again, consult <a class="link" target="_blank" href="https://github.com/AR-js-org/studio/blob/master/how-to-upload-gltf.md">this guide on uploading gltf.</a>';
            return;
          }
        }
        // need to load again
        const reader2 = new FileReader();
        reader2.readAsDataURL(file);
        reader2.onloadend = function () {
          //for backend api asset needs only base64 part
          window.assetFile = reader2.result.split(",")[1];
          window.assetName = "asset.gltf";
          checkUserUploadStatus();
          let preview = document.getElementById("content-preview");
          preview.innerHTML = previewModelTemplate(reader2.result, file.name);
        };
      } catch (error) {
        previewError.innerHTML = "*The gltf file is corrupted.";
        return;
      }
    };
  } else if (fileType == "zip") {
    handleZip(file, (err, result) => {
      if (err) {
        const previewError = document.getElementById("content-error");
        previewError.innerHTML =
          err === true ? "*Please check the zip file is correct" : err;
        return;
      }
      window.assetFile = result.split(",")[1];
      window.assetName = "asset.gltf";
      checkUserUploadStatus();
      let preview = document.getElementById("content-preview");
      preview.innerHTML = previewModelTemplate(result, file.name);
    });
  }
}

function handleZip(file, cb) {
  const reader = new FileReader();
  reader.readAsArrayBuffer(file);
  reader.onloadend = function () {
    const data = reader.result;
    JSZip.loadAsync(data).then((zip) => {
      for (let i in zip.files) console.log(i);
      for (let i in zip.files) {
        if (/.gltf$/.test(i)) {
          let prePath = "";
          let file = i.split("/");
          file.pop();
          if (file.length > 0) prePath = file.join("/") + "/";
          zip
            .file(i)
            .async("string")
            .then((text) => {
              try {
                let gltf = JSON.parse(text);
                let buffers = gltf.buffers || [];
                let images = gltf.images || [];
                let uri;
                let targets = [];

                // console.log(gltf.buffers);
                // console.log(gltf.images);
                for (let i = 0; i < buffers.length; i++) {
                  uri = buffers[i].uri;
                  if (!reg4Base64.test(uri)) {
                    // need a related file
                    buffers[i].uri = prePath + uri;
                    targets.push(buffers[i]);
                  }
                }
                for (let i = 0; i < images.length; i++) {
                  uri = images[i].uri;
                  if (!reg4Base64.test(uri)) {
                    // need a related file
                    images[i].uri = prePath + uri;
                    targets.push(images[i]);
                  }
                }
                extractTargets(gltf, targets, zip, cb);
              } catch (error) {
                cb(`*The file [${i}] is corrupted`);
              }
            })
            .catch((error) => {
              console.log(error);
              cb(true);
            });
          return;
        }
      }
      cb("no gltf file in the zip");
    });
  };
}

function extractTargets(gltf, targets, zip, cb) {
  if (targets.length < 1) {
    return cb(
      false,
      "data:application/octet-stream;base64," + btoa(JSON.stringify(gltf))
    );
  }
  let one = targets.shift();
  let zipFile = zip.file(one.uri);
  if (!zipFile) return cb(`*Miss the file [${one.uri}] inside the zip file.`);
  // console.log(one.uri);
  zipFile
    .async("base64")
    .then((base64) => {
      one.uri = "data:application/octet-stream;base64," + base64;
      extractTargets(gltf, targets, zip, cb);
    })
    .catch((err) => {
      console.log(err);
      cb(true);
    });
}
