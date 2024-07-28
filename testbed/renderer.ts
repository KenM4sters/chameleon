import * as cml from "../src/chameleon"
import * as glm from "gl-matrix"
import { screen_quad_indices, screen_quad_vertices } from "./primitives";
import { ProjectMesh, ProjectsList } from "./projects_list";
import { Background } from "./background";

import screen_quad_vert from "./shaders/screen_quad.vert?raw";
import texture_frag from "./shaders/texture.frag?raw";


export enum ProjectID 
{
    mammoth,
    silverback,
    wgpu,
    chameleon,
    pbr,
    sandbox,
    vulkanLights,
    raytracer,
    shmup,
    bankingApp,
    gamesList,
    actixWeb,
    count
};

export class Renderer 
{
    constructor()
    {

    }

    public create(uCanvasDimensions : cml.UniformResource, uMousePosition : cml.UniformResource) : void 
    {

        // full screen quad input (generally used input for all squares with a model matrix).
        //
        this.vbo = cml.createVertexBuffer({data: new Float32Array(screen_quad_vertices), byteSize: screen_quad_vertices.length * 4});
        this.ebo = cml.createIndexBuffer({data: new Uint16Array(screen_quad_indices), byteSize: screen_quad_indices.length * 4});


        this.layout = new cml.VertexLayout(
            [
                new cml.VertexAttribute("Position", cml.ValueType.Float, 3),
                new cml.VertexAttribute("TexCoords", cml.ValueType.Float, 2),
            ], 
            2
        );


        this.input = cml.createVertexInput(
        {
            vBuffer: this.vbo,
            iBuffer: this.ebo,
            layout: this.layout,
            verticesCount: screen_quad_indices.length
        });


        this.linear_clamp_sampler = cml.createSampler(
            {
                addressModeS: cml.SamplerAddressMode.ClampToEdge,
                addressModeT: cml.SamplerAddressMode.ClampToEdge,
                addressModeR: cml.SamplerAddressMode.ClampToEdge,
                minFilter: cml.SamplerFilterMode.Linear,
                magFilter: cml.SamplerFilterMode.Linear,
            }
        );


        this.linear_nearest_sampler = cml.createSampler(
            {
                addressModeS: cml.SamplerAddressMode.ClampToEdge,
                addressModeT: cml.SamplerAddressMode.ClampToEdge,
                addressModeR: cml.SamplerAddressMode.ClampToEdge,
                minFilter: cml.SamplerFilterMode.Nearest,
                magFilter: cml.SamplerFilterMode.Nearest,
            }
        );


        // Scene depth buffer
        //
        this.sceneDepthTexture = cml.createTexture(
            {
                target: cml.TargetType.Texture2D,
                nMipMaps: 0,
                level: 0,
                internalFormat: cml.InternalFormat.Depth24Stencil8,
                format: cml.Format.DepthStencil,
                type: cml.ValueType.UInt24_8,
                usage: cml.Usage.ReadWrite,
                sampler: this.linear_clamp_sampler,
                width: window.innerWidth * this.highResolutionFactor,
                height: window.innerHeight * this.highResolutionFactor,
                data : null
            }
        );

        // Scene color buffer
        //
        this.sceneColorTexture = cml.createTexture(
            {
                target: cml.TargetType.Texture2D,
                nMipMaps: 0,
                level: 0,
                internalFormat: cml.InternalFormat.RGBA32F,
                format: cml.Format.RGBA,
                type: cml.ValueType.Float,
                usage: cml.Usage.ReadWrite,
                sampler: this.linear_clamp_sampler,
                width: window.innerWidth * this.highResolutionFactor,
                height: window.innerHeight * this.highResolutionFactor,
                data : null
            }
        );

        this.meshIdTexture = cml.createTexture(
            {
                target: cml.TargetType.Texture2D,
                nMipMaps: 0,
                level: 0,
                internalFormat: cml.InternalFormat.RGBA32F,
                format: cml.Format.RGBA,
                type: cml.ValueType.Float,
                usage: cml.Usage.ReadWrite,
                sampler: this.linear_nearest_sampler,
                width: window.innerWidth * this.highResolutionFactor,
                height: window.innerHeight * this.highResolutionFactor,
                data : null
            }
        );

        this.mesh_id_downsampled_texture = cml.createTexture(
            {
                target: cml.TargetType.Texture2D,
                nMipMaps: 0,
                level: 0,
                internalFormat: cml.InternalFormat.RGBA32F,
                format: cml.Format.RGBA,
                type: cml.ValueType.Float,
                usage: cml.Usage.ReadWrite,
                sampler: this.linear_nearest_sampler,
                width: window.innerWidth,
                height: window.innerHeight,
                data : null
            }
        );

        let depth_attachment : cml.FrameBufferAttachment = 
        {
            texture: this.sceneDepthTexture,
            attachment: cml.Attachment.DepthStencil
        }

        let scene_attachment : cml.FrameBufferAttachment = 
        {
            texture: this.sceneColorTexture,
            attachment: cml.Attachment.Color0
        }

        let mesh_id_attachment : cml.FrameBufferAttachment = 
        {
            texture: this.meshIdTexture,
            attachment: cml.Attachment.Color1
        }

        let mesh_id_downsampled_attachment : cml.FrameBufferAttachment = 
        {
            texture: this.mesh_id_downsampled_texture,
            attachment: cml.Attachment.Color0
        }

        this.sceneBuffer = cml.createFrameBuffer({attachments: [scene_attachment, mesh_id_attachment, depth_attachment], count: 3});
        this.sceneBuffer.drawAttachments();

        this.mesh_id_buffer = cml.createFrameBuffer({attachments: [mesh_id_attachment, depth_attachment], count: 2});

        // Anti-alias color buffer
        //
        this.FXAATexture = cml.createTexture(
            {
                target: cml.TargetType.Texture2D,
                nMipMaps: 0,
                level: 0,
                internalFormat: cml.InternalFormat.RGBA32F,
                format: cml.Format.RGBA,
                type: cml.ValueType.Float,
                usage: cml.Usage.ReadWrite,
                sampler: this.linear_clamp_sampler,
                width: window.innerWidth,
                height: window.innerHeight,
                data : null
            }
        );
    
        let FXAAColorAttachment : cml.FrameBufferAttachment = 
        {
            texture: this.FXAATexture,
            attachment: cml.Attachment.Color0
        }

        this.fxaaBuffer = cml.createFrameBuffer({attachments: [FXAAColorAttachment], count: 1});


        let displayQuad_modelMatrix = glm.mat4.create();
        let displayQuad_uModelMatrix = cml.createUniformResource({name: "u_model", type: "Mat4x4f", data: new Float32Array(displayQuad_modelMatrix), accessType: cml.ResourceAccessType.PerDrawCall, writeFrequency: cml.WriteFrequency.Dynamic});
        
        
        let fxaaProgram = cml.createProgram({vertCode: screen_quad_vert, fragCode: texture_frag});
        let sSceneColorTexture = cml.createSamplerResource({name: "s_srcTexture", texture: this.sceneColorTexture, writeFrequency: cml.WriteFrequency.Dynamic, accessType: cml.ResourceAccessType.PerDrawCall});    
        this.fxaaShader = cml.createShader({program: fxaaProgram, resources: [displayQuad_uModelMatrix, sSceneColorTexture, uCanvasDimensions], count: 3});
        

        // MSAA Shader (handled by the framework when calling begin(null), 
        // indicating that this is the final pass).
        //
        let displayQuadProgram = cml.createProgram({vertCode: screen_quad_vert, fragCode: texture_frag});
        let sFXAAColorTexture = cml.createSamplerResource({name: "s_srcTexture", texture: this.FXAATexture, writeFrequency: cml.WriteFrequency.Dynamic, accessType: cml.ResourceAccessType.PerDrawCall});    
        this.displayShader = cml.createShader({program: displayQuadProgram, resources: [displayQuad_uModelMatrix, sFXAAColorTexture], count: 2});
    }

