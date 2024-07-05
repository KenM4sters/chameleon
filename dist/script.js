"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IScript = void 0;
/**
 * @brief The way the engine works is by taking in a derived instance of this IScript class
 * and calling it's intialize method. The user needs to setup their own class that inherits
 * from this and defines an appropriate instantiation and render loop methods.
 */
var IScript = /** @class */ (function () {
    function IScript() {
        this.isReady = false;
        this.Loop = this.Loop.bind(this);
    }
    return IScript;
}());
exports.IScript = IScript;
;
