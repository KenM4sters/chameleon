"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.SphereGeometry = exports.BoxGeometry = exports.Geometry = void 0;
var export_1 = require("../export");
var Geometry = /** @class */ (function () {
    function Geometry() {
    }
    return Geometry;
}());
exports.Geometry = Geometry;
/**
 * @brief Handles all the VertexBuffer, IndexBuffer and VertexArray constructions to simplify
 * geometry creation. Together with a Material instance, this can be used to construct a Mesh
 * instance that will be rendered by the Scene.
 */
var BoxGeometry = /** @class */ (function (_super) {
    __extends(BoxGeometry, _super);
    function BoxGeometry() {
        var _this = _super.call(this) || this;
        var cubeBuffer = new export_1.VertexBuffer(export_1.Primitives.Vertices.cubePNT);
        var elements = new Array(new export_1.BufferAttribute(3, 12, "aPosition"), new export_1.BufferAttribute(3, 12, "aNormal"), new export_1.BufferAttribute(2, 8, "aUV"));
        var layout = new export_1.BufferAttribLayout(elements);
        cubeBuffer.SetLayout(layout);
        _this.vertexArray = new export_1.VertexArray(cubeBuffer);
        return _this;
    }
    BoxGeometry.prototype.GetVertexArray = function () { return this.vertexArray; };
    return BoxGeometry;
}(Geometry));
exports.BoxGeometry = BoxGeometry;
;
/**
 * @brief Similar to BoxGeometry, but constructs a Sphere of a given radius and number of width
 * and height segments.
 */
var SphereGeometry = /** @class */ (function (_super) {
    __extends(SphereGeometry, _super);
    /**
     * @brief Constructs a Sphere instance of a given radius and number of width and height segments.
     * @param radius Radius of the sphere.
     * @param latCount Number of segments along the y-axis.
     * @param lonCount Number of segments along the x-axis.
     */
    function SphereGeometry(radius, latCount, lonCount) {
        var _this = _super.call(this) || this;
        var data = GenerateCompleteSphere(radius, latCount, lonCount);
        _this.verticesCount = data.vertices.length / 8;
        var cubeBuffer = new export_1.VertexBuffer(data.vertices);
        var elements = new Array(new export_1.BufferAttribute(3, 12, "aPosition"), new export_1.BufferAttribute(3, 12, "aNormal"), new export_1.BufferAttribute(2, 8, "aUV"));
        var layout = new export_1.BufferAttribLayout(elements);
        cubeBuffer.SetLayout(layout);
        var EBO = new export_1.IndexBuffer(data.indices);
        _this.vertexArray = new export_1.VertexArray(cubeBuffer, EBO);
        return _this;
    }
    SphereGeometry.prototype.GetVertexArray = function () { return this.vertexArray; };
    return SphereGeometry;
}(Geometry));
exports.SphereGeometry = SphereGeometry;
;
function GenerateCompleteSphere(radius, stackCount, sectorCount) {
    var vert = [];
    var ind = [];
    var x, y, z, xy, nx, ny, nz, s, t, i, j, k1, k2, kk = 0;
    var lengthInv = 1.0 / radius;
    var sectorStep = 2 * Math.PI / sectorCount;
    var stackStep = Math.PI / stackCount;
    var offset = 0;
    for (i = 0; i <= stackCount; ++i) {
        var stackAngle = Math.PI / 2 - i * stackStep; // starting from pi/2 to -pi/2
        xy = radius * Math.cos(stackAngle); // r * cos(u)
        z = radius * Math.sin(stackAngle); // r * sin(u)
        for (j = 0; j <= sectorCount; ++j) {
            var sectorAngle = j * sectorStep; // starting from 0 to 2pi
            // Vertex position
            x = xy * Math.cos(sectorAngle); // r * cos(u) * cos(v)
            y = xy * Math.sin(sectorAngle); // r * cos(u) * sin(v)
            // r * sin(u)
            vert.push(x);
            vert.push(y);
            vert.push(z);
            // Normalized vertex normal
            nx = x * lengthInv;
            ny = y * lengthInv;
            nz = z * lengthInv;
            vert.push(nx);
            vert.push(ny);
            vert.push(nz);
            // Vertex tex coord between [0, 1]
            s = j / sectorCount;
            t = i / stackCount;
            vert.push(s);
            vert.push(t);
            // next
            offset += 3;
            offset += 3;
            offset += 2;
        }
    }
    for (i = 0; i < stackCount; ++i) {
        k1 = i * (sectorCount + 1); // beginning of current stack
        k2 = k1 + sectorCount + 1; // beginning of next stack
        for (j = 0; j < sectorCount; ++j, ++k1, ++k2) {
            // 2 triangles per sector excluding 1st and last stacks
            if (i != 0) {
                ind[kk] = (k1); // k1---k2---k1+1
                ind[kk + 1] = (k2); // k1---k2---k1+1
                ind[kk + 2] = (k1 + 1); // k1---k2---k1+1
                kk += 3;
            }
            if (i != (stackCount - 1)) {
                ind[kk] = (k1 + 1); // k1---k2---k1+1
                ind[kk + 1] = (k2); // k1---k2---k1+1
                ind[kk + 2] = (k2 + 1); // k1---k2---k1+1
                kk += 3;
            }
        }
    }
    var vertices = new Float32Array(vert);
    var indices = new Uint16Array(ind);
    return { vertices: vertices, indices: indices };
}
function GenerateCompletePlane(w, h, wSegments, hSegments) {
    var vert = [];
    var ind = [];
    for (var y = 0; y <= hSegments; y++) {
        for (var x = 0; x <= wSegments; x++) {
            var u = x / wSegments;
            var v = y / hSegments;
            var posX = u * w - w / 2; // Center the plane
            var posZ = v * h - h / 2; // Center the plane
            vert.push(posX, 0.0, posZ);
            vert.push(0.0, 1.0, 0.0);
            // Store UV coordinates
            // vert.push(x % 2 ? 0.0 : 1.0);
            // vert.push(y % 2 ? 0.0 : 1.0);
            vert.push(u);
            vert.push(v);
        }
    }
    for (var y = 0; y < hSegments; y++) {
        for (var x = 0; x < wSegments; x++) {
            var v0 = y * (wSegments + 1) + x;
            var v1 = v0 + 1;
            var v2 = (y + 1) * (wSegments + 1) + x;
            var v3 = v2 + 1;
            ind.push(v0, v1, v2);
            ind.push(v1, v3, v2);
        }
    }
    var vertices = new Float32Array(vert);
    var indices = new Uint16Array(ind);
    return { vertices: vertices, indices: indices };
}
