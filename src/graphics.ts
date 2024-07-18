import { FrameBuffer, IGraphicsContext, IndexBuffer, Program, Resource, Sampler, SamplerResource, Shader, Texture, UniformBuffer, UniformResource, VertexBuffer, VertexInput } from "./context/common/context";
import { GLGraphicsContext } from "./context/webgl/gl_context";

let s_ctx : IGraphicsContext = new GLGraphicsContext();

/**
 * @brief Wrapper around any variable to ensure that it's passed by reference and not value.
 */ 

export class Ref<T> 
{
    constructor(public val : T) {};
};


/**
 *
 * @brief Initializes the rendering framework by setting the correct graphics context from
 * which all following context calls will be made to. 
 * @note This function MUST be called before any graphics-related functions, otherwise the 
 * context will considered as null and an error will be thrown.
 */
export function init(settings : GraphicsSettings) : void 
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
export function shutdown() : void
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
export function createVertexBuffer(
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
export function createIndexBuffer(
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
export function createUniformBuffer(
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
export function createProgram(
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
export function createTexture(
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
export function createSampler(
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
export function createFrameBuffer(
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
 * @param type the type of the resource of which all available ones are listed in the UniformType enum.
 * @param memory the memory of the data that you wish to be made available to the shader program.
 * @return A smart pointer to the base Resource class which abstracts context-related
 * operations and offers a minimal interface for the user.
 */
export function createSamplerResource(
    props:          TextureResourceProps
) : SamplerResource
{
    return s_ctx.createSamplerResource(props);
}

/**
 * @brief Creates a buffer on the GPU and fills it with the data passed in with @ref memory.
 * These should be constructed to hold and bind "uniform" data to Shader instances, with "uniform"
 * here meaning any of the types listed in @ref type.
 * @param name the name of the resource which will act as a key for a resource map that can be queried after construction (remember this).
 * @param type the type of the resource of which all available ones are listed in the UniformType enum.
 * @param memory the memory of the data that you wish to be made available to the shader program.
 * @return A smart pointer to the base Resource class which abstracts context-related
 * operations and offers a minimal interface for the user.
 */
export function createUniformResource(
    props:          UniformResourceProps
) : UniformResource
{
    return s_ctx.createUniformResource(props);
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
export function createShader(
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
export function createVertexInput(
    props:          VertexInputProps,
) : VertexInput
{
    return s_ctx.createVertexInput(props);
}


/**
 * @brief 
 */
export function begin(target : FrameBuffer | null) : void 
{
    s_ctx.begin(target);
}


/**
 * @brief
 */
export function end() : void 
{
    s_ctx.end();
}

/**
 * @brief Binds all appropriate resources and makes a draw command to the GPU. 
 * @param input the VertexInput instance which holds the vertex data to draw rasterize.
 * @param shader the Shader instance that holds the Program and Resources to be used with the
 * the draw command.
 */
export function submit(
    input:          VertexInput, 
    shader:         Shader
) : void
{
    s_ctx.submit(input, shader);
}


export type VertexData = Float32Array | Uint16Array | Uint8Array; 

/**
 * @brief An exhaustive list of the possible attributes. Names are important to match in DX12 
 * so these type types act as indexes into an array of strings that correspond to the names=
 * in shader
 * 
 * You should use these types regardless of the GraphicsBackend for consistency.
 */
export type Attribute =
    "Position"
    | "Normal"
    | "Tangent"
    | "BiTangent"
    | "Weight"
    | "Indices"
    | "Color"
    | "TexCoords"
    | "Count";

/**
 * @brief
 */
export type ResourceType =
    "Sampler"
    | "Float"
    | "Int"
    | "Vec2f"
    | "Vec2i"
    | "Vec3f"
    | "Vec3i"
    | "Vec4f"
    | "Vec4i"
    | "Mat4x4f"
    | "Mat3x3f"
    | "Count"


/**
 * @brief Rendering API of choice. Eventually this will cover OpenGL, Vulka, Metal and DX12,
 * but for now only OpenGL and Vulkan are being supported.
 */
export enum GraphicsBackend
{
    WebGL,
    WebGPU,
    Count
};


/**
 * @brief Specifies how the sampler will handle texture coordinates outside of the [0, 1]
 * range.
 */
export enum SamplerAddressMode
{
    Repeat,                 ///< Wraps back around to [0, 1]
    MirroredRepeat,         ///< Same as repeat, but reflects the texture.
    ClampToEdge,            ///< Stretches the texture to the edge (ideal in most situations). 
    Count
};


/**
 * @brief Specifies how the sampler will handle texture coordinates that do not map directly
 * to a texel, which can happen when the image has been scaled. 
 */
export enum SamplerFilterMode
{
    Nearest,                ///< Selects the closest texel (pixelated look).
    Linear,                 ///< Linearly interpolates between relative texels (smooth look).
    MipMapNearest,          ///< Selects the closest texel (pixelated look).
    MipMapLinear,           ///< Linearly interpolates between relative texels (smooth look).
    Count
};




/**
 * @brief Targets dimensions for textures. 
 */
export enum TargetType
{
    Texture2D,
    TextureCube,
    Count
}


/**
 * @brief Similar to @see {@link Format}, but also specifies the type of each component.
 * Seeing as this framework support HDR rendering, you should almost always use the "F" variants
 * to specifiy that they're floating point values and shouldn't be clamped during rendering.
 */
export enum InternalFormat
{
    R32,
    R32F,
    RG32,
    RG32F,
    RGB32,
    RGB32F,
    RGBA32,
    RGBA32F,
    Depth24Stencil8,
    Count
};


/**
 * @brief formats for buffers - specifies the number of channels per texel. 
 */
export enum Format
{
    RG,
    RGB,
    RGBA,
    DepthStencil,
    Count
};


/**
 * @brief Specifies the different types of frame buffer attachments.
 * @note Color0 represents the 1st color attachment.
 */
export enum Attachment
{
    Color0,
    Color1,
    Color2,
    Color3,
    Depth,
    Stencil,
    DepthStencil,
    Count
};


/**
 * @brief The possible types of a single value within the context of textures and attributes.
 * Often it's important to know whether something is an array of floats, characters or integers.
 */
export enum ValueType
{
    UInt,
    SInt,
    UChar,
    SChar,
    Float,
    Count
};


/**
 * @brief 
 */
export enum Usage 
{
    ReadOnly,
    WriteOnly,
    ReadWrite
};

export enum WriteFrequency 
{
    Static,
    Dynamic
};

export enum ResourceAccessType 
{
    PerFrame,
    PerMaterial,
    PerDrawCall
}


//============================================================================
// Flags to explicity pass single bits of information which change the
// context's behaviour.
//============================================================================


/**
 * @brief 
 */
export enum TextureFlags
{
    ReadOnly = 0,
    WriteOnly = 1 << 0,
    ReadWrite = 1 << 1,
    Color = 1 << 3,
    Depth = 1 << 4,
    Stencil = 1 << 5,
};


/**
 * @brief 
 */
export enum VertexBufferFlags 
{
    Static = 0,
    Dynamic = 1 << 0
};


/**
 * @brief 
 */
export enum IndexBufferFlags 
{
    Static = 0,
    Dynamic = 1 << 0
};


/**
 * @brief
 */
export enum UniformBufferFlags 
{
    Static = 0,
    Dynamic = 1 << 0
};


/**
 * @brief
 */
export class VertexAttribute 
{
    constructor(attribute : Attribute, type : ValueType, count : number)
    {
        this.attribute = attribute;
        this.type = type;
        this.count = count;
        this.byteOffset = 0;

        switch(type) 
        {
            case ValueType.UInt: this.byteSize = count * 4; break;
            case ValueType.SInt: this.byteSize = count * 4; break;
            case ValueType.UChar: this.byteSize = count * 1; break;
            case ValueType.SChar: this.byteSize = count * 1; break;
            case ValueType.Float: this.byteSize = count * 4; break;
            default: this.byteSize = count * 4; break;
        }
    }   
    
    attribute : Attribute;
    type : ValueType;
    count : number;
    byteOffset : number;
    byteSize : number;
};


/**
 * @brief 
 */
export class VertexLayout 
{
    constructor(attributes : VertexAttribute[], count : number)
    {
        this.attributes = attributes;
        this.count = count;
        this.stride = 0;

        for(let i = 0; i < count; i++) 
        {
            this.attributes[i].byteOffset = this.stride;
            this.stride += attributes[i].byteSize;
        }   
    }

    attributes : VertexAttribute[];
    count : number;
    stride : number;
};


//============================================================================
// Helper structs to encapsulate variables that should only be used in 
// conjunction width each other. These are left for the the user to create.
//============================================================================


/**
 * @brief Encapsulates all the required info to create the graphics context behind Chameleon.
 */
export interface GraphicsSettings 
{
    canvas : HTMLCanvasElement;
    backend : GraphicsBackend;
    name : string;
    pixelViewportWidth : number;
    pixelViewportHeight : number;
};


/**
 * @brief
 */
export interface TextureProps
{
    target : TargetType;
    format : Format;
    width : number;
    height : number;
    internalFormat : InternalFormat;
    type : ValueType;
    nMipMaps : number;
    level : number;
    usage : Usage;
    sampler : Sampler;
    data : ArrayBufferView | Float32Array | Uint16Array | null;
};  


/**
 * @brief
 */
export interface SamplerProps 
{
    addressModeS : SamplerAddressMode;
    addressModeT : SamplerAddressMode;
    addressModeR : SamplerAddressMode;
    minFilter : SamplerFilterMode;
    magFilter : SamplerFilterMode;
};


/**
 * @brief
 */
export interface VertexBufferProps 
{
    data : VertexData;
    byteSize : number;
};



/**
 * @brief
 */
export interface IndexBufferProps 
{
    data : VertexData;
    byteSize : number;
};



/**
 * @brief
 */
export interface UniformBufferProps 
{
    data : VertexData;
    byteSize : number;
};



/**
 * @brief
 */
export interface VertexLayoutProps 
{
    attributes : VertexAttribute[];
    count : number;
};



/**
 * @brief 
 */
export interface ProgramProps 
{
    vertCode : string;
    fragCode : string;
};



export interface TextureResourceProps 
{
    name : string;
    texture : Texture;
    writeFrequency : WriteFrequency;
    accessType : ResourceAccessType;
}

export interface UniformResourceProps 
{
    name : string;
    type : ResourceType;
    data: number | string | VertexData;
    writeFrequency : WriteFrequency;
    accessType : ResourceAccessType;
};
 

/**
 * @brief
 */
export interface VertexInputProps 
{
    vBuffer : VertexBuffer;
    layout : VertexLayout;
    iBuffer : IndexBuffer | null;
};



/**
 * @brief
 */
export interface ShaderProps 
{
    program : Program;
    resources : Resource[];
    count : number;
};




/**
 * @brief
 */
export interface FrameBufferProps 
{
    attachments : FrameBufferAttachment[];
    count : number;
};



/**
 * @brief
 */
export interface FrameBufferAttachment 
{
    texture : Texture;
    attachment : Attachment;
};


/**
 * @brief 
 */
export interface Extent 
{
    width : number;
    height : number;
};


/**
 * @brief 
 */
export interface Transform 
{
    pModel : number;
    matrixCount : number;
};