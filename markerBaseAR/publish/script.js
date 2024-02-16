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
      width: 128,
      height: 128,
      colorDark: "#000000",
      colorLight: "#ffffff",
      correctLevel: QRCode.CorrectLevel.H,
    });
    return qrcode;
  }

  const projectName =
    localStorage.getItem("projectName") + localStorage.getItem("randomString");

  if (response.access_token && projectName) {
    const githubUrl = await publishToGithub(response.access_token, projectName);
    const qrGenerate = await generateQRCode(githubUrl);
    if (qrGenerate) {
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
