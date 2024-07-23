import { Experience } from "../testbed/experience";
import { Frontend } from "../testbed/frontend/frontend";
import { Resources } from "../testbed/resources";

window.addEventListener("DOMContentLoaded", () => 
{
    const frontend = new Frontend();
    const experience = new Experience();
    const resources = Resources.GetInstance();

    resources.LoadAllAssets(() => 
    {
        experience.init();
        experience.run();
    });
});