import { RawCubeTexture, RawTexture2D } from "./texture";
import { Ref } from "../webgl";
export interface FramebufferCreateInfo {
    targetTexture: RawTexture2D;
    attachment: number;
    renderBufferCreateInfo: RenderbufferCreateInfo | null;
}
export interface RenderbufferCreateInfo {
    width: number;
    height: number;
    format: number;
    attachmentType: number;
}
export declare class Framebuffer {
    constructor(createInfo: FramebufferCreateInfo);
    Resize(width: number, height: number): void;
    SetColorAttachment(texture: RawTexture2D | RawCubeTexture, attachment: number, level?: number): void;
    DrawToAttachment(attachmentUnit: number[]): void;
    Destroy(): void;
    GetFramebufferId(): Ref<WebGLFramebuffer>;
    GetRenderbufferId(): Ref<WebGLRenderbuffer | null>;
    framebufferInfo: FramebufferCreateInfo;
    renderBufferInfo: RenderbufferCreateInfo | null;
    private framebufferId;
    private renderbufferId;
    private gl;
}
