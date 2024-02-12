const fileHolderTemplate = `
  

    <div>
      Click to upload
     </div>`;

class FileHolder extends HTMLElement {
  constructor() {
    super();

    var shadow = this.attachShadow({ mode: "open" });
    shadow.innerHTML = fileHolderTemplate;
    setTimeout(
      function () {
        var targetAttr = this.parentElement.getAttribute("target");
        var target = document.querySelector("#" + targetAttr);
        if (target) {
          this.onclick = function () {
            target.click();
          };
        }
      }.bind(this),
      500
    );
  }

  connectedCallback() {
    this.classList.add("pages-content-element");
  }
}

customElements.define("file-holder", FileHolder);
