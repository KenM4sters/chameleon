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
exports.RawCubeTexture = exports.RawTexture2D = exports.Texture = void 0;
var webgl_1 = require("../webgl");
;
;
var Texture = /** @class */ (function () {
    function Texture() {
        this.gl = webgl_1.WebGL.GetInstance().gl;
        var texture = this.gl.createTexture();
        if (!texture) {
            throw new Error("Failed to create texture!");
        }
        this.id = { val: texture };
    }
    Texture.prototype.Destroy = function () {
        this.gl.deleteTexture(this.id.val);
    };
    Texture.prototype.GetId = function () { return this.id; };
    return Texture;
}());
exports.Texture = Texture;
;
var RawTexture2D = /** @class */ (function (_super) {
    __extends(RawTexture2D, _super);
    function RawTexture2D(createInfo) {
        var _this = _super.call(this) || this;
        _this.textureInfo = createInfo;
        _this.gl.bindTexture(createInfo.samplerInfo.dimension, _this.id.val);
        _this.gl.texParameteri(createInfo.samplerInfo.dimension, _this.gl.TEXTURE_MIN_FILTER, createInfo.samplerInfo.minFilter);
        _this.gl.texParameteri(createInfo.samplerInfo.dimension, _this.gl.TEXTURE_MAG_FILTER, createInfo.samplerInfo.magFilter);
        _this.gl.texParameteri(createInfo.samplerInfo.dimension, _this.gl.TEXTURE_WRAP_S, createInfo.samplerInfo.sWrap);
        _this.gl.texParameteri(createInfo.samplerInfo.dimension, _this.gl.TEXTURE_WRAP_T, createInfo.samplerInfo.tWrap);
        _this.gl.pixelStorei(_this.gl.UNPACK_COLORSPACE_CONVERSION_WEBGL, _this.gl.NONE);
        _this.gl.pixelStorei(_this.gl.UNPACK_FLIP_Y_WEBGL, true);
        _this.gl.texImage2D(createInfo.dimension, 0, createInfo.format, createInfo.width, createInfo.height, 0, createInfo.nChannels, createInfo.type, createInfo.data);
        // Check for texture errors
        if (_this.gl.getError() !== _this.gl.NO_ERROR) {
            console.error("Error with texture binding or creation");
        }
        _this.gl.bindTexture(createInfo.dimension, null);
        return _this;
    }
    RawTexture2D.prototype.Resize = function (createInfo) {
        this.textureInfo = createInfo;
        this.gl.bindTexture(createInfo.samplerInfo.dimension, this.id.val);
        this.gl.texImage2D(createInfo.dimension, 0, createInfo.format, createInfo.width, createInfo.height, 0, createInfo.nChannels, createInfo.type, createInfo.data);
        // Check for texture errors
        if (this.gl.getError() !== this.gl.NO_ERROR) {
            console.error("Error with texture binding or creation");
        }
        this.gl.bindTexture(createInfo.dimension, null);
    };
    RawTexture2D.prototype.GetTextureInfo = function () { return this.textureInfo; };
    return RawTexture2D;
}(Texture));
exports.RawTexture2D = RawTexture2D;
;
var RawCubeTexture = /** @class */ (function (_super) {
    __extends(RawCubeTexture, _super);
    function RawCubeTexture(createInfo) {
        var _this = _super.call(this) || this;
        _this.textureInfo = createInfo;
        _this.gl.bindTexture(createInfo.samplerInfo.dimension, _this.id.val);
        _this.gl.texParameteri(createInfo.samplerInfo.dimension, _this.gl.TEXTURE_MIN_FILTER, createInfo.samplerInfo.minFilter);
        _this.gl.texParameteri(createInfo.samplerInfo.dimension, _this.gl.TEXTURE_MAG_FILTER, createInfo.samplerInfo.magFilter);
        _this.gl.texParameteri(createInfo.samplerInfo.dimension, _this.gl.TEXTURE_WRAP_S, createInfo.samplerInfo.sWrap);
        _this.gl.texParameteri(createInfo.samplerInfo.dimension, _this.gl.TEXTURE_WRAP_T, createInfo.samplerInfo.tWrap);
        if (createInfo.samplerInfo.rWrap) {
            _this.gl.texParameteri(createInfo.samplerInfo.dimension, _this.gl.TEXTURE_WRAP_R, createInfo.samplerInfo.rWrap);
        }
        _this.gl.pixelStorei(_this.gl.UNPACK_COLORSPACE_CONVERSION_WEBGL, _this.gl.NONE);
        for (var i = 0; i < 6; i++) {
            _this.gl.texImage2D(_this.gl.TEXTURE_CUBE_MAP_POSITIVE_X + i, 0, createInfo.format, createInfo.width, createInfo.height, 0, createInfo.nChannels, createInfo.type, createInfo.data);
            // Check for texture errors
            if (_this.gl.getError() !== _this.gl.NO_ERROR) {
                console.error("Error with texture binding or creation");
            }
        }
        _this.gl.bindTexture(createInfo.dimension, null);
        return _this;
    }
    RawCubeTexture.prototype.GetTextureInfo = function () { return this.textureInfo; };
    return RawCubeTexture;
}(Texture));
exports.RawCubeTexture = RawCubeTexture;
