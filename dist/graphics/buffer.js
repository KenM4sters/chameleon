"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IndexBuffer = exports.VertexBuffer = exports.BufferAttribLayout = exports.BufferAttribute = void 0;
var webgl_1 = require("../webgl");
/**
 * @brief Holds information about a specific part of a single vertex.
 * Usually either position, normal or UV coordinates.
 * This informatinon is required by the BufferAttribLayout class in order for the
 * corresponding VertexArray instance to accurately describe the layout information.
 */
var BufferAttribute = /** @class */ (function () {
    /**
     * @brief Constructs a BufferAttribute instance.
     * @param count The number of elements for this attribute (probably 2 for 2D applications and 3 for 3D).
     * @param size The total size of the attribute (likely to be 4 (size of a float) * the count).
     * @param name The debug name for this attribute (not used by WebGL).
     */
    function BufferAttribute(count, size, name) {
        this.count = count;
        this.size = size;
        this.name = name;
    }
    return BufferAttribute;
}());
exports.BufferAttribute = BufferAttribute;
/**
 * @brief Holds an array of BufferAttributes to wholly describe a single vertex, which is
 * used by the corresponding VertexArray instance to set the layout information.
 */
var BufferAttribLayout = /** @class */ (function () {
    /**
     * @brief Constructs a new BufferAttribLayout from an array of BufferAttributes.
     * @param elements The array of BufferAttributes that together define each attribute for a single
     * vertex.
     */
    function BufferAttribLayout(elements) {
        this.attributes = [];
        this.size = 0;
        this.stride = 0;
        this.attributes = this.attributes.concat(elements);
        this.CalculateStrideAndOffsets();
        this.CaclulateAttributesSize();
    }
    /**
     * @brief Pushes a new BufferAttribute and updates this layout.
     * @param element The BufferAttribute to be added.
     */
    BufferAttribLayout.prototype.PushElement = function (element) {
        this.attributes.push(element);
        this.CalculateStrideAndOffsets();
        this.CaclulateAttributesSize();
    };
    /**
     * @brief Pushes an array of BufferAttributes and updates this layout.
     * @param element The BufferAttribute to be added.
     */
    BufferAttribLayout.prototype.PushElementArray = function (elements) {
        this.attributes = this.attributes.concat(elements);
        this.CalculateStrideAndOffsets();
        this.CaclulateAttributesSize();
    };
    /**
     * @brief Very important function that calculates the total stride for a single vertex
     * and an offset for each attribute into that vertex.
     */
    BufferAttribLayout.prototype.CalculateStrideAndOffsets = function () {
        var offset = 0;
        for (var _i = 0, _a = this.attributes; _i < _a.length; _i++) {
            var element = _a[_i];
            element.offset = offset;
            offset += element.size;
            this.stride += element.size;
        }
    };
    /**
     * @brief Calculates the total size of a vertex from the size of each attribute.
     */
    BufferAttribLayout.prototype.CaclulateAttributesSize = function () {
        for (var _i = 0, _a = this.attributes; _i < _a.length; _i++) {
            var atttrib = _a[_i];
            this.size += atttrib.size;
        }
    };
    // Getters
    BufferAttribLayout.prototype.GetAttributes = function () { return this.attributes; };
    return BufferAttribLayout;
}());
exports.BufferAttribLayout = BufferAttribLayout;
/**
 * @brief Constructs a WebGLBuffer from vertices and a BufferLayout.
 */
