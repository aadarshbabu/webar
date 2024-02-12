class Header extends HTMLElement {
  constructor() {
    super();
    const template = `
    <style>
        @import url('https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css');
    </style>

        <nav class="navbar bg-body-tertiary">
            <div class="container-fluid">
                <a class="navbar-brand" href="/">
                    <img src="../assits/LiberinLogo.jpg" alt="Logo" width="30" height="30"
                        class="d-inline-block align-text-top">
                    Liberin WebAR
                </a>
            </div>

         </nav>
        `;

    let shadow = this.attachShadow({ mode: "open" });
    shadow.innerHTML = template;
  }
}

customElements.define("page-header", Header);
