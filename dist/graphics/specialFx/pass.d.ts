import { Renderer } from "../renderer/renderer";
import { RawTexture2D } from "../texture";
import { Primitives } from "../../primitives";
export declare enum SpecialFXPassTypes {
    Undefined = 0,
    BloomBlur = 1,
    BloomCombine = 2,
    ToneMapping = 3,
    ColorCorrection = 4
}
export declare abstract class SpecialFXPass {
    constructor(renderer: Renderer, type: SpecialFXPassTypes, dependancies: SpecialFXPassTypes[]);
    GetType(): SpecialFXPassTypes;
    abstract Render(read: RawTexture2D, write: RawTexture2D): void;
    abstract Resize(width: number, height: number): void;
    protected renderer: Renderer;
    protected gl: WebGL2RenderingContext;
    protected type: SpecialFXPassTypes;
    protected dependencies: SpecialFXPassTypes[];
    protected screenQuad: Primitives.Square;
}
