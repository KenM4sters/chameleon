"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Dragon = void 0;
var frontend_1 = require("../frontend");
var assets_1 = __importDefault(require("./assets"));
var graphics_1 = require("./graphics/graphics");
var interface_1 = require("./interface");
var preloader_1 = require("./preloader");
var scene_1 = require("./scene/scene");
var webgl_1 = require("./webgl");
/**
 * @brief The main entry point for our application. Dragon has instances of the scene, graphics,
 * script and assets and runs the main game loop.
 */
var Dragon = /** @class */ (function () {
    /**
     * @brief Constructs all necessary members (scene, graphics etc...)
     * @param script The scripts that defines an initiaztion and loop function to call.
     */
    function Dragon(script) {
        var _this = this;
        this.isReady = false;
        this.animationFrameId = 0;
        this.lastFrame = 0;
        this.elapsedTime = 0;
        this.timeStep = 0;
        this.script = script;
        this.graphics = new graphics_1.Graphics();
        this.preloader = new preloader_1.Preloader();
        this.assets = assets_1.default.GetInstance();
        this.scene = new scene_1.Scene(this.graphics);
        this.assets.LoadAllAssets(function () {
            script.Initialize();
            _this.frontend = new frontend_1.Frontend();
            _this.interface = new interface_1.Interface(_this);
            _this.isReady = true;
        });
        window.addEventListener("resize", function () { return _this.OnResize(); });
        if (!this.isReady) {
            this.DrawPreloader();
        }
    }
    Dragon.prototype.DrawPreloader = function () {
        var _this = this;
        this.animationFrameId = requestAnimationFrame(function (elapsedTime) { return _this.AnimationLoop(elapsedTime); });
    };
    /**
     * @brief This needs to be called by the initialization function of the IScript instance
     * which gives a callback to the function that will be called each frame.
     * @param callback The loop function to be called each frame.
     */
    Dragon.prototype.SetAnimationLoop = function (callback) {
        var _this = this;
        this.animationCallback = callback;
        this.animationFrameId = requestAnimationFrame(function (elapsedTime) { return _this.AnimationLoop(elapsedTime); });
    };
    Dragon.prototype.AnimationLoop = function (elapsedTime) {
        var _this = this;
        this.elapsedTime = elapsedTime;
        this.timeStep = elapsedTime - this.lastFrame;
        this.lastFrame = elapsedTime;
        if (this.animationCallback && this.isReady) {
            // Clean the Preloader up (destroy gl resources, DOM elements etc if it hasn't
            // been cleaned up yet.
            if (!this.preloader.isDestroyed) {
                this.preloader.Destroy();
            }
            this.animationCallback(elapsedTime, this.timeStep);
        }
        else {
            this.preloader.Update(this.elapsedTime, this.timeStep);
        }
        this.animationFrameId = requestAnimationFrame(function (elapsedTime) { return _this.AnimationLoop(elapsedTime); });
    };
    /**
     * @brief Updates the graphics member instance.
     */
    Dragon.prototype.Update = function () {
        if (this.graphics != undefined) {
            this.graphics.Update(this.scene, this.elapsedTime, this.timeStep);
        }
    };
    /**
     * @brief Resizes each member instance whenver the window is resized.
     */
    Dragon.prototype.OnResize = function () {
        var newWidth = window.innerWidth;
        var newHeight = window.innerHeight;
        var canvas = webgl_1.WebGL.GetInstance().canvas;
        if (canvas.width != newWidth || canvas.height != newHeight) {
            canvas.width = newWidth;
            canvas.height = newHeight;
            this.scene.Resize(canvas.width, canvas.height);
            this.graphics.Resize(canvas.width, canvas.height);
        }
    };
    Dragon.prototype.Stop = function () {
        cancelAnimationFrame(this.animationFrameId);
        this.animationCallback = undefined;
    };
    return Dragon;
}());
exports.Dragon = Dragon;
