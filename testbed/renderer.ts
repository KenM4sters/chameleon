import * as cml from "../src/chameleon"
import * as glm from "gl-matrix"
import { Scene } from "./scene";
import { BackgroundMesh, ProjectMesh } from "./mesh";
import screen_quad_vert from "./shaders/screen_quad.vert?raw";
import texture_frag from "./shaders/texture.frag?raw";
import fxaa_frag from "./shaders/fxaa.frag?raw";

import { Primitives } from "./primitives";


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
        let FXAATexture = cml.createTexture(
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
    
        let FXAAColorAttachment : cml.FrameBufferAttachment = 
        {
            texture: FXAATexture,
            attachment: cml.Attachment.Color0
        }

        this.fxaaBuffer = cml.createFrameBuffer({attachments: [FXAAColorAttachment], count: 1});




        let displayQuad_modelMatrix = glm.mat4.create();
        let displayQuad_uModelMatrix = cml.createUniformResource({name: "u_model", type: "Mat4x4f", data: new Float32Array(displayQuad_modelMatrix), accessType: cml.ResourceAccessType.PerDrawCall, writeFrequency: cml.WriteFrequency.Dynamic});
        
        let fxaaProgram = cml.createProgram({vertCode: screen_quad_vert, fragCode: texture_frag});
        let sSceneColorTexture = cml.createSamplerResource({name: "s_srcTexture", texture: sceneColorTexture, writeFrequency: cml.WriteFrequency.Dynamic, accessType: cml.ResourceAccessType.PerDrawCall});    
        this.fxaaShader = cml.createShader({program: fxaaProgram, resources: [displayQuad_uModelMatrix, sSceneColorTexture, uCanvasDimensions], count: 3});
        





        // MSAA Shader (handled by the framework when calling begin(null), 
        // indicating that this is the final pass).
        //
        let displayQuadProgram = cml.createProgram({vertCode: screen_quad_vert, fragCode: texture_frag});
        let sFXAAColorTexture = cml.createSamplerResource({name: "s_srcTexture", texture: FXAATexture, writeFrequency: cml.WriteFrequency.Dynamic, accessType: cml.ResourceAccessType.PerDrawCall});    
        this.displayShader = cml.createShader({program: displayQuadProgram, resources: [displayQuad_uModelMatrix, sFXAAColorTexture], count: 2});
    }

    public render(scene : Scene, background : BackgroundMesh): void
    {
        cml.begin(this.sceneBuffer);
        cml.setViewport({pixelWidth: window.innerWidth * this.highResolutionFactor, pixelHeight: window.innerHeight * this.highResolutionFactor});

        scene.traverse((mesh : ProjectMesh) => 
        {
            cml.submit(mesh.vertexInput, mesh.shader);
        });

        cml.submit(background.vertexInput, background.shader);

        cml.end();

        cml.begin(this.fxaaBuffer);
        cml.setViewport({pixelWidth: window.innerWidth, pixelHeight: window.innerHeight});
        cml.submit(this.primitives.fullScreenQuadInput, this.fxaaShader);
        cml.end();

        cml.begin(null);
        cml.submit(this.primitives.fullScreenQuadInput, this.displayShader);
        cml.end();
    }

    public renderBackgroundOnly(background : BackgroundMesh): void
    {
        cml.begin(this.sceneBuffer);
        cml.setViewport({pixelWidth: window.innerWidth * this.highResolutionFactor, pixelHeight: window.innerHeight * this.highResolutionFactor});

        cml.submit(background.vertexInput, background.shader);

        cml.end();

        cml.begin(this.fxaaBuffer);
        cml.setViewport({pixelWidth: window.innerWidth, pixelHeight: window.innerHeight});
        cml.submit(this.primitives.fullScreenQuadInput, this.fxaaShader);
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
    public fxaaBuffer !: cml.FrameBuffer;
    public fxaaShader !: cml.Shader;
    public displayShader !: cml.Shader;
    public primitives !: Primitives;
    
    public highResolutionFactor : number = 1.0;
};