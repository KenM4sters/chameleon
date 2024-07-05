"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var RGBELoader_js_1 = require("three/examples/jsm/loaders/RGBELoader.js");
var Assets = /** @class */ (function () {
    function Assets() {
        this.textures = new Map();
        this.status = 0;
    }
    Assets.prototype.LoadAllAssets = function (callback) {
        var _this = this;
        var loader = new RGBELoader_js_1.RGBELoader();
        var _loop_1 = function (r) {
            if (r.type == "LDR") {
                var IMG_1 = new Image();
                IMG_1.src = r.path;
                IMG_1.style.transform = "'rotateY(180deg)'";
                IMG_1.addEventListener("load", function () {
                    _this.textures.set(r.name, IMG_1);
                    _this.UpdateStatus(callback);
                });
            }
            else if (r.type == "HDR") {
                loader.load(r.path, function (tex) {
                    _this.textures.set(r.name, tex.image);
                    _this.UpdateStatus(callback);
                });
            }
        };
        for (var _i = 0, sources_1 = sources; _i < sources_1.length; _i++) {
            var r = sources_1[_i];
            _loop_1(r);
        }
    };
    Assets.prototype.UpdateStatus = function (callback) {
        this.status += 1;
        if (this.status == sources.length) {
            callback();
        }
    };
    Assets.prototype.GetTexture = function (name) {
        return this.textures.get(name);
    };
    Assets.GetInstance = function () {
        if (!this.instance) {
            this.instance = new Assets();
        }
        return this.instance;
    };
    return Assets;
}());
exports.default = Assets;
var sources = [
    {
        name: "ocean",
        type: "HDR",
        path: "./ocean.hdr"
    },
];
