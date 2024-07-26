import { View } from "./portfolio";
import { StateResponder } from "./state_responder";


export let g_routes : View[] = 
[
    "mammoth",
    "silverback",
    "wgpu",
    "chameleon",
    "pbr",
    "sandbox",
    "vulkanLights",
    "raytracer",
    "shmup",
    "bankingApp",
    "gamesList",
    "actixWeb"
];

export class Router extends StateResponder
{
    constructor() 
    {
        super();

        this.handleViewChange = this.handleViewChange.bind(this);
        this.onViewChange(this.handleViewChange);

        const contentWrapper = document.querySelector(".content_wrapper");

        if(!contentWrapper) 
        {
            throw new Error("Failed to find dom element with class list containing: content_wrapper");
        }

        this.contentWrapper = contentWrapper as HTMLElement;
        
        window.addEventListener("popstate", (event) => 
        {
            this.handleNavigation(event.state ? event.state.path : "home");
        });
    }

    public navigateTo(view : View) : void 
    {
        const path = `/${view}`;
        
        // Update the URL and push the state to the history stack
        history.pushState({ path: view }, "", path);

        // Handle the navigation to show the correct content
        this.handleNavigation(view);
    }

    public handleNavigation(view : View) : void 
    {
        // Hide all sections
        document.querySelectorAll(".content_section").forEach((section) => 
        {
            section.classList.remove("active");            
        });

        // Show the target section
        const targetSection = document.getElementById(view);
        
        if(targetSection) 
        {
            targetSection.classList.add("active");       
        } 
        else 
        {
            let home = document.getElementById("home");

            if(!home) 
            {
                throw new Error("Failed to find dom element with id: home");
            }

            home.classList.add("active");
        }
    }

    private handleViewChange(view : View) : void 
    {
        this.navigateTo(view);
    }

    private contentWrapper : HTMLElement;
}