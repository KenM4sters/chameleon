import { RawTexture2D } from "../texture";
import { SpecialFXPass } from "./pass";
import { SpecialFX } from "./specialFX";
export interface ToneMappingPassCreateInfo {
    exposure: number;
}
export declare class ToneMappingPass extends SpecialFXPass {
    constructor(specialFx: SpecialFX, createInfo: ToneMappingPassCreateInfo);
    Render(read: RawTexture2D, write: RawTexture2D): void;
    Resize(width: number, height: number): void;
    private specialFx;
    private toneMappingInfo;
}
