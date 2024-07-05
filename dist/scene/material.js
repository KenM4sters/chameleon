"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
exports.PhysicalMaterial = exports.SkyboxMaterial = exports.NormalMaterial = exports.BasicMaterial = exports.Material = void 0;
var glm = __importStar(require("gl-matrix"));
var export_1 = require("../export");
// Shaders
//
var model_view_projection_vert_raw_1 = __importDefault(require("../resources/shaders/model_view_projection.vert?raw"));
var skybox_vert_raw_1 = __importDefault(require("../resources/shaders/skybox.vert?raw"));
var skybox_frag_raw_1 = __importDefault(require("../resources/shaders/skybox.frag?raw"));
var color_frag_raw_1 = __importDefault(require("../resources/shaders/color.frag?raw"));
var texture_frag_raw_1 = __importDefault(require("../resources/shaders/texture.frag?raw"));
var physical_material_frag_raw_1 = __importDefault(require("../resources/shaders/physical_material.frag?raw"));
var physical_material_vert_raw_1 = __importDefault(require("../resources/shaders/physical_material.vert?raw"));
;
var Material = /** @class */ (function () {
    function Material() {
    }
    return Material;
}());
exports.Material = Material;
/**
 * @brief Wrapper around a shader instance that only supports a color and a texture.
 */
var BasicMaterial = /** @class */ (function (_super) {
    __extends(BasicMaterial, _super);
    function BasicMaterial() {
        var _this = _super.call(this) || this;
        _this.texture = null;
        _this.shader = new export_1.Shader(model_view_projection_vert_raw_1.default, color_frag_raw_1.default);
        return _this;
    }
    BasicMaterial.prototype.AddTexture = function (texture) {
        this.texture = texture;
        this.shader.Compile(model_view_projection_vert_raw_1.default, texture_frag_raw_1.default);
    };
    BasicMaterial.prototype.GetShader = function () { return this.shader; };
    return BasicMaterial;
}(Material));
exports.BasicMaterial = BasicMaterial;
/**
 * @brief Wrapper around a shader instance that renders the normals as colors.
 */
var NormalMaterial = /** @class */ (function (_super) {
    __extends(NormalMaterial, _super);
    function NormalMaterial() {
        var _this = _super.call(this) || this;
        _this.texture = null;
        _this.shader = new export_1.Shader(model_view_projection_vert_raw_1.default, color_frag_raw_1.default);
        return _this;
    }
    NormalMaterial.prototype.AddTexture = function (texture) {
        this.texture = texture;
        this.shader.Compile(model_view_projection_vert_raw_1.default, texture_frag_raw_1.default);
    };
    NormalMaterial.prototype.GetShader = function () { return this.shader; };
    return NormalMaterial;
}(Material));
exports.NormalMaterial = NormalMaterial;
/**
 * @brief Wrapper around a shader instance that only supports a RawCubeTexture instance.
 */
var SkyboxMaterial = /** @class */ (function (_super) {
    __extends(SkyboxMaterial, _super);
    function SkyboxMaterial(cubeTex) {
        var _this = _super.call(this) || this;
        _this.shader = new export_1.Shader(skybox_vert_raw_1.default, skybox_frag_raw_1.default);
        _this.cubeTexture = cubeTex;
        return _this;
    }
    SkyboxMaterial.prototype.GetShader = function () { return this.shader; };
    return SkyboxMaterial;
}(Material));
exports.SkyboxMaterial = SkyboxMaterial;
/**
 * @brief Wrapper around a shader instance that supports full PBR material properties
 * such as Metallnes, Roughness, Albedo and more.
 */
var PhysicalMaterial = /** @class */ (function (_super) {
    __extends(PhysicalMaterial, _super);
    function PhysicalMaterial(props) {
        var _this = _super.call(this) || this;
        _this.albedo = glm.vec3.fromValues(1.0, 1.0, 1.0);
        _this.metallic = 0.3;
        _this.roughenss = 0.8;
        _this.ao = 0.5;
        _this.emission = 0.0;
        _this.shader = new export_1.Shader(physical_material_vert_raw_1.default, physical_material_frag_raw_1.default);
        if (props.albedo)
            _this.albedo = props.albedo;
        if (props.metallic)
            _this.metallic = props.metallic;
        if (props.roughenss)
            _this.roughenss = props.roughenss;
        if (props.ao)
            _this.ao = props.ao;
        if (props.emission)
            _this.emission = props.emission;
        return _this;
    }
    PhysicalMaterial.prototype.GetShader = function () { return this.shader; };
    return PhysicalMaterial;
}(Material));
exports.PhysicalMaterial = PhysicalMaterial;
