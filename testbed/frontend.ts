import header_html from "./html/header.html?raw";
import home_html from "./html/home.html?raw";
import { View } from "./portfolio";
import { Project, ProjectProps, projects } from "./project";
import { Router } from "./router";
import { StateResponder } from "./state_responder";


export class Frontend extends StateResponder
{
    constructor() 
    {
        super();

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



        const home_button = document.querySelector("#home_button");

        if(!home_button) 
        {
            throw new Error("Failed to find dom element with id: home_button");
        }

        home_button.addEventListener("click", () => 
        {
            router.navigateTo("home");
        });

        // Navigate to home on instantation.
        router.navigateTo("home");
    } 

    private handleViewChange(view : View) : void 
    {
        switch(view) 
        {
            case "home": this.setForHome(); break;
            case "about": this.setForAbout(); break;
            default: this.setForProject(); break;
        }
    }

    private setForHome() : void 
    {
        this.body.style.overflowX = "hidden";
        this.body.style.overflowY = "hidden";
    }   

    private setForAbout() : void 
    {
        this.body.style.overflowX = "hidden";
        this.body.style.overflowY = "hidden";
    }

    private setForProject() : void 
    {
        this.body.style.overflowX = "hidden";
        this.body.style.overflowY = "visible";
    }


    private body !: HTMLElement;
};