import * as glm from "gl-matrix";
import { Geometry } from "./geometry";
import { Material } from "./material";
import { Scene } from "./scene";
type MeshUpdateCallback = (mesh: Mesh, elapsedTime: number, timeStep: number) => void;
/**
 * @brief Mostly used by a Mesh instance to translate, scale and rotate the model position
 * of the mesh.
 */
export declare class Transforms {
    constructor();
    position: glm.vec3;
    scale: glm.vec3;
    rotation: glm.quat;
}
/**
 * @brief Final object that holds instances of Geometry, Material and Transform classes
 * which together completely describe all the information required to render objects.
 */
export declare class Mesh {
    /**
     * @brief Constructs a Mesh instance from Geometry, Material and optionally Transform instnaces.
     * @param geo The Geometry instance.
     * @param mat The Material instance.
     * @param transforms The Transforms instance.
     */
    constructor(geo: Geometry, mat: Material, transforms?: Transforms);
    SetTransforms(transforms: Transforms): void;
    /**
     * @brief Sets a callback function that will be called just before rendering this Mesh
     * instance. Some example uses would be to provide any per frame transforms.
     * @param callback The callback function, which takes in the Mesh (this), the
     * elapsedTime and timeStep (time between each frame).
     */
    SetUpdateCallback(callback: MeshUpdateCallback): void;
    /**
     * @brief Updates all the uniforms needed for rendering this Mesh instance.
     * @param scene The scene that holds the lights and skybox that each hold information
     * that this Mesh needs to be properly be shaded by the fragment shader.
     */
    UpdateUniforms(scene: Scene): void;
    position: glm.vec3;
    scale: glm.vec3;
    rotation: glm.quat;
    geometry: Geometry;
    material: Material;
    userUpdateCallback: MeshUpdateCallback | undefined;
}
export {};
