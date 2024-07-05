import { Ref } from "../webgl";
/**
 * @brief Holds information about a specific part of a single vertex.
 * Usually either position, normal or UV coordinates.
 * This informatinon is required by the BufferAttribLayout class in order for the
 * corresponding VertexArray instance to accurately describe the layout information.
 */
export declare class BufferAttribute {
    /**
     * @brief Constructs a BufferAttribute instance.
     * @param count The number of elements for this attribute (probably 2 for 2D applications and 3 for 3D).
     * @param size The total size of the attribute (likely to be 4 (size of a float) * the count).
     * @param name The debug name for this attribute (not used by WebGL).
     */
    constructor(count: number, size: number, name: string);
    name: string;
    offset: number;
    size: number;
    count: number;
}
/**
 * @brief Holds an array of BufferAttributes to wholly describe a single vertex, which is
 * used by the corresponding VertexArray instance to set the layout information.
 */
export declare class BufferAttribLayout {
    /**
     * @brief Constructs a new BufferAttribLayout from an array of BufferAttributes.
     * @param elements The array of BufferAttributes that together define each attribute for a single
     * vertex.
     */
    constructor(elements: Array<BufferAttribute>);
    attributes: Array<BufferAttribute>;
    size: number;
    stride: number;
    /**
     * @brief Pushes a new BufferAttribute and updates this layout.
     * @param element The BufferAttribute to be added.
     */
    PushElement(element: BufferAttribute): void;
    /**
     * @brief Pushes an array of BufferAttributes and updates this layout.
     * @param element The BufferAttribute to be added.
     */
    PushElementArray(elements: Array<BufferAttribute>): void;
    /**
     * @brief Very important function that calculates the total stride for a single vertex
     * and an offset for each attribute into that vertex.
     */
    private CalculateStrideAndOffsets;
    /**
     * @brief Calculates the total size of a vertex from the size of each attribute.
     */
    private CaclulateAttributesSize;
    GetAttributes(): Array<BufferAttribute>;
}
/**
 * @brief Constructs a WebGLBuffer from vertices and a BufferLayout.
 */
export declare class VertexBuffer {
    constructor(vertices: Float32Array);
    GetUniqueLayout(): BufferAttribLayout;
    GetUniqueVertexData(): Float32Array;
    GetUniqueOffset(): number;
    GetUniqueSize(): number;
    GetVerticesCount(): number;
    /**
     * @brief This function MUST be called after constructing a VertexBuffer instance
     * in order to initalize the information about the vertices that will be used by the
     * corresponding VertexArray instance.
     * @param layout The layout that describes the vertices data.
     */
    SetLayout(layout: BufferAttribLayout): void;
    PushLayoutToBuffer(): void;
    static Id: Ref<WebGLBuffer | null>;
    static cachedVertexData: Float32Array;
    static cachedLayout: Array<BufferAttribLayout>;
    static cachedSize: number;
    private nUniqueVertices;
    private uniqueLayout;
    private uniqueVertexData;
    private uniqueSize;
    private uniqueOffset;
}
/**
 * @brief Sister class of a VertexBuffer to describe the indices for the VertexBuffer.
 * Not necessary, but is recommended for meshes/models with a large number of vertices.
 */
export declare class IndexBuffer {
    constructor(indices: Uint16Array);
    GetUniqueIndices(): Uint16Array;
    GetUniqueOffset(): number;
    GetUniqueSize(): number;
    static cachedIndices: Uint16Array;
    static cachedSize: number;
    static Id: Ref<WebGLBuffer | null>;
    private uniqueIndices;
    private uniqueOffset;
    private uniqueSize;
}
