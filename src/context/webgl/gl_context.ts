import { IGraphicsContext, SamplerResource, UniformResource } from "../common/context";
import { FrameBuffer, IndexBuffer, Program, Sampler, Shader, Texture, UniformBuffer, VertexBuffer, VertexInput } from "../common/context";
import { FrameBufferProps, GraphicsSettings, IndexBufferProps, ProgramProps, SamplerProps, ShaderProps, TextureProps, TextureResourceProps, UniformBufferProps, UniformResourceProps, VertexBufferProps, VertexInputProps } from "../../graphics";
import { GLIndexBuffer, GLUniformBuffer, GLVertexBuffer } from "./gl_buffer";
import { GLProgram } from "./gl_program";
import { GLShader } from "./gl_shader";
import { GLVertexInput } from "./gl_vertex_input";
import { GLSamplerResource, GLUniformResource } from "./gl_resource";
import { GLTexture } from "./gl_texture";
import { GLSampler } from "./gl_sampler";
import { GLFrameBuffer } from "./gl_framebuffer";


let canvas : HTMLCanvasElement;
let gl : WebGL2RenderingContext;


let g_glSamplerFilterModes : number[];
let g_glSamplerAddressModes : number[];
let g_glTargetTypes : number[];
let g_glInternalFormats : number[];
let g_glFormats : number[];
let g_glAttachments : number[];
let g_glValueTypes : number[];



/**
 * @brief 
 */
class GLGraphicsContext extends IGraphicsContext 
{
    constructor() 
    {
        super();

        this.isLastBuffer = false;
    }

    public override init(settings : GraphicsSettings) : void 
    {

        canvas = settings.canvas;

        gl = canvas.getContext("webgl2", {antialias: false}) as WebGL2RenderingContext;
        
        gl.viewport(0, 0, canvas.width, canvas.height);
        gl.depthFunc(gl.LEQUAL);
        gl.enable(gl.DEPTH_TEST);


        // Extensions to support textures with floating point values (widely supported).
        //
        let ext1 = gl.getExtension('EXT_color_buffer_float');
        if (!ext1) 
        {
            throw new Error('EXT_color_buffer_float is not supported')
        };

        let ext2 = gl.getExtension('OES_texture_float_linear');
        if (!ext2) 
        {
            throw new Error('OES_texture_float_linear is not supported')
        };

        // Context-specific type arrays to be used with their respective enums as indexes.
        //
        g_glSamplerFilterModes = 
        [
            gl.NEAREST,
            gl.LINEAR,
            gl.LINEAR_MIPMAP_LINEAR,
            gl.LINEAR_MIPMAP_NEAREST
        ];

        g_glSamplerAddressModes = 
        [
            gl.REPEAT,
            gl.MIRRORED_REPEAT,
            gl.CLAMP_TO_EDGE, 
        ];

        g_glTargetTypes = 
        [
            gl.TEXTURE_2D,
            gl.TEXTURE_2D_MULTISAMPLE,
            gl.TEXTURE_CUBE_MAP
        ];

        g_glInternalFormats = 
        [
            gl.R32I,
            gl.R32F,
            gl.RG,
            gl.RG32F,
            gl.RGB,
            gl.RGB32F,
            gl.RGBA,
            gl.RGBA32F,
            gl.DEPTH24_STENCIL8
        ];

        g_glFormats = 
        [
            gl.RG,
            gl.RGB,
            gl.RGBA,
            gl.DEPTH_STENCIL
        ];

        g_glAttachments = 
        [
            gl.COLOR_ATTACHMENT0,
            gl.COLOR_ATTACHMENT1,
            gl.COLOR_ATTACHMENT2,
            gl.COLOR_ATTACHMENT3,
            gl.DEPTH_ATTACHMENT,
            gl.STENCIL_ATTACHMENT,
            gl.DEPTH_STENCIL_ATTACHMENT
        ];


        g_glValueTypes = 
        [
            gl.UNSIGNED_INT,
            gl.INT,
            gl.UNSIGNED_BYTE,
            gl.BYTE,
            gl.FLOAT,
            gl.UNSIGNED_INT_24_8
        ];


        // MSAA buffer
        //

        const msaaFrameBuffer = gl.createFramebuffer();

        if(!msaaFrameBuffer) 
        {
            throw new Error("Failed to create frame buffer!");  
        } 

        this.MSAAFrameBuffer = msaaFrameBuffer;

        const msaaRenderBuffer = gl.createRenderbuffer();

        if(!msaaRenderBuffer) 
        {
            throw new Error("Failed to create render buffer!");  
        } 

        this.MSAARenderBuffer = msaaRenderBuffer;
        
        gl.bindFramebuffer(gl.FRAMEBUFFER, this.MSAAFrameBuffer);
        gl.bindRenderbuffer(gl.RENDERBUFFER, this.MSAARenderBuffer);
        gl.renderbufferStorageMultisample(gl.RENDERBUFFER, gl.getParameter(gl.MAX_SAMPLES), gl.RGBA8, canvas.width, canvas.height);
        gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.RENDERBUFFER, this.MSAARenderBuffer);
        
        if (gl.checkFramebufferStatus(gl.FRAMEBUFFER) !== gl.FRAMEBUFFER_COMPLETE) 
        {
            console.error('Framebuffer is not complete.');
        }

