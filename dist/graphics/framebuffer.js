"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Framebuffer = void 0;
var webgl_1 = require("../webgl");
;
;
var Framebuffer = /** @class */ (function () {
    function Framebuffer(createInfo) {
        this.renderBufferInfo = null;
        this.gl = webgl_1.WebGL.GetInstance().gl;
        // Create native framebuffer id
        //
        var framebufferId = this.gl.createFramebuffer();
        if (!framebufferId) {
            throw new Error("Failed to create framebuffer!");
        }
        this.framebufferId = { val: framebufferId };
        this.renderbufferId = { val: null };
        this.framebufferInfo = createInfo;
        // Create native framebuffer
        //
        var texInfo = createInfo.targetTexture.GetTextureInfo();
        this.gl.bindTexture(texInfo.dimension, createInfo.targetTexture.GetId().val);
        this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this.framebufferId.val);
        this.gl.framebufferTexture2D(this.gl.FRAMEBUFFER, createInfo.attachment, createInfo.targetTexture.GetTextureInfo().dimension, createInfo.targetTexture.GetId().val, 0);
        this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null);
        this.gl.bindTexture(texInfo.dimension, null);
        // Check for any errors.
        //
        var status = this.gl.checkFramebufferStatus(this.gl.FRAMEBUFFER);
        if (status != this.gl.FRAMEBUFFER_COMPLETE) {
            console.error('Framebuffer is not complete: ' + status.toString(16));
        }
        // Create render buffer if the createInfo contains a RenderBufferCreateInfo.
        //
        if (createInfo.renderBufferCreateInfo) {
            this.renderBufferInfo = createInfo.renderBufferCreateInfo;
            var renderbufferId = this.gl.createRenderbuffer();
            if (!renderbufferId) {
                throw new Error("Failed to create framebuffer!");
            }
            this.renderbufferId = { val: renderbufferId };
            this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this.framebufferId.val);
            this.gl.bindRenderbuffer(this.gl.RENDERBUFFER, this.renderbufferId.val);
            this.gl.renderbufferStorage(this.gl.RENDERBUFFER, createInfo.renderBufferCreateInfo.format, createInfo.renderBufferCreateInfo.width, createInfo.renderBufferCreateInfo.height);
            this.gl.framebufferRenderbuffer(this.gl.FRAMEBUFFER, createInfo.renderBufferCreateInfo.attachmentType, this.gl.RENDERBUFFER, this.renderbufferId.val);
            this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null);
            this.gl.bindRenderbuffer(this.gl.RENDERBUFFER, null);
        }
    }
    Framebuffer.prototype.Resize = function (width, height) {
        if (this.renderBufferInfo) {
            this.renderBufferInfo.width = width;
            this.renderBufferInfo.height = height;
            this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this.framebufferId.val);
            this.gl.bindRenderbuffer(this.gl.RENDERBUFFER, this.renderbufferId.val);
            this.gl.renderbufferStorage(this.gl.RENDERBUFFER, this.renderBufferInfo.format, this.renderBufferInfo.width, this.renderBufferInfo.height);
            this.gl.framebufferRenderbuffer(this.gl.FRAMEBUFFER, this.renderBufferInfo.attachmentType, this.gl.RENDERBUFFER, this.renderbufferId.val);
        }
    };
    Framebuffer.prototype.SetColorAttachment = function (texture, attachment, level) {
        if (level === void 0) { level = 0; }
        this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this.framebufferId.val);
        this.gl.framebufferTexture2D(this.gl.FRAMEBUFFER, attachment, texture.GetTextureInfo().dimension, texture.GetId().val, level);
        this.Resize(texture.GetTextureInfo().width, texture.GetTextureInfo().height);
    };
    Framebuffer.prototype.DrawToAttachment = function (attachmentUnit) {
        this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this.framebufferId.val);
        this.gl.drawBuffers(attachmentUnit);
    };
    Framebuffer.prototype.Destroy = function () {
        this.gl.deleteFramebuffer(this.framebufferId.val);
        this.gl.deleteRenderbuffer(this.renderbufferId.val);
        if (this.framebufferInfo) {
            this.framebufferInfo.targetTexture.Destroy();
        }
    };
    Framebuffer.prototype.GetFramebufferId = function () { return this.framebufferId; };
    ;
    Framebuffer.prototype.GetRenderbufferId = function () { return this.renderbufferId; };
    return Framebuffer;
}());
exports.Framebuffer = Framebuffer;
;
