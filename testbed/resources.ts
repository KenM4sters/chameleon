


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
        name: "mammoth_1",
        type: "LDR",
        path: "/chameleon/images/mammoth/mammoth_1.png"
    },
    {
        name : "mammoth_2",
        type: "LDR",
        path: "/chameleon/images/mammoth/mammoth_2.png"
    },
    {
        name : "mammoth_3",
        type: "LDR",
        path: "/chameleon/images/mammoth/mammoth_3.png"
    },
    {
        name : "mammoth_4",
        type: "LDR",
        path: "/chameleon/images/mammoth/mammoth_4.png"
    },
    {
        name : "mammoth_5",
        type: "LDR",
        path: "/chameleon/images/mammoth/mammoth_5.png"
    },
    {
        name : "mammoth_6",
        type: "LDR",
        path: "/chameleon/images/mammoth/mammoth_6.png"
    },
    {
        name : "silverback_1",
        type: "LDR",
        path: "/chameleon/images/silverback/silverback_1.png"
    },
    {
        name : "silverback_2",
        type: "LDR",
        path: "/chameleon/images/silverback/silverback_2.png"
    },
    {
        name : "silverback_3",
        type: "LDR",
        path: "/chameleon/images/silverback/silverback_3.png"
    },
    {
        name : "silverback_4",
        type: "LDR",
        path: "/chameleon/images/silverback/silverback_4.png"
    },
    {
        name : "silverback_5",
        type: "LDR",
        path: "/chameleon/images/silverback/silverback_5.png"
    },
    {
        name : "silverback_6",
        type: "LDR",
        path: "/chameleon/images/silverback/silverback_6.png"
    },
    {
        name : "wgpu_1",
        type: "LDR",
        path: "/chameleon/images/wgpu/wgpu_1.png"
    },
    {
        name : "wgpu_2",
        type: "LDR",
        path: "/chameleon/images/wgpu/wgpu_2.png"
    },
    {
        name : "wgpu_3",
        type: "LDR",
        path: "/chameleon/images/wgpu/wgpu_3.png"
    },
    {
        name : "wgpu_4",
        type: "LDR",
        path: "/chameleon/images/wgpu/wgpu_4.png"
    },
    {
        name : "wgpu_5",
        type: "LDR",
        path: "/chameleon/images/wgpu/wgpu_5.png"
    },
    {
        name : "wgpu_6",
        type: "LDR",
        path: "/chameleon/images/wgpu/wgpu_6.png"
    },
    {
        name : "chameleon_1",
        type: "LDR",
        path: "/chameleon/images/chameleon/chameleon_1.png"
    },
    {
        name : "chameleon_2",
        type: "LDR",
        path: "/chameleon/images/chameleon/chameleon_2.png"
    },
    {
        name : "chameleon_3",
        type: "LDR",
        path: "/chameleon/images/chameleon/chameleon_3.png"
    },
    {
        name : "chameleon_4",
        type: "LDR",
        path: "/chameleon/images/chameleon/chameleon_4.png"
    },
    {
        name : "chameleon_5",
        type: "LDR",
        path: "/chameleon/images/chameleon/chameleon_5.png"
    },
    {
        name : "chameleon_6",
        type: "LDR",
        path: "/chameleon/images/chameleon/chameleon_6.png"
    },
    {
        name : "pbr_1",
        type: "LDR",
        path: "/chameleon/images/pbr/pbr_1.png"
    },
    {
        name : "pbr_2",
        type: "LDR",
        path: "/chameleon/images/pbr/pbr_2.png"
    },
    {
        name : "pbr_3",
        type: "LDR",
        path: "/chameleon/images/pbr/pbr_3.png"
    },
    {
        name : "pbr_4",
        type: "LDR",
        path: "/chameleon/images/pbr/pbr_4.png"
    },
    {
        name : "pbr_5",
        type: "LDR",
        path: "/chameleon/images/pbr/pbr_5.png"
    },
    {
        name : "pbr_6",
        type: "LDR",
        path: "/chameleon/images/pbr/pbr_6.png"
    },
    {
        name : "sandbox_1",
        type: "LDR",
        path: "/chameleon/images/sandbox/sandbox_1.png"
    },
    {
        name : "sandbox_2",
        type: "LDR",
        path: "/chameleon/images/sandbox/sandbox_2.png"
    },
    {
        name : "sandbox_3",
        type: "LDR",
        path: "/chameleon/images/sandbox/sandbox_3.png"
    },
    {
        name : "sandbox_4",
        type: "LDR",
        path: "/chameleon/images/sandbox/sandbox_4.png"
    },
    {
        name : "sandbox_5",
        type: "LDR",
        path: "/chameleon/images/sandbox/sandbox_5.png"
    },
    {
        name : "sandbox_6",
        type: "LDR",
        path: "/chameleon/images/sandbox/sandbox_6.png"
    },
    {
        name : "vulkan_lights_1",
        type: "LDR",
        path: "/chameleon/images/vulkan_lights/vulkan_lights_1.png"
    },
    {
        name : "vulkan_lights_2",
        type: "LDR",
        path: "/chameleon/images/vulkan_lights/vulkan_lights_2.png"
    },
    {
        name : "vulkan_lights_3",
        type: "LDR",
        path: "/chameleon/images/vulkan_lights/vulkan_lights_3.png"
    },
    {
        name : "vulkan_lights_4",
        type: "LDR",
        path: "/chameleon/images/vulkan_lights/vulkan_lights_4.png"
    },
    {
        name : "vulkan_lights_5",
        type: "LDR",
        path: "/chameleon/images/vulkan_lights/vulkan_lights_5.png"
    },
    {
        name : "vulkan_lights_6",
        type: "LDR",
        path: "/chameleon/images/vulkan_lights/vulkan_lights_6.png"
    },
    {
        name : "raytracer_1",
        type: "LDR",
        path: "/chameleon/images/raytracer/raytracer_1.png"
    },
    {
        name : "raytracer_2",
        type: "LDR",
        path: "/chameleon/images/raytracer/raytracer_2.png"
    },
    {
        name : "raytracer_3",
        type: "LDR",
        path: "/chameleon/images/raytracer/raytracer_3.png"
    },
    {
        name : "raytracer_4",
        type: "LDR",
        path: "/chameleon/images/raytracer/raytracer_4.png"
    },
    {
        name : "raytracer_5",
        type: "LDR",
        path: "/chameleon/images/raytracer/raytracer_5.png"
    },
    {
        name : "raytracer_6",
        type: "LDR",
        path: "/chameleon/images/raytracer/raytracer_6.png"
    },
    {
        name : "shmup_1",
        type: "LDR",
        path: "/chameleon/images/shmup/shmup_1.png"
    },
    {
        name : "shmup_2",
        type: "LDR",
        path: "/chameleon/images/shmup/shmup_2.png"
    },
    {
        name : "shmup_3",
        type: "LDR",
        path: "/chameleon/images/shmup/shmup_3.png"
    },
    {
        name : "shmup_4",
        type: "LDR",
        path: "/chameleon/images/shmup/shmup_4.png"
    },
    {
        name : "shmup_5",
        type: "LDR",
        path: "/chameleon/images/shmup/shmup_5.png"
    },
    {
        name : "shmup_6",
        type: "LDR",
        path: "/chameleon/images/shmup/shmup_6.png"
    },
    {
        name : "banking_app_1",
        type: "LDR",
        path: "/chameleon/images/banking_app/banking_app_1.png"
    },
    {
        name : "banking_app_2",
        type: "LDR",
        path: "/chameleon/images/banking_app/banking_app_2.png"
    },
    {
        name : "banking_app_3",
        type: "LDR",
        path: "/chameleon/images/banking_app/banking_app_3.png"
    },
    {
        name : "banking_app_4",
        type: "LDR",
        path: "/chameleon/images/banking_app/banking_app_4.png"
    },
    {
        name : "banking_app_5",
        type: "LDR",
        path: "/chameleon/images/banking_app/banking_app_5.png"
    },
    {
        name : "banking_app_6",
        type: "LDR",
        path: "/chameleon/images/banking_app/banking_app_6.png"
    },
    {
        name : "games_list_1",
        type: "LDR",
        path: "/chameleon/images/games_list/games_list_1.png"
    },
    {
        name : "games_list_2",
        type: "LDR",
        path: "/chameleon/images/games_list/games_list_2.png"
    },
    {
        name : "games_list_3",
        type: "LDR",
        path: "/chameleon/images/games_list/games_list_3.png"
    },
    {
        name : "games_list_4",
        type: "LDR",
        path: "/chameleon/images/games_list/games_list_4.png"
    },
    {
        name : "games_list_5",
        type: "LDR",
        path: "/chameleon/images/games_list/games_list_5.png"
    },
    {
        name : "games_list_6",
        type: "LDR",
        path: "/chameleon/images/games_list/games_list_6.png"
    },
    {
        name : "actix_web_1",
        type: "LDR",
        path: "/chameleon/images/actix_web/actix_web_1.png"
    },
    {
        name : "actix_web_2",
        type: "LDR",
        path: "/chameleon/images/actix_web/actix_web_2.png"
    },
    {
        name : "actix_web_3",
        type: "LDR",
        path: "/chameleon/images/actix_web/actix_web_3.png"
    },
    {
        name : "actix_web_4",
        type: "LDR",
        path: "/chameleon/images/actix_web/actix_web_4.png"
    },
    {
        name : "actix_web_5",
        type: "LDR",
        path: "/chameleon/images/actix_web/actix_web_5.png"
    },
    {
        name : "actix_web_6",
        type: "LDR",
        path: "/chameleon/images/actix_web/actix_web_6.png"
    },
    {
        name : "gravity_simulator_1",
        type: "LDR",
        path: "/chameleon/images/gravity_simulator/gravity_simulator_1.png"
    },
    {
        name : "prime_numbers_1",
        type: "LDR",
        path: "/chameleon/images/prime_numbers/prime_numbers_1.png"
    },
    {
        name : "background_1",
        type: "LDR",
        path: "/chameleon/images/background/water_normals.jpg"
    },
]
    