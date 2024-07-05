"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebGL = exports.Ref = void 0;
;
/**
 * @brief Wrapper around any variable to ensure that it's passed by reference and not value.
 */
var Ref = /** @class */ (function () {
    function Ref(val) {
        this.val = val;
    }
    ;
    return Ref;
}());
exports.Ref = Ref;
;
/**
 * @brief Singleton class that merely provies easier access to the canvas and WebGl context
 * instances that are needed throughout the application.
 */
var WebGL = /** @class */ (function () {
    function WebGL() {
        this.canvas = document.getElementById("canvas");
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.gl = this.canvas.getContext('webgl2', { antialias: true });
        if (!this.gl)
            throw new Error("webgl context is not available!");
        var ext1 = this.gl.getExtension('EXT_color_buffer_float');
        if (!ext1) {
            throw new Error('EXT_color_buffer_float is not supported');
        }
        ;
        var ext2 = this.gl.getExtension('OES_texture_float_linear');
        if (!ext2) {
            throw new Error('OES_texture_float_linear is not supported');
        }
        ;
    }
    // Public static method to get the instance of the class
    WebGL.GetInstance = function () {
        if (!WebGL.instance) {
            WebGL.instance = new WebGL();
        }
        return WebGL.instance;
    };
    WebGL.instance = null;
    return WebGL;
}());
exports.WebGL = WebGL;
;
