import * as cml from "../src/chameleon"
import * as glm from "gl-matrix"

import screen_quad_vert from "./shaders/screen_quad.vert?raw";
import model_view_projection_vert from "./shaders/model_view_projection.vert?raw";
import color_frag from "./shaders/color.frag?raw";
import texture_frag from "./shaders/texture.frag?raw";
import background_frag from "./shaders/background.frag?raw";

export class Experience 
{
    constructor() 
    {

    }

    public init() : void 
    {

        // Canvas, mouse and time uniforms (maybe all of these should be part of the framework?).
        //
        let canvas = document.getElementById("webgl") as HTMLCanvasElement;
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        let mousePosition = glm.vec2.create();
        
        window.addEventListener("mousemove", (e : MouseEvent) => 
        {
            let yPos = ((e.clientY - window.innerHeight) * -1) / window.innerHeight;
            let xPos = e.clientX / window.innerWidth;
            mousePosition = [xPos, yPos];  
        });

        let uCanvasDimensions = cml.createUniformResource({type: "Vec2f", name: "u_canvasDimensions", data: new Float32Array([canvas.width, canvas.height]), writeFrequency: cml.WriteFrequency.Dynamic, accessType: cml.ResourceAccessType.PerMaterial});
        let uTime = cml.createUniformResource({type: "Float", name: "u_time", data: performance.now(), writeFrequency: cml.WriteFrequency.Dynamic, accessType: cml.ResourceAccessType.PerFrame});
        let uMousePosition = cml.createUniformResource({type: "Vec2f", name: "u_mousePosition", data: new Float32Array(mousePosition), writeFrequency: cml.WriteFrequency.Dynamic, accessType: cml.ResourceAccessType.PerFrame});


        // Init.
        //
        let settings : cml.GraphicsSettings = 
        {
            canvas: canvas,
            name: "demo",
            backend: cml.GraphicsBackend.WebGL,
            pixelViewportWidth: canvas.width,
            pixelViewportHeight: canvas.height
        }

        cml.init(settings);

        // View Frustum (maybe all of these should be part of the framework?).
        //
        let camera = new cml.PerspectiveCamera([0, 0.5, 2.4]);
        let uProjection = cml.createUniformResource({type: "Mat4x4f", data: new Float32Array(camera.GetProjectionMatrix(1.0, 1.0)), name: "u_projection", writeFrequency: cml.WriteFrequency.Dynamic, accessType: cml.ResourceAccessType.PerFrame});
        let uView = cml.createUniformResource({type: "Mat4x4f", data: new Float32Array(camera.GetViewMatrix()), name: "u_view", writeFrequency: cml.WriteFrequency.Dynamic, accessType: cml.ResourceAccessType.PerFrame});

        window.addEventListener("wheel", (e : WheelEvent) => 
        {
            camera.position[1] = window.scrollY * -0.01;
            camera.target[1] = window.scrollY * -0.01;
            uView.update(new Float32Array(camera.GetViewMatrix()));
        });


        // Common sampler (maybe this should be part of the framework?).
        //
        let sampler = cml.createSampler(
            {
                addressModeS: cml.SamplerAddressMode.ClampToEdge,
                addressModeT: cml.SamplerAddressMode.ClampToEdge,
                addressModeR: cml.SamplerAddressMode.ClampToEdge,
                minFilter: cml.SamplerFilterMode.Linear,
                magFilter: cml.SamplerFilterMode.Linear,
            }
        );


        // full screen quad input (generally used input for all squares with a model matrix).
        //
        let fullScreenQuadVBO = cml.createVertexBuffer({data: new Float32Array(screen_quad_vertices), byteSize: screen_quad_vertices.length * 4});
        let fullScreenQuadEBO = cml.createIndexBuffer({data: new Uint16Array(screen_quad_indices), byteSize: screen_quad_indices.length * 4});
        
        let fullScreenQuadLayout = new cml.VertexLayout(
            [
                new cml.VertexAttribute("Position", cml.ValueType.Float, 3),
                new cml.VertexAttribute("TexCoords", cml.ValueType.Float, 2),
            ], 
            2
        );

        let fullScreenQuadInput = cml.createVertexInput(
        {
            vBuffer: fullScreenQuadVBO,
            iBuffer: fullScreenQuadEBO,
            layout: fullScreenQuadLayout,
            verticesCount: screen_quad_indices.length
        });


        // Scene color buffer
        //
        let sceneColorTexture = cml.createTexture(
            {
                target: cml.TargetType.Texture2D,
                nMipMaps: 0,
                level: 0,
                internalFormat: cml.InternalFormat.RGBA32F,
                format: cml.Format.RGBA,
                type: cml.ValueType.Float,
                usage: cml.Usage.ReadWrite,
                sampler: sampler,
                width: window.innerWidth,
                height: window.innerHeight,
                data : null
            }
        );

        // Scene depth buffer
        //
        let sceneDepthTexture = cml.createTexture(
            {
                target: cml.TargetType.Texture2D,
                nMipMaps: 0,
                level: 0,
                internalFormat: cml.InternalFormat.Depth24Stencil8,
                format: cml.Format.DepthStencil,
                type: cml.ValueType.UInt24_8,
                usage: cml.Usage.ReadWrite,
                sampler: sampler,
                width: window.innerWidth,
                height: window.innerHeight,
                data : null
            }
        );
    
        let ssceneColorTexture = cml.createSamplerResource({name: "s_srcTexture", texture: sceneColorTexture, writeFrequency: cml.WriteFrequency.Dynamic, accessType: cml.ResourceAccessType.PerDrawCall});    


        let colorAttachment1 : cml.FrameBufferAttachment = 
        {
            texture: sceneColorTexture,
            attachment: cml.Attachment.Color0
        }

        let depthAttachment1 : cml.FrameBufferAttachment = 
        {
            texture: sceneDepthTexture,
            attachment: cml.Attachment.DepthStencil
        }

        let sceneBuffer = cml.createFrameBuffer({attachments: [colorAttachment1, depthAttachment1], count: 2});

        // Background
        //
        let backgroundProgram = cml.createProgram({vertCode: screen_quad_vert, fragCode: background_frag});
        let background_vertexInput = fullScreenQuadInput;
        let background_modelMatrix = glm.mat4.create();
        glm.mat4.translate(background_modelMatrix, background_modelMatrix, [0, 0, 1.0]);
        let background_uModelMatrix = cml.createUniformResource({name: "u_model", type: "Mat4x4f", data: new Float32Array(background_modelMatrix), accessType: cml.ResourceAccessType.PerDrawCall, writeFrequency: cml.WriteFrequency.Dynamic});
        let background_shader = cml.createShader({program: backgroundProgram, resources: [background_uModelMatrix, uCanvasDimensions], count: 2});


        // Display Quad
        //
        let displayQuadProgram = cml.createProgram({vertCode: screen_quad_vert, fragCode: texture_frag});
        let displayQuad_vertexInput = fullScreenQuadInput;
        let displayQuad_modelMatrix = glm.mat4.create();
        let displayQuad_uModelMatrix = cml.createUniformResource({name: "u_model", type: "Mat4x4f", data: new Float32Array(displayQuad_modelMatrix), accessType: cml.ResourceAccessType.PerDrawCall, writeFrequency: cml.WriteFrequency.Dynamic});
        let displayQuad_shader = cml.createShader({program: displayQuadProgram, resources: [displayQuad_uModelMatrix, ssceneColorTexture], count: 2});


        // Project cubes input
        //
        let projectCubeVBO = cml.createVertexBuffer({data: cube_vertices, byteSize: cube_vertices.byteLength});
        let projectCubeEBO = cml.createIndexBuffer({data: cube_indices, byteSize: cube_indices.byteLength});
        
        let projectCubeLayout = new cml.VertexLayout(
            [
                new cml.VertexAttribute("Position", cml.ValueType.Float, 3),
                new cml.VertexAttribute("Normal", cml.ValueType.Float, 3),
                new cml.VertexAttribute("TexCoords", cml.ValueType.Float, 2),
            ], 
            3
        );    
        
        console.log(projectCubeLayout);
        

        let projectCubeInput = cml.createVertexInput(
        {
            vBuffer: projectCubeVBO,
            iBuffer: projectCubeEBO,
            layout: projectCubeLayout,
            verticesCount: cube_indices.length
        });
        
        // Project cubes program.
        //
        let projectCubeProgram = cml.createProgram({vertCode: model_view_projection_vert, fragCode: color_frag});
        
        




        // Project 1. Mammoth
        //
        let mammothModel = glm.mat4.create();
        const axis = glm.vec3.fromValues(0, 1, 0);
        const angle = 60;      
        let mammothRotation = glm.vec4.create();   
        const quat = glm.quat.setAxisAngle(mammothRotation, axis, glm.glMatrix.toRadian(angle));
        mammothRotation = glm.quat.normalize(quat, quat);
        mammothModel = glm.mat4.fromQuat(mammothModel, quat);
        glm.mat4.scale(mammothModel, mammothModel, [0.2, 0.2, 0.01]);

        let uMammothModel = cml.createUniformResource({name: "u_model", type: "Mat4x4f", data: new Float32Array(mammothModel), accessType: cml.ResourceAccessType.PerDrawCall, writeFrequency: cml.WriteFrequency.Dynamic});
        let mammothShader = cml.createShader({program: projectCubeProgram, resources: [uMammothModel, uProjection, uView ], count: 3});




        loop();

        function loop() 
        {
            window.requestAnimationFrame(() => 
            {
                uMousePosition.update(new Float32Array(mousePosition));
                uTime.update(performance.now() * 0.0005);
    
                cml.begin(sceneBuffer);  
                cml.submit(background_vertexInput, background_shader);
                cml.submit(projectCubeInput, mammothShader);
                cml.end();
                
                cml.begin(null); 
                cml.submit(displayQuad_vertexInput, displayQuad_shader); 
                cml.end();
    
                loop();
            });  
        }
    }