        window.addEventListener("resize", () => {
            gl.bindFramebuffer(gl.FRAMEBUFFER, this.MSAAFrameBuffer);
            gl.bindRenderbuffer(gl.RENDERBUFFER, this.MSAARenderBuffer);
            gl.renderbufferStorageMultisample(gl.RENDERBUFFER, gl.getParameter(gl.MAX_SAMPLES), gl.RGBA8, window.innerWidth, window.innerHeight);
            gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.RENDERBUFFER, this.MSAARenderBuffer);
            
            if (gl.checkFramebufferStatus(gl.FRAMEBUFFER) !== gl.FRAMEBUFFER_COMPLETE) 
            {
                console.error('Framebuffer is not complete.');
            }            
        });

    }

    public override shutdown() : void 
    {
        
    }

    public override createVertexBuffer(props : VertexBufferProps) : VertexBuffer 
    {   
        let vertexBuffer = new GLVertexBuffer();
        vertexBuffer.create(props);
        return vertexBuffer;
    }

    public override createIndexBuffer(props : IndexBufferProps) : IndexBuffer 
    {
        let indexBuffer = new GLIndexBuffer();
        indexBuffer.create(props);
        return indexBuffer;
    }

    public override createUniformBuffer(props : UniformBufferProps) : UniformBuffer 
    {
        let uniformBuffer = new GLUniformBuffer();
        uniformBuffer.create(props);
        return uniformBuffer;
    }

    public override createProgram(props : ProgramProps) : Program 
    {
        let program = new GLProgram();
        program.create(props);
        return program;
    }

    public override createTexture(props : TextureProps) : Texture 
    {
        let texture = new GLTexture();
        texture.create(props);
        return texture;
    }

    public override createSampler(props : SamplerProps) : Sampler 
    {
        let sampler = new GLSampler();
        sampler.create(props);
        return sampler;
    }

    public override createFrameBuffer(props : FrameBufferProps) : FrameBuffer 
    {
        let frameBuffer = new GLFrameBuffer();
        frameBuffer.create(props);
        return frameBuffer;
    }

    public override createSamplerResource(props : TextureResourceProps) : SamplerResource 
    {
        let samplerResource = new GLSamplerResource();
        samplerResource.create(props);
        return samplerResource;
    }

    public override createUniformResource(props : UniformResourceProps) : UniformResource 
    {
        let uniformResource = new GLUniformResource();
        uniformResource.create(props);
        return uniformResource;
    } 
    
    public override createShader(props : ShaderProps) : Shader 
    {
        let shader = new GLShader();
        shader.create(props);
        return shader;
    }   
    
    public override createVertexInput(props : VertexInputProps) : VertexInput 
    {
        let vertexInput = new GLVertexInput();
        vertexInput.create(props);
        return vertexInput;
    }

    public override begin(target : FrameBuffer | null) : void 
    {
        if(target) 
        {
            this.isLastBuffer = false;
            const frameBuffer = target as GLFrameBuffer;
            gl.bindFramebuffer(gl.FRAMEBUFFER, frameBuffer.getContextHandle());
        }
        else 
        {
            this.isLastBuffer = true;

            gl.bindFramebuffer(gl.FRAMEBUFFER, this.MSAAFrameBuffer);
        }

        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        gl.clearColor(0.1, 0.1, 0.1, 1.0);
    }

    public override end() : void 
    {
        if(!this.isLastBuffer) 
        {            
            gl.bindFramebuffer(gl.FRAMEBUFFER, null);
            gl.bindRenderbuffer(gl.RENDERBUFFER, null);
            gl.activeTexture(gl.TEXTURE0);
            gl.bindTexture(gl.TEXTURE_2D, null);
        }
        else 
        {          
            gl.bindFramebuffer(gl.READ_FRAMEBUFFER, this.MSAAFrameBuffer);
            gl.bindFramebuffer(gl.DRAW_FRAMEBUFFER, null); // display buffer. 
            gl.blitFramebuffer(
                0, 0, canvas.width, canvas.height, 
                0, 0, canvas.width, canvas.height,
                gl.COLOR_BUFFER_BIT, gl.LINEAR
            );

            gl.bindFramebuffer(gl.FRAMEBUFFER, null);
            gl.bindFramebuffer(gl.READ_FRAMEBUFFER, null);
            gl.bindFramebuffer(gl.DRAW_FRAMEBUFFER, null);
        }
    }

    public override setViewport(dimensions : {pixelWidth : number, pixelHeight: number}) : void 
    {
        gl.viewport(0, 0, dimensions.pixelWidth, dimensions.pixelHeight);
    }

    public override submit(vInput : VertexInput, shader : Shader) : void 
    {
        let glShader = shader as GLShader;
        let glInput = vInput as GLVertexInput;

        glShader.bind();
        gl.bindVertexArray(glInput.getContextHandle());
        gl.drawElements(gl.TRIANGLES, glInput.getVerticesCount(), gl.UNSIGNED_SHORT, 0);
        gl.useProgram(null);
        gl.bindVertexArray(null);
    }

    private isLastBuffer : boolean;
    private MSAAFrameBuffer !: WebGLFramebuffer;
    private MSAARenderBuffer !: WebGLRenderbuffer;
}


export {
    canvas, gl, GLGraphicsContext, 
    g_glSamplerFilterModes,
    g_glSamplerAddressModes, 
    g_glTargetTypes, 
    g_glInternalFormats, 
    g_glFormats, 
    g_glAttachments, 
    g_glValueTypes, 
};

