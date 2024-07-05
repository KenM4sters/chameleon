import { Mesh, RawCubeTexture, RawTexture2D, Scene } from "../export";
import { HDRImage, HDRImageCreateInfo } from "../graphics/image";
export declare class Skybox {
    constructor(scene: Scene, imageInfo: HDRImageCreateInfo);
    private GenerateIrradianceMaps;
    private GenreateBRDF;
    GetHDRImage(): HDRImage;
    GetCube(): Mesh;
    GetCubeMap(): RawCubeTexture;
    GetConvolutedMap(): RawCubeTexture;
    GetPrefilteredMap(): RawCubeTexture;
    GetBRDF(): RawTexture2D;
    private cube;
    private hdrImage;
    private cubeMap;
    private prefilteredMap;
    private convolutedMap;
    private brdf;
    private eqToCubShader;
    private convoluteShader;
    private prefilterShader;
    private brdfQuad;
    private scene;
    private gl;
}
