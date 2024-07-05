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
exports.Skybox = void 0;
var glm = __importStar(require("gl-matrix"));
var export_1 = require("../export");
var image_1 = require("../graphics/image");
var webgl_1 = require("../webgl");
var eq_to_cube_vert_raw_1 = __importDefault(require("../resources/shaders/eq_to_cube.vert?raw"));
var eq_to_cube_frag_raw_1 = __importDefault(require("../resources/shaders/eq_to_cube.frag?raw"));
var convolute_vert_raw_1 = __importDefault(require("../resources/shaders/convolute.vert?raw"));
var convolute_frag_raw_1 = __importDefault(require("../resources/shaders/convolute.frag?raw"));
var prefilter_vert_raw_1 = __importDefault(require("../resources/shaders/prefilter.vert?raw"));
var prefilter_frag_raw_1 = __importDefault(require("../resources/shaders/prefilter.frag?raw"));
var brdf_vert_raw_1 = __importDefault(require("../resources/shaders/brdf.vert?raw"));
var brdf_frag_raw_1 = __importDefault(require("../resources/shaders/brdf.frag?raw"));
var Skybox = /** @class */ (function () {
    function Skybox(scene, imageInfo) {
        this.eqToCubShader = new export_1.Shader(eq_to_cube_vert_raw_1.default, eq_to_cube_frag_raw_1.default);
        this.convoluteShader = new export_1.Shader(convolute_vert_raw_1.default, convolute_frag_raw_1.default);
        this.prefilterShader = new export_1.Shader(prefilter_vert_raw_1.default, prefilter_frag_raw_1.default);
        this.brdfQuad = new export_1.Primitives.Square(brdf_vert_raw_1.default, brdf_frag_raw_1.default);
        this.scene = scene;
        this.gl = webgl_1.WebGL.GetInstance().gl;
        var cubeMapInfo = {
            dimension: this.gl.TEXTURE_CUBE_MAP,
            format: this.gl.RGBA32F,
            width: 512,
            height: 512,
            nChannels: this.gl.RGBA,
            type: this.gl.FLOAT,
            data: null,
            samplerInfo: {
                dimension: this.gl.TEXTURE_CUBE_MAP,
                minFilter: this.gl.LINEAR,
                magFilter: this.gl.LINEAR,
                sWrap: this.gl.CLAMP_TO_EDGE,
                tWrap: this.gl.CLAMP_TO_EDGE,
                rWrap: this.gl.CLAMP_TO_EDGE,
            }
        };
        var convoluteInfo = {
            dimension: this.gl.TEXTURE_CUBE_MAP,
            format: this.gl.RGBA32F,
            width: 64,
            height: 64,
            nChannels: this.gl.RGBA,
            type: this.gl.FLOAT,
            data: null,
            samplerInfo: {
                dimension: this.gl.TEXTURE_CUBE_MAP,
                minFilter: this.gl.LINEAR,
                magFilter: this.gl.LINEAR,
                sWrap: this.gl.CLAMP_TO_EDGE,
                tWrap: this.gl.CLAMP_TO_EDGE,
                rWrap: this.gl.CLAMP_TO_EDGE,
            }
        };
        var prefilterInfo = {
            dimension: this.gl.TEXTURE_CUBE_MAP,
            format: this.gl.RGBA32F,
            width: 256,
            height: 256,
            nChannels: this.gl.RGBA,
            type: this.gl.FLOAT,
            data: null,
            samplerInfo: {
                dimension: this.gl.TEXTURE_CUBE_MAP,
                minFilter: this.gl.LINEAR_MIPMAP_LINEAR,
                magFilter: this.gl.LINEAR,
                sWrap: this.gl.CLAMP_TO_EDGE,
                tWrap: this.gl.CLAMP_TO_EDGE,
                rWrap: this.gl.CLAMP_TO_EDGE,
            }
        };
        var brdfInfo = {
            dimension: this.gl.TEXTURE_2D,
            format: this.gl.RG16F,
            width: 512,
            height: 512,
            nChannels: this.gl.RG,
            type: this.gl.FLOAT,
            data: null,
            samplerInfo: {
                dimension: this.gl.TEXTURE_2D,
                minFilter: this.gl.LINEAR,
                magFilter: this.gl.LINEAR,
                sWrap: this.gl.CLAMP_TO_EDGE,
                tWrap: this.gl.CLAMP_TO_EDGE,
            }
        };
        this.cubeMap = new export_1.RawCubeTexture(cubeMapInfo);
        this.convolutedMap = new export_1.RawCubeTexture(convoluteInfo);
        this.prefilteredMap = new export_1.RawCubeTexture(prefilterInfo);
        this.brdf = new export_1.RawTexture2D(brdfInfo);
        this.hdrImage = new image_1.HDRImage(imageInfo);
        var mat = new export_1.SkyboxMaterial(this.cubeMap);
        var geo = new export_1.BoxGeometry();
        this.cube = new export_1.Mesh(geo, mat);
        this.GenerateIrradianceMaps();
        this.GenreateBRDF();
    }
    Skybox.prototype.GenerateIrradianceMaps = function () {
        var _a, _b, _c;
        var captureProjection = glm.mat4.perspective(glm.mat4.create(), glm.glMatrix.toRadian(90.0), 1, 0.1, 10);
        var captureViews = [
            // Positive X
            glm.mat4.lookAt(glm.mat4.create(), glm.vec3.fromValues(0.0, 0.0, 0.0), glm.vec3.fromValues(1.0, 0.0, 0.0), glm.vec3.fromValues(0.0, -1.0, 0.0)),
            // Negative X
            glm.mat4.lookAt(glm.mat4.create(), glm.vec3.fromValues(0.0, 0.0, 0.0), glm.vec3.fromValues(-1.0, 0.0, 0.0), glm.vec3.fromValues(0.0, -1.0, 0.0)),
            // Positive Y
            glm.mat4.lookAt(glm.mat4.create(), glm.vec3.fromValues(0.0, 0.0, 0.0), glm.vec3.fromValues(0.0, 1.0, 0.0), glm.vec3.fromValues(0.0, 0.0, 1.0)),
            // Negative Y
            glm.mat4.lookAt(glm.mat4.create(), glm.vec3.fromValues(0.0, 0.0, 0.0), glm.vec3.fromValues(0.0, -1.0, 0.0), glm.vec3.fromValues(0.0, 0.0, -1.0)),
            // Positive Z
            glm.mat4.lookAt(glm.mat4.create(), glm.vec3.fromValues(0.0, 0.0, 0.0), glm.vec3.fromValues(0.0, 0.0, 1.0), glm.vec3.fromValues(0.0, -1.0, 0.0)),
            // Negative Z
            glm.mat4.lookAt(glm.mat4.create(), glm.vec3.fromValues(0.0, 0.0, 0.0), glm.vec3.fromValues(0.0, 0.0, -1.0), glm.vec3.fromValues(0.0, -1.0, 0.0)),
        ];
        // Cube map
        //
        var target = this.scene.renderTarget;
        var texInfo = this.cubeMap.GetTextureInfo();
        target.viewport = { width: texInfo.width, height: texInfo.height };
        this.scene.renderer.SetRenderTarget(this.scene.renderTarget);
        var geo = this.cube.geometry;
        this.gl.useProgram(this.eqToCubShader.GetId().val);
        this.gl.activeTexture(this.gl.TEXTURE0);
        this.gl.bindTexture(this.gl.TEXTURE_2D, this.hdrImage.GetId().val);
        this.gl.uniform1i(this.gl.getUniformLocation(this.eqToCubShader.GetId().val, "hdrTex"), 0);
        this.gl.uniformMatrix4fv(this.gl.getUniformLocation(this.eqToCubShader.GetId().val, "projection"), false, captureProjection);
        for (var i = 0; i < 6; i++) {
            texInfo.dimension = this.gl.TEXTURE_CUBE_MAP_POSITIVE_X + i;
            if (target.writeBuffer) {
                target.writeBuffer.SetColorAttachment(this.cubeMap, this.gl.COLOR_ATTACHMENT0);
                if (this.gl.checkFramebufferStatus(this.gl.FRAMEBUFFER) != this.gl.FRAMEBUFFER_COMPLETE) {
                    console.error('Framebuffer not complete');
                }
            }
            this.gl.uniformMatrix4fv(this.gl.getUniformLocation(this.eqToCubShader.GetId().val, "view"), false, captureViews[i]);
            this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
            this.scene.renderer.Draw(geo.GetVertexArray(), this.eqToCubShader, 36);
        }
        (_a = target.writeBuffer) === null || _a === void 0 ? void 0 : _a.SetColorAttachment(this.scene.writeTexture, this.gl.COLOR_ATTACHMENT0);
        target.viewport = { width: this.gl.canvas.width, height: this.gl.canvas.height };
        // Convolution
        //
        texInfo = this.convolutedMap.GetTextureInfo();
        target.viewport = { width: texInfo.width, height: texInfo.height };
        this.scene.renderer.SetRenderTarget(this.scene.renderTarget);
        this.gl.useProgram(this.convoluteShader.GetId().val);
        this.gl.activeTexture(this.gl.TEXTURE0);
        this.gl.bindTexture(this.gl.TEXTURE_CUBE_MAP, this.cubeMap.GetId().val);
        this.gl.uniform1i(this.gl.getUniformLocation(this.convoluteShader.GetId().val, "environmetMap"), 0);
        this.gl.uniformMatrix4fv(this.gl.getUniformLocation(this.convoluteShader.GetId().val, "projection"), false, captureProjection);
        for (var i = 0; i < 6; i++) {
            texInfo.dimension = this.gl.TEXTURE_CUBE_MAP_POSITIVE_X + i;
            if (target.writeBuffer) {
                target.writeBuffer.SetColorAttachment(this.convolutedMap, this.gl.COLOR_ATTACHMENT0);
                if (this.gl.checkFramebufferStatus(this.gl.FRAMEBUFFER) != this.gl.FRAMEBUFFER_COMPLETE) {
                    console.error('Framebuffer not complete');
                }
            }
            this.gl.uniformMatrix4fv(this.gl.getUniformLocation(this.convoluteShader.GetId().val, "view"), false, captureViews[i]);
            this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
            this.scene.renderer.Draw(geo.GetVertexArray(), this.convoluteShader, 36);
        }
        this.gl.activeTexture(this.gl.TEXTURE0);
        this.gl.bindTexture(this.gl.TEXTURE_CUBE_MAP, null);
        (_b = target.writeBuffer) === null || _b === void 0 ? void 0 : _b.SetColorAttachment(this.scene.writeTexture, this.gl.COLOR_ATTACHMENT0);
        target.viewport = { width: this.gl.canvas.width, height: this.gl.canvas.height };
        // Prefilter
        //
        this.gl.activeTexture(this.gl.TEXTURE0);
        this.gl.bindTexture(this.gl.TEXTURE_CUBE_MAP, this.prefilteredMap.GetId().val);
        this.gl.generateMipmap(this.gl.TEXTURE_CUBE_MAP);
        this.gl.bindTexture(this.gl.TEXTURE_CUBE_MAP, null);
        this.gl.useProgram(this.prefilterShader.GetId().val);
        this.gl.activeTexture(this.gl.TEXTURE0);
        this.gl.bindTexture(this.gl.TEXTURE_CUBE_MAP, this.cubeMap.GetId().val);
        this.gl.uniform1i(this.gl.getUniformLocation(this.prefilterShader.GetId().val, "environmetMap"), 0);
        this.gl.uniformMatrix4fv(this.gl.getUniformLocation(this.prefilterShader.GetId().val, "projection"), false, captureProjection);
        var maxMipLevels = 5;
        if (target.writeBuffer) {
            this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, target.writeBuffer.GetFramebufferId().val);
            for (var mip = 0; mip < maxMipLevels; mip++) {
                // reisze framebuffer according to mip-level size.
                var mipWidth = (256 * Math.pow(0.5, mip));
                var mipHeight = (256 * Math.pow(0.5, mip));
                target.viewport = { width: mipWidth, height: mipHeight };
                this.gl.viewport(0, 0, mipWidth, mipHeight);
                var roughness = mip / (maxMipLevels - 1);
                this.gl.uniform1f(this.gl.getUniformLocation(this.prefilterShader.GetId().val, "roughness"), roughness);
                for (var i = 0; i < 6; i++) {
                    texInfo.dimension = this.gl.TEXTURE_CUBE_MAP_POSITIVE_X + i;
                    this.gl.framebufferTexture2D(this.gl.FRAMEBUFFER, this.gl.COLOR_ATTACHMENT0, texInfo.dimension, this.prefilteredMap.GetId().val, mip);
                    target.writeBuffer.Resize(mipWidth, mipHeight);
                    if (this.gl.checkFramebufferStatus(this.gl.FRAMEBUFFER) != this.gl.FRAMEBUFFER_COMPLETE) {
                        console.error('Framebuffer not complete');
                    }
                    this.gl.uniformMatrix4fv(this.gl.getUniformLocation(this.prefilterShader.GetId().val, "view"), false, captureViews[i]);
                    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
                    this.scene.renderer.Draw(geo.GetVertexArray(), this.prefilterShader, 36);
                }
            }
        }
        // Cleanup.
        this.gl.activeTexture(this.gl.TEXTURE0);
        this.gl.bindTexture(this.gl.TEXTURE_CUBE_MAP, null);
        (_c = target.writeBuffer) === null || _c === void 0 ? void 0 : _c.SetColorAttachment(this.scene.writeTexture, this.gl.COLOR_ATTACHMENT0);
        target.viewport = { width: this.gl.canvas.width, height: this.gl.canvas.height };
    };
    Skybox.prototype.GenreateBRDF = function () {
        var target = this.scene.renderTarget;
        var texInfo = this.brdf.GetTextureInfo();
        target.viewport = { width: texInfo.width, height: texInfo.height };
        this.scene.renderer.SetRenderTarget(this.scene.renderTarget);
        var shader = this.brdfQuad.GetShader();
        this.gl.useProgram(shader.GetId().val);
        this.gl.activeTexture(this.gl.TEXTURE0);
        this.gl.bindTexture(this.gl.TEXTURE_2D, this.hdrImage.GetId().val);
        if (target.writeBuffer) {
            target.writeBuffer.SetColorAttachment(this.brdf, this.gl.COLOR_ATTACHMENT0);
            this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
            this.scene.renderer.Draw(this.brdfQuad.GetVertexArray(), shader, 6);
            // Cleanup.
            this.gl.activeTexture(this.gl.TEXTURE0);
            this.gl.bindTexture(this.gl.TEXTURE_2D, null);
            target.writeBuffer.SetColorAttachment(this.scene.writeTexture, this.gl.COLOR_ATTACHMENT0);
            target.viewport = { width: this.gl.canvas.width, height: this.gl.canvas.height };
        }
    };
    Skybox.prototype.GetHDRImage = function () { return this.hdrImage; };
    Skybox.prototype.GetCube = function () { return this.cube; };
    Skybox.prototype.GetCubeMap = function () { return this.cubeMap; };
    Skybox.prototype.GetConvolutedMap = function () { return this.convolutedMap; };
    Skybox.prototype.GetPrefilteredMap = function () { return this.prefilteredMap; };
    Skybox.prototype.GetBRDF = function () { return this.brdf; };
    return Skybox;
}());
exports.Skybox = Skybox;
