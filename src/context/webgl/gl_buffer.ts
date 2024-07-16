import { IndexBuffer, UniformBuffer, VertexBuffer } from "../../graphics";
import { IndexBufferProps, VertexBufferProps, VertexData } from "../../types";
import { gl } from "./gl_context";


/**
 * @brief Constructs a GLVertexBuffer from vertices and a BufferLayout.
 */
export class GLVertexBuffer extends VertexBuffer
{
    constructor()
    {
        super();

        this.vbo = 0;
        this.byteSize = 0;
    }

    public override create(props : VertexBufferProps) : void 
    {
        this.byteSize = props.byteSize;

        const id = gl.createBuffer();
        if(id) 
        {
            this.vbo = id;
        }

        gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo);
        gl.bufferData(gl.ARRAY_BUFFER, props.data, gl.STATIC_DRAW);
        gl.bindBuffer(gl.ARRAY_BUFFER, 0);
    }

    public override update(data: VertexData, byteOffset : number) : void 
    {
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo);
        gl.bufferSubData(gl.ARRAY_BUFFER, byteOffset, data);
        gl.bindBuffer(gl.ARRAY_BUFFER, 0);
    }

    public override destroy() : void 
    {
        gl.deleteBuffer(this.vbo);
        this.vbo = 0;
    }   

    public getContextHandle() : WebGLBuffer { return this.vbo; }
    public getByteSize() : number { return this.byteSize; }

    private vbo : WebGLBuffer;
    private byteSize : number;
};


/**
 * @brief Constructs a GLIndexBuffer from vertices and a BufferLayout.
 */
export class GLIndexBuffer extends IndexBuffer
{
    constructor()
    {
        super();
        this.ebo = 0;
        this.byteSize = 0;
    }

    public override create(props : IndexBufferProps) : void 
    {
        this.byteSize = props.byteSize;

        const id = gl.createBuffer();
        if(id) 
        {
            this.ebo = id;
        }

        gl.bindBuffer(gl.ARRAY_BUFFER, this.ebo);
        gl.bufferData(gl.ARRAY_BUFFER, props.data, gl.STATIC_DRAW);
        gl.bindBuffer(gl.ARRAY_BUFFER, 0);
    }

    public override update(data: VertexData, byteOffset : number) : void 
    {
        gl.bindBuffer(gl.ARRAY_BUFFER, this.ebo);
        gl.bufferSubData(gl.ARRAY_BUFFER, byteOffset, data);
        gl.bindBuffer(gl.ARRAY_BUFFER, 0);
    }

    public override destroy() : void 
    {
        gl.deleteBuffer(this.ebo);
        this.ebo = 0;
    }   

    public getContextHandle() : WebGLBuffer { return this.ebo; }
    public getByteSize() : number { return this.byteSize; }

    private ebo : WebGLBuffer;
    private byteSize : number;
};


/**
 * @brief Constructs a GLUnfiormBuffer from vertices and a BufferLayout.
 */
export class GLUniformBuffer extends UniformBuffer
{
    constructor()
    {
        super();

        this.ubo = 0;
        this.byteSize = 0;
    }

    public override create(props : IndexBufferProps) : void 
    {
        this.byteSize = props.byteSize;

        const id = gl.createBuffer();
        if(id) 
        {
            this.ubo = id;
        }

        gl.bindBuffer(gl.ARRAY_BUFFER, this.ubo);
        gl.bufferData(gl.ARRAY_BUFFER, props.data, gl.STATIC_DRAW);
        gl.bindBuffer(gl.ARRAY_BUFFER, 0);
    }

    public override update(data: VertexData, byteOffset : number) : void 
    {
        gl.bindBuffer(gl.ARRAY_BUFFER, this.ubo);
        gl.bufferSubData(gl.ARRAY_BUFFER, byteOffset, data);
        gl.bindBuffer(gl.ARRAY_BUFFER, 0);
    }

    public override destroy() : void 
    {
        gl.deleteBuffer(this.ubo);
        this.ubo = 0;
    }   

    public getContextHandle() : WebGLBuffer { return this.ubo; }
    public getByteSize() : number { return this.byteSize; }

    private ubo : WebGLBuffer;
    private byteSize : number;
};

