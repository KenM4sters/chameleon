import { IndexBuffer, VertexBuffer } from "./buffer";
import { Ref } from "../webgl";
/**
 * @brief A VertexArray instance should be used in conjunction with a VertexBuffer and/or
 * IndexBuffer instance to accurately decsribe the vertices in the vertex buffer.
 */
export declare class VertexArray {
    /**
     * @brief Constructs a WebGLVertexArray instance and defines the necessary layout attributes
     * for the given vertex buffer.
     * @param vBuffer The vertex buffer that contains the vertex data that this vertex array will describe.
     * @param iBuffer The index buffer that corresponds to the vertex buffer, null by default.
     */
    constructor(vBuffer: VertexBuffer, iBuffer?: IndexBuffer | null);
    GetId(): Ref<WebGLVertexArrayObject | null>;
    GetVertexBuffer(): VertexBuffer;
    GetIndexBuffer(): IndexBuffer | null;
    private id;
    private vertexBuffer;
    private indexBuffer;
}
