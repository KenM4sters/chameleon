import { IGraphicsContext } from "./context/common/context";
import { GLGraphicsContext } from "./context/webgl/gl_context";
import { Attribute, Format, FrameBufferAttachment, FrameBufferProps, GraphicsBackend, GraphicsSettings, IndexBufferProps, InternalFormat, ProgramProps, ResourceProps, ResourceType, SamplerAddressMode, SamplerFilterMode, SamplerProps, ShaderProps, TargetType, TextureProps, UniformBufferProps, ValueType, VertexBufferProps, VertexData, VertexInputProps, VertexLayout } from "./types";


let s_ctx : IGraphicsContext = new GLGraphicsContext();

/**
 * @brief Wrapper around any variable to ensure that it's passed by reference and not value.
 */ 

class Ref<T> 
{
    constructor(public val : T) {};
};


/**
 * @brief
 */
abstract class VertexBuffer 
{   
    public abstract create(props : VertexBufferProps) : void;

    public abstract update(data: VertexData, byteOffset : number) : void;

    public abstract destroy() : void;
    
    protected constructor() {};
};


/**
 * @brief
 */
abstract class IndexBuffer 
{
    public abstract create(props : IndexBufferProps) : void;

    public abstract update(data: VertexData, byteOffset : number) : void;

    public abstract destroy() : void;
    
    protected constructor() {};
};


/**
 * @brief
 */
abstract class UniformBuffer 
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
abstract class Program 
{
    public abstract create(props : ProgramProps) : void;

    public abstract destroy() : void;
    
    protected constructor() {};

};


/**
 * @brief Base class that each context provides a child of that manages the creation of a buffer 
 * on the GPU for texture data. 
 */
abstract class Texture 
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
abstract class Sampler 
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
abstract class FrameBuffer
{
    public abstract create(props : FrameBufferProps) : void;

    public abstract resize(width : number, height : number) : void;

    public abstract destroy() : void;
    
    protected constructor() {}


};


/**
 * @brief Base class that each context provides a child of that manages the creation of a Resource
 * which holds and manages data on the CPU that will be made visible to a shader program.
 * Generally speaking, this can be thought of as a wrapper for "uniforms", although it should
 * be noted that this also suppots images/samplers (which aren't labelled as uniforms in vulkan).
 */
abstract class Resource 
{
    public abstract create(props : ResourceProps) : void

    public abstract update(data : VertexData) : void

    public abstract destroy() : void

    public abstract  getName() : string; 

    public abstract getType() : ResourceType; 
    
    protected constructor() {}
};


/**
 * @brief Base class that each context provides a child of that manages the creation of a large
 * wrapper around a program and a number of resources that are intended to be used with that 
 * program. 
 */
abstract class Shader   
{
    public abstract create(props : ShaderProps) : void;

    public abstract update(name : string, data : VertexData) : void;

    public abstract destroy() : void;
    
    protected constructor() {}
};


/**
 * @brief Base class that each context provides a child of that manages that defines how 
 * vertex data should be interpreted (as well as providing the vertex and/or index data itself).
 */
abstract class VertexInput 
{
    public abstract create(props: VertexInputProps) : void;

    public abstract destroy() : void;
    
    protected constructor() {}
};


/**
 * @brief Initializes the rendering framework by setting the correct graphics context from
 * which all following context calls will be made to. 
 * @note This function MUST be called before any graphics-related functions, otherwise the 
 * context will considered as null and an error will be thrown.
 */
function init(settings : GraphicsSettings) : void 
{
    switch(settings.backend) 
    {
        case GraphicsBackend.WebGL: s_ctx = new GLGraphicsContext(); break;
    }

    s_ctx.init(settings);
}


/**
 * @brief Destroys the graphics context in use and other various resources, but importantly
 * not the ones that were created and returned to the user. The intention with this framework
 * was to be provide maximum flexibility and, as such, all memory that was created by the user
 * through the various createX() function should be managed by the user.
 * @note eventhough smart pointers are returned by createX() functions, the relative destroy()
 * member function should be called on each object before it goes out of scope, which cleans
 * up the context-related reources.
 */
