import { Framebuffer } from "../framebuffer";
export interface RenderTargetCreateInfo {
    viewport: {
        width: number;
        height: number;
    };
    depthFunc: number;
    blendFunc: number;
}
export declare class RenderTarget {
    constructor(writeBuffer: Framebuffer, createInfo: RenderTargetCreateInfo);
    Resize(width: number, height: number, createInfo: RenderTargetCreateInfo): void;
    Destroy(): void;
    writeBuffer: Framebuffer | null;
    viewport: {
        width: number;
        height: number;
    };
    depthFunc: number;
    blendFunc: number;
}
