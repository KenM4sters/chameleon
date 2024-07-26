import * as cml from "../src/chameleon"
import * as glm from "gl-matrix"

import { Scene } from "./scene";
import { ProjectID, Renderer } from "./renderer";
import { BackgroundMesh, ProjectMesh } from "./mesh";
import { Resources } from "./resources";
import { Primitives } from "./primitives";
import { g_routes } from "./router";
import { View } from "./portfolio";
import { StateResponder } from "./state_responder";




export class Experience extends StateResponder
{
    constructor() 
    {
        super();
        this.intersectedProject = null;
        this.selectedProject = null;

        this.handleViewChange = this.handleViewChange.bind(this);
        this.onViewChange(this.handleViewChange);
    } 

    public create() : void 
    { 
        // Canvas, mouse and time uniforms (maybe all of these should be part of the framework?).
        //
        this.canvas = document.getElementById("webgl") as HTMLCanvasElement;
        this.canvas.width = window.innerWidth;       
        this.canvas.height = window.innerHeight;


        // Init.
        //
        let settings : cml.GraphicsSettings = 
        {
            canvas: this.canvas,
            name: "demo",
            backend: cml.GraphicsBackend.WebGL,
            pixelViewportWidth: this.canvas.width,
            pixelViewportHeight: this.canvas.height
        }

        cml.init(settings);



        // Members
        //
        this.primitves = Primitives.getInstance();
        this.primitves.create();
        
        this.scene = new Scene();
        this.scene.create();
        
        

        // Common uniforms
        //
        this.currentMousePosition = glm.vec2.create();
        this.uCanvasDimensions = cml.createUniformResource({type: "Vec2f", name: "u_canvasDimensions", data: new Float32Array([this.canvas.width, this.canvas.height]), writeFrequency: cml.WriteFrequency.Dynamic, accessType: cml.ResourceAccessType.PerMaterial});
        this.uTime = cml.createUniformResource({type: "Float", name: "u_time", data: performance.now(), writeFrequency: cml.WriteFrequency.Dynamic, accessType: cml.ResourceAccessType.PerFrame});
        this.uMousePosition = cml.createUniformResource({type: "Vec2f", name: "u_mousePosition", data: new Float32Array(this.currentMousePosition), writeFrequency: cml.WriteFrequency.Dynamic, accessType: cml.ResourceAccessType.PerFrame});
        



        this.renderer = new Renderer();
        this.renderer.create(this.uCanvasDimensions, this.uMousePosition);

        // View Frustum (maybe all of these should be part of the framework?).
        //
        let camera = new cml.PerspectiveCamera([-10.0, 0.5, 8.0]);
        camera.target = [0.0, 0.0, 3.0];
        let uProjection = cml.createUniformResource({type: "Mat4x4f", data: new Float32Array(camera.GetProjectionMatrix(1.0, 1.0)), name: "u_projection", writeFrequency: cml.WriteFrequency.Dynamic, accessType: cml.ResourceAccessType.PerFrame});
        let uView = cml.createUniformResource({type: "Mat4x4f", data: new Float32Array(camera.GetViewMatrix()), name: "u_view", writeFrequency: cml.WriteFrequency.Dynamic, accessType: cml.ResourceAccessType.PerFrame});


        // Projects
        //
        let projectMeshes : {translation : glm.vec3, scale : glm.vec3, id : ProjectID, label : string}[] = 
        [
            {translation: [0.0, 0.0, 0.0], scale: [0.8, 0.8, 0.04], id: ProjectID.mammoth, label: "mammoth"},
            {translation: [0.0, 0.0, 0.6], scale: [0.8, 0.8, 0.04], id: ProjectID.silverback, label: "mammoth"},
            {translation: [0.0, 0.0, 1.2], scale: [0.8, 0.8, 0.04], id: ProjectID.wgpu, label: "mammoth"},
            {translation: [0.0, 0.0, 1.8], scale: [0.8, 0.8, 0.04], id: ProjectID.chameleon, label: "chameleon_marbles"},
            {translation: [0.0, 0.0, 2.4], scale: [0.8, 0.8, 0.04], id: ProjectID.pbr, label: "pbr_metal"},
            {translation: [0.0, 1.0, 3.0], scale: [0.8, 0.8, 0.04], id: ProjectID.sandbox, label: "sandbox"},
            {translation: [0.0, 0.0, 3.6], scale: [0.8, 0.8, 0.04], id: ProjectID.vulkanLights, label: "vulkan_lights"},
            {translation: [0.0, 0.0, 4.2], scale: [0.8, 0.8, 0.04], id: ProjectID.raytracer, label: "raytracer"},
            {translation: [0.0, 0.0, 4.8], scale: [0.8, 0.8, 0.04], id: ProjectID.shmup, label: "shmup"},
            {translation: [0.0, 0.0, 5.4], scale: [0.8, 0.8, 0.04], id: ProjectID.bankingApp, label: "mammoth"},
            {translation: [0.0, 0.0, 6.0], scale: [0.8, 0.8, 0.04], id: ProjectID.gamesList, label: "games_list"},
            {translation: [0.0, 0.0, 6.6], scale: [0.8, 0.8, 0.04], id: ProjectID.actixWeb, label: "mammoth"}
        ];

        projectMeshes.forEach((project) => 
        {
            let mesh = new ProjectMesh();

            let resources = Resources.GetInstance();
            let img = resources.GetTexture(project.label);

            if(!img) 
            {
                throw new Error(`Failed to create mesh - no matching texture with name, ${project.label}`);
            }
        
            mesh.create(project.id, project.label, img, uProjection, uView, project.translation, project.scale);

            this.scene.addMesh(mesh);
        });

        
        // Background
        //
        this.background = new BackgroundMesh();
        this.background.create(this.uCanvasDimensions, this.uMousePosition);
        

        // Listeners
        //
        window.addEventListener("wheel", (e : WheelEvent) => this.respondToScroll(e));
        window.addEventListener("mousemove", (e : MouseEvent) => this.respondToMouseMove(e));
        window.addEventListener("click", (e : MouseEvent) => this.respondToMouseClick(e));
        window.addEventListener("close", () => {});
    }

