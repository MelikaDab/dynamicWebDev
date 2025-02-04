import { attachShadow } from "./utils.mjs";

const TEMPLATE = document.createElement("template");
TEMPLATE.innerHTML = `
    <style>
        * {
        padding: 0;
        margin: 0;
        }

        nav {
        display: flex;
        background-color: var(--color-nav);
        gap: 2em;
        padding: 1em;
        }

        .menuButton {
        display: none; /* Hidden by default on desktops */
        background: none;
        border: 2px solid var(--color-text);
        width: 100px;
        height: 60px;
        border-radius: 20px;
        cursor: pointer;
        font-weight: 600;
        font-size: 25px;
        font-family: "Caveat", serif;
        color: var(--color-text);


        }

        nav h1 {
            color: var(--color-background)
        }

        nav ul {
        display: flex;
        list-style-type: none;
        align-items: center;
        gap: 1em;
        }
        
        a {
        color: var(--color-link);
        }

        .activeLink {
        color: var(--color-text);
        }

        h1 {
        font-family: "Homemade Apple", serif;
        }

        h2 {
        color: var(--color-h2);
        font-family: "Homemade Apple", serif;
        }

        label {
          align-self: center;
        }
         /* Mobile Styles */
        @media (max-width: 768px) {
        nav {
            display: grid;
            grid-template-columns: 3;
            grid-template-rows: 2;
        }

        nav ul {
            grid-column: 1/2;
            grid-row: 2/2;
            justify-self: left;
            display: none;
            flex-direction: column;
        }
        
        .menuButton {
        display: initial; /* Show menu button on small screens */
        grid-column: 3/4;
        grid-row: 1/2;
        right: 20px;
        }

        label {
        grid-column: 2/3;
        grid-row: 1/2;
        }

        ul.show {
        display: initial; /* Show links when menu is toggled */
        }
        }
    </style>
    <nav>
        <h1 id="melikas-lodge">Melika D.</h1>   
        <ul>
          <li><a href="/">Home</a></li>
          <li><a href="/projects.html">Projects</a></li>
          <li><a href="/hobbies.html">Hobbies</a></li>
        </ul> 
        <label class="checkBox">
          <input type="checkbox" autocomplete="off" />
          Dark mode
        </label>
        <button class="menuButton">menu</button>      
    </nav>
`;

class NavHeader extends HTMLElement {
    connectedCallback() {
        const shadowRoot = attachShadow(this, TEMPLATE);

        const currentPage = window.location.pathname;
        const links = shadowRoot.querySelectorAll("a");

        links.forEach(link => {
            if (link.getAttribute("href") === currentPage) {
                link.classList.add("activeLink");
            }
        });

        const menuButton = shadowRoot.querySelector(".menuButton");
        const navLinks = shadowRoot.querySelector("ul");

        menuButton.addEventListener("click", () => {
            navLinks.classList.toggle("show");
        });

        document.addEventListener("click", (event) => {
            if (!this.contains(event.target)) {
                navLinks.classList.toggle("show");
            }
        });

        const checkBox = shadowRoot.querySelector(".checkBox");

        if (localStorage.getItem("mode") === "dark") {
          checkBox.checked = true;
          document.body.classList.add("darkMode");
        }

        checkBox.addEventListener("change", (event) => {
          if (event.target.checked) {
            document.body.classList.add("darkMode");
            localStorage.setItem("mode", "dark");

          } else {
            document.body.classList.remove("darkMode");
            localStorage.setItem("mode", "light");

          }
        });

         
    }

}

customElements.define("nav-header", NavHeader);