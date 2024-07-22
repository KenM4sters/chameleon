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
    }

    public override init(settings : GraphicsSettings) : void 
    {

        canvas = settings.canvas;

        gl = canvas.getContext("webgl2", {antialias: true}) as WebGL2RenderingContext;

        gl.viewport(0, 0, canvas.width, canvas.height);
        gl.depthFunc(gl.LEQUAL);
        gl.enable(gl.DEPTH_TEST);

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
        if(!target) 
        {
            gl.bindFramebuffer(gl.FRAMEBUFFER, target);
        }
        else 
        {
            const frameBuffer = target as GLFrameBuffer;
            gl.bindFramebuffer(gl.FRAMEBUFFER, frameBuffer.getContextHandle());
        }

        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        gl.clearColor(0.1, 0.1, 0.1, 1.0);
    }

    public override end() : void 
    {
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, null);
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