    private destroy() : void 
    {

    }
};



let planet_image_vertices : number[] = 
[
    -1.0, -1.0, 0.0, 0.0, 0.0,
    1.0, -1.0, 0.0, 1.0, 0.0,
    1.0, 0.90, 0.0, 1.0, 1.0,
    0.6, 0.90, 0.0, 1.0, 1.0,
    0.55, 1.0, 0.0, 1.0, 1.0,
    -1.0, 0.90, 0.0, 0.0, 1.0,
    -0.85, 0.90, 0.0, 0.0, 1.0,
    -0.80, 1.0, 0.0, 0.0, 1.0
];

let planet_image_scaled_vertices : number[] = 
[
    -1.02, -1.0, 0.0, 0.0, 0.0,
    1.0, -1.0, 0.0, 1.0, 0.0,
    1.0, 0.90, 0.0, 1.0, 1.0,
    0.6, 0.90, 0.0, 1.0, 1.0,
    0.55, 1.0, 0.0, 1.0, 1.0,
    -1.02, 0.90, 0.0, 0.0, 1.0,
    -0.85, 0.90, 0.0, 0.0, 1.0,
    -0.80, 1.0, 0.0, 0.0, 1.0
];


let planet_image_indices : number[] = 
[
    0, 1, 2, 
    0, 2, 3,
    0, 3, 4,
    0, 4, 7,
    0, 6, 7,
    0, 5, 6
];

