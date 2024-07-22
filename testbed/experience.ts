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

        this.readyImagesCounter = 0;
        this.imagesCount = 12;
        this.isReady = false;

        this.mammothImage = new Image();
        this.WGPUImage = new Image();
        this.silverbackImage = new Image();
        this.chameleonImage = new Image();
        this.PBRImage = new Image();
        this.sandboxImage = new Image();
        this.vulkanImage = new Image();
        this.raytracerImage = new Image();
        this.shmupImage = new Image();
        this.bankingAppImage = new Image();
        this.gamesListImage = new Image();
        this.actixWebImage = new Image();

        this.loadImage(this.mammothImage, "testbed/images/mammoth.png");
        this.loadImage(this.WGPUImage, "testbed/images/mammoth.png");
        this.loadImage(this.silverbackImage, "testbed/images/mammoth.png");
        this.loadImage(this.chameleonImage, "testbed/images/chameleon_marbles.png");
        this.loadImage(this.PBRImage, "testbed/images/pbr_metal.png");
        this.loadImage(this.sandboxImage, "testbed/images/sandbox.png");
        this.loadImage(this.vulkanImage, "testbed/images/vulkan_lights.png");
        this.loadImage(this.raytracerImage, "testbed/images/raytracer.png");
        this.loadImage(this.shmupImage, "testbed/images/shmup.png");
        this.loadImage(this.bankingAppImage, "testbed/images/mammoth.png");
        this.loadImage(this.gamesListImage, "testbed/images/games_list.png");
        this.loadImage(this.actixWebImage, "testbed/images/mammoth.png");
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
            uMousePosition.update(new Float32Array(mousePosition));
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
        let background_shader = cml.createShader({program: backgroundProgram, resources: [background_uModelMatrix, uCanvasDimensions, uMousePosition], count: 3});


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
    

        let projectCubeInput = cml.createVertexInput(
        {
            vBuffer: projectCubeVBO,
            iBuffer: projectCubeEBO,
            layout: projectCubeLayout,
            verticesCount: cube_indices.length
        });
        
        // Project cubes program.
        //
        let projectCubeProgram = cml.createProgram({vertCode: model_view_projection_vert, fragCode: texture_frag});
        
        const axis = glm.vec3.fromValues(0, 1, 0);
        const angle = 80;      
        let projectCubeRotation = glm.vec4.create();   
        const projectCubeQuat = glm.quat.setAxisAngle(projectCubeRotation, axis, glm.glMatrix.toRadian(angle));
        projectCubeRotation = glm.quat.normalize(projectCubeQuat, projectCubeQuat);


        // Project 1. Mammoth
        //
        let mammothTexture = cml.createTexture(
            {
                target: cml.TargetType.Texture2D,
                nMipMaps: 0,
                level: 0,
                internalFormat: cml.InternalFormat.RGB32,
                format: cml.Format.RGB,
                type: cml.ValueType.UChar,
                usage: cml.Usage.ReadWrite,
                sampler: sampler,
                width: this.mammothImage.width,
                height: this.mammothImage.height,
                data : this.mammothImage
            }
        );

        let mammothModel = glm.mat4.create();
        glm.mat4.translate(mammothModel, mammothModel, [0.0, 0.0, 0.0]);
        glm.mat4.scale(mammothModel, mammothModel, [0.8, 0.8, 0.04]);
        let uMammothModel = cml.createUniformResource({name: "u_model", type: "Mat4x4f", data: new Float32Array(mammothModel), accessType: cml.ResourceAccessType.PerDrawCall, writeFrequency: cml.WriteFrequency.Dynamic});
        let sMammothTexture = cml.createSamplerResource({name: "s_texture", texture: mammothTexture, accessType: cml.ResourceAccessType.PerDrawCall, writeFrequency: cml.WriteFrequency.Dynamic});
        let mammothShader = cml.createShader({program: projectCubeProgram, resources: [uMammothModel, uProjection, uView, sMammothTexture], count: 4});
        
        
        // Project 2. WGPU framework
        //
        let WGPUTexture = cml.createTexture(
            {
                target: cml.TargetType.Texture2D,
                nMipMaps: 0,
                level: 0,
                internalFormat: cml.InternalFormat.RGB32,
                format: cml.Format.RGB,
                type: cml.ValueType.UChar,
                usage: cml.Usage.ReadWrite,
                sampler: sampler,
                width: this.WGPUImage.width,
                height: this.WGPUImage.height,
                data : this.WGPUImage
            }
        );
        
        
        let WGPUModel = glm.mat4.create();
        glm.mat4.translate(WGPUModel, WGPUModel, [0.0, 0.0, 0.5]);
        glm.mat4.scale(WGPUModel, WGPUModel, [0.8, 0.8, 0.04]);
        let uWGPUModel = cml.createUniformResource({name: "u_model", type: "Mat4x4f", data: new Float32Array(WGPUModel), accessType: cml.ResourceAccessType.PerDrawCall, writeFrequency: cml.WriteFrequency.Dynamic});
        let sWGPUTexture = cml.createSamplerResource({name: "s_texture", texture: WGPUTexture, accessType: cml.ResourceAccessType.PerDrawCall, writeFrequency: cml.WriteFrequency.Dynamic});
        let WGPUShader = cml.createShader({program: projectCubeProgram, resources: [uWGPUModel, uProjection, uView, sWGPUTexture], count: 4});
        
        // Project 3. Silverback
        //
        let silverbackTexture = cml.createTexture(
            {
                target: cml.TargetType.Texture2D,
                nMipMaps: 0,
                level: 0,
                internalFormat: cml.InternalFormat.RGB32,
                format: cml.Format.RGB,
                type: cml.ValueType.UChar,
                usage: cml.Usage.ReadWrite,
                sampler: sampler,
                width: this.silverbackImage.width,
                height: this.silverbackImage.height,
                data : this.silverbackImage
            }
        );
        
        let silverbackModel = glm.mat4.create();
        glm.mat4.translate(silverbackModel, silverbackModel, [0.0, 0.0, 1.0]);
        glm.mat4.scale(silverbackModel, silverbackModel, [0.8, 0.8, 0.04]);
        let uSilverbackModel = cml.createUniformResource({name: "u_model", type: "Mat4x4f", data: new Float32Array(silverbackModel), accessType: cml.ResourceAccessType.PerDrawCall, writeFrequency: cml.WriteFrequency.Dynamic});
        let sSilverbackTexture = cml.createSamplerResource({name: "s_texture", texture: silverbackTexture, accessType: cml.ResourceAccessType.PerDrawCall, writeFrequency: cml.WriteFrequency.Dynamic});
        let silverbackShader = cml.createShader({program: projectCubeProgram, resources: [uSilverbackModel, uProjection, uView, sSilverbackTexture], count: 4});
        
        // Project 4. Chameleon
        //
        let chameleonTexture = cml.createTexture(
            {
                target: cml.TargetType.Texture2D,
                nMipMaps: 0,
                level: 0,
                internalFormat: cml.InternalFormat.RGB32,
                format: cml.Format.RGB,
                type: cml.ValueType.UChar,
                usage: cml.Usage.ReadWrite,
                sampler: sampler,
                width: this.chameleonImage.width,
                height: this.chameleonImage.height,
                data : this.chameleonImage
            }
        );

        let chameleonModel = glm.mat4.create();
        glm.mat4.translate(chameleonModel, chameleonModel, [0.0, 0.0, 1.5]);
        glm.mat4.scale(chameleonModel, chameleonModel, [0.8, 0.8, 0.04]);
        let uChameleonModel = cml.createUniformResource({name: "u_model", type: "Mat4x4f", data: new Float32Array(chameleonModel), accessType: cml.ResourceAccessType.PerDrawCall, writeFrequency: cml.WriteFrequency.Dynamic});
        let sChameleonTexture = cml.createSamplerResource({name: "s_texture", texture: chameleonTexture, accessType: cml.ResourceAccessType.PerDrawCall, writeFrequency: cml.WriteFrequency.Dynamic});
        let chameleonShader = cml.createShader({program: projectCubeProgram, resources: [uChameleonModel, uProjection, uView, sChameleonTexture], count: 4});
        
        // Project 5. PBR
        //
        let PBRTexture = cml.createTexture(
            {
                target: cml.TargetType.Texture2D,
                nMipMaps: 0,
                level: 0,
                internalFormat: cml.InternalFormat.RGB32,
                format: cml.Format.RGB,
                type: cml.ValueType.UChar,
                usage: cml.Usage.ReadWrite,
                sampler: sampler,
                width: this.PBRImage.width,
                height: this.PBRImage.height,
                data : this.PBRImage
            }
        );
        
        let PBRModel = glm.mat4.create();
        glm.mat4.translate(PBRModel, PBRModel, [0.0, 0.0, 2.0]);
        glm.mat4.scale(PBRModel, PBRModel, [0.8, 0.8, 0.04]);
        let uPBRModel = cml.createUniformResource({name: "u_model", type: "Mat4x4f", data: new Float32Array(PBRModel), accessType: cml.ResourceAccessType.PerDrawCall, writeFrequency: cml.WriteFrequency.Dynamic});
        let sPBRTexture = cml.createSamplerResource({name: "s_texture", texture: PBRTexture, accessType: cml.ResourceAccessType.PerDrawCall, writeFrequency: cml.WriteFrequency.Dynamic});
        let PBRShader = cml.createShader({program: projectCubeProgram, resources: [uPBRModel, uProjection, uView, sPBRTexture], count: 4});
        
        // Project 6. Sandbox
        //
        let sandboxTexture = cml.createTexture(
            {
                target: cml.TargetType.Texture2D,
                nMipMaps: 0,
                level: 0,
                internalFormat: cml.InternalFormat.RGB32,
                format: cml.Format.RGB,
                type: cml.ValueType.UChar,
                usage: cml.Usage.ReadWrite,
                sampler: sampler,
                width: this.sandboxImage.width,
                height: this.sandboxImage.height,
                data : this.sandboxImage
            }
        );
        
        
        
        let sandboxModel = glm.mat4.create();
        glm.mat4.translate(sandboxModel, sandboxModel, [0.0, 0.0, 2.5]);
        glm.mat4.scale(sandboxModel, sandboxModel, [0.8, 0.8, 0.04]);
        let uSandboxModel = cml.createUniformResource({name: "u_model", type: "Mat4x4f", data: new Float32Array(sandboxModel), accessType: cml.ResourceAccessType.PerDrawCall, writeFrequency: cml.WriteFrequency.Dynamic});
        let sSandboxTexture = cml.createSamplerResource({name: "s_texture", texture: sandboxTexture, accessType: cml.ResourceAccessType.PerDrawCall, writeFrequency: cml.WriteFrequency.Dynamic});
        let sandboxShader = cml.createShader({program: projectCubeProgram, resources: [uSandboxModel, uProjection, uView, sSandboxTexture], count: 4});
        
        // Project 7. Vulkan
        //
        let vulkanTexture = cml.createTexture(
            {
                target: cml.TargetType.Texture2D,
                nMipMaps: 0,
                level: 0,
                internalFormat: cml.InternalFormat.RGB32,
                format: cml.Format.RGB,
                type: cml.ValueType.UChar,
                usage: cml.Usage.ReadWrite,
                sampler: sampler,
                width: this.mammothImage.width,
                height: this.mammothImage.height,
                data : this.mammothImage
            }
        );

        let vulkanModel = glm.mat4.create();
        glm.mat4.translate(vulkanModel, vulkanModel, [0.0, 0.0, 3.0]);
        glm.mat4.scale(vulkanModel, vulkanModel, [0.8, 0.8, 0.04]);
        let uVulkanModel = cml.createUniformResource({name: "u_model", type: "Mat4x4f", data: new Float32Array(vulkanModel), accessType: cml.ResourceAccessType.PerDrawCall, writeFrequency: cml.WriteFrequency.Dynamic});
        let sVulkanTexture = cml.createSamplerResource({name: "s_texture", texture: vulkanTexture, accessType: cml.ResourceAccessType.PerDrawCall, writeFrequency: cml.WriteFrequency.Dynamic});
        let vulkanShader = cml.createShader({program: projectCubeProgram, resources: [uVulkanModel, uProjection, uView, sVulkanTexture], count: 4});
        
        // Project 8. Raytracer
        //
        let raytracerTexture = cml.createTexture(
            {
                target: cml.TargetType.Texture2D,
                nMipMaps: 0,
                level: 0,
                internalFormat: cml.InternalFormat.RGB32,
                format: cml.Format.RGB,
                type: cml.ValueType.UChar,
                usage: cml.Usage.ReadWrite,
                sampler: sampler,
                width: this.raytracerImage.width,
                height: this.raytracerImage.height,
                data : this.raytracerImage
            }
        );
        
        
        let raytracerModel = glm.mat4.create();
        glm.mat4.translate(raytracerModel, raytracerModel, [0.0, 0.0, 3.5]);
        glm.mat4.scale(raytracerModel, raytracerModel, [0.8, 0.8, 0.04]);
        let uRaytracerModel = cml.createUniformResource({name: "u_model", type: "Mat4x4f", data: new Float32Array(raytracerModel), accessType: cml.ResourceAccessType.PerDrawCall, writeFrequency: cml.WriteFrequency.Dynamic});
        let sRaytracerTexture = cml.createSamplerResource({name: "s_texture", texture: raytracerTexture, accessType: cml.ResourceAccessType.PerDrawCall, writeFrequency: cml.WriteFrequency.Dynamic});
        let raytracerShader = cml.createShader({program: projectCubeProgram, resources: [uRaytracerModel, uProjection, uView, sRaytracerTexture], count: 4});
        
        // Project 9. Shmup
        //
        let shmupTexture = cml.createTexture(
            {
                target: cml.TargetType.Texture2D,
                nMipMaps: 0,
                level: 0,
                internalFormat: cml.InternalFormat.RGB32,
                format: cml.Format.RGB,
                type: cml.ValueType.UChar,
                usage: cml.Usage.ReadWrite,
                sampler: sampler,
                width: this.shmupImage.width,
                height: this.shmupImage.height,
                data : this.shmupImage
            }
        );
        
        
        
        let shmupModel = glm.mat4.create();
        glm.mat4.translate(shmupModel, shmupModel, [0.0, 0.0, 4.0]);
        glm.mat4.scale(shmupModel, shmupModel, [0.8, 0.8, 0.04]);
        let uShmupModel = cml.createUniformResource({name: "u_model", type: "Mat4x4f", data: new Float32Array(shmupModel), accessType: cml.ResourceAccessType.PerDrawCall, writeFrequency: cml.WriteFrequency.Dynamic});
        let sShmupTexture = cml.createSamplerResource({name: "s_texture", texture: shmupTexture, accessType: cml.ResourceAccessType.PerDrawCall, writeFrequency: cml.WriteFrequency.Dynamic});
        let shmupShader = cml.createShader({program: projectCubeProgram, resources: [uShmupModel, uProjection, uView, sShmupTexture], count: 4});
        
        // Project 10. Banking app
        //
        let bankingAppTexture = cml.createTexture(
            {
                target: cml.TargetType.Texture2D,
                nMipMaps: 0,
                level: 0,
                internalFormat: cml.InternalFormat.RGB32,
                format: cml.Format.RGB,
                type: cml.ValueType.UChar,
                usage: cml.Usage.ReadWrite,
                sampler: sampler,
                width: this.bankingAppImage.width,
                height: this.bankingAppImage.height,
                data : this.bankingAppImage
            }
        );
        
        
        
        let bankingAppModel = glm.mat4.create();
        glm.mat4.translate(bankingAppModel, bankingAppModel, [0.0, 0.0, 4.5]);
        glm.mat4.scale(bankingAppModel, bankingAppModel, [0.8, 0.8, 0.04]);
        let uBankingAppModel = cml.createUniformResource({name: "u_model", type: "Mat4x4f", data: new Float32Array(bankingAppModel), accessType: cml.ResourceAccessType.PerDrawCall, writeFrequency: cml.WriteFrequency.Dynamic});
        let sBankingAppTexture = cml.createSamplerResource({name: "s_texture", texture: bankingAppTexture, accessType: cml.ResourceAccessType.PerDrawCall, writeFrequency: cml.WriteFrequency.Dynamic});
        let bankingAppShader = cml.createShader({program: projectCubeProgram, resources: [uBankingAppModel, uProjection, uView, sBankingAppTexture], count: 4});
        
        // Project 11. Games list
        //
        let gamesListTexture = cml.createTexture(
            {
                target: cml.TargetType.Texture2D,
                nMipMaps: 0,
                level: 0,
                internalFormat: cml.InternalFormat.RGB32,
                format: cml.Format.RGB,
                type: cml.ValueType.UChar,
                usage: cml.Usage.ReadWrite,
                sampler: sampler,
                width: this.gamesListImage.width,
                height: this.gamesListImage.height,
                data : this.gamesListImage
            }
        );
        
        
        let gamesListModel = glm.mat4.create();
        glm.mat4.translate(gamesListModel, gamesListModel, [0.0, 0.0, 5.0]);
        glm.mat4.scale(gamesListModel, gamesListModel, [0.8, 0.8, 0.04]);
        let uGamesListModel = cml.createUniformResource({name: "u_model", type: "Mat4x4f", data: new Float32Array(gamesListModel), accessType: cml.ResourceAccessType.PerDrawCall, writeFrequency: cml.WriteFrequency.Dynamic});
        let sGamesListTexture = cml.createSamplerResource({name: "s_texture", texture: gamesListTexture, accessType: cml.ResourceAccessType.PerDrawCall, writeFrequency: cml.WriteFrequency.Dynamic});
        let gamesListShader = cml.createShader({program: projectCubeProgram, resources: [uGamesListModel, uProjection, uView, sGamesListTexture], count: 4});
        
        // Project 11. Actix Web server
        //
        let actixWebTexture = cml.createTexture(
            {
                target: cml.TargetType.Texture2D,
                nMipMaps: 0,
                level: 0,
                internalFormat: cml.InternalFormat.RGB32,
                format: cml.Format.RGB,
                type: cml.ValueType.UChar,
                usage: cml.Usage.ReadWrite,
                sampler: sampler,
                width: this.actixWebImage.width,
                height: this.actixWebImage.height,
                data : this.actixWebImage
            }
        );
        
        
        
        let actixWebModel = glm.mat4.create();
        glm.mat4.translate(actixWebModel, actixWebModel, [0.0, 0.0, 5.5]);
        glm.mat4.scale(actixWebModel, actixWebModel, [0.8, 0.8, 0.04]);
        let uActixWebModel = cml.createUniformResource({name: "u_model", type: "Mat4x4f", data: new Float32Array(actixWebModel), accessType: cml.ResourceAccessType.PerDrawCall, writeFrequency: cml.WriteFrequency.Dynamic});
        let sActixWebTexture = cml.createSamplerResource({name: "s_texture", texture: actixWebTexture, accessType: cml.ResourceAccessType.PerDrawCall, writeFrequency: cml.WriteFrequency.Dynamic});
        let actixWebShader = cml.createShader({program: projectCubeProgram, resources: [uActixWebModel, uProjection, uView, sActixWebTexture], count: 4});


        loop();

        function loop() 
        {
            window.requestAnimationFrame(() => 
            {
                uTime.update(performance.now() * 0.0005);
    
                cml.begin(sceneBuffer);  
                cml.submit(background_vertexInput, background_shader);
                cml.submit(projectCubeInput, mammothShader);
                cml.submit(projectCubeInput, WGPUShader);
                cml.submit(projectCubeInput, silverbackShader);
                cml.submit(projectCubeInput, chameleonShader);
                cml.submit(projectCubeInput, PBRShader);
                cml.submit(projectCubeInput, sandboxShader);
                cml.submit(projectCubeInput, vulkanShader);
                cml.submit(projectCubeInput, raytracerShader);
                cml.submit(projectCubeInput, shmupShader);
                cml.submit(projectCubeInput, bankingAppShader);
                cml.submit(projectCubeInput, gamesListShader);
                cml.submit(projectCubeInput, actixWebShader);
                cml.end();
                
                cml.begin(null); 
                cml.submit(displayQuad_vertexInput, displayQuad_shader); 
                cml.end();
    
                loop();
            });  
        }

        // Clean up.
        window.addEventListener("close", () => 
        {
            projectCubeInput.destroy();

            mammothShader.destroy();
            WGPUShader.destroy();
            silverbackShader.destroy();
            chameleonShader.destroy();
            PBRShader.destroy();
            sandboxShader.destroy();
            vulkanShader.destroy();
            raytracerShader.destroy();
            shmupShader.destroy();
            bankingAppShader.destroy();
            gamesListShader.destroy();
            actixWebShader.destroy();
        });
    }

    private loadImage(img : HTMLImageElement, path : string) : void 
    {
        img.src = path;
        img.onload = () => 
        {
            this.readyImagesCounter++;
            if(this.readyImagesCounter >= this.imagesCount) 
            {
                this.init();                
            }
        }
    }

    private mammothImage : HTMLImageElement;
    private WGPUImage : HTMLImageElement;
    private silverbackImage : HTMLImageElement;
    private chameleonImage : HTMLImageElement;
    private PBRImage : HTMLImageElement;
    private sandboxImage : HTMLImageElement;
    private vulkanImage : HTMLImageElement;
    private raytracerImage : HTMLImageElement;
    private shmupImage : HTMLImageElement;
    private bankingAppImage : HTMLImageElement;
    private gamesListImage : HTMLImageElement;
    private actixWebImage : HTMLImageElement;
    private imagesCount : number;
    private readyImagesCounter : number;
    private isReady : boolean;
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
    -1.0, -1.0, -1.0,  0.0,  0.0, -1.0,  9.0, 9.0,  // Bottom-left
     1.0, -1.0, -1.0,  0.0,  0.0, -1.0,  9.0, 9.0,  // Bottom-right
     1.0,  1.0, -1.0,  0.0,  0.0, -1.0,  9.0, 9.0,  // Top-right
    -1.0,  1.0, -1.0,  0.0,  0.0, -1.0,  9.0, 9.0,  // Top-left
    
    // Left face
    -1.0,  1.0,  1.0, -1.0,  0.0,  0.0,  9.0, 9.0,  // Top-right
    -1.0,  1.0, -1.0, -1.0,  0.0,  0.0,  9.0, 9.0,  // Top-left
    -1.0, -1.0, -1.0, -1.0,  0.0,  0.0,  9.0, 9.0,  // Bottom-left
    -1.0, -1.0,  1.0, -1.0,  0.0,  0.0,  9.0, 9.0,  // Bottom-right
    
    // Right face
     1.0,  1.0,  1.0,  1.0,  0.0,  0.0,  9.0, 9.0,  // Top-left
     1.0, -1.0, -1.0,  1.0,  0.0,  0.0,  9.0, 9.0,  // Bottom-right
     1.0,  1.0, -1.0,  1.0,  0.0,  0.0,  9.0, 9.0,  // Top-right
     1.0, -1.0,  1.0,  1.0,  0.0,  0.0,  9.0, 9.0,  // Bottom-left
    
    // Top face
    -1.0,  1.0,  1.0,  0.0,  1.0,  0.0,  9.0, 9.0,  // Top-left
     1.0,  1.0,  1.0,  0.0,  1.0,  0.0,  9.0, 9.0,  // Top-right
     1.0,  1.0, -1.0,  0.0,  1.0,  0.0,  9.0, 9.0,  // Bottom-right
    -1.0,  1.0, -1.0,  0.0,  1.0,  0.0,  9.0, 9.0,  // Bottom-left
    
    // Bottom face
    -1.0, -1.0,  1.0,  0.0, -1.0,  0.0,  9.0, 9.0,  // Top-left
     1.0, -1.0,  1.0,  0.0, -1.0,  0.0,  9.0, 9.0,  // Top-right
     1.0, -1.0, -1.0,  0.0, -1.0,  0.0,  9.0, 9.0,  // Bottom-right
    -1.0, -1.0, -1.0,  0.0, -1.0,  0.0,  9.0, 9.0   // Bottom-left
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


