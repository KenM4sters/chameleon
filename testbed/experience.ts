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
        
        let camera = new cml.PerspectiveCamera([0.0, 4.0, 20.0]);
        camera.target = [0.0, 0.0, 0.0];
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
        window.addEventListener("mousemove", (e : MouseEvent) => this.respondToMouseMove(e.clientX, e.clientY));
        window.addEventListener("click", (e : MouseEvent) => this.respondToMouseClick(e));
        window.addEventListener("close", () => {});

        this.respondToMouseMove(0, 0);
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

    private respondToMouseMove(pos_x: number, pos_y: number) : void
    {
        let yPos = ((pos_y - this.canvas.height) * -1) / this.canvas.height;
        let xPos = pos_x / this.canvas.width;
        this.currentMousePosition = [xPos, yPos];  
        this.uMousePosition.update(new Float32Array(this.currentMousePosition));
        
        const rect = this.canvas.getBoundingClientRect();
        const mouseX = pos_x - rect.left;
        const mouseY = pos_y - rect.top;
        
        if(this.getCurrentView() == "home") 
        {
            this.checkMouseProjectIntersection([mouseX, mouseY]);
        }   

        let clip_space_mouse_position = glm.vec2.create();

        clip_space_mouse_position[0] = xPos * 2 - 1;
        clip_space_mouse_position[1] = yPos * 2 - 1;
        
        let clip_pos = glm.vec4.fromValues(clip_space_mouse_position[0], clip_space_mouse_position[1], 0.99, 1.0);

        let inverse_projection = glm.mat4.invert(glm.mat4.create(), this.camera.perspectiveCamera.GetProjectionMatrix(1.0, 1.0));

        let view_space = glm.vec4.transformMat4(glm.vec4.create(), clip_pos, inverse_projection);

        let inverse_view = glm.mat4.invert(glm.mat4.create(), this.camera.perspectiveCamera.GetViewMatrix());

        let model_space = glm.vec4.transformMat4(glm.vec4.create(), view_space, inverse_view);

        glm.vec4.scale(model_space, model_space, 1 / model_space[3]);

        this.projectsList.traverse((project) => {

            const project_dir = glm.vec3.subtract(glm.vec3.create(), project.position, glm.vec3.fromValues(model_space[0], model_space[1], model_space[2]));

            if(glm.vec3.length(project_dir) < 8.5) 
            {
                let target_mouse_matrix = glm.mat4.targetTo(
                    glm.mat4.create(), 
                    project.position, 
                    glm.vec3.fromValues(model_space[0], model_space[1], -4.0), 
                    glm.vec3.fromValues(0, 1, 0)
                );
    
                project.modelMatrix = glm.mat4.create();
                // glm.mat4.multiply(project.modelMatrix, project.modelMatrix, target_mouse_matrix);
                glm.mat4.translate(project.modelMatrix, project.modelMatrix, project.position);
                glm.mat4.scale(project.modelMatrix, project.modelMatrix, project.scale);
                project.uModelMatrix.update(new Float32Array(project.modelMatrix));
            } else {
                project.modelMatrix = glm.mat4.create();
                glm.mat4.translate(project.modelMatrix, project.modelMatrix, project.position);
                glm.mat4.scale(project.modelMatrix, project.modelMatrix, project.scale);
                project.uModelMatrix.update(new Float32Array(project.modelMatrix));
            }

        })
    }  

    private respondToMouseClick(e : MouseEvent) : void 
    {
        if(this.getCurrentView() == "home") 
        {
            if(this.intersectedProject != null) 
            {
                this.selectedProject = this.intersectedProject;
                
                const selectedMesh = this.projectsList.getMesh(this.selectedProject);   
                 
                this.triggerViewChange(g_routes[this.intersectedProject]);

                this.intersectedProject = null;
            } 
        }
    }

    private respondToScroll(e: WheelEvent) : void
    {
        if(this.getCurrentView() == "home") 
        {            
            this.projectsList.update(e);
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
                    mesh.isIntersected = 1;
                    mesh.uIsIntersected.update(mesh.isIntersected);
                } 
                else 
                {
                    mesh.isIntersected = 0;
                    mesh.uIsIntersected.update(mesh.isIntersected);
                }
            });            
        }
        else 
        {
            app.style.cursor = "default";
            this.intersectedProject = null;

            this.projectsList.traverse((mesh : ProjectMesh) => {
                mesh.isIntersected = 0;
                mesh.uIsIntersected.update(mesh.isIntersected);
            });  
        }
    }

    private respondToWindowResize() : void 
    {
        const new_width = window.innerWidth;
        const new_height = window.innerHeight;

        this.canvas.width = new_width;
        this.canvas.height = new_height;

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
