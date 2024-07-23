import * as cml from "../src/chameleon"
import * as glm from "gl-matrix"

import screen_quad_vert from "./shaders/screen_quad.vert?raw";
import background_frag from "./shaders/background.frag?raw";

import { BackgroundMesh, Scene } from "./scene";
import { ProjectID, Renderer } from "./renderer";
import { ProjectMesh } from "./project_mesh";
import { Resources } from "./resources";
import { Primitives } from "./primitives";
import { uint } from "three/examples/jsm/nodes/Nodes.js";


export class Experience 
{
    constructor() 
    {
    }

    public init() : void 
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

        window.addEventListener("wheel", (e : WheelEvent) => 
        {
            // camera.position[1] = window.scrollY * -0.1;
            // camera.target[1] = window.scrollY * -0.1;
            uView.update(new Float32Array(camera.GetViewMatrix()));
        });

        this.primitves = Primitives.getInstance();
        this.primitves.create();

        this.scene = new Scene();
        this.scene.create();

        this.renderer = new Renderer();
        this.renderer.create();


        let projectMeshes : {translation : glm.vec3, scale : glm.vec3, id : ProjectID, label : string}[] = 
        [
            {translation: [0.0, 0.0, 0.0], scale: [0.8, 0.8, 0.04], id: ProjectID.mammoth, label: "mammoth"},
            {translation: [0.0, 0.0, 0.5], scale: [0.8, 0.8, 0.04], id: ProjectID.silverback, label: "mammoth"},
            {translation: [0.0, 0.0, 1.0], scale: [0.8, 0.8, 0.04], id: ProjectID.wgpu, label: "mammoth"},
            {translation: [0.0, 0.0, 1.5], scale: [0.8, 0.8, 0.04], id: ProjectID.chameleon, label: "chameleon_marbles"},
            {translation: [0.0, 0.0, 2.0], scale: [0.8, 0.8, 0.04], id: ProjectID.pbr, label: "pbr_metal"},
            {translation: [0.0, 0.0, 2.5], scale: [0.8, 0.8, 0.04], id: ProjectID.sandbox, label: "sandbox"},
            {translation: [0.0, 0.0, 3.0], scale: [0.8, 0.8, 0.04], id: ProjectID.raytracer, label: "vulkan_lights"},
            {translation: [0.0, 0.0, 3.5], scale: [0.8, 0.8, 0.04], id: ProjectID.vulkanLights, label: "raytracer"},
            {translation: [0.0, 0.0, 4.0], scale: [0.8, 0.8, 0.04], id: ProjectID.shmup, label: "shmup"},
            {translation: [0.0, 0.0, 4.5], scale: [0.8, 0.8, 0.04], id: ProjectID.bankingApp, label: "mammoth"},
            {translation: [0.0, 0.0, 5.0], scale: [0.8, 0.8, 0.04], id: ProjectID.gamesList, label: "games_list"},
            {translation: [0.0, 0.0, 5.5], scale: [0.8, 0.8, 0.04], id: ProjectID.actixWeb, label: "mammoth"}
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

        this.background = new BackgroundMesh();

        // Background
        //
        let backgroundProgram = cml.createProgram({vertCode: screen_quad_vert, fragCode: background_frag});
        let background_vertexInput = this.primitves.fullScreenQuadInput;
        let background_modelMatrix = glm.mat4.create();
        glm.mat4.translate(background_modelMatrix, background_modelMatrix, [0, 0, 1.0]);
        let background_uModelMatrix = cml.createUniformResource({name: "u_model", type: "Mat4x4f", data: new Float32Array(background_modelMatrix), accessType: cml.ResourceAccessType.PerDrawCall, writeFrequency: cml.WriteFrequency.Dynamic});
        let background_shader = cml.createShader({program: backgroundProgram, resources: [background_uModelMatrix, this.uCanvasDimensions, this.uMousePosition], count: 3});

        this.background.create(backgroundProgram, background_vertexInput, background_modelMatrix, background_uModelMatrix, background_shader);
        

        window.addEventListener("mousemove", (e : MouseEvent) => 
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
                this.checkMouseProjectIntersection([mouseX * 2.0, mouseY * 2.0]);
            }
        });

        // Clean up.
        window.addEventListener("close", () => 
        {

        });
    }

    public run() : void 
    {
        window.requestAnimationFrame(() => 
        {
            this.uTime.update(performance.now() * 0.0005);
            
            this.renderer.render(this.scene, this.background);

            this.run();
        });  
    }

    private checkMouseProjectIntersection(mousePosition : glm.vec2) : void 
    {
        const pixel = new Float32Array(4);

        this.renderer.sceneBuffer.readPixels(cml.Attachment.Color1, mousePosition[0], mousePosition[1], 1, 1, cml.Format.RGBA, cml.ValueType.Float, pixel);
        
        const app = document.getElementById("app") as HTMLElement;

        if(pixel[0] < ProjectID.count) 
        {
            app.style.cursor = "pointer";

            this.scene.traverse((mesh : ProjectMesh) => 
            {
                if(mesh.id == pixel[0]) 
                {

                }
            });
        }
        else 
        {
            app.style.cursor = "default";
        }
    }

    private scene !: Scene;
    private renderer !: Renderer;
    private primitves !: Primitives;
    private background !: BackgroundMesh;

    private currentMousePosition !: glm.vec2;
    private previousMousePosition !: glm.vec2;

    private canvas !: HTMLCanvasElement;
    private uTime !: cml.UniformResource;
    private uMousePosition !: cml.UniformResource;
    private uCanvasDimensions !: cml.UniformResource;
};








