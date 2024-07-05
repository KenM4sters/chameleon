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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Scene = void 0;
var glm = __importStar(require("gl-matrix"));
var assets_1 = __importDefault(require("../assets"));
var export_1 = require("../export");
var framebuffer_1 = require("../graphics/framebuffer");
var target_1 = require("../graphics/renderer/target");
var webgl_1 = require("../webgl");
var geometry_1 = require("./geometry");
var light_1 = require("./light");
var material_1 = require("./material");
var mesh_1 = require("./mesh");
var skybox_1 = require("./skybox");
var scene_depth_vert_raw_1 = __importDefault(require("../resources/shaders/scene_depth.vert?raw"));
var scene_depth_frag_raw_1 = __importDefault(require("../resources/shaders/scene_depth.frag?raw"));
/**
 * @brief Holds containers for the meshes, lights and a skybox and handles the rendering of them.
 */
var Scene = /** @class */ (function () {
    function Scene(graphics) {
        this.lights = new Array();
        this.skybox = null;
        this.depthShader = new export_1.Shader(scene_depth_vert_raw_1.default, scene_depth_frag_raw_1.default);
        this.meshes = new Array();
        this.renderer = graphics.GetRenderer();
        this.gl = webgl_1.WebGL.GetInstance().gl;
        var canvas = webgl_1.WebGL.GetInstance().canvas;
        var writeTexInfo = {
            dimension: this.gl.TEXTURE_2D,
            format: this.gl.RGBA32F,
            width: canvas.width,
            height: canvas.height,
            nChannels: this.gl.RGBA,
            type: this.gl.FLOAT,
            data: null,
            samplerInfo: {
                dimension: this.gl.TEXTURE_2D,
                minFilter: this.gl.LINEAR,
                magFilter: this.gl.LINEAR,
                sWrap: this.gl.REPEAT,
                tWrap: this.gl.REPEAT,
            }
        };
        this.writeTexture = new export_1.RawTexture2D(writeTexInfo);
        var sceneFrameInfo = {
            targetTexture: this.writeTexture,
            attachment: this.gl.COLOR_ATTACHMENT0,
            renderBufferCreateInfo: {
                width: canvas.width,
                height: canvas.height,
                format: this.gl.DEPTH24_STENCIL8,
                attachmentType: this.gl.DEPTH_STENCIL_ATTACHMENT
            }
        };
        var sceneStageInfo = {
            viewport: { width: canvas.width, height: canvas.height },
            depthFunc: this.gl.LEQUAL,
            blendFunc: this.gl.ONE
        };
        this.sceneBuffer = new framebuffer_1.Framebuffer(sceneFrameInfo);
        this.renderTarget = new target_1.RenderTarget(this.sceneBuffer, sceneStageInfo);
        // Depth Info (for shadow mapping)
        //
        var depthTextureInfo = {
            dimension: this.gl.TEXTURE_2D,
            format: this.gl.DEPTH_COMPONENT32F,
            width: 2048,
            height: 2048,
            nChannels: this.gl.DEPTH_COMPONENT,
            type: this.gl.FLOAT,
            data: null,
            samplerInfo: {
                dimension: this.gl.TEXTURE_2D,
                minFilter: this.gl.NEAREST,
                magFilter: this.gl.NEAREST,
                sWrap: this.gl.CLAMP_TO_EDGE,
                tWrap: this.gl.CLAMP_TO_EDGE,
            }
        };
        this.depthTexture = new export_1.RawTexture2D(depthTextureInfo);
        var depthBufferInfo = {
            targetTexture: this.writeTexture,
            attachment: this.gl.DEPTH_ATTACHMENT,
            renderBufferCreateInfo: null
        };
        this.depthBuffer = new framebuffer_1.Framebuffer(depthBufferInfo);
        this.depthViewMatrix = glm.mat4.lookAt(glm.mat4.create(), [3, 1.25, 1.5], [0, 0, 0], [0, 1, 0]);
        this.depthProjectionMatrix = glm.mat4.ortho(glm.mat4.create(), -10, 10, -10, 10, 1.0, 100);
        // this.depthProjectionMatrix = glm.mat4.perspective(glm.mat4.create(), glm.glMatrix.toRadian(45), canvas.width / canvas.height, 0.1, 100);
    }
    /**
     * @brief Scene-specific render function to take some load of the Graphics instance.
     * Renders all meshes and skyboxes.
     */
    Scene.prototype.Render = function (elapsedTime, timeStep) {
        this.camera.Update(elapsedTime, timeStep);
        this.renderTarget.viewport = { width: 2048, height: 2048 };
        this.renderTarget.writeBuffer = this.depthBuffer;
        this.renderTarget.depthFunc = this.gl.LEQUAL;
        this.depthBuffer.SetColorAttachment(this.depthTexture, this.gl.DEPTH_ATTACHMENT);
        this.gl.drawBuffers([this.gl.NONE]);
        this.gl.readBuffer(this.gl.NONE);
        this.gl.enable(this.gl.CULL_FACE);
        this.gl.cullFace(this.gl.BACK);
        this.renderer.SetRenderTarget(this.renderTarget);
        this.gl.clear(this.gl.DEPTH_BUFFER_BIT);
        this.DrawSceneToDepthBuffer();
        this.renderer.End();
        this.gl.disable(this.gl.CULL_FACE);
        this.renderTarget.viewport = { width: this.gl.canvas.width, height: this.gl.canvas.height };
        this.renderTarget.writeBuffer = this.sceneBuffer;
        this.renderTarget.depthFunc = this.gl.LEQUAL;
        this.sceneBuffer.SetColorAttachment(this.writeTexture, this.gl.COLOR_ATTACHMENT0);
        this.renderer.SetRenderTarget(this.renderTarget);
        var children = this.GetAllChildren();
        for (var _i = 0, _a = children.meshes; _i < _a.length; _i++) {
            var mesh = _a[_i];
            mesh.UpdateUniforms(this);
            if (mesh.userUpdateCallback) {
                mesh.userUpdateCallback(mesh, elapsedTime, timeStep);
            }
        }
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
        this.DrawSceneToWriteBuffer();
        this.renderer.End();
    };
    Scene.prototype.DrawSceneToDepthBuffer = function () {
        var children = this.GetAllChildren();
        this.gl.useProgram(this.depthShader.GetId().val);
        this.gl.uniformMatrix4fv(this.gl.getUniformLocation(this.depthShader.GetId().val, "projection"), false, this.depthProjectionMatrix);
        this.gl.uniformMatrix4fv(this.gl.getUniformLocation(this.depthShader.GetId().val, "view"), false, this.depthViewMatrix);
        for (var _i = 0, _a = children.meshes; _i < _a.length; _i++) {
            var mesh = _a[_i];
            var modelMatrix = glm.mat4.create();
            modelMatrix = glm.mat4.fromQuat(modelMatrix, mesh.rotation);
            modelMatrix = glm.mat4.scale(glm.mat4.create(), modelMatrix, mesh.scale);
            modelMatrix = glm.mat4.translate(glm.mat4.create(), modelMatrix, mesh.position);
            this.gl.uniformMatrix4fv(this.gl.getUniformLocation(this.depthShader.GetId().val, "model"), false, modelMatrix);
            if (mesh.material instanceof material_1.PhysicalMaterial) {
                if (mesh.geometry instanceof geometry_1.BoxGeometry) {
                    this.renderer.Draw(mesh.geometry.GetVertexArray(), this.depthShader, 36);
                }
                else if (mesh.geometry instanceof geometry_1.SphereGeometry) {
                    var vao = mesh.geometry.GetVertexArray();
                    var EBO = vao.GetIndexBuffer();
                    this.gl.bindVertexArray(vao.GetId().val);
                    this.gl.useProgram(this.depthShader.GetId().val);
                    if (EBO) {
                        this.gl.drawElements(this.gl.TRIANGLES, EBO.GetUniqueSize() / EBO.GetUniqueIndices().BYTES_PER_ELEMENT, this.gl.UNSIGNED_SHORT, EBO.GetUniqueOffset());
                    }
                }
            }
        }
    };
    Scene.prototype.DrawSceneToWriteBuffer = function () {
        var children = this.GetAllChildren();
        if (this.skybox) {
            this.skybox.GetCube().UpdateUniforms(this);
            var geo = this.skybox.GetCube().geometry;
            var mat = this.skybox.GetCube().material;
            if (geo instanceof geometry_1.BoxGeometry && mat instanceof material_1.SkyboxMaterial) {
                this.renderer.Draw(geo.GetVertexArray(), mat.GetShader(), 36);
            }
        }
        for (var _i = 0, _a = children.meshes; _i < _a.length; _i++) {
            var mesh = _a[_i];
            if (mesh.material instanceof material_1.PhysicalMaterial) {
                if (mesh.geometry instanceof geometry_1.BoxGeometry) {
                    this.renderer.Draw(mesh.geometry.GetVertexArray(), mesh.material.GetShader(), 36);
                }
                else if (mesh.geometry instanceof geometry_1.SphereGeometry) {
                    var vao = mesh.geometry.GetVertexArray();
                    var EBO = vao.GetIndexBuffer();
                    var shader = mesh.material.GetShader();
                    this.gl.bindVertexArray(vao.GetId().val);
                    this.gl.useProgram(shader.GetId().val);
                    if (EBO) {
                        this.gl.drawElements(this.gl.TRIANGLES, EBO.GetUniqueSize() / EBO.GetUniqueIndices().BYTES_PER_ELEMENT, this.gl.UNSIGNED_SHORT, EBO.GetUniqueOffset());
                    }
                }
            }
        }
    };
    Scene.prototype.Add = function (child) {
        if (child instanceof mesh_1.Mesh) {
            this.meshes.push(child);
        }
        else if (child instanceof light_1.Light) {
            this.lights.push(child);
        }
    };
    /**
     * @brief Sets a skybox with the desired texture.
     * @param assetName Name of the asset held by the Assets instance.
     */
    Scene.prototype.AddBackground = function (assetName) {
        var assets = assets_1.default.GetInstance();
        var asset = assets.GetTexture(assetName);
        var hdrImageInfo = {
            dimension: this.gl.TEXTURE_2D,
            type: this.gl.FLOAT,
            format: this.gl.RGBA32F,
            nChannels: this.gl.RGBA,
            threeData: asset,
            samplerInfo: {
                dimension: this.gl.TEXTURE_2D,
                minFilter: this.gl.LINEAR,
                magFilter: this.gl.LINEAR,
                sWrap: this.gl.CLAMP_TO_EDGE,
                tWrap: this.gl.CLAMP_TO_EDGE
            }
        };
        this.skybox = new skybox_1.Skybox(this, hdrImageInfo);
    };
    /**
     * @brief Sets the camera instance.
     * @param camera Currently only supporting a PerspectiveCamera instance.
     */
    Scene.prototype.SetCamera = function (camera) {
        this.camera = camera;
    };
    Scene.prototype.GetAllChildren = function () {
        return { meshes: this.meshes, lights: this.lights };
    };
    Scene.prototype.Resize = function (width, height) {
        this.camera.Resize(width, height);
        var writeTexInfo = {
            dimension: this.gl.TEXTURE_2D,
            format: this.gl.RGBA32F,
            width: width,
            height: height,
            nChannels: this.gl.RGBA,
            type: this.gl.FLOAT,
            data: null,
            samplerInfo: {
                dimension: this.gl.TEXTURE_2D,
                minFilter: this.gl.LINEAR,
                magFilter: this.gl.LINEAR,
                sWrap: this.gl.REPEAT,
                tWrap: this.gl.REPEAT,
            }
        };
        this.writeTexture.Resize(writeTexInfo);
        var sceneStageInfo = {
            viewport: { width: width, height: height },
            depthFunc: this.gl.LEQUAL,
            blendFunc: this.gl.ONE
        };
        this.renderTarget.Resize(width, height, sceneStageInfo);
    };
    return Scene;
}());
exports.Scene = Scene;
;
