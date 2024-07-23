import * as cml from "../src/chameleon"
import * as glm from "gl-matrix"
import { BackgroundMesh, Scene } from "./scene";
import { ProjectMesh } from "./project_mesh";
import screen_quad_vert from "./shaders/screen_quad.vert?raw";
import texture_frag from "./shaders/texture.frag?raw";
import { Primitives } from "./primitives";


export enum ProjectID 
{
    mammoth,
    silverback,
    wgpu,
    chameleon,
    pbr,
    sandbox,
    raytracer,
    vulkanLights,
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

    public create() : void 
    {
        this.primitives = Primitives.getInstance();

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
                sampler: this.primitives.sampler,
                width: window.innerWidth * this.highResolutionFactor,
                height: window.innerHeight * this.highResolutionFactor,
                data : null
            }
        );

        let meshIdTexture = cml.createTexture(
            {
                target: cml.TargetType.Texture2D,
                nMipMaps: 0,
                level: 0,
                internalFormat: cml.InternalFormat.RGBA32F,
                format: cml.Format.RGBA,
                type: cml.ValueType.Float,
                usage: cml.Usage.ReadWrite,
                sampler: this.primitives.sampler,
                width: window.innerWidth * this.highResolutionFactor,
                height: window.innerHeight * this.highResolutionFactor,
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
                sampler: this.primitives.sampler,
                width: window.innerWidth * this.highResolutionFactor,
                height: window.innerHeight * this.highResolutionFactor,
                data : null
            }
        );
    
        let ssceneColorTexture = cml.createSamplerResource({name: "s_srcTexture", texture: sceneColorTexture, writeFrequency: cml.WriteFrequency.Dynamic, accessType: cml.ResourceAccessType.PerDrawCall});    


        let sceneColorAttachment1 : cml.FrameBufferAttachment = 
        {
            texture: sceneColorTexture,
            attachment: cml.Attachment.Color0
        }

        let meshIdColorAttachment : cml.FrameBufferAttachment = 
        {
            texture: meshIdTexture,
            attachment: cml.Attachment.Color1
        }

        let depthAttachment1 : cml.FrameBufferAttachment = 
        {
            texture: sceneDepthTexture,
            attachment: cml.Attachment.DepthStencil
        }

        this.sceneBuffer = cml.createFrameBuffer({attachments: [sceneColorAttachment1, meshIdColorAttachment, depthAttachment1], count: 3});
        this.sceneBuffer.drawAttachments();

        // Anti-alias color buffer
        //
        let MSAATexture = cml.createTexture(
            {
                target: cml.TargetType.Texture2D,
                nMipMaps: 0,
                level: 0,
                internalFormat: cml.InternalFormat.RGBA32F,
                format: cml.Format.RGBA,
                type: cml.ValueType.Float,
                usage: cml.Usage.ReadWrite,
                sampler: this.primitives.sampler,
                width: window.innerWidth,
                height: window.innerHeight,
                data : null
            }
        );
    
        let sMSAATexture = cml.createSamplerResource({name: "s_srcTexture", texture:MSAATexture, writeFrequency: cml.WriteFrequency.Dynamic, accessType: cml.ResourceAccessType.PerDrawCall});    


        let MSAAColorAttachment1 : cml.FrameBufferAttachment = 
        {
            texture: MSAATexture,
            attachment: cml.Attachment.Color0
        }

        this.antiAliasBuffer = cml.createFrameBuffer({attachments: [MSAAColorAttachment1], count: 1});

        let displayQuadProgram = cml.createProgram({vertCode: screen_quad_vert, fragCode: texture_frag});
        let displayQuad_modelMatrix = glm.mat4.create();
        let displayQuad_uModelMatrix = cml.createUniformResource({name: "u_model", type: "Mat4x4f", data: new Float32Array(displayQuad_modelMatrix), accessType: cml.ResourceAccessType.PerDrawCall, writeFrequency: cml.WriteFrequency.Dynamic});

        this.displayShader = cml.createShader({program: displayQuadProgram, resources: [displayQuad_uModelMatrix, ssceneColorTexture], count: 2});

        this.antialiasShader = cml.createShader({program: displayQuadProgram, resources: [displayQuad_uModelMatrix, sMSAATexture], count: 2});
    }

    public render(scene : Scene, background : BackgroundMesh): void
    {
        cml.begin(this.sceneBuffer);
        cml.setViewport({pixelWidth: window.innerWidth * this.highResolutionFactor, pixelHeight: window.innerHeight * this.highResolutionFactor});

        scene.traverse((mesh : ProjectMesh) => 
        {
            cml.submit(mesh.vertexInput, mesh.shader);
        })

        cml.submit(background.vertexInput, background.shader);

        cml.end();



        cml.begin(this.antiAliasBuffer);
        cml.setViewport({pixelWidth: window.innerWidth, pixelHeight: window.innerHeight});
        cml.submit(this.primitives.fullScreenQuadInput, this.displayShader);
        cml.end();

        cml.begin(null);
        cml.submit(this.primitives.fullScreenQuadInput, this.displayShader);
        cml.end();
    }

    public destroy() : void 
    {
        this.sceneBuffer.destroy();
    }

    public sceneBuffer !: cml.FrameBuffer;
    public antiAliasBuffer !: cml.FrameBuffer;
    public antialiasShader !: cml.Shader;
    public displayShader !: cml.Shader;
    public primitives !: Primitives;
    
    public highResolutionFactor : number = 2.0;
};