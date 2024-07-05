import { RawTexture2D } from "../texture";
import { SpecialFXPass } from "./pass";
import { SpecialFX } from "./specialFX";
export interface BlurPassCreateInfo {
    filterRadius: number;
}
export declare class BlurPass extends SpecialFXPass {
    constructor(specialFx: SpecialFX, createInfo: BlurPassCreateInfo);
    Render(read: RawTexture2D, write: RawTexture2D): void;
    Resize(width: number, height: number): void;
    private specialFx;
    private blurInfo;
}
