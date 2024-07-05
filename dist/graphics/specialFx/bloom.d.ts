import { RawTexture2D } from "../texture";
import { SpecialFXPass } from "./pass";
import { SpecialFX } from "./specialFX";
export interface BloomPassCreateInfo {
    filterRadius: number;
    levels: number;
    strength: number;
}
export declare class BloomPass extends SpecialFXPass {
    constructor(specialFx: SpecialFX, createInfo: BloomPassCreateInfo);
    Render(read: RawTexture2D, write: RawTexture2D): void;
    Resize(width: number, height: number): void;
    private Blur;
    private specialFx;
    private bloomInfo;
    private mipChain;
    private upsampleShader;
    private downsampleShader;
}
