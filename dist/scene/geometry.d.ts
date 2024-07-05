import { VertexArray } from "../export";
export declare abstract class Geometry {
    constructor();
}
/**
 * @brief Handles all the VertexBuffer, IndexBuffer and VertexArray constructions to simplify
 * geometry creation. Together with a Material instance, this can be used to construct a Mesh
 * instance that will be rendered by the Scene.
 */
export declare class BoxGeometry extends Geometry {
    constructor();
    GetVertexArray(): VertexArray;
    private vertexArray;
}
/**
 * @brief Similar to BoxGeometry, but constructs a Sphere of a given radius and number of width
 * and height segments.
 */
export declare class SphereGeometry extends Geometry {
    /**
     * @brief Constructs a Sphere instance of a given radius and number of width and height segments.
     * @param radius Radius of the sphere.
     * @param latCount Number of segments along the y-axis.
     * @param lonCount Number of segments along the x-axis.
     */
    constructor(radius: number, latCount: number, lonCount: number);
    GetVertexArray(): VertexArray;
    verticesCount: number;
    private vertexArray;
}
