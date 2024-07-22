import { Experience } from "../testbed/experience";
import { Frontend } from "../testbed/frontend";

window.addEventListener("DOMContentLoaded", () => 
{
    const frontend = new Frontend();
    const experience = new Experience();
    
    experience.init();
});