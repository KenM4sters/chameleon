import { Experience } from "./experience";
import { Frontend } from "./frontend";
import { Resources } from "./resources";
import { Router } from "./router";


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
    | "actixWeb";



export class Portfolio  
{
    constructor() 
    {
        const router = new Router();

        const frontend = new Frontend();
        frontend.create(router);
        
        const experience = new Experience();        

        const resources = Resources.GetInstance();
    
        resources.LoadAllAssets(() => 
        {
            experience.create();
            experience.run();
        });
    }
}