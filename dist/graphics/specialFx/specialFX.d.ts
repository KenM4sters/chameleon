import { Layer } from "../../webgl";
import { Renderer } from "../renderer/renderer";
import { RenderTarget } from "../renderer/target";
import { RawTexture2D } from "../texture";
import { BloomPassCreateInfo } from "./bloom";
import { BlurPassCreateInfo } from "./blur";
import { ToneMappingPassCreateInfo } from "./toneMapping";
export declare class SpecialFX implements Layer {
    constructor(renderer: Renderer, sceneTexture: RawTexture2D);
    Render(): void;
    AddBloom(createInfo: BloomPassCreateInfo): void;
    AddToneMapping(createInfo: ToneMappingPassCreateInfo): void;
    AddBlur(createInfo: BlurPassCreateInfo): void;
    SortPasses(): void;
    Resize(width: number, height: number): void;
    readonly renderer: Renderer;
    readonly scene: RawTexture2D;
    ping: RawTexture2D;
    pong: RawTexture2D;
    target: RenderTarget;
    private writeBuffer;
    private passes;
    private gl;
}
