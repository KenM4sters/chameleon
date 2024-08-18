import header_html from "./html/header.html?raw";
import home_html from "./html/home.html?raw";
import about_html from "./html/about.html?raw";

import { View } from "./portfolio";
import { Project, ProjectProps, projects } from "./project";
import { Router } from "./router";
import { StateResponder } from "./state_responder";


export class Frontend extends StateResponder
{
    constructor() 
    {
        super();

        this.handleViewChange = this.handleViewChange.bind(this);
        this.onViewChange(this.handleViewChange);
    }

    public create(router : Router) : void 
    {
        // Dynamically inserting relevant HTML to make the index.html cleaner.
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

        const about = document.querySelector(".about_wrapper");
        if(!about) 
        {
            throw new Error("Failed to find dom element with class list containing: about_wrapper");
        }
        about.innerHTML = about_html;

        // Fills each project div with the appropriate content
        //
        projects.forEach((props : ProjectProps) => 
        {
            const project = new Project(props);

            const projectDiv = document.getElementById(props.divId);

            if(!projectDiv) 
            {
                throw new Error(`Failed to find project with projectDivId: ${props.divId}`);
            }

            projectDiv.innerHTML = project.html;
        })



        const homeLink = document.querySelector("#home_link") as HTMLElement | null;

        if(!homeLink) 
        {
            throw new Error("Failed to find dom element with id: home_link");
        }

        this.homeLink = homeLink;

        this.homeLink.addEventListener("click", () => 
        {
            this.triggerViewChange("home");
        });

        const aboutLink = document.querySelector("#about_link") as HTMLElement | null;

        if(!aboutLink) 
        {
            throw new Error("Failed to find dom element with id: about_link");
        }

        this.aboutLink = aboutLink;

        this.aboutLink.addEventListener("click", () => 
        {
            this.triggerViewChange("about");
        });

        this.app = document.querySelector("#app") as HTMLElement;



        window.addEventListener("wheel", () => {
            const elements = document.querySelectorAll(".scroll_trigger_fade_in");
            
            elements.forEach(element => 
            {
                const rect = element.getBoundingClientRect();
                const windowHeight = window.innerHeight || document.documentElement.clientHeight;
                
                // Check if the element is within the viewport
                if (rect.top <= windowHeight * 0.75 && rect.bottom >= 0) {
                    // Element is in the viewport, apply animation
                    if (!element.classList.contains('fade_in')) 
                    {
                        element.classList.add("fade_in");
                    }
                }
            })
        });
    } 

    private handleViewChange(view : View) : void 
    {

        const elements = document.querySelectorAll(".scroll_trigger_fade_in");
            
        elements.forEach(element => 
        {            
            if(element.classList.contains('fade_in')) 
            {
                element.classList.remove("fade_in");
            }
        })

        switch(view) 
        {
            case "home": this.setForHome(); break;
            case "about": this.setForAbout(); break;
            default: this.setForProject(); break;
        }
    }

    private setForHome() : void 
    {
        this.app.style.overflowX = "hidden";
        this.app.style.overflowY = "hidden";

        this.homeLink.classList.add("active");
        this.aboutLink.classList.remove("active");
        this.aboutLink.classList.remove("expanded");
    }   

    private setForAbout() : void 
    {
        this.app.style.overflowX = "hidden";
        this.app.style.overflowY = "hidden";
        this.app.style.cursor = "default";

        this.aboutLink.classList.add("active");
        this.homeLink.classList.remove("active");
    }

    private setForProject() : void 
    {
        this.app.style.overflowX = "hidden";
        this.app.style.overflowY = "visible";
        this.app.style.cursor = "default";

        this.app.classList.add("fade_white");

        this.aboutLink.classList.remove("active");
        this.aboutLink.classList.remove("expanded");
        this.homeLink.classList.remove("active");
    }


    private app !: HTMLElement;
    private homeLink !: HTMLElement;
    private aboutLink !: HTMLElement;
};