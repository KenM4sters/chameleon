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
        app.appendChild(headerWrapper);

        const content = document.createElement("div");
        content.classList.add("landing_wrapper active");
        content.innerHTML = landing_html;

        app.appendChild(content);
    }
};