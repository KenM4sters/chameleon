"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Interface = void 0;
var export_1 = require("./export");
/**
 * @brief Small abstraction to handle the various different GUI options for Dragon.
 * This will probably grow larger over time.
 */
var Interface = /** @class */ (function () {
    function Interface(dragon) {
        var _this = this;
        this.toggleView = true;
        this.modifySceneProps = false;
        this.dragon = dragon;
        this.sceneViewSlider = document.querySelector(".scene-view-slider");
        this.cameraIcon = { element: document.querySelector(".camera-view"), selected: false };
        this.satelliteIcon = { element: document.querySelector(".satellite-view"), selected: false };
        this.cameraIcon.element.addEventListener("click", function () {
            if (_this.cameraIcon.selected) {
                return;
            }
            _this.ToggleView(true);
        });
        this.satelliteIcon.element.addEventListener("click", function () {
            if (_this.satelliteIcon.selected) {
                return;
            }
            _this.ToggleView(false);
        });
        this.ToggleView(true);
    }
    Interface.prototype.ToggleView = function (state) {
        if (state) {
            this.dragon.scene.camera.SetController(export_1.CameraControllerTypes.FPS);
            this.sceneViewSlider.classList.remove("viewing-satellite");
            this.sceneViewSlider.classList.add("viewing-camera");
            this.cameraIcon.element.classList.remove("unselected-scene-view");
            this.cameraIcon.element.classList.add("selected-scene-view");
            this.satelliteIcon.element.classList.add("unselected-scene-view");
            this.cameraIcon.selected = true;
            this.satelliteIcon.selected = false;
        }
        else {
            this.dragon.scene.camera.SetController(export_1.CameraControllerTypes.TurnTable);
            this.sceneViewSlider.classList.remove("viewing-camera");
            this.sceneViewSlider.classList.add("viewing-satellite");
            this.satelliteIcon.element.classList.remove("unselected-scene-view");
            this.satelliteIcon.element.classList.add("selected-scene-view");
            this.cameraIcon.element.classList.add("unselected-scene-view");
            this.satelliteIcon.selected = true;
            this.cameraIcon.selected = false;
        }
    };
    return Interface;
}());
exports.Interface = Interface;
