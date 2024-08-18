import { Experience } from "./experience";
import { Frontend } from "./frontend";
import { Resources } from "./resources";
import { Router } from "./router";

import preloader_html from "./html/preloader.html?raw";

export type View = 
    "home"
    | "about"
    | "mammoth"
    | "silverback"
    | "wgpu"
    | "chameleon"
    | "pbr"
    | "sandbox"
    | "vulkanLights"
    | "raytracer"
    | "shmup"
    | "bankingApp"
    | "gamesList"
    | "actixWeb"
    | "gravitySimulator"
    | "primeNumbers";



export class Portfolio  
{
    constructor() 
    {
        const router = new Router();
        
        const experience = new Experience();        

        const resources = Resources.GetInstance();

        const header = document.querySelector(".header_wrapper");

        if(!header) 
        {
            throw new Error("Failed to find header element");
        }

        header.innerHTML = "";

        const home = document.getElementById("home");

        if(!home) 
        {
            throw new Error("Failed to find home element");
        }

        home.innerHTML = preloader_html;                
    
        resources.LoadAllAssets(() => 
        {
            console.log('ready');
            
            const frontend = new Frontend();
            frontend.create(router);
            
            experience.create();
            experience.run();
        });
    }
}