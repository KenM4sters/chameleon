import { GLRenderer } from "./context/webgl/gl_renderer";


/**
 * @brief Wrapper around any variable to ensure that it's passed by reference and not value.
 */
export class Ref<T> 
{
    constructor(public val : T) {};
};

export enum GraphicsBackend 
{
    OpenGL,
    Vulkan
};

export enum SamplerWrapType 
{
    WrapS,
    WrapT,
    WrapR
};

export enum SamplerWrapMode
{
    Repeat,
    MirroredRepeat,
    ClampToEdge,
    ClampToBorder
};

export enum SamplerFilterMode 
{
    Nearest,
    Linear
};

export enum Dimension 
{
    Texture2D,
    Texture3D,
    TextureCube
};

export enum TextureInternalFormat 
{
    R16F,
    RG,
    RG16F,
    RGB,
    RGB16F,
    RBG32F,
    RGBA,
    RGBA16F,
    RGBA32F,
    DepthStencil16F 
};

export enum TextureFormat 
{
    R,
    RG,
    RGB,
    RGBA,
};


export enum DrawMode 
{
    Arrays,
    Indexed
};

export enum DrawShape
{
    Triangles,
    TrianglesList,
    TrianglesFan,
    Points
};


/**
 * @brief Holds information about a specific part of a single vertex.
 * Usually either position, normal or UV coordinates. 
 * This informatinon is required by the BufferAttribLayout class in order for the 
 * corresponding VertexArray instance to accurately describe the layout information.
 */
export class BufferAttribute 
{   
    /**
     * @brief Constructs a BufferAttribute instance.
     * @param count The number of elements for this attribute (probably 2 for 2D applications and 3 for 3D).
     * @param size The total size of the attribute (likely to be 4 (size of a float) * the count).
     * @param name The debug name for this attribute (not used by WebGL).
     */
    constructor(count : number, size: number, name : string) 
    {
        this.count = count;
        this.size = size;
        this.name = name;
        // We need more context about the overall BufferAttribLayout in order 
        // to define its offset in the layout.
        this.offset = 0;
    }

    public name : string;
    public offset : number;
    public size : number;
    public count : number;
}

/**
 * @brief Holds an array of BufferAttributes to wholly describe a single vertex, which is
 * used by the corresponding VertexArray instance to set the layout information.
 */
export class VertexInput
{
    /**
     * @brief Constructs a new BufferAttribLayout from an array of BufferAttributes.
     * @param elements The array of BufferAttributes that together define each attribute for a single
     * vertex.
     */
    constructor(elements : Array<BufferAttribute>) 
    {
        this.attributes = this.attributes.concat(elements);
        this.CalculateStrideAndOffsets();
        this.CaclulateAttributesSize();
    }

    /**
     * @brief Pushes a new BufferAttribute and updates this layout. 
     * @param element The BufferAttribute to be added.
     */
    public PushElement(element : BufferAttribute) : void 
    {
        this.attributes.push(element);
        this.CalculateStrideAndOffsets();
        this.CaclulateAttributesSize();
    }
    /**
     * @brief Pushes an array of BufferAttributes and updates this layout. 
     * @param element The BufferAttribute to be added.
     */
    public PushElementArray(elements : Array<BufferAttribute>) : void 
    {
        this.attributes = this.attributes.concat(elements);
        this.CalculateStrideAndOffsets();
        this.CaclulateAttributesSize();
    }

    /**
     * @brief Very important function that calculates the total stride for a single vertex
     * and an offset for each attribute into that vertex.
     */
    private CalculateStrideAndOffsets() : void 
    {
        var offset : number = 0;
        for(const element of this.attributes) 
        {
            element.offset = offset;
            offset += element.size;
            this.stride += element.size;
        }
    }

    /**
     * @brief Calculates the total size of a vertex from the size of each attribute.
     */
    private CaclulateAttributesSize() : void 
    {
        for(const atttrib of this.attributes) 
        {
            this.size += atttrib.size;
        }

    }   

    // Getters
    public GetAttributes() : Array<BufferAttribute> { return this.attributes; }

    public attributes : Array<BufferAttribute> = []; 
    public size : number = 0;
    public stride : number = 0;
}



export class Graphics 
{
    constructor(canvas : HTMLCanvasElement) 
    {
        Graphics.canvas = canvas;
        Graphics.gl = canvas.getContext("webgl2") as WebGL2RenderingContext;

        window.addEventListener("resize", () => this.Resize());

        this.renderer = new GLRenderer();

    }

    /**
     * @brief Called whenever the window is resized, and resizes the canvas to match, for now
     * at least, the new window dimensions. Resize() is then called on the renderer with the new
     * dimensions.
     */
    private Resize() : void 
    {
        if(Graphics.canvas.width != window.innerWidth || Graphics.canvas.height != window.innerHeight)
        {
            Graphics.canvas.width = window.innerWidth;
            Graphics.canvas.height = window.innerHeight;
        }

        this.renderer.Resize(Graphics.canvas.width, Graphics.canvas.height);
    }
    
    
    public static canvas : HTMLCanvasElement;
    public static gl : WebGL2RenderingContext;

    private renderer : GLRenderer;
};