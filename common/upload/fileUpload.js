const { MarkerModule, Package } = ARjsStudioBackend;

function checkFile(size, limitInBytes = 5000000) {
  return size <= limitInBytes;
}

function checkFileType(fileType) {
  const allowedImageTypes = ["image/jpeg", "image/jpg", "image/png"];
  const lowerCaseFileType = fileType.toLowerCase();
  return allowedImageTypes.includes(lowerCaseFileType);
}

function UploadFile(self) {
  const file = self.files[0];
  console.log("File", file);

  if (!checkFile(file.size) || !checkFileType(file.type)) {
    MarkerError(
      "Marker is not valid | please check the marker file size or type. "
    );
    return false;
  }

  MarkerError("");
  const fileReader = new FileReader();

  fileReader.readAsDataURL(file);

  fileReader.onloadend = function () {
    const base64Data = fileReader.result;
    window.markerImage = base64Data;

    MarkerModule.getFullMarkerImage(base64Data, 0.5, 512, "black").then(
      (fullMarkerImage) => {
        window.fullMarkerImage = fullMarkerImage;
        const blob = dataURItoBlob(fullMarkerImage);
        const fileURL = URL.createObjectURL(blob);

        // const preview = document.getElementById("marker-preview");
        previewUrl(fileURL, file.name, true);
        checkUserUploadStatus();
      }
    );
  };
  self.value = ""; // Reset required for re-upload
}
