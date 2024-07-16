import { FrameBuffer, IndexBuffer, Program, Resource, Sampler, Shader, Texture, UniformBuffer, VertexBuffer, VertexInput } from "../../graphics";
import { FrameBufferProps, GraphicsSettings, IndexBufferProps, ProgramProps, ResourceProps, SamplerProps, ShaderProps, TextureProps, UniformBufferProps, VertexBufferFlags, VertexBufferProps, VertexData, VertexInputProps } from "../../types";



abstract class IGraphicsContext 
{
    constructor() {}

    public abstract init(settings : GraphicsSettings) : void;

    public abstract shutdown() : void;

    public abstract createVertexBuffer(props : VertexBufferProps) : VertexBuffer;

    public abstract createIndexBuffer(props : IndexBufferProps) : IndexBuffer;

    public abstract createUniformBuffer(props : UniformBufferProps) : UniformBuffer;

    public abstract createProgram(props : ProgramProps) : Program;

    public abstract createTexture(props : TextureProps) : Texture;

    public abstract createSampler(props : SamplerProps) : Sampler;

    public abstract createFrameBuffer(props : FrameBufferProps) : FrameBuffer;

    public abstract createResource(props : ResourceProps) : Resource;
    
    public abstract createShader(props : ShaderProps) : Shader;
    
    public abstract createVertexInput(props : VertexInputProps) : VertexInput;

    public abstract begin(target : FrameBuffer | null) : void;

    public abstract end() : void;

    public abstract submit(vInput : VertexInput, shader : Shader) : void;
};


export { IGraphicsContext }