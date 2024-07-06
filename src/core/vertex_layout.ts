

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
export class BufferAttribLayout
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