function shutdown() : void
{
    s_ctx.shutdown();
}


/**
 * @brief Creates a buffer on the GPU, fills it with the given data and returns a smart pointer
 * to the base class.
 * @note This should be used to allocate memory for vertex data.
 * @param memory The memory that the buffer will be filled with.
 * @param flags n/a for now.
 * @return A smart pointer to the base VertexBuffer class which abstracts context-related
 * operations and offers a minimal interface for the user.
 */
function createVertexBuffer(
    props : VertexBufferProps
) : VertexBuffer
{
    return s_ctx.createVertexBuffer(props);
}


/**
 * @brief Creates a buffer on the GPU, fills it with the given data and returns a smart pointer
 * to the base class.
 * @note This should be used to allocate memory index data.
 * @param memory The memory that the buffer will be filled with.
 * @param flags n/a for now.
 * @return A smart pointer to the base IndexBuffer class which abstracts context-related
 * operations and offers a minimal interface for the user.
 */
function createIndexBuffer(
    props:             IndexBufferProps
) : IndexBuffer
{
    return s_ctx.createIndexBuffer(props);
}



/**
 * @brief Creates a buffer on the GPU, fills it with the given data and returns a smart pointer
 * to the base class.
 * @note This should be used to allocate memory uniform data.
 * @param memory The memory that the buffer will be filled with.
 * @param flags n/a for now.
 * @return A smart pointer to the base UniformBuffer class which abstracts context-related
 * operations and offers a minimal interface for the user.
 */
function createUniformBuffer(
    props:             UniformBufferProps, 
) : UniformBuffer
{
    return s_ctx.createUniformBuffer(props);
}



/**
 * @brief Creates a shader program from the given source code.
 * @note This should be passed to a Shader object in order for draw calls to be made
 * to the appropraite pipeline.
 * @param vertPath filePath to the vertex shader code.
 * @param fragPath filePath to the fragment shader code.
 * @return A smart pointer to the base Program class which abstracts context-related
 * operations and offers a minimal interface for the user.
 */
function createProgram(
    props:         ProgramProps,
) : Program
{
    return s_ctx.createProgram(props);
}

/**
 * @brief Creates a buffer on the GPU for texture data and defines how it should be sampled.
 * @note This is the sole object to be used for texture data and can be used in a variety
 * of different contexts (attachments for FrameBuffers or as texture data for meshes).
 * @param target texture target type (probably Texture2D).
 * @param level mip-map level for this texture (probably 0).
 * @param internalFormat number of channels for the texture data as well as the type (probably RGBA32F).
 * @param width width of the texture in pixels.
 * @param height height of the texture in pixels.
 * @param format similar to internalFormat, but only needs the number of channels (probably RGBA).
 * @param type the type specified for the internalFormat (probably Float).
 * @param nMipMaps the number of mip-maps that should be generated. If 0, then no mip-maps are generated.
 * @param sampler the sampler that will be used with this texture (defines how it should be sampled).
 * @return A smart pointer to the base Texture class which abstracts context-related
 * operations and offers a minimal interface for the user.
 */
function createTexture(
    props:             TextureProps,
) : Texture
{
    return s_ctx.createTexture(props);
}


/**
 * @brief Creates a sampler which are used with Texture instances to define how the texture
 * data should be sampled (wrapping and filter types).
 * @note One single sampler can be used with many different textures.
 * @note For the min and mag filters, if mip maps are intended to be used with the texture that this
 * sampler will be applied to, they should be set the MipMap variants, otherwise the mip maps
 * won't be used.
 * @param addressModeS the wrapping mode along the x-axis of the texture (probably ClampToEdge).
 * @param addressModeT the wrapping mode along the y-axis of the texture (probably ClampToEdge).
 * @param addressModeR the wrapping mode along the z-axis of the texture (probably ClampToEdge).
 * @param minFilter the minification filter used when texture samples don't map 1:1 to pixels (probably Linear).
 * @param magFilter the magnification filter used when texture samples don't map 1:1 to pixels (probably Linear).
 * @return A smart pointer to the base Program class which abstracts context-related
 * operations and offers a minimal interface for the user.
 */
