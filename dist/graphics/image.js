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
exports.HDRImage = exports.Image = void 0;
var webgl_1 = require("../webgl");
var Image = /** @class */ (function () {
    function Image() {
        this.gl = webgl_1.WebGL.GetInstance().gl;
        this.gl = webgl_1.WebGL.GetInstance().gl;
        var texture = this.gl.createTexture();
        if (!texture) {
            throw new Error("Failed to create texture!");
        }
        this.id = { val: texture };
    }
    Image.prototype.Destroy = function () {
        this.gl.deleteTexture(this.id.val);
    };
    Image.prototype.GetId = function () { return this.id; };
    return Image;
}());
exports.Image = Image;
var HDRImage = /** @class */ (function (_super) {
    __extends(HDRImage, _super);
    function HDRImage(createInfo) {
        var _this = _super.call(this) || this;
        _this.imageInfo = createInfo;
        _this.gl.bindTexture(createInfo.samplerInfo.dimension, _this.id.val);
        _this.gl.texParameteri(createInfo.samplerInfo.dimension, _this.gl.TEXTURE_MIN_FILTER, createInfo.samplerInfo.magFilter);
        _this.gl.texParameteri(createInfo.samplerInfo.dimension, _this.gl.TEXTURE_MAG_FILTER, createInfo.samplerInfo.minFilter);
        _this.gl.texParameteri(createInfo.samplerInfo.dimension, _this.gl.TEXTURE_WRAP_S, createInfo.samplerInfo.sWrap);
        _this.gl.texParameteri(createInfo.samplerInfo.dimension, _this.gl.TEXTURE_WRAP_T, createInfo.samplerInfo.tWrap);
        _this.gl.pixelStorei(_this.gl.UNPACK_COLORSPACE_CONVERSION_WEBGL, _this.gl.NONE);
        _this.gl.texImage2D(createInfo.dimension, 0, createInfo.format, createInfo.threeData.width, createInfo.threeData.height, 0, createInfo.nChannels, createInfo.type, new Float32Array(createInfo.threeData.data));
        _this.gl.bindTexture(createInfo.dimension, null);
        return _this;
    }
    HDRImage.prototype.GetImageInfo = function () {
        return this.imageInfo;
    };
    return HDRImage;
}(Image));
exports.HDRImage = HDRImage;
