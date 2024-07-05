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
exports.BlurPass = void 0;
var pass_1 = require("./pass");
var primitives_1 = require("../../primitives");
var screen_quad_vert_raw_1 = __importDefault(require("../../resources/shaders/screen_quad.vert?raw"));
var down_sampling_frag_raw_1 = __importDefault(require("../../resources/shaders/down_sampling.frag?raw"));
;
var BlurPass = /** @class */ (function (_super) {
    __extends(BlurPass, _super);
    function BlurPass(specialFx, createInfo) {
        var _this = _super.call(this, specialFx.renderer, pass_1.SpecialFXPassTypes.ToneMapping, []) || this;
        _this.specialFx = specialFx;
        _this.blurInfo = createInfo;
        _this.screenQuad = new primitives_1.Primitives.Square(screen_quad_vert_raw_1.default, down_sampling_frag_raw_1.default);
        return _this;
    }
    BlurPass.prototype.Render = function (read, write) {
        var target = this.specialFx.target;
        this.renderer.SetRenderTarget(target);
        this.gl.useProgram(this.screenQuad.GetShader().GetId().val);
        var texInfo = read.GetTextureInfo();
        this.gl.activeTexture(this.gl.TEXTURE0);
        this.gl.bindTexture(texInfo.dimension, read.GetId().val);
        this.gl.uniform1i(this.gl.getUniformLocation(this.screenQuad.GetShader().GetId().val, "readTex"), 0);
        this.gl.uniform1f(this.gl.getUniformLocation(this.screenQuad.GetShader().GetId().val, "filterRadius"), this.blurInfo.filterRadius);
        this.renderer.Draw(this.screenQuad.GetVertexArray(), this.screenQuad.GetShader(), 6);
        this.renderer.End();
    };
    BlurPass.prototype.Resize = function (width, height) {
    };
    return BlurPass;
}(pass_1.SpecialFXPass));
exports.BlurPass = BlurPass;
