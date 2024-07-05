"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Graphics = void 0;
var webgl_1 = require("../webgl");
var renderer_1 = require("./renderer/renderer");
var specialFX_1 = require("./specialFx/specialFX");
/**
 * @brief A wrapper around a Renderer that's designed manage and tell the renderer
 * what it should be doing each frame.
 */
var Graphics = /** @class */ (function () {
    function Graphics() {
        this.renderer = new renderer_1.Renderer();
        this.width = 0;
        this.height = 0;
        var webgl = webgl_1.WebGL.GetInstance();
        this.gl = webgl.gl;
    }
    /**
     * @brief Has to be called in order for any rendering to happen. This function will tell
     * the scene to render followed by any specialFx passes (some are required by default, such
     * as toneMapping).
     * @param scene An instance of a scene (should only be one) to render.
     * @param elapsedTime Time since the application began.
     * @param timeStep Time between each frame.
     */
    Graphics.prototype.Update = function (scene, elapsedTime, timeStep) {
        scene.Render(elapsedTime, timeStep);
        if (!this.specialFx) {
            this.specialFx = new specialFX_1.SpecialFX(this.renderer, scene.writeTexture);
        }
        this.specialFx.Render();
    };
    /**
     * @brief Calls the entire graphics pipeline to resize to the user defined dimensions.
     * If this isn't set, the default will be the dimensions of the canvas.
     * @param width Should be the width of the desired viewport.
     * @param height Should be the height of the desired viewport.
     */
    Graphics.prototype.SetSizes = function (width, height) {
        if (this.width != width || this.height != height) {
            this.Resize(width, height);
        }
    };
    /**
     * @brief Called everytime the window is resized, and resizes the canvas and specialFx passes.
     * @param width The new width.
     * @param height The new height.
     */
    Graphics.prototype.Resize = function (width, height) {
        this.width = width;
        this.height = height;
        this.gl.canvas.width = this.width;
        this.gl.canvas.height = this.height;
        if (this.specialFx) {
            this.specialFx.Resize(width, height);
        }
    };
    Graphics.prototype.GetRenderer = function () { return this.renderer; };
    return Graphics;
}());
exports.Graphics = Graphics;
;
