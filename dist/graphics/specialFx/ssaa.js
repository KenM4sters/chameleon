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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SSAAPass = void 0;
var primitives_1 = require("../../primitives");
var pass_1 = require("./pass");
var screen_quad_vert_raw_1 = __importDefault(require("../../resources/shaders/screen_quad.vert?raw"));
var ssaa_frag_raw_1 = __importDefault(require("../../resources/shaders/ssaa.frag?raw"));
;
var SSAAPass = /** @class */ (function (_super) {
    __extends(SSAAPass, _super);
    function SSAAPass(specialFx, createInfo) {
        var _this = _super.call(this, specialFx.renderer, pass_1.SpecialFXPassTypes.ToneMapping, []) || this;
        _this.specialFx = specialFx;
        _this.ssaaInfo = createInfo;
        _this.screenQuad = new primitives_1.Primitives.Square(screen_quad_vert_raw_1.default, ssaa_frag_raw_1.default);
        _this.highResTexInfo =
            {
                dimension: _this.gl.TEXTURE_2D,
                format: _this.gl.RGBA32F,
                width: _this.gl.canvas.width * _this.ssaaInfo.screenResMultiplier,
                height: _this.gl.canvas.height * _this.ssaaInfo.screenResMultiplier,
                nChannels: _this.gl.RGBA,
                type: _this.gl.FLOAT,
                data: null,
                samplerInfo: {
                    dimension: _this.gl.TEXTURE_2D,
                    minFilter: _this.gl.LINEAR,
                    magFilter: _this.gl.LINEAR,
                    sWrap: _this.gl.REPEAT,
                    tWrap: _this.gl.REPEAT,
                }
            };
        return _this;
    }
    SSAAPass.prototype.Render = function (read, write) {
        var _a;
        var texInfo = read.GetTextureInfo();
        var target = this.specialFx.target;
        target.writeBuffer = this.specialFx.target.writeBuffer;
        target.viewport = { width: this.gl.canvas.width * this.ssaaInfo.screenResMultiplier, height: this.gl.canvas.height * this.ssaaInfo.screenResMultiplier };
        this.highResTexInfo.width = this.gl.canvas.width * this.ssaaInfo.screenResMultiplier;
        this.highResTexInfo.height = this.gl.canvas.height * this.ssaaInfo.screenResMultiplier;
        this.renderer.SetRenderTarget(target);
        write.Resize(this.highResTexInfo);
        (_a = target.writeBuffer) === null || _a === void 0 ? void 0 : _a.SetColorAttachment(write, this.gl.COLOR_ATTACHMENT0);
        this.gl.useProgram(this.screenQuad.GetShader().GetId().val);
        this.gl.activeTexture(this.gl.TEXTURE0);
        this.gl.bindTexture(texInfo.dimension, read.GetId().val);
        this.gl.uniform1i(this.gl.getUniformLocation(this.screenQuad.GetShader().GetId().val, "uToneMappedTexture"), 0);
        this.renderer.Draw(this.screenQuad.GetVertexArray(), this.screenQuad.GetShader(), 6);
        target.writeBuffer = null;
        target.viewport = { width: this.gl.canvas.width, height: this.gl.canvas.height };
        this.renderer.SetRenderTarget(target);
        this.highResTexInfo.width = this.gl.canvas.width;
        this.highResTexInfo.height = this.gl.canvas.height;
        this.gl.activeTexture(this.gl.TEXTURE0);
        this.gl.bindTexture(texInfo.dimension, write.GetId().val);
        this.gl.uniform1i(this.gl.getUniformLocation(this.screenQuad.GetShader().GetId().val, "uToneMappedTexture"), 0);
        this.renderer.Draw(this.screenQuad.GetVertexArray(), this.screenQuad.GetShader(), 6);
        write.Resize(this.highResTexInfo);
        this.renderer.End();
    };
    SSAAPass.prototype.Resize = function (width, height) {
    };
    return SSAAPass;
}(pass_1.SpecialFXPass));
exports.SSAAPass = SSAAPass;