var VertexBuffer = /** @class */ (function () {
    function VertexBuffer(vertices) {
        this.uniqueSize = 0;
        this.uniqueOffset = 0;
        this.uniqueVertexData = vertices;
        // Cache new vertex data into a single shared Float32Array.
        var temp = new Float32Array(VertexBuffer.cachedVertexData.length + this.uniqueVertexData.length);
        temp.set(VertexBuffer.cachedVertexData, 0);
        temp.set(this.uniqueVertexData, VertexBuffer.cachedVertexData.length);
        VertexBuffer.cachedVertexData = temp;
    }
    // Getters
    VertexBuffer.prototype.GetUniqueLayout = function () { return this.uniqueLayout; };
    VertexBuffer.prototype.GetUniqueVertexData = function () { return this.uniqueVertexData; };
    VertexBuffer.prototype.GetUniqueOffset = function () { return this.uniqueOffset; };
    VertexBuffer.prototype.GetUniqueSize = function () { return this.uniqueSize; };
    VertexBuffer.prototype.GetVerticesCount = function () { return this.nUniqueVertices; };
    /**
     * @brief This function MUST be called after constructing a VertexBuffer instance
     * in order to initalize the information about the vertices that will be used by the
     * corresponding VertexArray instance.
     * @param layout The layout that describes the vertices data.
     */
    VertexBuffer.prototype.SetLayout = function (layout) {
        // Set the layout of our updated cached vertex data;
        this.uniqueLayout = layout;
        // Update existing layout properties to reflect the new layout.
        this.uniqueSize = this.uniqueVertexData.length * this.uniqueVertexData.BYTES_PER_ELEMENT;
        this.uniqueOffset = VertexBuffer.cachedSize;
        this.nUniqueVertices = this.uniqueSize / this.uniqueLayout.size;
        VertexBuffer.cachedSize += this.uniqueSize;
        this.PushLayoutToBuffer();
        var webgl = webgl_1.WebGL.GetInstance();
        var gl = webgl.gl;
        if (!VertexBuffer.Id.val) {
            VertexBuffer.Id.val = gl.createBuffer();
        }
        ;
        gl.bindBuffer(gl.ARRAY_BUFFER, VertexBuffer.Id.val);
        gl.bufferData(gl.ARRAY_BUFFER, VertexBuffer.cachedVertexData, gl.STATIC_DRAW);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
    };
    VertexBuffer.prototype.PushLayoutToBuffer = function () {
        VertexBuffer.cachedLayout.concat(this.uniqueLayout);
    };
    VertexBuffer.Id = { val: null };
    VertexBuffer.cachedVertexData = new Float32Array();
    VertexBuffer.cachedLayout = new Array();
    VertexBuffer.cachedSize = 0;
    return VertexBuffer;
}());
exports.VertexBuffer = VertexBuffer;
;
/**
 * @brief Sister class of a VertexBuffer to describe the indices for the VertexBuffer.
 * Not necessary, but is recommended for meshes/models with a large number of vertices.
 */
var IndexBuffer = /** @class */ (function () {
    function IndexBuffer(indices) {
        this.uniqueIndices = indices;
        this.uniqueOffset = IndexBuffer.cachedSize;
        this.uniqueSize = this.uniqueIndices.length * 2; // 16 bits = 2 bytes.
        var temp = new Uint16Array(IndexBuffer.cachedIndices.length + this.uniqueIndices.length);
        temp.set(IndexBuffer.cachedIndices, 0);
        temp.set(this.uniqueIndices, IndexBuffer.cachedIndices.length);
        IndexBuffer.cachedIndices = temp;
        IndexBuffer.cachedSize = IndexBuffer.cachedIndices.length * 2; // 16 bits = 2 bytes.
        var webgl = webgl_1.WebGL.GetInstance();
        var gl = webgl.gl;
        if (!IndexBuffer.Id.val) {
            IndexBuffer.Id.val = gl.createBuffer();
        }
        ;
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, IndexBuffer.Id.val);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, IndexBuffer.cachedIndices, gl.STATIC_DRAW);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
    }
    // Getters
    IndexBuffer.prototype.GetUniqueIndices = function () { return this.uniqueIndices; };
    IndexBuffer.prototype.GetUniqueOffset = function () { return this.uniqueOffset; };
    IndexBuffer.prototype.GetUniqueSize = function () { return this.uniqueSize; };
    IndexBuffer.cachedIndices = new Uint16Array();
    IndexBuffer.cachedSize = 0;
    IndexBuffer.Id = { val: null };
    return IndexBuffer;
}());
exports.IndexBuffer = IndexBuffer;
;
