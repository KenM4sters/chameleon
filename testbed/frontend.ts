import header_html from "./header.html?raw";

export class Frontend 
{
    constructor() 
    {
        const app = document.querySelector("#app") as HTMLElement;

        const headerWrapper = document.createElement("div");
        headerWrapper.classList.add("header_wrapper");
        headerWrapper.innerHTML = header_html;

        app.appendChild(headerWrapper);
    }
};