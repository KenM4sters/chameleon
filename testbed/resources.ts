


/**
 * @brief
 */
export class Resources 
{
    private constructor() 
    {
    }

    public LoadAllAssets(callback: () => void) : void 
    {
        for(const r of sources) 
        {
            if(r.type == "LDR") 
            {
                const img = new Image();
                img.src = r.path;  
                
                img.addEventListener("load", () => {
                    this.textures.set(r.name, img);
                    this.UpdateStatus(callback);
                })
            }
        }
    }

    private UpdateStatus(callback: () => void) : void 
    {
        this.status += 1;
        if(this.status == sources.length) 
        {
            callback();
        }
    }

    public GetTexture(name : string) : HTMLImageElement | undefined 
    {         
        return this.textures.get(name); 
    }

    public static GetInstance() : Resources 
    {
        if(!this.instance) 
        {
            this.instance = new Resources();
        }

        return this.instance;
    }

    private static instance : Resources;
    private textures : Map<string, HTMLImageElement> = new Map<string, HTMLImageElement>();
    private status : number = 0;
}



const sources : {name: string, type: string, path: string}[] = 
[
    {
        path: "testbed/images/mammoth.png",
        name: "mammoth",
        type: "LDR",
    },
    {
        path: "testbed/images/mammoth.png",
        name: "mammoth",
        type: "LDR",
    },
    {
        path: "testbed/images/mammoth.png",
        name: "mammoth",
        type: "LDR",
    },
    {
        path: "testbed/images/chameleon_marbles.png",
        name: "chameleon_marbles",
        type: "LDR",
    },
    {
        path: "testbed/images/pbr_metal.png",
        name: "pbr_metal",
        type: "LDR",
    },
    {
        path: "testbed/images/sandbox.png",
        name: "sandbox",
        type: "LDR",
    },
    {
        path: "testbed/images/vulkan_lights.png",
        name: "vulkan_lights",
        type: "LDR",
    },
    {
        path: "testbed/images/raytracer.png",
        name: "raytracer",
        type: "LDR",
    },
    {
        path: "testbed/images/shmup.png",
        name: "shmup",
        type: "LDR",
    },
    {
        path: "testbed/images/mammoth.png",
        name: "mammoth",
        type: "LDR",
    },
    {
        path: "testbed/images/games_list.png",
        name: "games_list",
        type: "LDR",
    },
    {
        path: "testbed/images/mammoth.png",
        name: "mammoth",
        type: "LDR",
    }
]
    