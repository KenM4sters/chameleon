"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Mesh = exports.Transforms = void 0;
var glm = __importStar(require("gl-matrix"));
var material_1 = require("./material");
var light_1 = require("./light");
/**
 * @brief Mostly used by a Mesh instance to translate, scale and rotate the model position
 * of the mesh.
 */
var Transforms = /** @class */ (function () {
    function Transforms() {
        this.position = glm.vec3.fromValues(0, 0, 0);
        this.scale = glm.vec3.fromValues(1, 1, 1);
        this.rotation = glm.quat.fromValues(0, 0, 0, 0);
    }
    return Transforms;
}());
exports.Transforms = Transforms;
/**
 * @brief Final object that holds instances of Geometry, Material and Transform classes
 * which together completely describe all the information required to render objects.
 */
var Mesh = /** @class */ (function () {
    /**
     * @brief Constructs a Mesh instance from Geometry, Material and optionally Transform instnaces.
     * @param geo The Geometry instance.
     * @param mat The Material instance.
     * @param transforms The Transforms instance.
     */
    function Mesh(geo, mat, transforms) {
        if (transforms === void 0) { transforms = new Transforms(); }
        this.geometry = geo;
        this.material = mat;
        this.position = transforms.position;
        this.scale = transforms.scale;
        this.rotation = transforms.rotation;
    }
    Mesh.prototype.SetTransforms = function (transforms) {
        this.position = transforms.position;
        this.scale = transforms.scale;
        this.rotation = transforms.rotation;
    };
    /**
     * @brief Sets a callback function that will be called just before rendering this Mesh
     * instance. Some example uses would be to provide any per frame transforms.
     * @param callback The callback function, which takes in the Mesh (this), the
     * elapsedTime and timeStep (time between each frame).
     */
    Mesh.prototype.SetUpdateCallback = function (callback) {
        this.userUpdateCallback = callback;
    };
    /**
     * @brief Updates all the uniforms needed for rendering this Mesh instance.
     * @param scene The scene that holds the lights and skybox that each hold information
     * that this Mesh needs to be properly be shaded by the fragment shader.
     */
    Mesh.prototype.UpdateUniforms = function (scene) {
        var gl = scene.gl;
        var lights = scene.lights;
        var skybox = scene.skybox;
        var camera = scene.camera;
        var modelMatrix = glm.mat4.create();
        modelMatrix = glm.mat4.fromQuat(modelMatrix, this.rotation);
        modelMatrix = glm.mat4.scale(glm.mat4.create(), modelMatrix, this.scale);
        modelMatrix = glm.mat4.translate(glm.mat4.create(), modelMatrix, this.position);
        if (this.material instanceof material_1.PhysicalMaterial) {
            var material = this.material;
            var shader = material.GetShader();
            if (skybox) {
                gl.activeTexture(gl.TEXTURE1);
                gl.bindTexture(gl.TEXTURE_2D, scene.depthTexture.GetId().val);
                gl.activeTexture(gl.TEXTURE2);
                gl.bindTexture(gl.TEXTURE_2D, skybox.GetBRDF().GetId().val);
                gl.activeTexture(gl.TEXTURE3);
                gl.bindTexture(gl.TEXTURE_CUBE_MAP, skybox.GetConvolutedMap().GetId().val);
                gl.activeTexture(gl.TEXTURE4);
                gl.bindTexture(gl.TEXTURE_CUBE_MAP, skybox.GetPrefilteredMap().GetId().val);
            }
            gl.useProgram(shader.GetId().val);
            gl.uniform1i(gl.getUniformLocation(shader.GetId().val, "uShadowMap"), 1);
            gl.uniform1i(gl.getUniformLocation(shader.GetId().val, "uBRDF"), 2);
            gl.uniform1i(gl.getUniformLocation(shader.GetId().val, "uConvolutedMap"), 3);
            gl.uniform1i(gl.getUniformLocation(shader.GetId().val, "uPrefilteredMap"), 4);
            gl.uniformMatrix4fv(gl.getUniformLocation(shader.GetId().val, "model"), false, modelMatrix);
            gl.uniformMatrix4fv(gl.getUniformLocation(shader.GetId().val, "view"), false, camera.GetViewMatrix());
            gl.uniformMatrix4fv(gl.getUniformLocation(shader.GetId().val, "projection"), false, camera.GetProjectionMatrix());
            gl.uniformMatrix4fv(gl.getUniformLocation(shader.GetId().val, "lightSpaceProjection"), false, scene.depthProjectionMatrix);
            gl.uniformMatrix4fv(gl.getUniformLocation(shader.GetId().val, "lightSpaceView"), false, scene.depthViewMatrix);
            gl.uniform3fv(gl.getUniformLocation(shader.GetId().val, "uCameraPosition"), camera.position);
            gl.uniform2fv(gl.getUniformLocation(shader.GetId().val, "uShadowMapResolution"), [gl.canvas.width, gl.canvas.height]);
            gl.uniform3fv(gl.getUniformLocation(shader.GetId().val, "uMaterial.Albedo"), material.albedo);
            gl.uniform1f(gl.getUniformLocation(shader.GetId().val, "uMaterial.Metallic"), material.metallic);
            gl.uniform1f(gl.getUniformLocation(shader.GetId().val, "uMaterial.Roughness"), material.roughenss);
            gl.uniform1f(gl.getUniformLocation(shader.GetId().val, "uMaterial.AO"), material.ao);
            gl.uniform1f(gl.getUniformLocation(shader.GetId().val, "uMaterial.Emission"), material.emission);
            for (var _i = 0, lights_1 = lights; _i < lights_1.length; _i++) {
                var light = lights_1[_i];
                if (light instanceof light_1.PointLight) {
                    gl.uniform3fv(gl.getUniformLocation(shader.GetId().val, "uLight.Position"), light.position);
                    gl.uniform3fv(gl.getUniformLocation(shader.GetId().val, "uLight.AmbientColor"), light.color);
                    gl.uniform1f(gl.getUniformLocation(shader.GetId().val, "uLight.Intensity"), light.intensity);
                    gl.useProgram(null);
                }
            }
            gl.activeTexture(gl.TEXTURE0);
            gl.bindTexture(gl.TEXTURE_CUBE_MAP, null);
            gl.activeTexture(gl.TEXTURE1);
            gl.bindTexture(gl.TEXTURE_CUBE_MAP, null);
            gl.activeTexture(gl.TEXTURE2);
            gl.bindTexture(gl.TEXTURE_2D, null);
        }
        else if (this.material instanceof material_1.SkyboxMaterial) {
            var material = this.material;
            var shader = material.GetShader();
            gl.useProgram(shader.GetId().val);
            gl.uniformMatrix4fv(gl.getUniformLocation(shader.GetId().val, "projection"), false, camera.GetProjectionMatrix());
            gl.uniformMatrix4fv(gl.getUniformLocation(shader.GetId().val, "view"), false, camera.GetViewMatrix());
            gl.activeTexture(gl.TEXTURE0);
            gl.bindTexture(gl.TEXTURE_CUBE_MAP, material.cubeTexture.GetId().val);
            gl.uniform1i(gl.getUniformLocation(shader.GetId().val, "environmentMap"), 0);
        }
    };
    return Mesh;
}());
exports.Mesh = Mesh;
