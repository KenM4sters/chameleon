"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SpecialFX = void 0;
var webgl_1 = require("../../webgl");
var framebuffer_1 = require("../framebuffer");
var target_1 = require("../renderer/target");
var texture_1 = require("../texture");
var bloom_1 = require("./bloom");
var blur_1 = require("./blur");
var fxaa_1 = require("./fxaa");
var toneMapping_1 = require("./toneMapping");
var read;
var write;
var SpecialFX = /** @class */ (function () {
    function SpecialFX(renderer, sceneTexture) {
        this.passes = [];
        this.renderer = renderer;
        this.scene = sceneTexture;
        this.gl = webgl_1.WebGL.GetInstance().gl;
        var canvas = webgl_1.WebGL.GetInstance().canvas;
        var writeTextureInfo = {
            dimension: this.gl.TEXTURE_2D,
            format: this.gl.RGBA32F,
            width: canvas.width,
            height: canvas.height,
            nChannels: this.gl.RGBA,
            type: this.gl.FLOAT,
            data: null,
            samplerInfo: {
                dimension: this.gl.TEXTURE_2D,
                minFilter: this.gl.LINEAR,
                magFilter: this.gl.LINEAR,
                sWrap: this.gl.REPEAT,
                tWrap: this.gl.REPEAT,
            }
        };
        this.ping = new texture_1.RawTexture2D(writeTextureInfo);
        this.pong = new texture_1.RawTexture2D(writeTextureInfo);
        read = this.ping;
        write = this.pong;
        var writeBufferInfo = {
            targetTexture: this.pong,
            attachment: this.gl.COLOR_ATTACHMENT0,
            renderBufferCreateInfo: null
        };
        this.writeBuffer = new framebuffer_1.Framebuffer(writeBufferInfo);
        var renderTargetInfo = {
            viewport: { width: canvas.width, height: canvas.height },
            depthFunc: this.gl.LEQUAL,
            blendFunc: this.gl.ONE
        };
        this.target = new target_1.RenderTarget(this.writeBuffer, renderTargetInfo);
        var hdrInfo = {
            exposure: 1.0
        };
        var bloomInfo = {
            levels: 2,
            filterRadius: 0.001,
            strength: 0.3,
        };
        var fxaaInfo = {
            screenResolution: { width: canvas.width, height: canvas.height }
        };
        var ssaaInfo = {
            screenResMultiplier: 2
        };
        // this.passes.push(new BloomPass(this, bloomInfo));
        this.passes.push(new toneMapping_1.ToneMappingPass(this, hdrInfo));
        // this.passes.push(new SSAAPass(this, ssaaInfo));
        this.passes.push(new fxaa_1.FXAAPass(this, fxaaInfo));
    }
    SpecialFX.prototype.Render = function () {
        this.target.writeBuffer = this.writeBuffer;
        for (var i = 0; i < this.passes.length; i++) {
            if (i == 0) {
                this.passes[i].Render(this.scene, write);
            }
            else {
                this.passes[i].Render(read, write);
            }
            ;
            if (read == this.ping) {
                write = this.ping;
                read = this.pong;
            }
            else {
                read = this.ping;
                write = this.pong;
            }
        }
    };
    SpecialFX.prototype.AddBloom = function (createInfo) {
        this.passes.push(new bloom_1.BloomPass(this, createInfo));
        this.SortPasses();
    };
    SpecialFX.prototype.AddToneMapping = function (createInfo) {
        this.passes.push(new toneMapping_1.ToneMappingPass(this, createInfo));
        this.SortPasses();
    };
    SpecialFX.prototype.AddBlur = function (createInfo) {
        this.passes.push(new blur_1.BlurPass(this, createInfo));
        this.SortPasses();
    };
    SpecialFX.prototype.SortPasses = function () {
    };
    SpecialFX.prototype.Resize = function (width, height) {
        var targetInfo = {
            viewport: { width: width, height: height },
            depthFunc: this.gl.LEQUAL,
            blendFunc: this.gl.ONE
        };
        this.target.Resize(width, height, targetInfo);
        var writeTextureInfo = {
            dimension: this.gl.TEXTURE_2D,
            format: this.gl.RGBA32F,
            width: width,
            height: height,
            nChannels: this.gl.RGBA,
            type: this.gl.FLOAT,
            data: null,
            samplerInfo: {
                dimension: this.gl.TEXTURE_2D,
                minFilter: this.gl.LINEAR,
                magFilter: this.gl.LINEAR,
                sWrap: this.gl.REPEAT,
                tWrap: this.gl.REPEAT,
            }
        };
        this.ping.Resize(writeTextureInfo);
        this.pong.Resize(writeTextureInfo);
        read = this.ping;
        write = this.pong;
        for (var _i = 0, _a = this.passes; _i < _a.length; _i++) {
            var pass = _a[_i];
            pass.Resize(width, height);
        }
    };
    return SpecialFX;
}());
exports.SpecialFX = SpecialFX;
