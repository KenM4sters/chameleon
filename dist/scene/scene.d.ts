import * as glm from "gl-matrix";
import { Graphics, RawTexture2D, Shader } from "../export";
import { Renderer } from "../graphics/renderer/renderer";
import { RenderTarget } from "../graphics/renderer/target";
import { PerspectiveCamera } from "./camera";
import { Light } from "./light";
import { Mesh } from "./mesh";
import { Skybox } from "./skybox";
/**
 * @brief Holds containers for the meshes, lights and a skybox and handles the rendering of them.
 */
export declare class Scene {
    constructor(graphics: Graphics);
    /**
     * @brief Scene-specific render function to take some load of the Graphics instance.
     * Renders all meshes and skyboxes.
     */
    Render(elapsedTime: number, timeStep: number): void;
    private DrawSceneToDepthBuffer;
    private DrawSceneToWriteBuffer;
    Add(child: Mesh | Light): void;
    /**
     * @brief Sets a skybox with the desired texture.
     * @param assetName Name of the asset held by the Assets instance.
     */
    AddBackground(assetName: string): void;
    /**
     * @brief Sets the camera instance.
     * @param camera Currently only supporting a PerspectiveCamera instance.
     */
    SetCamera(camera: PerspectiveCamera): void;
    GetAllChildren(): {
        meshes: Array<Mesh>;
        lights: Array<Light>;
    };
    Resize(width: number, height: number): void;
    renderer: Renderer;
    renderTarget: RenderTarget;
    writeTexture: RawTexture2D;
    lights: Array<Light>;
    camera: PerspectiveCamera;
    skybox: Skybox | null;
    gl: WebGL2RenderingContext;
    depthTexture: RawTexture2D;
    depthViewMatrix: glm.mat4;
    depthProjectionMatrix: glm.mat4;
    depthShader: Shader;
    private sceneBuffer;
    private depthBuffer;
    private meshes;
}
