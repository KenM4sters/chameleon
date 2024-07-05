"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Input = void 0;
var Input = /** @class */ (function () {
    function Input() {
        var _this = this;
        this.mouseMoveCallbacks = [];
        this.mouseDownCallbacks = [];
        this.mouseUpCallbacks = [];
        this.scrollCallbacks = [];
        this.keyDownCallbacks = [];
        window.addEventListener("mousemove", function (e) { return _this.OnMouseMove(e); });
        window.addEventListener("mouseup", function (e) { return _this.OnMouseUp(e); });
        window.addEventListener("mousedown", function (e) { return _this.OnMouseDown(e); });
        window.addEventListener("wheel", function (e) { return _this.OnScroll(e); }, { passive: false });
        window.addEventListener("keydown", function (e) { return _this.OnKeyDown(e); });
    }
    Input.prototype.AddMouseMoveCallback = function (callback) {
        this.mouseMoveCallbacks.push(callback);
    };
    Input.prototype.AddMouseUpCallback = function (callback) {
        this.mouseUpCallbacks.push(callback);
    };
    Input.prototype.AddMouseDownCallback = function (callback) {
        this.mouseDownCallbacks.push(callback);
    };
    Input.prototype.AddScrollCallback = function (callback) {
        this.scrollCallbacks.push(callback);
    };
    Input.prototype.AddKeyDownCallback = function (callback) {
        this.keyDownCallbacks.push(callback);
    };
    Input.prototype.OnMouseMove = function (e) {
        for (var _i = 0, _a = this.mouseMoveCallbacks; _i < _a.length; _i++) {
            var mouseMoveCallback = _a[_i];
            mouseMoveCallback(e);
        }
    };
    Input.prototype.OnMouseUp = function (e) {
        for (var _i = 0, _a = this.mouseUpCallbacks; _i < _a.length; _i++) {
            var mouseUpCallback = _a[_i];
            mouseUpCallback(e);
        }
    };
    Input.prototype.OnMouseDown = function (e) {
        for (var _i = 0, _a = this.mouseDownCallbacks; _i < _a.length; _i++) {
            var mouseDownCallback = _a[_i];
            mouseDownCallback(e);
        }
    };
    Input.prototype.OnScroll = function (e) {
        for (var _i = 0, _a = this.scrollCallbacks; _i < _a.length; _i++) {
            var scrollCallback = _a[_i];
            scrollCallback(e);
        }
    };
    Input.prototype.OnKeyDown = function (e) {
        for (var _i = 0, _a = this.keyDownCallbacks; _i < _a.length; _i++) {
            var keyDownCallback = _a[_i];
            keyDownCallback(e);
        }
    };
    Input.GetInstance = function () {
        if (!Input.instance) {
            Input.instance = new Input();
        }
        return new Input();
    };
    Input.instance = null;
    return Input;
}());
exports.Input = Input;
