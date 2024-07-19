import { VertexInput } from "../common/context";
import { VertexAttribute, VertexInputProps, VertexLayout } from "../../graphics";
import { GLIndexBuffer, GLVertexBuffer } from "./gl_buffer";
import { gl } from "./gl_context";



/**
 * @brief A GLVertexInput instance should be used in conjunction with a GLVertexBuffer and/or 
 * GLIndexBuffer instance to accurately decsribe the vertices in the vertex buffer. 
 */
export class GLVertexInput extends VertexInput 
{
    constructor() 
    {
        super();

        this.vao = 0;
        this.indexBuffer = null;
        this.verticesCount = 0;
    } 
    
    /**
     * @brief Constructs a WebGLVertexArray instance and defines the necessary layout attributes
     * for the given vertex buffer.
     * @param vBuffer The vertex buffer that contains the vertex data that this vertex array will describe.
     * @param iBuffer The index buffer that corresponds to the vertex buffer, null by default.
     */
    public override create(props: VertexInputProps): void 
    {

        this.vertexBuffer = props.vBuffer as GLVertexBuffer;
        this.layout = props.layout;
        this.indexBuffer = props.iBuffer as GLIndexBuffer;
        this.verticesCount = props.verticesCount;

        const id = gl.createVertexArray();

        if(!id) 
        {
            throw new Error("Failed to create vertex array object!");
        }

        this.vao = id;

        gl.bindVertexArray(this.vao);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer.getContextHandle());
        if(this.indexBuffer) 
        {
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer.getContextHandle());
        }
 
        for(let i = 0; i < this.layout.attributes.length; i++)  
        {            
            const attrib = this.layout.attributes[i];
            gl.vertexAttribPointer(i, attrib.count, gl.FLOAT, false, this.layout.stride, attrib.byteOffset);
            gl.enableVertexAttribArray(i);
        }

        gl.bindVertexArray(null);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
    }

    public override destroy(): void 
    {
        this.vertexBuffer.destroy();
        this.indexBuffer?.destroy();

        gl.deleteVertexArray(this.vao);
        this.vao = 0;
    }

    public override getVerticesCount(): number { return this.verticesCount; }
    public getContextHandle() : WebGLVertexArrayObject { return this.vao; }
    public getVertexBuffer() : GLVertexBuffer { return this.vertexBuffer; }
    public getIndexBuffer() : GLIndexBuffer | null { return this.indexBuffer; }

    private vao : WebGLVertexArrayObject;
    private vertexBuffer !: GLVertexBuffer; 
    private layout !: VertexLayout;
    private indexBuffer : GLIndexBuffer | null = null;
    private verticesCount : number;

};