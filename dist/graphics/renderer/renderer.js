"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Renderer = void 0;
var webgl_1 = require("../../webgl");
var Renderer = /** @class */ (function () {
    function Renderer() {
        this.gl = webgl_1.WebGL.GetInstance().gl;
        this.gl.enable(this.gl.DEPTH_TEST);
    }
    Renderer.prototype.Draw = function (vertexArray, shader, verticesCount) {
        this.gl.bindVertexArray(vertexArray.GetId().val);
        this.gl.useProgram(shader.GetId().val);
        this.gl.drawArrays(this.gl.TRIANGLES, 0, verticesCount);
    };
    Renderer.prototype.SetRenderTarget = function (renderTarget) {
        this.gl.viewport(0, 0, renderTarget.viewport.width, renderTarget.viewport.height);
        this.gl.enable(this.gl.DEPTH_TEST);
        this.gl.depthFunc(renderTarget.depthFunc);
        var writeBuffer = renderTarget.writeBuffer;
        if (writeBuffer) {
            this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, writeBuffer.GetFramebufferId().val);
        }
        else {
            this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null);
        }
    };
    Renderer.prototype.End = function () {
        this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null);
        this.gl.useProgram(null);
        this.gl.activeTexture(this.gl.TEXTURE0);
        this.gl.bindTexture(this.gl.TEXTURE_2D, null);
        this.gl.bindTexture(this.gl.TEXTURE_CUBE_MAP, null);
        this.gl.activeTexture(this.gl.TEXTURE1);
        this.gl.bindTexture(this.gl.TEXTURE_2D, null);
        this.gl.bindTexture(this.gl.TEXTURE_CUBE_MAP, null);
        this.gl.activeTexture(this.gl.TEXTURE2);
        this.gl.bindTexture(this.gl.TEXTURE_2D, null);
        this.gl.bindTexture(this.gl.TEXTURE_CUBE_MAP, null);
        this.gl.activeTexture(this.gl.TEXTURE3);
        this.gl.bindTexture(this.gl.TEXTURE_2D, null);
        this.gl.bindTexture(this.gl.TEXTURE_CUBE_MAP, null);
    };
    return Renderer;
}());
exports.Renderer = Renderer;
;
