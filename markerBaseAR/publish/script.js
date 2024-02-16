window.onload = async () => {
  const { Package } = ARjsStudioBackend;
  // Function to extract URL parameters

  function getUrlParameter(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
  }

  const code = getUrlParameter("code");

  let response = await fetch(`http://localhost:4000/code?code=${code}`);
  response = await response.json();
  console.log("Res", response);

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
    return qrcode;
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
      const withoutPrefixUrl = removeHttpPrefix(httpsGitUrl);
      setLink(withoutPrefixUrl);
      hideSpinner();
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
