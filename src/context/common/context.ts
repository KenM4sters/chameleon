import { FrameBufferProps, GraphicsSettings, IndexBufferProps, ProgramProps, SamplerProps, ShaderProps, TextureProps, TextureResourceProps, UniformBufferProps, UniformResourceProps, ResourceType, VertexBufferProps, VertexData, VertexInputProps, ResourceAccessType, WriteFrequency, Attachment } from "../../graphics";


/**
 * @brief
 */
export abstract class VertexBuffer 
{   
    public abstract create(props : VertexBufferProps) : void;

    public abstract update(data: VertexData, byteOffset : number) : void;

    public abstract destroy() : void;
    
    protected constructor() {};
};


/**
 * @brief
 */
export abstract class IndexBuffer 
{
    public abstract create(props : IndexBufferProps) : void;

    public abstract update(data: VertexData, byteOffset : number) : void;

    public abstract destroy() : void;
    
    protected constructor() {};
};


/**
 * @brief
 */
export abstract class UniformBuffer 
{
    public abstract create(props : UniformBufferProps) : void;

    public abstract update(data: VertexData, byteOffset : number) : void;

    public abstract destroy() : void;
    
    protected constructor() {};
};


/**
 * @brief Base class that each context provides a child class of that manages the creation
 * of a shader program from filePaths to the shader code.
 */
export abstract class Program 
{
    public abstract create(props : ProgramProps) : void;

    public abstract destroy() : void;
    
    protected constructor() {};

};


/**
 * @brief Base class that each context provides a child of that manages the creation of a buffer 
 * on the GPU for texture data. 
 */
export abstract class Texture 
{
	public abstract create(props : TextureProps) : void;

    public abstract resize(width : number, height : number) : void;

    public abstract destroy() : void;
    
    protected constructor() {}

};

/**
 * @brief Base class that each context provides a child of that manages the creation of a sampler
 * object that can be used for many textures that each share the same sampling properties.
 */
export abstract class Sampler 
{
    public abstract create(props : SamplerProps) : void;

    public abstract update(props : SamplerProps) : void;

    public abstract detroy() : void;

    protected constructor() {}

};



/**
 * @brief Base class that each context provides a child of that manages the creation of a FrameBuffer
 * used for rendering to offscreen buffers. 
 */
export abstract class FrameBuffer
{
    public abstract create(props : FrameBufferProps) : void;

    public abstract resize(width : number, height : number) : void;

    public abstract setDrawAttachment(attachment : Attachment) : void;

    public abstract clear() : void;

    public abstract destroy() : void;
    
    protected constructor() {}


};


/**
 * @brief Base class that each context provides a child of that manages the creation of a Resource
 * which holds and manages data on the CPU that will be made visible to a shader program.
 * Generally speaking, this can be thought of as a wrapper for "uniforms", although it should
 * be noted that this also suppots images/samplers (which aren't labelled as uniforms in vulkan).
 */
export abstract class Resource 
{
    public abstract destroy() : void

    public abstract getName() : string; 

    public abstract getType() : ResourceType;

    public abstract getAccessType() : ResourceAccessType;

    public abstract getWriteFrequency() : WriteFrequency;
    
    protected constructor() {}
};

/**
 * @brief Base class that each context provides a child of that manages the creation of a Resource
 * which holds and manages data on the CPU that will be made visible to a shader program.
 * Generally speaking, this can be thought of as a wrapper for "uniforms", although it should
 * be noted that this also suppots images/samplers (which aren't labelled as uniforms in vulkan).
 */
export abstract class UniformResource extends Resource
{
    public abstract destroy() : void

    public abstract getName() : string; 

    public abstract getType() : ResourceType;

    public abstract getAccessType() : ResourceAccessType;

    public abstract getWriteFrequency() : WriteFrequency;

    public abstract update(data : number | string | VertexData) : void;
    
    protected constructor() 
    {
        super();
    }
};

/**
 * @brief Base class that each context provides a child of that manages the creation of a Resource
 * which holds and manages data on the CPU that will be made visible to a shader program.
 * Generally speaking, this can be thought of as a wrapper for "uniforms", although it should
 * be noted that this also suppots images/samplers (which aren't labelled as uniforms in vulkan).
 */
export abstract class SamplerResource extends Resource
{
    public abstract destroy() : void

    public abstract getName() : string; 

    public abstract getType() : ResourceType;

    public abstract getAccessType() : ResourceAccessType;

    public abstract getWriteFrequency() : WriteFrequency;

    public abstract update(texture : Texture) : void;
    
    protected constructor() 
    {
        super();
    }
};


/**
 * @brief Base class that each context provides a child of that manages the creation of a large
 * wrapper around a program and a number of resources that are intended to be used with that 
 * program. 
 */
export abstract class Shader   
{
    public abstract create(props : ShaderProps) : void;

    public abstract bind() : void;

    public abstract destroy() : void;
    
    protected constructor() {}
};


/**
 * @brief Base class that each context provides a child of that manages that defines how 
 * vertex data should be interpreted (as well as providing the vertex and/or index data itself).
 */
export abstract class VertexInput 
{
    public abstract create(props: VertexInputProps) : void;

    public abstract getVerticesCount() : number;

    public abstract destroy() : void;
    
    protected constructor() {}
};

export abstract class IGraphicsContext 
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

    public abstract createSamplerResource(props : TextureResourceProps) : SamplerResource;

    public abstract createUniformResource(props : UniformResourceProps) : UniformResource;
    
    public abstract createShader(props : ShaderProps) : Shader;
    
    public abstract createVertexInput(props : VertexInputProps) : VertexInput;

    public abstract begin(target : FrameBuffer | null) : void;

    public abstract end() : void;

    public abstract submit(vInput : VertexInput, shader : Shader) : void;
};


