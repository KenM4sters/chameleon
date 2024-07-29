import * as cml from "../src/chameleon"
import * as glm from "gl-matrix"

import { ProjectID, Renderer } from "./renderer";
import { g_routes } from "./router";
import { View } from "./portfolio";
import { StateResponder } from "./state_responder";
import { ProjectMesh, ProjectsList } from "./projects_list";
import { Background } from "./background";


export interface Camera 
{
    perspectiveCamera : cml.PerspectiveCamera;
    uProjection : cml.UniformResource;
    uView : cml.UniformResource;
};

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



        // Common uniforms
        //
        this.currentMousePosition = glm.vec2.create();
        this.uCanvasDimensions = cml.createUniformResource({type: "Vec2f", name: "u_canvasDimensions", data: new Float32Array([this.canvas.width, this.canvas.height]), writeFrequency: cml.WriteFrequency.Dynamic, accessType: cml.ResourceAccessType.PerMaterial});
        this.uTime = cml.createUniformResource({type: "Float", name: "u_time", data: performance.now(), writeFrequency: cml.WriteFrequency.Dynamic, accessType: cml.ResourceAccessType.PerFrame});
        this.uMousePosition = cml.createUniformResource({type: "Vec2f", name: "u_mousePosition", data: new Float32Array(this.currentMousePosition), writeFrequency: cml.WriteFrequency.Dynamic, accessType: cml.ResourceAccessType.PerFrame});
        

        // View Frustum (maybe all of these should be part of the framework?).
        //
        
        let camera = new cml.PerspectiveCamera([-10.0, 0.5, 8.0]);
        camera.target = [0.0, 0.0, 3.0];
        let uProjection = cml.createUniformResource({type: "Mat4x4f", data: new Float32Array(camera.GetProjectionMatrix(1.0, 1.0)), name: "u_projection", writeFrequency: cml.WriteFrequency.Dynamic, accessType: cml.ResourceAccessType.PerFrame});
        let uView = cml.createUniformResource({type: "Mat4x4f", data: new Float32Array(camera.GetViewMatrix()), name: "u_view", writeFrequency: cml.WriteFrequency.Dynamic, accessType: cml.ResourceAccessType.PerFrame});

        this.camera = 
        {
            perspectiveCamera : camera,
            uProjection : uProjection,
            uView : uView
        };

        this.renderer = new Renderer();
        this.renderer.create(this.uCanvasDimensions, this.uMousePosition);


        this.projectsList = new ProjectsList();
        this.projectsList.create(uView, uProjection);


        this.background = new Background();
        this.background.create(this.uCanvasDimensions, this.uMousePosition);
        
        


        // Listeners
        //
        window.addEventListener("resize", () => this.respondToWindowResize());
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
                this.renderer.render(this.projectsList, this.background);
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
        let yPos = ((e.clientY - window.innerHeight) * -1) / window.innerHeight;
        let xPos = e.clientX / window.innerWidth;
        this.currentMousePosition = [xPos, yPos];  
        this.uMousePosition.update(new Float32Array(this.currentMousePosition));
        
        const rect = this.canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        
        if(this.getCurrentView() == "home") 
        {
            this.checkMouseProjectIntersection([mouseX, mouseY]);
        }
    }  

    private respondToMouseClick(e : MouseEvent) : void 
    {
        if(this.getCurrentView() == "home") 
        {
            if(this.intersectedProject != null) 
            {
                this.selectedProject = this.intersectedProject;
                
                const selectedMesh = this.projectsList.getMesh(this.selectedProject);
                
                
                if(selectedMesh.position[2] <= 3.1 && selectedMesh.position[2] >= 2.9) 
                {
                    this.triggerViewChange(g_routes[this.intersectedProject]);

                    this.intersectedProject = null;
                } 
                else 
                {
                    const difference = 3.0 - selectedMesh.position[2];
    
                    this.projectsList.traverse((mesh : ProjectMesh) => 
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
        if(this.getCurrentView() == "home") 
        {            
            this.projectsList.traverse((mesh : ProjectMesh) => 
            {
                glm.vec3.add(mesh.position, mesh.position, [0, 0, e.deltaY * 0.002]);
    
                if(mesh.position[2] < 3.2 && mesh.position[2] > 2.8) 
                {
                    mesh.position[1] = Math.max(Math.sin(mesh.position[2]) * 4.0, 0.0);
                } else 
                {
                    if(mesh.position[1] > 0.0) 
                    {
                        mesh.position[1] -= 0.05;
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


        // The texture containing the ids of each mesh is supersampled along with the
        // scene texture (for antialiazing purposes), so instead of wasting GPU computation time
        // and downscaling the texture, we'll just scale our mouse coordinates by the same factor.
        //
        const pos_x = mousePosition[0] * this.renderer.highResolutionFactor;
        
        
        const pos_y = (this.canvas.height - mousePosition[1]) * this.renderer.highResolutionFactor;


        this.renderer.sceneBuffer.readPixels(cml.Attachment.Color1, pos_x, pos_y, 1, 1, cml.Format.RGBA, cml.ValueType.Float, pixel);
        

        const app = document.getElementById("app") as HTMLElement;        


        if(pixel[0] < ProjectID.count) 
        {
            app.style.cursor = "pointer";

            this.projectsList.traverse((mesh : ProjectMesh) => 
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

    private respondToWindowResize() : void 
    {
        const new_width = window.innerWidth;
        const new_height = window.innerHeight;

        if(new_width != this.canvas.width || new_height != this.canvas.height) 
        {
            this.canvas.width = new_width;
            this.canvas.height = new_height;
        }

        this.uCanvasDimensions.update(new Float32Array([new_width, new_height]));

        cml.setViewport({pixelWidth: new_width, pixelHeight: new_height});

        this.renderer.resize(new_width, new_height);
        this.projectsList.resize(new_width, new_height);
    }

    private handleViewChange(view : View) : void 
    {
    }
    
    private currentMousePosition !: glm.vec2;
    private uTime !: cml.UniformResource;
    private uMousePosition !: cml.UniformResource;
    private uCanvasDimensions !: cml.UniformResource;

    private camera !: Camera;
    
    private canvas !: HTMLCanvasElement;
    private intersectedProject : ProjectID | null;
    private selectedProject : ProjectID | null;

    private projectsList !: ProjectsList;
    private renderer !: Renderer;
    private background !: Background;

};
