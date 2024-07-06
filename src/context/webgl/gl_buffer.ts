import { BufferAttribLayout } from "../../core/vertex_layout";
import { Ref } from "../../utils";
import { IBuffer } from "../buffer";
import { GLRenderer } from "./gl_renderer";


export class GLBuffer extends IBuffer 
{
    constructor() 
    {
        super();
    }
};

/**
 * @brief Constructs a WebGLBuffer from vertices and a BufferLayout.
 */
export class GLVertexBuffer extends GLBuffer
{
    constructor(vertices : Float32Array, layout : BufferAttribLayout)
    {
        super();

        this.uniqueVertexData = vertices;
        
        // Cache new vertex data into a single shared Float32Array.
        var temp = new Float32Array(GLVertexBuffer.cachedVertexData.length + this.uniqueVertexData.length);
        temp.set(GLVertexBuffer.cachedVertexData, 0);
        temp.set(this.uniqueVertexData, GLVertexBuffer.cachedVertexData.length);
        GLVertexBuffer.cachedVertexData = temp;

        // Set the layout of our updated cached vertex data;
        this.uniqueLayout = layout;

        // Update existing layout properties to reflect the new layout.
        this.uniqueSize = this.uniqueVertexData.length * this.uniqueVertexData.BYTES_PER_ELEMENT
        this.uniqueOffset = GLVertexBuffer.cachedSize;
        this.nUniqueVertices = this.uniqueSize / this.uniqueLayout.size;
                
        GLVertexBuffer.cachedSize += this.uniqueSize;
        this.PushLayoutToBuffer();

        const gl = GLRenderer.gl;
        
        if(!GLVertexBuffer.Id.val) 
        {
            GLVertexBuffer.Id.val = gl.createBuffer();
        };

        gl.bindBuffer(gl.ARRAY_BUFFER, GLVertexBuffer.Id.val);
        gl.bufferData(gl.ARRAY_BUFFER, GLVertexBuffer.cachedVertexData, gl.STATIC_DRAW);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
    }

    public PushLayoutToBuffer() : void 
    {
        GLVertexBuffer.cachedLayout.concat(this.uniqueLayout); 
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
export class GLIndexBuffer   
{
    constructor(indices : Uint16Array | Uint32Array) 
    {
        this.uniqueIndices = indices;
        this.uniqueOffset = GLIndexBuffer.cachedSize;
        this.uniqueSize = this.uniqueIndices.length * 2; // 16 bits = 2 bytes.

        var temp = new Uint16Array(GLIndexBuffer.cachedIndices.length + this.uniqueIndices.length);
        temp.set(GLIndexBuffer.cachedIndices, 0);
        temp.set(this.uniqueIndices, GLIndexBuffer.cachedIndices.length);

        GLIndexBuffer.cachedIndices = temp;
        GLIndexBuffer.cachedSize = GLIndexBuffer.cachedIndices.length * 2; // 16 bits = 2 bytes.
        
        const gl = GLRenderer.gl;

        if(!GLIndexBuffer.Id.val) 
        {
            GLIndexBuffer.Id.val = gl.createBuffer();
        };
        
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, GLIndexBuffer.Id.val);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, GLIndexBuffer.cachedIndices, gl.STATIC_DRAW);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
    }

    public static cachedIndices : Uint16Array = new Uint16Array();
    public static cachedSize : number = 0;
    public static Id : Ref<WebGLBuffer | null> = {val: null}

    public readonly uniqueIndices : Uint16Array | Uint32Array;
    public readonly uniqueOffset : number;
    public readonly uniqueSize : number;
};

