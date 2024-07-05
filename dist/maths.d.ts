import * as glm from "gl-matrix";
export declare class Spherical {
    radius: number;
    theta: number;
    phi: number;
    constructor(radius?: number, theta?: number, phi?: number);
    setFromVector3(vec: glm.vec3): void;
    setFromSpherical(spherical: Spherical): void;
}
export declare function Clamp(value: number, min: number, max: number): number;
export declare function SphericalToCartesian(radius: number, theta: number, phi: number): glm.vec3;
export declare function Lerp(start: number, end: number, t: number): number;
export declare function EaseInOut(t: number): number;
