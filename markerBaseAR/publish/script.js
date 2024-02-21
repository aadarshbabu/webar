window.onload = async () => {
  const { Package } = ARjsStudioBackend;
  // Function to extract URL parameters

  function getUrlParameter(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
  }

  const controller = new AbortController();

  // 5 second timeout:

  const timeoutId = setTimeout(() => controller.abort(), 10000);

  const code = getUrlParameter("code");

  let response = await fetch(
    `https://nodewebar.onrender.com/code?code=${code}`,
    { signal: controller.signal }
  );

  response = await response.json();
  console.log("Res", response);
  if (response) {
    clearTimeout(timeoutId);
  }

  window.session = JSON.parse(window.name);

  if (
    window.session.assetType === "audio" ||
    window.session.assetType === "video"
  ) {
    window.session.assetFile = new Uint8Array(window.session.assetFile).buffer;
  }

  function hideSpinner() {
    document.getElementById("qrSpinner").remove();
    var spinnerContainer = document.getElementById("spinnerContainer");
    spinnerContainer.remove();
  }

  async function publishToGithub(token, repoName) {
    if (!repoName || !token) {
      return alert("Token and repo name not exist.");
    }

    const package = new Package(window.session);

    return await package.serve({
      packageType: "github",
      token: token, // required, must be an OAuth2 token
      message: "first commit for WebAR!", // optional
      repo: repoName, // using user + GH code, gg wp
      branch: "gh-pages", // automatically deploy to Pages by default
    });
  }

  async function generateQRCode(pageUrl) {
    const qrDiv = document.getElementById("qrcode");

    var qrcode = new QRCode(qrDiv, {
      text: pageUrl,
      width: 256,
      height: 256,
      colorDark: "#000000",
      colorLight: "#ffffff",
      correctLevel: QRCode.CorrectLevel.H,
    });

    // Get the canvas element from the QR code
    const canvas = qrDiv.querySelector("canvas");

    // Get the data URL of the canvas
    const dataURL = canvas.toDataURL("image/png");

    // Log or use the data URL as needed
    console.log("DataURI", dataURL);

    return dataURL;
  }

  const projectName =
    localStorage.getItem("projectName") + localStorage.getItem("randomString");

  if (response.access_token && projectName) {
    openModal();

    const imageData = window.session.fullMarkerImage
      ? window.session.fullMarkerImage
      : window.session.markerImage;

    setMarkerImage(imageData);

    const githubUrl = await publishToGithub(response.access_token, projectName);

    const httpsGitUrl = convertToHttps(githubUrl);
    const qrGenerate = await generateQRCode(httpsGitUrl);

    if (qrGenerate) {
      console.log("QR", qrGenerate);
      const withoutPrefixUrl = removeHttpPrefix(httpsGitUrl);
      ShowUrl();
      setLink(withoutPrefixUrl);
      hideSpinner();
      const zipFile = createMarkerZip(imageData, qrGenerate);
    }
  } else {
    createError("Something went wrong");
    hideSpinner();
  }
};
//  @param(errorMessage: string)
function createError(errorMessage) {
  const node = document.createElement("p");
  const errorContainer = document.getElementById("error");

  node.innerText = errorMessage;
  node.style.color = "#ff0000";

  errorContainer.appendChild(node);
}

function setMarkerImage(url) {
  const markerImage = document.getElementById("markerImage");
  markerImage.setAttribute("src", url);
}

function openModal() {
  document.getElementById("openModal").click();
}

function setLink(link) {
  document.getElementById("link").innerText = link;
}

function showHideThankYouPage(isShow) {
  const showThankyou = document.getElementById("thanku");

  showThankyou.style.display = "none";
  if (isShow) {
    showThankyou.style.display = "block";
    createError("");
  }
}

function closeModal() {
  showHideThankYouPage(true);
}

function convertToHttps(url) {
  // Check if the URL starts with 'http://'
  if (url.startsWith("http://")) {
    // Replace 'http://' with 'https://'
    return url.replace("http://", "https://");
  }

  // If the URL is already using 'https://' or any other protocol, return as is
  return url;
}

function removeHttpPrefix(url) {
  // Remove 'https://' if present
  let cleanedUrl = url.replace("https://", "");

  // Remove 'http://' if present
  cleanedUrl = cleanedUrl.replace("http://", "");

  // Return the cleaned URL
  return cleanedUrl;
}

function copyToClipboard() {
  // Get the text content from the div with class 'text'
  const textToCopy = document.querySelector(".text").innerText;

  // Use the Clipboard API to copy the text to the clipboard
  navigator.clipboard
    .writeText(textToCopy)
    .then(() => {
      // Optionally, you can provide visual feedback to the user
      alert("Link copied to clipboard!");
    })
    .catch((err) => {
      console.error("Unable to copy to clipboard", err);
    });
}

function ShowUrl() {
  const showURl = document.getElementById("showURlLink");
  showURl.style.display = "flex";
}

function DownloadAssets() {
  const downloadBTN = document.getElementById("download-btn");

  downloadBTN.style.display = "flex";
  return downloadBTN;
}

async function createMarkerZip(markerImage, qrImage) {
  var zip = new JSZip();
  // Convert data URL to a Blob
  const markerImg = await fetch(markerImage).then((res) => res.blob());
  const qrImg = await fetch(qrImage).then((res) => res.blob());

  zip.file("marker.jpg", markerImg, { binary: true });
  zip.file("qrImage.jpg", qrImg, { binary: true });

  let promise;

  zip.generateAsync({ type: "blob" }).then(function (blob) {
    const link = DownloadAssets();
    link.onclick = () => DownloadZip(blob);
  });

  return promise;
}

function DownloadZip(blob) {
  const a = document.createElement("a");
  document.body.appendChild(a);
  a.style.display = "none";
  const url = window.URL.createObjectURL(blob);
  a.href = url;
  a.download = "DwARassets.zip";
  a.click();
  window.URL.revokeObjectURL(url);
  showTost("Assets download successful", "info");
}
