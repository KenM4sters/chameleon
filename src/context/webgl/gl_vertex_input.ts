import { Ref } from "../../types";
import { GLIndexBuffer, GLVertexBuffer } from "./gl_buffer";
import { GLRenderer } from "./gl_renderer";



/**
 * @brief A GLVertexInput instance should be used in conjunction with a GLVertexBuffer and/or 
 * GLIndexBuffer instance to accurately decsribe the vertices in the vertex buffer. 
 */
export class GLVertexInput extends IVertexInput 
{
    /**
     * @brief Constructs a WebGLVertexArray instance and defines the necessary layout attributes
     * for the given vertex buffer.
     * @param vBuffer The vertex buffer that contains the vertex data that this vertex array will describe.
     * @param iBuffer The index buffer that corresponds to the vertex buffer, null by default.
     */
    constructor(vertices : Float32Array, attributes : BufferAttribute[], indices : Uint32Array) 
    {
        super();

        this.vertexBuffer = vBuffer;
        this.indexBuffer = iBuffer;
        
        const gl = GLRenderer.gl;

        this.id = {val: gl.createVertexArray()};
        gl.bindVertexArray(this.id.val);
        gl.bindBuffer(gl.ARRAY_BUFFER, GLVertexBuffer.Id.val);

        if(this.indexBuffer) 
        {
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, GLIndexBuffer.Id.val);
        }
 
        var layoutLoc = 0;
        for(const attrib of this.vertexBuffer.uniqueLayout.attributes) 
        {
            var uniqueLayout = this.vertexBuffer.uniqueLayout;
            var layoutOffset = GLVertexBuffer.cachedSize - (this.vertexBuffer.uniqueVertexData.length * this.vertexBuffer.uniqueVertexData.BYTES_PER_ELEMENT); // computes the offset due to preceding layouts.
            
            gl.vertexAttribPointer(layoutLoc, attrib.count, gl.FLOAT, false, uniqueLayout.stride, layoutOffset + attrib.offset);
            gl.enableVertexAttribArray(layoutLoc);

            layoutLoc++; 
        }

        gl.bindVertexArray(null);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
    } 
    
    public readonly id : Ref<WebGLVertexArrayObject | null> = {val: null};
    public readonly vertexBuffer : GLVertexBuffer; 
    public readonly indexBuffer : GLIndexBuffer | null = null;

};