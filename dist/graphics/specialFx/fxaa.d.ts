import { RawTexture2D } from "../texture";
import { SpecialFXPass } from "./pass";
import { SpecialFX } from "./specialFX";
export interface FXAAPassCreateInfo {
    screenResolution: {
        width: number;
        height: number;
    };
}
export declare class FXAAPass extends SpecialFXPass {
    constructor(specialFx: SpecialFX, createInfo: FXAAPassCreateInfo);
    Render(read: RawTexture2D, write: RawTexture2D): void;
    Resize(width: number, height: number): void;
    private specialFx;
    private toneMappingInfo;
}
