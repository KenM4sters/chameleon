import { TextureImageData } from "three/src/textures/types";
import { Ref } from "../webgl";
import { SamplerCreateInfo } from "./texture";
export interface HDRImageCreateInfo {
    dimension: number;
    format: number;
    nChannels: number;
    type: number;
    threeData: TextureImageData;
    samplerInfo: SamplerCreateInfo;
}
export declare abstract class Image {
    constructor();
    Destroy(): void;
    GetId(): Ref<WebGLTexture>;
    protected id: Ref<WebGLTexture>;
    protected gl: WebGL2RenderingContext;
}
export declare class HDRImage extends Image {
    constructor(createInfo: HDRImageCreateInfo);
    GetImageInfo(): HDRImageCreateInfo;
    private imageInfo;
}