function createSampler(
    props:         SamplerProps,
) : Sampler 
{
    return s_ctx.createSampler(props);
}

/**
 * @brief Creates an off-screen rendering buffer with the attachments passed in.
 * In order to actually draw to a framebuffer, @ref begin must be called with a smart pointer
 * (the return value of this function) to a FrameBuffer instance. 
 * @param attachments a raw pointer to the first of an array of attachments (likely just the single color attachment).
 * @param count the number of attachements passed.
 * @return A smart pointer to the base FrameBuffer class which abstracts context-related
 * operations and offers a minimal interface for the user.
 */
function createFrameBuffer(
    props:          FrameBufferProps,
) : FrameBuffer
{
    return s_ctx.createFrameBuffer(props);
}

/**
 * @brief Creates a buffer on the GPU and fills it with the data passed in with @ref memory.
 * These should be constructed to hold and bind "uniform" data to Shader instances, with "uniform"
 * here meaning any of the types listed in @ref type.
 * @param name the name of the resource which will act as a key for a resource map that can be queried after construction (remember this).
 * @param type the type of the resource of which all available ones are listed in the ResourceType enum.
 * @param memory the memory of the data that you wish to be made available to the shader program.
 * @return A smart pointer to the base Resource class which abstracts context-related
 * operations and offers a minimal interface for the user.
 */
function createResource(
    props:          ResourceProps
) : Resource
{
    return s_ctx.createResource(props);
}

/**
 * @brief Creates a Shader instance that encapsulates a single Program and many Resource instances to define
 * a pipeline that can be submitted with a vertex input instance to draw graphics to the screen. 
 * @param program a raw pointer to the Program.
 * @param resources a raw pointer to the first of an array of Resources.
 * @param count the number of resources passed.
 * @return A smart pointer to the base Shader class which abstracts context-related
 * operations and offers a minimal interface for the user.
 */
function createShader(
    props:          ShaderProps
) : Shader
{
    return s_ctx.createShader(props);
}


/**
 * @brief Creates a VertexInput instance which encapsulates the GPU buffers that will be used 
 * to hold vertex data, as well as the layout that describes how that vertex data should be interpreted
 * by the shader program.
 * @param vBuffer the VertexBuffer instance that holds a  to the GPU vertex buffer.
 * @param layout the VertexLayout that describes how this vertex buffer should be interpreted.
 * @param iBuffer the indexBuffer associated with the VertexBuffer instance.
 * @return A smart pointer to the base VertexInput class which abstracts context-related
 * operations and offers a minimal interface for the user.
 */
function createVertexInput(
    props:          VertexInputProps,
) : VertexInput
{
    return s_ctx.createVertexInput(props);
}


/**
 * @brief 
 */
function begin(target : FrameBuffer | null) : void 
{
    s_ctx.begin(target);
}



/**
 * @brief Binds all appropriate resources and makes a draw command to the GPU. 
 * @param input the VertexInput instance which holds the vertex data to draw rasterize.
 * @param shader the Shader instance that holds the Program and Resources to be used with the
 * the draw command.
 */
function submit(
    input:          VertexInput, 
    shader:         Shader
) : void
{
    s_ctx.submit(input, shader);
}



export {
    VertexBuffer, IndexBuffer, UniformBuffer, Sampler, Texture, Program,
    FrameBuffer, Resource, Shader, VertexInput, createFrameBuffer, createVertexBuffer, createIndexBuffer, createProgram,
    createResource, createVertexInput, createTexture, createUniformBuffer, createSampler, createShader, shutdown, 
    submit, init, begin
}