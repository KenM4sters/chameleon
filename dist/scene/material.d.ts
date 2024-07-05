import * as glm from "gl-matrix";
import { RawCubeTexture, Shader, Texture } from "../export";
import { Image } from "../graphics/image";
export interface PhysicalMateralProps {
    albedo?: glm.vec3;
    metallic?: number;
    roughenss?: number;
    ao?: number;
    emission?: number;
}
export declare abstract class Material {
    constructor();
}
/**
 * @brief Wrapper around a shader instance that only supports a color and a texture.
 */
export declare class BasicMaterial extends Material {
    constructor();
    AddTexture(texture: Texture | Image): void;
    GetShader(): Shader;
    texture: Texture | Image | null;
    private shader;
}
/**
 * @brief Wrapper around a shader instance that renders the normals as colors.
 */
export declare class NormalMaterial extends Material {
    constructor();
    AddTexture(texture: Texture | Image): void;
    GetShader(): Shader;
    texture: Texture | Image | null;
    private shader;
}
/**
 * @brief Wrapper around a shader instance that only supports a RawCubeTexture instance.
 */
export declare class SkyboxMaterial extends Material {
    constructor(cubeTex: RawCubeTexture);
    GetShader(): Shader;
    cubeTexture: RawCubeTexture;
    private shader;
}
/**
 * @brief Wrapper around a shader instance that supports full PBR material properties
 * such as Metallnes, Roughness, Albedo and more.
 */
export declare class PhysicalMaterial extends Material {
    constructor(props: PhysicalMateralProps);
    GetShader(): Shader;
    private shader;
    albedo: glm.vec3;
    metallic: number;
    roughenss: number;
    ao: number;
    emission: number;
}