    public run() : void 
    {
        window.requestAnimationFrame(() => 
        {
            this.uTime.update(performance.now() * 0.0005);

            if(this.getCurrentView() == "home") 
            {
                this.renderer.render(this.scene, this.background);
            } 
            else 
            {
                this.renderer.renderBackgroundOnly(this.background);
            }

            this.run();
        });  
    }

    private respondToMouseMove(e : MouseEvent) : void
    {
        if(this.getCurrentView()== "home") 
        {
            let yPos = ((e.clientY - window.innerHeight) * -1) / window.innerHeight;
            let xPos = e.clientX / window.innerWidth;
            this.currentMousePosition = [xPos, yPos];  
            this.uMousePosition.update(new Float32Array(this.currentMousePosition));
    
            const rect = this.canvas.getBoundingClientRect();
            const mouseX = e.clientX - rect.left;
            const mouseY = e.clientY - rect.top;
    
            if(window.location.pathname == "/home") 
            {
                this.checkMouseProjectIntersection([mouseX, mouseY]);
            }
        }
    }

    private respondToMouseClick(e : MouseEvent) : void 
    {
        if(this.getCurrentView()== "home") 
        {
            if(this.intersectedProject != null) 
            {
                this.selectedProject = this.intersectedProject;
                
                const selectedMesh = this.scene.getMesh(this.selectedProject);
                
                if(selectedMesh.position[2] <= 3.1 && selectedMesh.position[2] >= 2.9) 
                {
                    this.triggerViewChange(g_routes[this.intersectedProject]);

                    this.intersectedProject = null;
                } 
                else 
                {
                    const difference = 3.0 - selectedMesh.position[2];
    
                    this.scene.traverse((mesh : ProjectMesh) => 
                    {
                        mesh.position[2] += difference;
                        mesh.modelMatrix = glm.mat4.create();
                        glm.mat4.translate(mesh.modelMatrix, mesh.modelMatrix, mesh.position);
                        glm.mat4.scale(mesh.modelMatrix, mesh.modelMatrix, mesh.scale);
    
                        mesh.uModelMatrix.update(new Float32Array(mesh.modelMatrix));
                    });
                }
            } 
        }
    }

    private respondToScroll(e: WheelEvent) : void
    {
        if(this.getCurrentView()== "home") 
        {            
            this.scene.traverse((mesh : ProjectMesh) => 
            {
                glm.vec3.add(mesh.position, mesh.position, [0, 0, e.deltaY * 0.002]);
    
                if(mesh.position[2] < 3.2 && mesh.position[2] > 2.8) 
                {
                    mesh.position[1] = Math.max(Math.sin(mesh.position[2]) * 4.0, 0.0);
                } else 
                {
                    if(mesh.position[1] > 0.0) 
                    {
                        mesh.position[1] -= 0.01;
                    }
                }
    
                mesh.modelMatrix = glm.mat4.create();
                glm.mat4.translate(mesh.modelMatrix, mesh.modelMatrix, mesh.position);
                glm.mat4.scale(mesh.modelMatrix, mesh.modelMatrix, mesh.scale);
    
                mesh.uModelMatrix.update(new Float32Array(mesh.modelMatrix));
            });
        }
    }


    private checkMouseProjectIntersection(mousePosition : glm.vec2) : void 
    {
        const pixel = new Float32Array(4);

        this.renderer.sceneBuffer.readPixels(cml.Attachment.Color1, mousePosition[0], this.canvas.height - mousePosition[1], 1, 1, cml.Format.RGBA, cml.ValueType.Float, pixel);
        
        const app = document.getElementById("app") as HTMLElement;

        if(pixel[0] < ProjectID.count) 
        {
            app.style.cursor = "pointer";

            this.scene.traverse((mesh : ProjectMesh) => 
            {
                if(mesh.id == pixel[0]) 
                {
                    this.intersectedProject = mesh.id;
                }
            });
        }
        else 
        {
            app.style.cursor = "default";
            this.intersectedProject = null;
        }
    }

    private handleViewChange(view : View) : void 
    {
    }

    private scene !: Scene;
    private renderer !: Renderer;
    private primitves !: Primitives;
    private background !: BackgroundMesh;

    private currentMousePosition !: glm.vec2;

    private canvas !: HTMLCanvasElement;
    private uTime !: cml.UniformResource;
    private uMousePosition !: cml.UniformResource;
    private uCanvasDimensions !: cml.UniformResource;
    private intersectedProject : ProjectID | null;
    private selectedProject : ProjectID | null;
};