function buildCube(width : number, height : number, depth : number, widthSegments : number, heightSegments : number, depthSegments : number) : Float32Array
{

}

function buildPlane(width : number, height : number, depth: number, widthSegments : number, heightSegments : number) : Float32Array {

    const segmentWidth = width / widthSegments;
    const segmentHeight = height / heightSegments;

    const widthHalf = width / 2;
    const heightHalf = height / 2;

    let vertexCounter = 0;
    let groupCount = 0;

    const vector = glm.vec3.create();

    // generate vertices, normals and uvs

    for ( let iy = 0; iy < gridY1; iy ++ ) {

        const y = iy * segmentHeight - heightHalf;

        for ( let ix = 0; ix < gridX1; ix ++ ) {

            const x = ix * segmentWidth - widthHalf;

            // set values to correct vector component

            vector[ u ] = x * udir;
            vector[ v ] = y * vdir;
            vector[ w ] = depthHalf;

            // now apply vector to vertex buffer

            vertices.push( vector.x, vector.y, vector.z );

            // set values to correct vector component

            vector[ u ] = 0;
            vector[ v ] = 0;
            vector[ w ] = depth > 0 ? 1 : - 1;

            // now apply vector to normal buffer

            normals.push( vector.x, vector.y, vector.z );

            // uvs

            uvs.push( ix / gridX );
            uvs.push( 1 - ( iy / gridY ) );

            // counters

            vertexCounter += 1;

        }

    }

    // indices

    // 1. you need three indices to draw a single face
    // 2. a single segment consists of two faces
    // 3. so we need to generate six (2*3) indices per segment

    for ( let iy = 0; iy < gridY; iy ++ ) {

        for ( let ix = 0; ix < gridX; ix ++ ) {

            const a = numberOfVertices + ix + gridX1 * iy;
            const b = numberOfVertices + ix + gridX1 * ( iy + 1 );
            const c = numberOfVertices + ( ix + 1 ) + gridX1 * ( iy + 1 );
            const d = numberOfVertices + ( ix + 1 ) + gridX1 * iy;

            // faces

            indices.push( a, b, d );
            indices.push( b, c, d );

            // increase counter

            groupCount += 6;

        }

    }

    // add a group to the geometry. this will ensure multi material support

    scope.addGroup( groupStart, groupCount, materialIndex );

    // calculate new start value for groups

    groupStart += groupCount;

    // update total number of vertices

    numberOfVertices += vertexCounter;

};
