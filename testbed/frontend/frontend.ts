import header_html from "./header.html?raw";
import home_html from "./home.html?raw";
import mammoth_html from "./mammoth.html?raw";

import { Router } from "./router";


type Routes = 
    "home"
    | "mammoth"
    | "WGPU"
    | "silverback"
    | "chameleon"
    | "PBR"
    | "sandbox"
    | "vulkan"
    | "raytracer"
    | "shmup"
    | "bankingApp"
    | "gamesList"
    | "actixWeb";


export class Frontend 
{
    constructor() 
    {

        // Dynamically inserting relevant HTML to make the index.html more clean.
        //
        const header = document.querySelector(".header_wrapper");

        if(!header) 
        {
            throw new Error("Failed to find dom element with class list containing: header");
        }

        header.innerHTML = header_html;

        const home = document.querySelector(".home_wrapper");

        if(!home) 
        {
            throw new Error("Failed to find dom element with class list containing: home_wrapper");
        }

        home.innerHTML = home_html;

        const mammoth = document.querySelector(".project_mammoth_wrapper");

        if(!mammoth) 
        {
            throw new Error("Failed to find dom element with class list containing: mammoth_wrapper");
        }

        mammoth.innerHTML = mammoth_html;





        
        this.router = new Router();




        const home_button = document.querySelector("#home_button");

        if(!home_button) 
        {
            throw new Error("Failed to find dom element with id: home_button");
        }

        const project_button = document.querySelector("#project_button");

        if(!project_button) 
        {
            throw new Error("Failed to find dom element with id: project_button");
        }

        home_button.addEventListener("click", () => 
        {
            this.router.navigateTo("home");
        });

        project_button.addEventListener("click", () => 
        {
            this.router.navigateTo("project_mammoth");
        })


    }

    private router !: Router
};