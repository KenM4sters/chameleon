"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Primitives = void 0;
var export_1 = require("./export");
/**
 * @brief Very simple wrapper around some common vertices (square, cube etc) used by the
 * geometry classes.
 */
var Primitives;
(function (Primitives) {
    var Square = /** @class */ (function () {
        function Square(vertSrc, fragSrc) {
            this.shader = new export_1.Shader(vertSrc, fragSrc);
            var cubeBuffer = new export_1.VertexBuffer(Primitives.Vertices.squarePNT);
            var elements = new Array(new export_1.BufferAttribute(3, 12, "aPosition"), new export_1.BufferAttribute(3, 12, "aNormal"), new export_1.BufferAttribute(2, 8, "aUV"));
            var layout = new export_1.BufferAttribLayout(elements);
            cubeBuffer.SetLayout(layout);
            this.vertexArray = new export_1.VertexArray(cubeBuffer);
        }
        Square.prototype.GetVertexArray = function () { return this.vertexArray; };
        Square.prototype.GetShader = function () { return this.shader; };
        return Square;
    }());
    Primitives.Square = Square;
    ;
    var Vertices = /** @class */ (function () {
        function Vertices() {
        }
        Vertices.cubePNT = new Float32Array([
            //  back
            -1.0, -1.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0,
            1.0, -1.0, -1.0, 0.0, 0.0, -1.0, 1.0, 0.0,
            1.0, 1.0, -1.0, 0.0, 0.0, -1.0, 1.0, 1.0,
            1.0, 1.0, -1.0, 0.0, 0.0, -1.0, 1.0, 1.0,
            -1.0, 1.0, -1.0, 0.0, 0.0, -1.0, 0.0, 1.0,
            -1.0, -1.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0,
            // front
            -1.0, -1.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0,
            1.0, -1.0, 1.0, 0.0, 0.0, 1.0, 1.0, 0.0,
            1.0, 1.0, 1.0, 0.0, 0.0, 1.0, 1.0, 1.0,
            1.0, 1.0, 1.0, 0.0, 0.0, 1.0, 1.0, 1.0,
            -1.0, 1.0, 1.0, 0.0, 0.0, 1.0, 0.0, 1.0,
            -1.0, -1.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0,
            // left
            -1.0, 1.0, 1.0, -1.0, 0.0, 0.0, 1.0, 0.0,
            -1.0, 1.0, -1.0, -1.0, 0.0, 0.0, 1.0, 1.0,
            -1.0, -1.0, -1.0, -1.0, 0.0, 0.0, 0.0, 1.0,
            -1.0, -1.0, -1.0, -1.0, 0.0, 0.0, 0.0, 1.0,
            -1.0, -1.0, 1.0, -1.0, 0.0, 0.0, 0.0, 0.0,
            -1.0, 1.0, 1.0, -1.0, 0.0, 0.0, 1.0, 0.0,
            // right
            1.0, 1.0, 1.0, 1.0, 0.0, 0.0, 1.0, 0.0,
            1.0, 1.0, -1.0, 1.0, 0.0, 0.0, 1.0, 1.0,
            1.0, -1.0, -1.0, 1.0, 0.0, 0.0, 0.0, 1.0,
            1.0, -1.0, -1.0, 1.0, 0.0, 0.0, 0.0, 1.0,
            1.0, -1.0, 1.0, 1.0, 0.0, 0.0, 0.0, 0.0,
            1.0, 1.0, 1.0, 1.0, 0.0, 0.0, 1.0, 0.0,
            // bottom
            -1.0, -1.0, -1.0, 0.0, -1.0, 0.0, 0.0, 1.0,
            1.0, -1.0, -1.0, 0.0, -1.0, 0.0, 1.0, 1.0,
            1.0, -1.0, 1.0, 0.0, -1.0, 0.0, 1.0, 0.0,
            1.0, -1.0, 1.0, 0.0, -1.0, 0.0, 1.0, 0.0,
            -1.0, -1.0, 1.0, 0.0, -1.0, 0.0, 0.0, 0.0,
            -1.0, -1.0, -1.0, 0.0, -1.0, 0.0, 0.0, 1.0,
            // top
            -1.0, 1.0, -1.0, 0.0, 1.0, 0.0, 0.0, 1.0,
            1.0, 1.0, -1.0, 0.0, 1.0, 0.0, 1.0, 1.0,
            1.0, 1.0, 1.0, 0.0, 1.0, 0.0, 1.0, 0.0,
            1.0, 1.0, 1.0, 0.0, 1.0, 0.0, 1.0, 0.0,
            -1.0, 1.0, 1.0, 0.0, 1.0, 0.0, 0.0, 0.0,
            -1.0, 1.0, -1.0, 0.0, 1.0, 0.0, 0.0, 1.0
        ]);
        Vertices.squarePNT = new Float32Array([
            1.0, 1.0, 0.0, 0.0, 0.0, 1.0, 1.0, 1.0,
            1.0, -1.0, 0.0, 0.0, 0.0, 1.0, 1.0, 0.0,
            -1.0, -1.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0,
            -1.0, -1.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0,
            -1.0, 1.0, 0.0, 0.0, 0.0, 1.0, 0.0, 1.0,
            1.0, 1.0, 0.0, 0.0, 0.0, 1.0, 1.0, 1.0
        ]);
        return Vertices;
    }());
    Primitives.Vertices = Vertices;
    ;
    var Indices = /** @class */ (function () {
        function Indices() {
        }
        Indices.square = new Uint16Array([
            0, 1, 3,
            1, 2, 3
        ]);
        Indices.cube = new Uint16Array([
            // Front face
            0, 1, 3,
            1, 2, 3,
            // Right face
            4, 5, 6,
            6, 7, 4,
            // Back face
            8, 9, 10,
            10, 11, 8,
            // Left face
            12, 13, 14,
            14, 15, 12,
            // Top face
            16, 17, 18,
            18, 19, 16,
            // Bottom face
            20, 21, 22,
            22, 23, 20
        ]);
        return Indices;
    }());
    Primitives.Indices = Indices;
    ;
})(Primitives || (exports.Primitives = Primitives = {}));
;
