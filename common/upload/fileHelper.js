function dataURItoBlob(dataURI) {
  const mime = dataURI.split(",")[0].split(":")[1].split(";")[0];
  const binary = atob(dataURI.split(",")[1]);
  let array = [];
  for (var i = 0; i < binary.length; i++) {
    array.push(binary.charCodeAt(i));
  }
  return new Blob([new Uint8Array(array)], { type: mime });
}
