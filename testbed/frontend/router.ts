import gsap from "gsap";


export class Router 
{
    constructor() 
    {
        const contentWrapper = document.querySelector(".content_wrapper");

        if(!contentWrapper) 
        {
            throw new Error("Failed to find dom element with class list containing: content_wrapper");
        }

        this.contentWrapper = contentWrapper as HTMLElement;
        

        this.handleNavigation("home");
        
        window.addEventListener("popstate", (event) => 
        {
            this.handleNavigation(event.state ? event.state.path : "home");
        });
    }

    public navigateTo(section : string) : void 
    {
        const path = `/${section}`;
        
        // Update the URL and push the state to the history stack
        history.pushState({ path: section }, "", path);

        // Handle the navigation to show the correct content
        this.handleNavigation(section);
    }

    public handleNavigation(path : string) : void 
    {
        // Hide all sections
        document.querySelectorAll(".content_section").forEach((section) => 
        {
            section.classList.remove("active");            
        });

        // Show the target section
        const targetSection = document.getElementById(path);

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

    private contentWrapper : HTMLElement;
}