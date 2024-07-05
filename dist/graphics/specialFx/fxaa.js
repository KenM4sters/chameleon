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
exports.FXAAPass = void 0;
var primitives_1 = require("../../primitives");
var pass_1 = require("./pass");
var screen_quad_vert_raw_1 = __importDefault(require("../../resources/shaders/screen_quad.vert?raw"));
var fxaa_frag_raw_1 = __importDefault(require("../../resources/shaders/fxaa.frag?raw"));
;
var FXAAPass = /** @class */ (function (_super) {
    __extends(FXAAPass, _super);
    function FXAAPass(specialFx, createInfo) {
        var _this = _super.call(this, specialFx.renderer, pass_1.SpecialFXPassTypes.ToneMapping, []) || this;
        _this.specialFx = specialFx;
        _this.toneMappingInfo = createInfo;
        _this.screenQuad = new primitives_1.Primitives.Square(screen_quad_vert_raw_1.default, fxaa_frag_raw_1.default);
        return _this;
    }
    FXAAPass.prototype.Render = function (read, write) {
        var target = this.specialFx.target;
        target.writeBuffer = null;
        target.viewport = { width: this.gl.canvas.width, height: this.gl.canvas.height };
        this.renderer.SetRenderTarget(target);
        this.gl.useProgram(this.screenQuad.GetShader().GetId().val);
        var texInfo = read.GetTextureInfo();
        this.gl.activeTexture(this.gl.TEXTURE0);
        this.gl.bindTexture(texInfo.dimension, read.GetId().val);
        this.gl.uniform1i(this.gl.getUniformLocation(this.screenQuad.GetShader().GetId().val, "uToneMappedTexture"), 0);
        this.gl.uniform2fv(this.gl.getUniformLocation(this.screenQuad.GetShader().GetId().val, "uResolution"), [this.toneMappingInfo.screenResolution.width, this.toneMappingInfo.screenResolution.height]);
        this.renderer.Draw(this.screenQuad.GetVertexArray(), this.screenQuad.GetShader(), 6);
        this.renderer.End();
    };
    FXAAPass.prototype.Resize = function (width, height) {
    };
    return FXAAPass;
}(pass_1.SpecialFXPass));
exports.FXAAPass = FXAAPass;
