import * as glm from "gl-matrix";
export declare abstract class Light {
    constructor();
}
/**
 * @brief Holds information about a light sources that radiates equally from a point in space.
 * A Light instance isn't rendered, but used by mesh shaders for accurate shading.
 */
export declare class PointLight extends Light {
    constructor(position: glm.vec3, color: glm.vec3, intensity: number);
    position: glm.vec3;
    color: glm.vec3;
    intensity: number;
}
