import { IndexBuffer, Program, Resource, Sampler, Texture, VertexBuffer } from "./graphics";


type VertexData = Float32Array | Uint16Array | Uint8Array; 

/**
 * @brief An exhaustive list of the possible attributes. Names are important to match in DX12 
 * so these type types act as indexes into an array of strings that correspond to the names=
 * in shader
 * 
 * You should use these types regardless of the GraphicsBackend for consistency.
 */
type Attribute =
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
type ResourceType =
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
enum GraphicsBackend
{
    WebGL,
    WebGPU,
    Count
};


/**
 * @brief Specifies how the sampler will handle texture coordinates outside of the [0, 1]
 * range.
 */
enum SamplerAddressMode
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
enum SamplerFilterMode
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
enum TargetType
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
enum InternalFormat
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
enum Format
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
enum Attachment
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
enum ValueType
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
enum Usage 
{
    ReadOnly,
    WriteOnly,
    ReadWrite
};


//============================================================================
// Flags to explicity pass single bits of information which change the
// context's behaviour.
//============================================================================


/**
 * @brief 
 */
enum TextureFlags
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
enum VertexBufferFlags 
{
    Static = 0,
    Dynamic = 1 << 0
};


/**
 * @brief 
 */
enum IndexBufferFlags 
{
    Static = 0,
    Dynamic = 1 << 0
};


/**
 * @brief
 */
enum UniformBufferFlags 
{
    Static = 0,
    Dynamic = 1 << 0
};


/**
 * @brief
 */
class VertexAttribute 
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
class VertexLayout 
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
interface GraphicsSettings 
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
interface TextureProps
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
};  


/**
 * @brief
 */
interface SamplerProps 
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
interface VertexBufferProps 
{
    data : VertexData;
    byteSize : number;
};



/**
 * @brief
 */
interface IndexBufferProps 
{
    data : VertexData;
    byteSize : number;
};



/**
 * @brief
 */
interface UniformBufferProps 
{
    data : VertexData;
    byteSize : number;
};



/**
 * @brief
 */
interface VertexLayoutProps 
{
    attributes : VertexAttribute[];
    count : number;
};



/**
 * @brief 
 */
interface ProgramProps 
{
    vertCode : string;
    fragCode : string;
};



/**
 * @brief
 */
interface ResourceProps 
{
    name : string;
    type : ResourceType;
    data : number | string | VertexData;
};



/**
 * @brief
 */
interface VertexInputProps 
{
    vBuffer : VertexBuffer;
    layout : VertexLayout;
    iBuffer : IndexBuffer | null;
};



/**
 * @brief
 */
interface ShaderProps 
{
    program : Program;
    resources : Resource[];
    count : number;
};




/**
 * @brief
 */
interface FrameBufferProps 
{
    attachments : FrameBufferAttachment[];
    count : number;
};



/**
 * @brief
 */
interface FrameBufferAttachment 
{
    texture : Texture;
    attachment : Attachment;
};


/**
 * @brief 
 */
interface Extent 
{
    width : number;
    height : number;
};


/**
 * @brief 
 */
interface Transform 
{
    pModel : number;
    matrixCount : number;
};






export {
    VertexData, SamplerAddressMode, Transform, TargetType, TextureFlags, 
    ValueType, VertexBufferFlags, IndexBufferFlags, InternalFormat,
    Extent, FrameBufferAttachment, GraphicsBackend, GraphicsSettings, 
    Attachment, Attribute, ResourceType, Format, SamplerFilterMode,
    UniformBufferFlags, VertexAttribute, VertexLayout, TextureProps,
    FrameBufferProps, VertexBufferProps, VertexLayoutProps, IndexBufferProps,
    UniformBufferProps, SamplerProps, ProgramProps, VertexInputProps, ResourceProps, ShaderProps, 
    Usage
}