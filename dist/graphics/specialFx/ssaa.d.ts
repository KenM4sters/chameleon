import { RawTexture2D } from "../texture";
import { SpecialFXPass } from "./pass";
import { SpecialFX } from "./specialFX";
export interface SSAAPassCreateInfo {
    screenResMultiplier: number;
}
export declare class SSAAPass extends SpecialFXPass {
    constructor(specialFx: SpecialFX, createInfo: SSAAPassCreateInfo);
    Render(read: RawTexture2D, write: RawTexture2D): void;
    Resize(width: number, height: number): void;
    private specialFx;
    private ssaaInfo;
    private highResTexInfo;
}