// function buildCube(width : number, height : number, depth : number, widthSegments : number, heightSegments : number, depthSegments : number) : Float32Array
// {

// }

// function buildPlane(width : number, height : number, depth: number, widthSegments : number, heightSegments : number) : Float32Array {

//     const segmentWidth = width / widthSegments;
//     const segmentHeight = height / heightSegments;

//     const widthHalf = width / 2;
//     const heightHalf = height / 2;

//     let vertexCounter = 0;
//     let groupCount = 0;

//     const vector = glm.vec3.create();

//     // generate vertices, normals and uvs

//     for ( let iy = 0; iy < gridY1; iy ++ ) {

//         const y = iy * segmentHeight - heightHalf;

//         for ( let ix = 0; ix < gridX1; ix ++ ) {

//             const x = ix * segmentWidth - widthHalf;

//             // set values to correct vector component

//             vector[ u ] = x * udir;
//             vector[ v ] = y * vdir;
//             vector[ w ] = depthHalf;

//             // now apply vector to vertex buffer

//             vertices.push( vector.x, vector.y, vector.z );

//             // set values to correct vector component

//             vector[ u ] = 0;
//             vector[ v ] = 0;
//             vector[ w ] = depth > 0 ? 1 : - 1;

//             // now apply vector to normal buffer

//             normals.push( vector.x, vector.y, vector.z );

//             // uvs

//             uvs.push( ix / gridX );
//             uvs.push( 1 - ( iy / gridY ) );

//             // counters

//             vertexCounter += 1;

//         }

//     }

//     // indices

//     // 1. you need three indices to draw a single face
//     // 2. a single segment consists of two faces
//     // 3. so we need to generate six (2*3) indices per segment

//     for ( let iy = 0; iy < gridY; iy ++ ) {

//         for ( let ix = 0; ix < gridX; ix ++ ) {

//             const a = numberOfVertices + ix + gridX1 * iy;
//             const b = numberOfVertices + ix + gridX1 * ( iy + 1 );
//             const c = numberOfVertices + ( ix + 1 ) + gridX1 * ( iy + 1 );
//             const d = numberOfVertices + ( ix + 1 ) + gridX1 * iy;

//             // faces

//             indices.push( a, b, d );
//             indices.push( b, c, d );

//             // increase counter

//             groupCount += 6;

//         }

//     }

//     // add a group to the geometry. this will ensure multi material support

//     scope.addGroup( groupStart, groupCount, materialIndex );

//     // calculate new start value for groups

//     groupStart += groupCount;

//     // update total number of vertices

//     numberOfVertices += vertexCounter;

// };
