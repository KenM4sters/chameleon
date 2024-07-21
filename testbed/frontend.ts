import header_html from "./header.html?raw";
import landing_html from "./landing.html?raw";

export class Frontend 
{
    constructor() 
    {
        const app = document.querySelector("#app") as HTMLElement;

        const headerWrapper = document.createElement("div");
        headerWrapper.classList.add("header_wrapper");
        headerWrapper.innerHTML = header_html;

        const landingWrapper = document.createElement("div");
        landingWrapper.classList.add("landing_wrapper");
        landingWrapper.innerHTML = landing_html;

        app.appendChild(headerWrapper);
        app.appendChild(landingWrapper);
    }
};