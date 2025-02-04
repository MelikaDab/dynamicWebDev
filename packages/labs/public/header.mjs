import { toHtmlElement } from "./toHtmlElement.mjs";
import './tokens.css';

const header = toHtmlElement(`
    <nav>
        <h1 id="melikas-lodge">Melika's Lodge</h1>
        <ul>
          <li id="home"><a href="/">Home</a></li>
          <li id="projects"><a href="/projects.html">Projects</a></li>
          <li id="hobbies"><a href="/hobbies.html">Hobbies</a></li>
        </ul>       
    </nav>`);

    window.addEventListener("load", () => {
    document.body.prepend(header);
    const currentPage = window.location.pathname;
    // console.log(currentPage);

    document.querySelectorAll("nav a").forEach(link => {
        if (link.getAttribute("href") === currentPage) {
            link.classList.add("activeLink");
        }
    })

    
});

