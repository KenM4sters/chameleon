"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RenderTarget = void 0;
;
var RenderTarget = /** @class */ (function () {
    function RenderTarget(writeBuffer, createInfo) {
        this.writeBuffer = writeBuffer;
        this.viewport = createInfo.viewport;
        this.depthFunc = createInfo.depthFunc;
        this.blendFunc = createInfo.blendFunc;
    }
    RenderTarget.prototype.Resize = function (width, height, createInfo) {
        var _a;
        (_a = this.writeBuffer) === null || _a === void 0 ? void 0 : _a.Resize(width, height);
        this.viewport = createInfo.viewport;
        this.depthFunc = createInfo.depthFunc;
        this.blendFunc = createInfo.blendFunc;
    };
    RenderTarget.prototype.Destroy = function () {
        var _a;
        (_a = this.writeBuffer) === null || _a === void 0 ? void 0 : _a.Destroy();
    };
    return RenderTarget;
}());
exports.RenderTarget = RenderTarget;
