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
    "actixWeb",
    "gravitySimulator",
    "primeNumbers",
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
            this.triggerViewChange(event.state ? event.state.path : "home")
        });

        // Navigate to home on instantation.
        this.triggerViewChange("home");
    }

    public navigateTo(view : View) : void 
    {
        const path = `/chameleon/${view}`;
        
        // Update the URL and push the state to the history stack
        history.pushState({ path: view }, "", path);

        // Handle the navigation to show the correct content
        this.handleNavigation(view);
    }

    public handleNavigation(view : View) : void 
    {
        // Hide all sections
        let elements = document.querySelectorAll(".content_section");
        elements.forEach((section) => 
        {
            if(section.id != view) 
            {                                     
                section.classList.remove("fade_in");                                     
                section.classList.add("fade_out");                                     
                section.classList.remove("active");                                     
            }
        });


        // Show the target section
        const targetSection = document.getElementById(view);
        
        if(targetSection) 
        {
            targetSection.classList.add("active");       
            targetSection.classList.remove("fade_out");       
            targetSection.classList.add("fade_in");                  
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