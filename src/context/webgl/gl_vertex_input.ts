import { Ref } from "../../utils";
import { IVertexInput } from "../vertex_input";
import { GLRenderer } from "./gl_renderer";


export class GLVertexInput extends IVertexInput 
{
    constructor(vertices : Float32Array, layout : BufferAttribLayout, indices : Uint16Array | Uint32Array | null)
    {
        super();

        this.vertexBuffer = new VertexBuffer(vertices, layout);

        if(indices) 
        {
            this.indexBuffer = new IndexBuffer(indices)
        } 
        
        this.vertexArray = new VertexArray(this.vertexBuffer, this.indexBuffer);
    }

    public readonly vertexBuffer : VertexBuffer;
    public readonly indexBuffer : IndexBuffer | null = null;
    public readonly vertexArray : VertexArray;
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
    }

    public name : string;
    public offset !: number; // We need more context about the overall BufferAttribLayout in order to define its offset in the layout, so we'll promise the compiler that it will eventually be defined, and before we attempt to access it.
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

/**
 * @brief Constructs a WebGLBuffer from vertices and a BufferLayout.
 */
export class VertexBuffer 
{
    constructor(vertices : Float32Array, layout : BufferAttribLayout)
    {
        this.uniqueVertexData = vertices;
        
        // Cache new vertex data into a single shared Float32Array.
        var temp = new Float32Array(VertexBuffer.cachedVertexData.length + this.uniqueVertexData.length);
        temp.set(VertexBuffer.cachedVertexData, 0);
        temp.set(this.uniqueVertexData, VertexBuffer.cachedVertexData.length);
        VertexBuffer.cachedVertexData = temp;

        // Set the layout of our updated cached vertex data;
        this.uniqueLayout = layout;

        // Update existing layout properties to reflect the new layout.
        this.uniqueSize = this.uniqueVertexData.length * this.uniqueVertexData.BYTES_PER_ELEMENT
        this.uniqueOffset = VertexBuffer.cachedSize;
        this.nUniqueVertices = this.uniqueSize / this.uniqueLayout.size;
                
        VertexBuffer.cachedSize += this.uniqueSize;
        this.PushLayoutToBuffer();

        const gl = GLRenderer.gl;
        
        if(!VertexBuffer.Id.val) 
        {
            VertexBuffer.Id.val = gl.createBuffer();
        };

        gl.bindBuffer(gl.ARRAY_BUFFER, VertexBuffer.Id.val);
        gl.bufferData(gl.ARRAY_BUFFER, VertexBuffer.cachedVertexData, gl.STATIC_DRAW);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
    }

    public PushLayoutToBuffer() : void 
    {
        VertexBuffer.cachedLayout.concat(this.uniqueLayout); 
    }
    
    public static Id : Ref<WebGLBuffer | null> = {val: null}
    public static cachedVertexData : Float32Array = new Float32Array();
    public static cachedLayout : Array<BufferAttribLayout> = new Array<BufferAttribLayout>();
    public static cachedSize : number = 0;
    
    public readonly nUniqueVertices : number;
    public readonly uniqueLayout : BufferAttribLayout;
    public readonly uniqueVertexData : Float32Array;
    public readonly uniqueSize : number = 0
    public readonly uniqueOffset : number = 0;
};



/**
 * @brief Sister class of a VertexBuffer to describe the indices for the VertexBuffer. 
 * Not necessary, but is recommended for meshes/models with a large number of vertices.
 */
export class IndexBuffer   
{
    constructor(indices : Uint16Array | Uint32Array) 
    {
        this.uniqueIndices = indices;
        this.uniqueOffset = IndexBuffer.cachedSize;
        this.uniqueSize = this.uniqueIndices.length * 2; // 16 bits = 2 bytes.

        var temp = new Uint16Array(IndexBuffer.cachedIndices.length + this.uniqueIndices.length);
        temp.set(IndexBuffer.cachedIndices, 0);
        temp.set(this.uniqueIndices, IndexBuffer.cachedIndices.length);

        IndexBuffer.cachedIndices = temp;
        IndexBuffer.cachedSize = IndexBuffer.cachedIndices.length * 2; // 16 bits = 2 bytes.
        
        const gl = GLRenderer.gl;

        if(!IndexBuffer.Id.val) 
        {
            IndexBuffer.Id.val = gl.createBuffer();
        };
        
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, IndexBuffer.Id.val);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, IndexBuffer.cachedIndices, gl.STATIC_DRAW);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
    }

    public static cachedIndices : Uint16Array = new Uint16Array();
    public static cachedSize : number = 0;
    public static Id : Ref<WebGLBuffer | null> = {val: null}

    public readonly uniqueIndices : Uint16Array | Uint32Array;
    public readonly uniqueOffset : number;
    public readonly uniqueSize : number;
};

/**
 * @brief A VertexArray instance should be used in conjunction with a VertexBuffer and/or 
 * IndexBuffer instance to accurately decsribe the vertices in the vertex buffer. 
 */
export class VertexArray 
{
    /**
     * @brief Constructs a WebGLVertexArray instance and defines the necessary layout attributes
     * for the given vertex buffer.
     * @param vBuffer The vertex buffer that contains the vertex data that this vertex array will describe.
     * @param iBuffer The index buffer that corresponds to the vertex buffer, null by default.
     */
    constructor(vBuffer : VertexBuffer, iBuffer : IndexBuffer | null = null) 
    {
        this.vertexBuffer = vBuffer;
        this.indexBuffer = iBuffer;

        const gl = GLRenderer.gl;

        this.id = {val: gl.createVertexArray()};
        gl.bindVertexArray(this.id.val);
        gl.bindBuffer(gl.ARRAY_BUFFER, VertexBuffer.Id.val);

        if(this.indexBuffer) 
        {
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, IndexBuffer.Id.val);
        }
 
        var layoutLoc = 0;
        for(const attrib of this.vertexBuffer.uniqueLayout.attributes) 
        {
            var uniqueLayout = this.vertexBuffer.uniqueLayout;
            var layoutOffset = VertexBuffer.cachedSize - (this.vertexBuffer.uniqueVertexData.length * this.vertexBuffer.uniqueVertexData.BYTES_PER_ELEMENT); // computes the offset due to preceding layouts.
            
            gl.vertexAttribPointer(layoutLoc, attrib.count, gl.FLOAT, false, uniqueLayout.stride, layoutOffset + attrib.offset);
            gl.enableVertexAttribArray(layoutLoc);

            layoutLoc++;
        }

        gl.bindVertexArray(null);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
    } 
    
    public readonly id : Ref<WebGLVertexArrayObject | null> = {val: null};
    public readonly vertexBuffer : VertexBuffer; 
    public readonly indexBuffer : IndexBuffer | null = null;

};