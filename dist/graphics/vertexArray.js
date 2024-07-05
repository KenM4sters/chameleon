"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VertexArray = void 0;
var buffer_1 = require("./buffer");
var webgl_1 = require("../webgl");
/**
 * @brief A VertexArray instance should be used in conjunction with a VertexBuffer and/or
 * IndexBuffer instance to accurately decsribe the vertices in the vertex buffer.
 */
var VertexArray = /** @class */ (function () {
    /**
     * @brief Constructs a WebGLVertexArray instance and defines the necessary layout attributes
     * for the given vertex buffer.
     * @param vBuffer The vertex buffer that contains the vertex data that this vertex array will describe.
     * @param iBuffer The index buffer that corresponds to the vertex buffer, null by default.
     */
    function VertexArray(vBuffer, iBuffer) {
        if (iBuffer === void 0) { iBuffer = null; }
        this.id = { val: null };
        this.indexBuffer = null;
        this.vertexBuffer = vBuffer;
        this.indexBuffer = iBuffer;
        var webgl = webgl_1.WebGL.GetInstance();
        var gl = webgl.gl;
        this.id = { val: gl.createVertexArray() };
        gl.bindVertexArray(this.id.val);
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer_1.VertexBuffer.Id.val);
        if (this.indexBuffer) {
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffer_1.IndexBuffer.Id.val);
        }
        var layoutLoc = 0;
        for (var _i = 0, _a = this.vertexBuffer.GetUniqueLayout().GetAttributes(); _i < _a.length; _i++) {
            var attrib = _a[_i];
            var uniqueLayout = this.vertexBuffer.GetUniqueLayout();
            var layoutOffset = buffer_1.VertexBuffer.cachedSize - (this.vertexBuffer.GetUniqueVertexData().length * this.vertexBuffer.GetUniqueVertexData().BYTES_PER_ELEMENT); // computes the offset due to preceding layouts.
            gl.vertexAttribPointer(layoutLoc, attrib.count, gl.FLOAT, false, uniqueLayout.stride, layoutOffset + attrib.offset);
            gl.enableVertexAttribArray(layoutLoc);
            layoutLoc++;
        }
        gl.bindVertexArray(null);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
    }
    // Getters
    VertexArray.prototype.GetId = function () { return this.id; };
    VertexArray.prototype.GetVertexBuffer = function () { return this.vertexBuffer; };
    VertexArray.prototype.GetIndexBuffer = function () { return this.indexBuffer; };
    return VertexArray;
}());
exports.VertexArray = VertexArray;
;