    public render(projectsList : ProjectsList, background : Background): void
    {
        cml.begin(this.sceneBuffer);
        cml.setViewport({pixelWidth: window.innerWidth * this.highResolutionFactor, pixelHeight: window.innerHeight * this.highResolutionFactor});
 
        projectsList.traverse((mesh : ProjectMesh) => 
        {
            cml.submit(projectsList.cube_input, mesh.shader);
        });

        cml.submit(background.input, background.shader);

        cml.end();

        cml.begin(this.fxaaBuffer);
        cml.setViewport({pixelWidth: window.innerWidth, pixelHeight: window.innerHeight});
        cml.submit(this.input, this.fxaaShader);
        cml.end();

        cml.begin(null);
        cml.submit(this.input, this.displayShader);
        cml.end();
    }

    public renderBackgroundOnly(background : Background): void
    {
        cml.begin(this.sceneBuffer);
        cml.setViewport({pixelWidth: window.innerWidth * this.highResolutionFactor, pixelHeight: window.innerHeight * this.highResolutionFactor});

        cml.submit(background.input, background.shader);

        cml.end();

        // Downsampling the depth texture.
        //
        
        
        cml.begin(this.fxaaBuffer);
        cml.setViewport({pixelWidth: window.innerWidth, pixelHeight: window.innerHeight});
        cml.submit(this.input, this.fxaaShader);
        cml.end();

        cml.begin(null);
        cml.submit(this.input, this.displayShader);
        cml.end();
    }

    public destroy() : void 
    {
        this.sceneBuffer.destroy();
    }

    public resize(width : number, height : number) : void 
    {
        this.sceneColorTexture.resize(width, height);
        this.meshIdTexture.resize(width, height);
        this.sceneDepthTexture.resize(width, height);
        this.FXAATexture.resize(width, height);
    }

    private vbo !: cml.VertexBuffer;
    private ebo !: cml.IndexBuffer;
    private layout !: cml.VertexLayout;
    private input !: cml.VertexInput;
    
    public linear_clamp_sampler !: cml.Sampler;
    public linear_nearest_sampler !: cml.Sampler;

    private sceneColorTexture !: cml.Texture; 
    private meshIdTexture !: cml.Texture; 
    private mesh_id_downsampled_texture !: cml.Texture;
    private sceneDepthTexture !: cml.Texture; 
    private FXAATexture !: cml.Texture; 

    public sceneBuffer !: cml.FrameBuffer;
    public mesh_id_buffer !: cml.FrameBuffer;
    public fxaaBuffer !: cml.FrameBuffer;

    public mesh_id_shader !: cml.Shader;
    public fxaaShader !: cml.Shader;
    public displayShader !: cml.Shader;
    
    private highResolutionFactor : number = 1.0;
};