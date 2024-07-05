import { Ref } from "../webgl";
/**
 * @brief A Shader instance merely holds a reference to a WebGLShaderProgram which
 * gets compiled and linked by providing paths to the vertex and shader files.
 */
export declare class Shader {
    constructor(vScriptId: string, fScriptId: string);
    GetId(): Ref<WebGLProgram>;
    /**
     * @brief Compiles and links a vertex and fragment programs into a a WebGLShaderProgram
     * that should be bound using gl.useProgram() when wanting to make a draw call with this
     * shader program.
     * @param vSource path to the vertex shader source file.
     * @param fSource path to the fragment shader source file.
     */
    Compile(vSource: string, fSource: string): void;
    private ID;
}
