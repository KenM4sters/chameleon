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
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BloomPass = void 0;
var glm = __importStar(require("gl-matrix"));
var texture_1 = require("../texture");
var pass_1 = require("./pass");
var primitives_1 = require("../../primitives");
var shader_1 = require("../shader");
var screen_quad_vert_raw_1 = __importDefault(require("../../resources/shaders/screen_quad.vert?raw"));
var bloom_frag_raw_1 = __importDefault(require("../../resources/shaders/bloom.frag?raw"));
var up_sampling_frag_raw_1 = __importDefault(require("../../resources/shaders/up_sampling.frag?raw"));
var down_sampling_frag_raw_1 = __importDefault(require("../../resources/shaders/down_sampling.frag?raw"));
;
var BloomPass = /** @class */ (function (_super) {
    __extends(BloomPass, _super);
    function BloomPass(specialFx, createInfo) {
        var _this = _super.call(this, specialFx.renderer, pass_1.SpecialFXPassTypes.ToneMapping, []) || this;
        _this.mipChain = Array();
        _this.upsampleShader = new shader_1.Shader(screen_quad_vert_raw_1.default, up_sampling_frag_raw_1.default);
        _this.downsampleShader = new shader_1.Shader(screen_quad_vert_raw_1.default, down_sampling_frag_raw_1.default);
        _this.specialFx = specialFx;
        _this.bloomInfo = createInfo;
        _this.screenQuad = new primitives_1.Primitives.Square(screen_quad_vert_raw_1.default, bloom_frag_raw_1.default);
        var mipSize = glm.vec2.fromValues(_this.gl.canvas.width, _this.gl.canvas.height);
        var iMipSize = glm.vec2.fromValues(Math.floor(_this.gl.canvas.width), Math.floor(_this.gl.canvas.height));
        for (var i = 0; i < _this.bloomInfo.levels; i++) {
            mipSize = glm.vec2.scale(glm.vec2.create(), mipSize, 0.5);
            iMipSize = glm.vec2.scale(glm.vec2.create(), iMipSize, 0.5);
            var mipInfo = {
                dimension: _this.gl.TEXTURE_2D,
                nChannels: _this.gl.RGBA,
                width: mipSize[0],
                height: mipSize[1],
                format: _this.gl.RGBA32F,
                type: _this.gl.FLOAT,
                data: null,
                samplerInfo: {
                    dimension: _this.gl.TEXTURE_2D,
                    minFilter: _this.gl.LINEAR,
                    magFilter: _this.gl.LINEAR,
                    sWrap: _this.gl.CLAMP_TO_EDGE,
                    tWrap: _this.gl.CLAMP_TO_EDGE,
                }
            };
            _this.mipChain.push(new texture_1.RawTexture2D(mipInfo));
        }
        // Prepping uniform locations for the source HDR texture from the Scene output.
        //
        _this.gl.useProgram(_this.screenQuad.GetShader().GetId().val);
        _this.gl.uniform1i(_this.gl.getUniformLocation(_this.screenQuad.GetShader().GetId().val, "sceneTexture"), 0);
        _this.gl.uniform1i(_this.gl.getUniformLocation(_this.screenQuad.GetShader().GetId().val, "blurredTexture"), 1);
        _this.gl.useProgram(null);
        _this.gl.useProgram(_this.upsampleShader.GetId().val);
        _this.gl.uniform1i(_this.gl.getUniformLocation(_this.upsampleShader.GetId().val, "srcTexture"), 0);
        _this.gl.useProgram(null);
        _this.gl.useProgram(_this.downsampleShader.GetId().val);
        _this.gl.uniform1i(_this.gl.getUniformLocation(_this.downsampleShader.GetId().val, "srcTexture"), 0);
        _this.gl.useProgram(null);
        return _this;
    }
    BloomPass.prototype.Render = function (read, write) {
        var _a;
        var target = this.specialFx.target;
        this.renderer.SetRenderTarget(target);
        // Blur the read texture, writing to the write texture.
        //
        this.Blur(target);
        this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
        // Combining the blurred and scene textures and writing to the write texture.
        //
        (_a = target.writeBuffer) === null || _a === void 0 ? void 0 : _a.SetColorAttachment(write, this.gl.COLOR_ATTACHMENT0);
        this.gl.useProgram(this.screenQuad.GetShader().GetId().val);
        this.gl.activeTexture(this.gl.TEXTURE0);
        this.gl.bindTexture(this.gl.TEXTURE_2D, this.specialFx.scene.GetId().val);
        this.gl.activeTexture(this.gl.TEXTURE1);
        this.gl.bindTexture(this.gl.TEXTURE_2D, this.mipChain[0].GetId().val);
        this.gl.uniform1f(this.gl.getUniformLocation(this.screenQuad.GetShader().GetId().val, "bloomStrength"), this.bloomInfo.strength);
        this.renderer.Draw(this.screenQuad.GetVertexArray(), this.screenQuad.GetShader(), 6);
        this.renderer.End();
    };
    BloomPass.prototype.Resize = function (width, height) {
        var mipSize = glm.vec2.fromValues(width, height);
        for (var i = 0; i < this.mipChain.length; i++) {
            mipSize = glm.vec2.scale(glm.vec2.create(), mipSize, 0.5);
            var mipInfo = {
                dimension: this.gl.TEXTURE_2D,
                nChannels: this.gl.RGBA,
                width: mipSize[0],
                height: mipSize[1],
                format: this.gl.RGBA32F,
                type: this.gl.FLOAT,
                data: null,
                samplerInfo: {
                    dimension: this.gl.TEXTURE_2D,
                    minFilter: this.gl.LINEAR,
                    magFilter: this.gl.LINEAR,
                    sWrap: this.gl.CLAMP_TO_EDGE,
                    tWrap: this.gl.CLAMP_TO_EDGE,
                }
            };
            this.mipChain[i].Resize(mipInfo);
        }
    };
    BloomPass.prototype.Blur = function (target) {
        // Downsampling
        //
        var writeBuffer = target.writeBuffer;
        this.gl.useProgram(this.downsampleShader.GetId().val);
        this.gl.bindTexture(this.gl.TEXTURE_2D, this.specialFx.scene.GetId().val);
        for (var i = 0; i < this.mipChain.length; i++) {
            var bloomMip = this.mipChain[i];
            var mipInfo = bloomMip.GetTextureInfo();
            this.gl.viewport(0, 0, mipInfo.width, mipInfo.height);
            writeBuffer === null || writeBuffer === void 0 ? void 0 : writeBuffer.SetColorAttachment(bloomMip, this.gl.COLOR_ATTACHMENT0);
            this.gl.uniform2fv(this.gl.getUniformLocation(this.downsampleShader.GetId().val, "srcResolution"), glm.vec2.fromValues(mipInfo.width, mipInfo.height));
            this.renderer.Draw(this.screenQuad.GetVertexArray(), this.downsampleShader, 6);
            this.gl.activeTexture(this.gl.TEXTURE0);
            this.gl.bindTexture(this.gl.TEXTURE_2D, null);
            this.gl.activeTexture(this.gl.TEXTURE0);
            this.gl.bindTexture(this.gl.TEXTURE_2D, bloomMip.GetId().val);
        }
        this.gl.useProgram(null);
        // Upsampling
        //
        this.gl.enable(this.gl.BLEND);
        this.gl.blendFunc(this.gl.ONE, this.gl.ONE);
        this.gl.blendEquation(this.gl.FUNC_ADD);
        this.gl.useProgram(this.upsampleShader.GetId().val);
        this.gl.uniform1f(this.gl.getUniformLocation(this.upsampleShader.GetId().val, "filterRadius"), this.bloomInfo.filterRadius);
        for (var i = this.mipChain.length - 1; i > 0; i--) {
            var bloomMip = this.mipChain[i];
            var nextBloomMip = this.mipChain[i - 1]; // Remember we're going backwards.
            this.gl.viewport(0, 0, nextBloomMip.GetTextureInfo().width, nextBloomMip.GetTextureInfo().height);
            this.gl.bindTexture(bloomMip.GetTextureInfo().dimension, bloomMip.GetId().val);
            writeBuffer === null || writeBuffer === void 0 ? void 0 : writeBuffer.SetColorAttachment(nextBloomMip, this.gl.COLOR_ATTACHMENT0);
            this.renderer.Draw(this.screenQuad.GetVertexArray(), this.upsampleShader, 6);
        }
        this.gl.disable(this.gl.BLEND);
        this.gl.useProgram(null);
        this.gl.bindTexture(this.gl.TEXTURE_2D, null);
    };
    return BloomPass;
}(pass_1.SpecialFXPass));
exports.BloomPass = BloomPass;
