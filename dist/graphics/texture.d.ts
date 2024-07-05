import { Ref } from "../webgl";
export interface RawTextureCreateInfo {
    dimension: number;
    format: number;
    width: number;
    height: number;
    nChannels: number;
    type: number;
    data: Float32Array | Uint8Array | Uint16Array | Uint32Array | null;
    samplerInfo: SamplerCreateInfo;
}
export interface SamplerCreateInfo {
    dimension: number;
    minFilter: number;
    magFilter: number;
    sWrap: number;
    tWrap: number;
    rWrap?: number;
}
export declare abstract class Texture {
    constructor();
    Destroy(): void;
    GetId(): Ref<WebGLTexture>;
    protected id: Ref<WebGLTexture>;
    protected gl: WebGL2RenderingContext;
}
export declare class RawTexture2D extends Texture {
    constructor(createInfo: RawTextureCreateInfo);
    Resize(createInfo: RawTextureCreateInfo): void;
    GetTextureInfo(): RawTextureCreateInfo;
    private textureInfo;
}
export declare class RawCubeTexture extends Texture {
    constructor(createInfo: RawTextureCreateInfo);
    GetTextureInfo(): RawTextureCreateInfo;
    private textureInfo;
}