let screen_quad_vertices : number[] = 
[
    -1.0, -1.0, 0.0, 0.0, 0.0,
    1.0, -1.0, 0.0, 1.0, 0.0,
    1.0, 1.0, 0.0, 1.0, 1.0,
    -1.0, 1.0, 0.0, 0.0, 1.0
];

let screen_quad_indices : number[] = 
[
    0, 1, 2, 
    0, 3, 2,
];


let cube_vertices = new Float32Array([
    // Position         // Normal         // UV
    // Front face
    -1.0, -1.0,  1.0,  0.0,  0.0,  1.0,  0.0, 0.0,  // Bottom-left
     1.0, -1.0,  1.0,  0.0,  0.0,  1.0,  1.0, 0.0,  // Bottom-right
     1.0,  1.0,  1.0,  0.0,  0.0,  1.0,  1.0, 1.0,  // Top-right
    -1.0,  1.0,  1.0,  0.0,  0.0,  1.0,  0.0, 1.0,  // Top-left
    
    // Back face
    -1.0, -1.0, -1.0,  0.0,  0.0, -1.0,  0.0, 0.0,  // Bottom-left
     1.0, -1.0, -1.0,  0.0,  0.0, -1.0,  1.0, 0.0,  // Bottom-right
     1.0,  1.0, -1.0,  0.0,  0.0, -1.0,  1.0, 1.0,  // Top-right
    -1.0,  1.0, -1.0,  0.0,  0.0, -1.0,  0.0, 1.0,  // Top-left
    
    // Left face
    -1.0,  1.0,  1.0, -1.0,  0.0,  0.0,  1.0, 0.0,  // Top-right
    -1.0,  1.0, -1.0, -1.0,  0.0,  0.0,  1.0, 1.0,  // Top-left
    -1.0, -1.0, -1.0, -1.0,  0.0,  0.0,  0.0, 1.0,  // Bottom-left
    -1.0, -1.0,  1.0, -1.0,  0.0,  0.0,  0.0, 0.0,  // Bottom-right
    
    // Right face
     1.0,  1.0,  1.0,  1.0,  0.0,  0.0,  1.0, 0.0,  // Top-left
     1.0, -1.0, -1.0,  1.0,  0.0,  0.0,  0.0, 1.0,  // Bottom-right
     1.0,  1.0, -1.0,  1.0,  0.0,  0.0,  1.0, 1.0,  // Top-right
     1.0, -1.0,  1.0,  1.0,  0.0,  0.0,  0.0, 0.0,  // Bottom-left
    
    // Top face
    -1.0,  1.0,  1.0,  0.0,  1.0,  0.0,  0.0, 1.0,  // Top-left
     1.0,  1.0,  1.0,  0.0,  1.0,  0.0,  1.0, 1.0,  // Top-right
     1.0,  1.0, -1.0,  0.0,  1.0,  0.0,  1.0, 0.0,  // Bottom-right
    -1.0,  1.0, -1.0,  0.0,  1.0,  0.0,  0.0, 0.0,  // Bottom-left
    
    // Bottom face
    -1.0, -1.0,  1.0,  0.0, -1.0,  0.0,  0.0, 0.0,  // Top-left
     1.0, -1.0,  1.0,  0.0, -1.0,  0.0,  1.0, 0.0,  // Top-right
     1.0, -1.0, -1.0,  0.0, -1.0,  0.0,  1.0, 1.0,  // Bottom-right
    -1.0, -1.0, -1.0,  0.0, -1.0,  0.0,  0.0, 1.0   // Bottom-left
]);

let cube_indices = new Uint16Array([
    // Front face
    0, 1, 2,
    2, 3, 0,
    
    // Back face
    4, 5, 6,
    6, 7, 4,
    
    // Left face
    8, 9, 10,
    10, 11, 8,
    
    // Right face
    12, 13, 14,
    14, 15, 12,
    
    // Top face
    16, 17, 18,
    18, 19, 16,
    
    // Bottom face
    20, 21, 22,
    22, 23, 20
]);