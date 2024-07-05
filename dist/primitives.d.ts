import { Shader, VertexArray } from "./export";
/**
 * @brief Very simple wrapper around some common vertices (square, cube etc) used by the
 * geometry classes.
 */
export declare namespace Primitives {
    class Square {
        constructor(vertSrc: string, fragSrc: string);
        GetVertexArray(): VertexArray;
        GetShader(): Shader;
        private vertexArray;
        private shader;
    }
    class Vertices {
        private constructor();
        static cubePNT: Float32Array;
        static squarePNT: Float32Array;
    }
    class Indices {
        private constructor();
        static square: Uint16Array;
        static cube: Uint16Array;
    }
}
