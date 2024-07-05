import { Shader } from "../shader";
import { VertexArray } from "../vertexArray";
import { RenderTarget } from "./target";
export declare class Renderer {
    constructor();
    Draw(vertexArray: VertexArray, shader: Shader, verticesCount: number): void;
    SetRenderTarget(renderTarget: RenderTarget): void;
    End(): void;
    gl: WebGL2RenderingContext;
}
